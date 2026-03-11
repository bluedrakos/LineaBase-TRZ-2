<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\DashboardApiController;

Route::get('/dashboard/resumen', [DashboardApiController::class, 'resumen']);
