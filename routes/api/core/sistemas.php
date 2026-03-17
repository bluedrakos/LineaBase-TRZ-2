<?php

use App\Http\Controllers\Api\V1\SistemasApiController;
use Illuminate\Support\Facades\Route;

Route::apiResource('sistemas', SistemasApiController::class);
