<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'SICMO API REST v1',
        'status' => 'online',
        'version' => '1.0.0'
    ]);
});

// Ruta para servir el frontend (SPA)
Route::get('/{any}', function () {
    return view('app'); // Asegúrate de que exista resources/views/app.blade.php
})->where('any', '.*');
