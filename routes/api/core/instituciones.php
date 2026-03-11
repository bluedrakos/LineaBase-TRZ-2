<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\InstitucionesApiController;

Route::prefix('instituciones')->group(function () {
    Route::get('/', [InstitucionesApiController::class, 'index'])->middleware('api.acc.mod:listar,instituciones');
    Route::post('/', [InstitucionesApiController::class, 'store'])->middleware('api.acc.mod:crear,instituciones');
    Route::put('/{institucion}', [InstitucionesApiController::class, 'update'])->middleware('api.acc.mod:editar,instituciones');
});
