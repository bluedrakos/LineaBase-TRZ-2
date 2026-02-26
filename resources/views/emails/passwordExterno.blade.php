<!DOCTYPE html>
<html>
<head>
    <title>Restablecer Contraseña</title>
</head>
<body>
    <h2>Restablecer tu contraseña</h2>
    <p>Hola {{ $usu_correo }},</p>
    <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
    <a href="{{ $changePasswordLink }}">{{ $changePasswordLink }}</a>
</body>
</html>