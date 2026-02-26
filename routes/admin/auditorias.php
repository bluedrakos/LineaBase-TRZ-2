<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuditoriaController;


Route::middleware('auth')->name('admin.')->group(function () {
    Route::get('/dashboard/auditorias', [AuditoriaController::class, 'index'])
        ->name('auditoria.index')
        ->middleware('acc.mod:listar');
});


