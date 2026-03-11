<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\UsuariosApiController;

Route::prefix('usuarios')->group(function () {
    Route::get('/', [UsuariosApiController::class, 'index'])->middleware('api.acc.mod:listar,gestion-usuarios');
    Route::get('/meta', [UsuariosApiController::class, 'meta'])->middleware('api.acc.mod:listar,gestion-usuarios');
    Route::post('/', [UsuariosApiController::class, 'store'])->middleware('api.acc.mod:crear,gestion-usuarios');
    Route::get('/{usuario}', [UsuariosApiController::class, 'show'])->middleware('api.acc.mod:ver,gestion-usuarios');
    Route::put('/{usuario}', [UsuariosApiController::class, 'update'])->middleware('api.acc.mod:editar,gestion-usuarios');
    Route::delete('/{usuario}', [UsuariosApiController::class, 'destroy'])->middleware('api.acc.mod:eliminar,gestion-usuarios');
    Route::patch('/{usuario}/activo', [UsuariosApiController::class, 'toggleStatus'])->middleware('api.acc.mod:editar,gestion-usuarios');
    Route::patch('/{usuario}/estado', [UsuariosApiController::class, 'toggleEstado'])->middleware('api.acc.mod:editar,gestion-usuarios');
});
