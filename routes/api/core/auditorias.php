<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuditoriasApiController;

Route::get('/auditorias', [AuditoriasApiController::class, 'index'])->middleware('api.acc.mod:listar,auditorias');
