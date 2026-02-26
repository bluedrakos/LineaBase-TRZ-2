<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SensorController;
use App\Http\Controllers\UsuarioController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Redirigir directamente al login
Route::get('/', function () {
    return redirect()->route('login');
});

// Panel principal (dashboard)
Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth'])
    ->name('dashboard');

// Perfil de usuario (opcional, se puede personalizar más adelante)
Route::middleware('auth')->group(function () {
    Route::get('/perfil', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/perfil', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/perfil', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



// Flujo de reseteo de contraseña en caso de que se le olvide al usuario
// ¿Como funciona?
// el usuario solicita el cambio de contraseña y se le abre un form
Route::get('/reset-password/olvide-password', [UsuarioController::class, 'mostrarOlvidePassword'])
    ->middleware('guest')
    ->name('email.forgot.password');
// una vez ingresado el form por el backend se valida su correo 
Route::post('/reset-password/olvide-password', [UsuarioController::class, 'enviarResetPassword'])
    ->middleware(['guest', 'throttle:6,1'])
    ->name('enviar.password.email');


// en caso de que exista, se le manda por correo un token para poder validarlo
Route::get('/reset-password/cambiar-password/{token}', [UsuarioController::class, 'mostrarResetPassword'])
    ->middleware('guest')
    ->name('email.reset.password');

    
// si el token es correcto, entonces se le envía el codigo OTP para el cambio de contraseña
Route::post('/reset-password/cambiar-password/{token}', [UsuarioController::class, 'resetPassword'])
    ->middleware(['guest', 'throttle:6,1'])
    ->name('enviar.resetPassword');

// para reenviar el codigo otp por si llega a pasar algo
Route::post('/reset-password/cambiar-password/{token}/reenviar', [UsuarioController::class, 'reenviarOTP'])
    ->middleware(['guest', 'throttle:6,1'])
    ->name('reenviarotp');

// para finalizar cambia la contraseña y termina con el flujo 
Route::post('/reset-password/cambiar-password/{token}/reset', [UsuarioController::class, 'mandarResetPassword'])
    ->middleware(['guest', 'throttle:6,1'])
    ->name('mandarResetPassword');





// Rutas de autenticación (login, logout, recuperar contraseña, etc.)
require __DIR__.'/auth.php';
require __DIR__.'/admin/usuarios.php';
require __DIR__.'/admin/modulos.php';
require __DIR__.'/admin/roles.php';
require __DIR__.'/admin/auditorias.php';
require __DIR__.'/admin/instituciones.php';