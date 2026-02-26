<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Models\Usuario;


/* Proceso de refactorizar las policies y middleware para una mejor comprension del codigo
PASO A SEGUIR
1. tengo que refactorizar las rutas pero usando middlewares en las rutas importantes
    1.1 rutas importantes que deben ir son middlewares
        - crearte (crear)
        - update (editar, habilitar, deshabilitar, activar, desactivar)
        - delete (eliminar #croe que no es necesario porque no se usa)
        - post 
        - put */
Route::middleware('auth')->name('admin.')->group(function () {
    // -------------------------------
    // Listado de usuarios
    // -------------------------------
    Route::get('/dashboard/gestion-usuarios', [UsuarioController::class, 'index'])
        ->name('usuarios.index')
        ->middleware('acc.mod:listar');
    // -------------------------------
    // Crear usuario
    // -------------------------------
    Route::get('/dashboard/gestion-usuarios/crear', [UsuarioController::class, 'create'])
        ->name('usuarios.create')
        ->middleware( 'acc.mod:crear');
    // Guardar nuevo usuario
    Route::post('/dashboard/gestion-usuarios', [UsuarioController::class, 'store'])
        ->name('usuarios.store')
        ->middleware( 'acc.mod:crear');

    // -------------------------------
    // Ver usuario específico de la bd
    // -------------------------------
    Route::get('/dashboard/gestion-usuarios/{usuario}', [UsuarioController::class, 'show'])
        ->middleware('acc.mod:ver')
        ->name('usuarios.show');

    // -------------------------------
    // Editar usuario
    // -------------------------------
    Route::put('/dashboard/gestion-usuarios/{usuario}', [UsuarioController::class, 'update'])
        ->name('usuarios.update')
        ->middleware( 'acc.mod:editar');

    // Activar o desactivar usuario
    Route::patch('/dashboard/gestion-usuarios/{usuario}/cambiar-activo', [UsuarioController::class, 'toggleStatus'])
        ->name('usuarios.toggleStatus')
        ->middleware( 'acc.mod:editar');

    // Cambiar estado (Habilitar/Deshabilitar)
    Route::patch('/dashboard/gestion-usuarios/{usuario}/cambiar-estado', [UsuarioController::class, 'toggleEstado'])
        ->name('usuarios.toggleEstado')
        ->middleware( 'acc.mod:editar');

    // -------------------------------
    // Eliminar usuario
    // -------------------------------
    Route::delete('/dashboard/gestion-usuarios/{usuario}', [UsuarioController::class, 'destroy'])
        ->name('usuarios.destroy')
        ->middleware( 'acc.mod:eliminar');

    // -------------------------------
    // Rutas adicionales (opcional)
    // -------------------------------
    // Exportar usuarios a Excel
    Route::get('/dashboard/gestion-usuarios/exportar/excel', [UsuarioController::class, 'exportExcel'])
        ->name('usuarios.export.excel')
        ->middleware( 'acc.mod:exportar');
});

// Flujo de reestablecimiento de contraseña para un usuario nuevo
Route::get('/reset-password/{token}', [UsuarioController::class, 'checkearTokenPassword'])
    ->middleware('guest')
    ->name('reset.password');

Route::post('/reset-password/{token}', [UsuarioController::class, 'reestablecerPassword'])
    ->middleware('guest')
    ->name('password.update');

