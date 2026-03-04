<?php

use App\Http\Controllers\Api\ConfigController;
use Illuminate\Support\Facades\Route;

Route::get('/config/branding', [ConfigController::class, 'getBranding']);

require __DIR__ . '/api_v1.php';
