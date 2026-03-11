<?php

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Iniciando prueba de correo...\n";

try {
    Mail::raw('Prueba de correo desde SICMO para evillegas@casamoneda.cl. Si recibes esto, la configuracion SMTP es correcta.', function ($message) {
        $message->to('evillegas@casamoneda.cl')
                ->subject('SICMO - Prueba SMTP');
    });
    echo "¡Éxito! El correo se envió correctamente.\n";
} catch (\Exception $e) {
    echo "ERROR al enviar correo:\n";
    echo $e->getMessage() . "\n";
    echo "Trace:\n" . $e->getTraceAsString() . "\n";
}
