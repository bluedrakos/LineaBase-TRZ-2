<?php

namespace App\Services;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class BackendModuleScaffolder
{
    /**
     * Genera la estructura básica de backend para un nuevo módulo.
     */
    public function generate(string $moduleSlug, string $moduleName): array
    {
        $className = Str::studly(Str::singular($moduleSlug));
        $pluralName = Str::studly(Str::plural($moduleSlug));
        $tableName = Str::snake(Str::plural($moduleSlug));

        $results = [];

        // 1. Generar Modelo
        $modelPath = app_path("Models/{$className}.php");
        if (!File::exists($modelPath)) {
            File::put($modelPath, $this->modelTemplate($className, $tableName));
            $results[] = "Modelo creado: app/Models/{$className}.php";
        }

        // 2. Generar Migración
        $timestamp = date('Y_m_d_His');
        $migrationName = "create_{$tableName}_table";
        $migrationPath = database_path("migrations/{$timestamp}_{$migrationName}.php");
        File::put($migrationPath, $this->migrationTemplate($tableName));
        $results[] = "Migración creada: database/migrations/{$timestamp}_{$migrationName}.php";

        // 3. Generar Controlador API V1
        $controllerName = "{$className}ApiController";
        $controllerPath = app_path("Http/Controllers/Api/V1/{$controllerName}.php");
        if (!File::exists($controllerPath)) {
            File::put($controllerPath, $this->controllerTemplate($className, $moduleName));
            $results[] = "Controlador creado: app/Http/Controllers/Api/V1/{$controllerName}.php";
        }

        // 4. Registrar ruta en api_v1.php (opcional: solo sugerencia o append)
        $this->appendRoute($moduleSlug, $controllerName);
        $results[] = "Ruta añadida a: routes/api_v1.php";

        return $results;
    }

    private function modelTemplate(string $className, string $tableName): string
    {
        return <<<PHP
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class {$className} extends Model
{
    use SoftDeletes;

    protected \$table = '{$tableName}';
    
    // Define aquí la llave primaria si no es 'id'
    // protected \$primaryKey = 'id';

    protected \$fillable = [
        // 'nombre',
        // 'descripcion',
    ];
}
PHP;
    }

    private function migrationTemplate(string $tableName): string
    {
        return <<<PHP
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('{$tableName}', function (Blueprint \$table) {
            \$table->id();
            // Agrega aquí tus columnas
            \$table->string('nombre')->nullable();
            \$table->text('descripcion')->nullable();
            \$table->timestamps();
            \$table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('{$tableName}');
    }
};
PHP;
    }

    private function controllerTemplate(string $className, string $moduleName): string
    {
        $variable = Str::camel($className);
        return <<<PHP
<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Models\\{$className};
use Illuminate\Http\Request;

class {$className}ApiController extends ApiController
{
    /**
     * Listado de {$moduleName}.
     */
    public function index()
    {
        \$data = {$className}::orderBy('created_at', 'desc')->paginate(15);
        return \$this->ok(\$data->items(), meta: [
            'current_page' => \$data->currentPage(),
            'total' => \$data->total(),
        ]);
    }

    /**
     * Crear un nuevo registro.
     */
    public function store(Request \$request)
    {
        \$validated = \$request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        \${$variable} = {$className}::create(\$validated);

        return \$this->ok(\${$variable}, 'Registro creado exitosamente.', 201);
    }

    /**
     * Mostrar un registro específico.
     */
    public function show({$className} \${$variable})
    {
        return \$this->ok(\${$variable});
    }

    /**
     * Actualizar un registro.
     */
    public function update(Request \$request, {$className} \${$variable})
    {
        \$validated = \$request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        \${$variable}->update(\$validated);

        return \$this->ok(\${$variable}, 'Registro actualizado correctamente.');
    }

    /**
     * Eliminar un registro.
     */
    public function destroy({$className} \${$variable})
    {
        \${$variable}->delete();
        return \$this->ok(null, 'Registro eliminado correctamente.');
    }
}
PHP;
    }

    private function appendRoute(string $slug, string $controllerName): void
    {
        $routePath = base_path('routes/api_v1.php');
        if (File::exists($routePath)) {
            $routeContent = File::get($routePath);
            $newRoute = "\n        Route::apiResource('{$slug}', {$controllerName}::class);";
            
            // Buscamos la seccion del middleware auth:sanctum
            $search = "Route::middleware('auth:sanctum')->group(function () {";
            if (str_contains($routeContent, $search)) {
                // Para api_v1, vamos a buscar el último "});" antes del cierre final de Route::prefix('v1')
                // Como tenemos un `});` y otro más abajo `});`, una forma rápida de meterlo al grupo sanctum
                // es ubicar la ruta de /auditorias (que ya vimos en el archivo) e insertarlo debajo.
                $insertPoint = "Route::get('/auditorias', [AuditoriasApiController::class, 'index'])";
                if (str_contains($routeContent, $insertPoint)) {
                    $routeContent = str_replace(
                        $insertPoint,
                        "Route::apiResource('{$slug}', {$controllerName}::class);\n\n        " . $insertPoint,
                        $routeContent
                    );
                    
                    // IMPORTANTE: También debemos incluir la clase en la cabecera del archivo
                    $useStatement = "use App\Http\Controllers\Api\V1\\{$controllerName};";
                    if (!str_contains($routeContent, $useStatement)) {
                        $routeContent = preg_replace(
                            "/(use Illuminate\\\\Support\\\\Facades\\\\Route;)/",
                            "{$useStatement}\n$1",
                            $routeContent
                        );
                    }
                    
                    File::put($routePath, $routeContent);
                }
            }
        }
    }
}
