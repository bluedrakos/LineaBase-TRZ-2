<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ModuloController;
use App\Models\Modulo;


Route::middleware('auth')->name('admin.')->group(function () {
    // -------------------------------
    // Listado de módulos
    // -------------------------------
    Route::get('/dashboard/gestion-modulos', [ModuloController::class, 'index'])
        ->name('modulos.index')
        ->middleware('acc.mod:listar');
    // -------------------------------
    // Crear módulo
    // -------------------------------
    // Route::get('/dashboard/gestion-modulos/crear', [ModuloController::class, 'create'])
    //     ->name('modulos.create')
    //     ->middleware( 'acc.mod:crear');
    
    // Guardar nuevo módulo
    Route::post('/dashboard/gestion-modulos', [ModuloController::class, 'store'])
        ->name('modulos.store')
        ->middleware( 'acc.mod:crear');

    // -------------------------------
    // Ver módulo específico de la bd
    // -------------------------------
    Route::get('/dashboard/gestion-modulos/{modulo}', [ModuloController::class, 'show'])
        ->middleware('acc.mod:ver')
        ->name('modulos.show');

    // -------------------------------
    // Editar módulo
    // -------------------------------
    Route::put('/dashboard/gestion-modulos/{modulo}', [ModuloController::class, 'update'])
        ->name('modulos.update')
        ->middleware( 'acc.mod:editar');
    Route::patch('/dashboard/gestion-modulos/{modulo}', [ModuloController::class, 'toggleActivo'])
        ->name('modulos.toggleActivo')
        ->middleware( 'acc.mod:editar');

    // -------------------------------
    // Eliminar módulo
    // -------------------------------
    Route::delete('/dashboard/gestion-modulos/{modulo}', [ModuloController::class, 'destroy'])
        ->name('modulos.destroy')
        ->middleware( 'acc.mod:eliminar');
});