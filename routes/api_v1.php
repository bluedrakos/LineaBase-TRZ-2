<?php

use App\Http\Controllers\Api\SoapController;
use App\Http\Controllers\Api\V1\AuditoriasApiController;
use App\Http\Controllers\Api\V1\AuthApiController;
use App\Http\Controllers\Api\V1\DashboardApiController;
use App\Http\Controllers\Api\V1\InstitucionesApiController;
use App\Http\Controllers\Api\V1\ModulosApiController;
use App\Http\Controllers\Api\V1\RolesApiController;
use App\Http\Controllers\Api\V1\UsuariosApiController;
use App\Http\Controllers\Api\V1\BancoApiController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/auth/login', [AuthApiController::class, 'login'])->middleware('throttle:6,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthApiController::class, 'logout']);
        Route::get('/auth/me', [AuthApiController::class, 'me']);

        // Notificaciones
        Route::get('/notifications', [\App\Http\Controllers\Api\V1\NotificationController::class, 'index']);
        Route::get('/notifications/unread-count', [\App\Http\Controllers\Api\V1\NotificationController::class, 'unreadCount']);
        Route::post('/notifications/mark-read', [\App\Http\Controllers\Api\V1\NotificationController::class, 'markAllAsRead']);
        Route::post('/notifications/{id}/mark-read', [\App\Http\Controllers\Api\V1\NotificationController::class, 'markAsRead']);

        Route::get('/dashboard/resumen', [DashboardApiController::class, 'resumen']);

        Route::prefix('usuarios')->group(function () {
            Route::get('/', [UsuariosApiController::class, 'index'])
                ->middleware('api.acc.mod:listar,gestion-usuarios');
            Route::get('/meta', [UsuariosApiController::class, 'meta'])
                ->middleware('api.acc.mod:listar,gestion-usuarios');
            Route::post('/', [UsuariosApiController::class, 'store'])
                ->middleware('api.acc.mod:crear,gestion-usuarios');
            Route::get('/{usuario}', [UsuariosApiController::class, 'show'])
                ->middleware('api.acc.mod:ver,gestion-usuarios');
            Route::put('/{usuario}', [UsuariosApiController::class, 'update'])
                ->middleware('api.acc.mod:editar,gestion-usuarios');
            Route::delete('/{usuario}', [UsuariosApiController::class, 'destroy'])
                ->middleware('api.acc.mod:eliminar,gestion-usuarios');
            Route::patch('/{usuario}/activo', [UsuariosApiController::class, 'toggleStatus'])
                ->middleware('api.acc.mod:editar,gestion-usuarios');
            Route::patch('/{usuario}/estado', [UsuariosApiController::class, 'toggleEstado'])
                ->middleware('api.acc.mod:editar,gestion-usuarios');
        });

        Route::prefix('roles')->group(function () {
            Route::get('/', [RolesApiController::class, 'index'])
                ->middleware('api.acc.mod:listar,gestion-de-permisos');
            Route::get('/meta', [RolesApiController::class, 'meta'])
                ->middleware('api.acc.mod:listar,gestion-de-permisos');
            Route::post('/', [RolesApiController::class, 'store'])
                ->middleware('api.acc.mod:crear,gestion-de-permisos');
            Route::put('/{rol}', [RolesApiController::class, 'update'])
                ->middleware('api.acc.mod:editar,gestion-de-permisos');
            Route::patch('/{rol}/activo', [RolesApiController::class, 'toggleStatus'])
                ->middleware('api.acc.mod:editar,gestion-de-permisos');
        });

        Route::prefix('modulos')->group(function () {
            Route::get('/', [ModulosApiController::class, 'index'])
                ->middleware('api.acc.mod:listar,gestion-modulos');
            Route::get('/meta', [ModulosApiController::class, 'meta'])
                ->middleware('api.acc.mod:listar,gestion-modulos');
            Route::post('/', [ModulosApiController::class, 'store'])
                ->middleware('api.acc.mod:crear,gestion-modulos');
            Route::get('/{modulo}', [ModulosApiController::class, 'show'])
                ->middleware('api.acc.mod:ver,gestion-modulos');
            Route::put('/{modulo}', [ModulosApiController::class, 'update'])
                ->middleware('api.acc.mod:editar,gestion-modulos');
            Route::delete('/{modulo}', [ModulosApiController::class, 'destroy'])
                ->middleware('api.acc.mod:eliminar,gestion-modulos');
            Route::patch('/{modulo}/activo', [ModulosApiController::class, 'toggleActivo'])
                ->middleware('api.acc.mod:editar,gestion-modulos');
        });

        Route::prefix('instituciones')->group(function () {
            Route::get('/', [InstitucionesApiController::class, 'index'])
                ->middleware('api.acc.mod:listar,instituciones');
            Route::post('/', [InstitucionesApiController::class, 'store'])
                ->middleware('api.acc.mod:crear,instituciones');
            Route::put('/{institucion}', [InstitucionesApiController::class, 'update'])
                ->middleware('api.acc.mod:editar,instituciones');
        });

        Route::apiResource('bancos', BancoApiController::class);

        Route::get('/auditorias', [AuditoriasApiController::class, 'index'])
            ->middleware('api.acc.mod:listar,auditorias');

        Route::prefix('tipo-modulo')->group(function () {
            Route::post('/', [\App\Http\Controllers\Api\V1\TipoModuloApiController::class, 'store'])
                ->middleware('api.acc.mod:crear,gestion-modulos');
            Route::put('/{tipoModulo}', [\App\Http\Controllers\Api\V1\TipoModuloApiController::class, 'update'])
                ->middleware('api.acc.mod:editar,gestion-modulos');
        });
    });
});

Route::get('/soap/usuarios', [SoapController::class, 'buscarUsuario']);
