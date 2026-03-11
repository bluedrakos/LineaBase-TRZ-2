<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthApiController;

Route::post('/auth/login', [AuthApiController::class, 'login'])->middleware('throttle:6,1');

Route::post('/auth/olvide-password', [AuthApiController::class, 'forgotPassword'])->middleware('throttle:6,1');
Route::post('/auth/cambiar-password/{token}', [AuthApiController::class, 'sendOTP'])->middleware('throttle:6,1');
Route::post('/auth/cambiar-password/{token}/reset', [AuthApiController::class, 'resetPassword'])->middleware('throttle:6,1');
Route::post('/auth/cambiar-password/{token}/reenviar', [AuthApiController::class, 'reenviarOTP'])->middleware('throttle:6,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthApiController::class, 'logout']);
    Route::get('/auth/me', [AuthApiController::class, 'me']);
});
