<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RolController;
use App\Models\Rol;


Route::middleware('auth')->name('admin.')->group(function () {
    // -------------------------------
    // Listado de permisos
    // -------------------------------
    Route::get('/dashboard/gestion-de-permisos', [RolController::class, 'index'])
        ->name('rol.index')
        ->middleware('acc.mod:listar');

    Route::post('/dashboard/gestion-de-permisos', [RolController::class, 'store'])
        ->name('rol.store')
        ->middleware( 'acc.mod:crear');
    Route::put('/dashboard/gestion-de-permisos/{rol}', [RolController::class, 'update'])
        ->name('rol.update')
        ->middleware( 'acc.mod:editar');

    Route::patch('/dashboard/gestion-de-permisos/{rol}', [RolController::class, 'toggleStatus'])
        ->name('rol.toggle')
        ->middleware( 'acc.mod:editar');


});