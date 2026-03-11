<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\NotificationController;

Route::prefix('notifications')->group(function () {
    Route::get('/', [NotificationController::class, 'index']);
    Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/mark-read', [NotificationController::class, 'markAllAsRead']);
    Route::post('/{id}/mark-read', [NotificationController::class, 'markAsRead']);
});
