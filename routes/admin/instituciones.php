<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InstitucionController;
use App\Models\Institucion;

Route::middleware('auth')->name('admin.')->group(function () {
    Route::get('/dashboard/instituciones', [InstitucionController::class, 'index'])
        ->name('institucion.index')
        ->middleware('acc.mod:listar');
        
    Route::post('/dashboard/instituciones', [InstitucionController::class, 'store'])
        ->name('institucion.store')
        ->middleware('acc.mod:crear');
        
    Route::put('/dashboard/instituciones/{institucion}', [InstitucionController::class, 'update'])
        ->name('institucion.update')
        ->middleware('acc.mod:editar');
});
