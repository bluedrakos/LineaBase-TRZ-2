<?php

use App\Http\Controllers\Api\SoapController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Rutas de Autenticación
    require __DIR__ . '/api/core/auth.php';

    Route::middleware('auth:sanctum')->group(function () {
        require __DIR__ . '/api/core/notifications.php';
        require __DIR__ . '/api/core/dashboard.php';
        require __DIR__ . '/api/core/usuarios.php';
        require __DIR__ . '/api/core/roles.php';
        require __DIR__ . '/api/core/modulos.php';
        require __DIR__ . '/api/core/instituciones.php';
        require __DIR__ . '/api/core/auditorias.php';

        // Rutas de los módulos a desarrollar estan dentro de modules


    });

    
});

Route::get('/soap/usuarios', [SoapController::class, 'buscarUsuario']);
