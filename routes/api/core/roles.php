<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\RolesApiController;

Route::prefix('roles')->group(function () {
    Route::get('/', [RolesApiController::class, 'index'])->middleware('api.acc.mod:listar,gestion-de-permisos');
    Route::get('/meta', [RolesApiController::class, 'meta'])->middleware('api.acc.mod:listar,gestion-de-permisos');
    Route::post('/', [RolesApiController::class, 'store'])->middleware('api.acc.mod:crear,gestion-de-permisos');
    Route::put('/{rol}', [RolesApiController::class, 'update'])->middleware('api.acc.mod:editar,gestion-de-permisos');
    Route::patch('/{rol}/activo', [RolesApiController::class, 'toggleStatus'])->middleware('api.acc.mod:editar,gestion-de-permisos');
});
