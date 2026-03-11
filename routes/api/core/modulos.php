<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ModulosApiController;
use App\Http\Controllers\Api\V1\TipoModuloApiController;

Route::prefix('modulos')->group(function () {
    Route::get('/', [ModulosApiController::class, 'index'])->middleware('api.acc.mod:listar,gestion-modulos');
    Route::get('/meta', [ModulosApiController::class, 'meta'])->middleware('api.acc.mod:listar,gestion-modulos');
    Route::post('/', [ModulosApiController::class, 'store'])->middleware('api.acc.mod:crear,gestion-modulos');
    Route::get('/{modulo}', [ModulosApiController::class, 'show'])->middleware('api.acc.mod:ver,gestion-modulos');
    Route::put('/{modulo}', [ModulosApiController::class, 'update'])->middleware('api.acc.mod:editar,gestion-modulos');
    Route::delete('/{modulo}', [ModulosApiController::class, 'destroy'])->middleware('api.acc.mod:eliminar,gestion-modulos');
    Route::patch('/{modulo}/activo', [ModulosApiController::class, 'toggleActivo'])->middleware('api.acc.mod:editar,gestion-modulos');
});

Route::prefix('tipo-modulo')->group(function () {
    Route::post('/', [TipoModuloApiController::class, 'store'])->middleware('api.acc.mod:crear,gestion-modulos');
    Route::put('/{tipoModulo}', [TipoModuloApiController::class, 'update'])->middleware('api.acc.mod:editar,gestion-modulos');
});
