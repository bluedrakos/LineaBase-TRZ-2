<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Bienvenido a TrackIoT</title>
    <style>
        .btn-primary {
            display: inline-block;
            background: #003d5b;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 10px;
            padding: 14px 24px;
            font-size: 18px;
            font-weight: 700;
            transition: background-color .2s ease-in-out;
        }
        .btn-primary:hover {
            background: #0a577c !important;
        }
    </style>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
@php
    $platformUrl = config('app.url') ?: 'https://www.trackiot.com';
@endphp

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6;padding:24px 12px;">
    <tr>
        <td align="center">
            <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;">
                <tr>
                    <td style="padding:28px 24px 18px 24px;text-align:center;">
                        <img src="https://res.cloudinary.com/dbltaelkk/image/upload/v1773255155/svgviewer-png-output_hy4udq.png" alt="TrackIoT" width="210" style="display:inline-block;border:0;outline:none;text-decoration:none;">
                    </td>
                </tr>

                <tr>
                    <td style="background:#003d5b;padding:40px 36px;">
                        <h1 style="margin:0;color:#ffffff;font-size:44px;line-height:1.1;font-weight:700;text-align:center;">
                            &iexcl;Bienvenido a TrackIoT!
                        </h1>
                    </td>
                </tr>

                <tr>
                    <td style="padding:34px 36px 18px 36px;text-align:center;">
                        <p style="margin:0 0 14px 0;color:#003d5b;font-size:40px;line-height:1.15;font-weight:700;">
                            Tu cuenta ha sido creada con &eacute;xito.
                        </p>
                        <p style="margin:0 0 16px 0;color:#334155;font-size:24px;line-height:1.4;">
                            Hola {{ $usu_nombre }}, para ingresar a la plataforma debes usar LDAP.
                        </p>

                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc;border:1px solid #d7e1e8;border-radius:10px;">
                            <tr>
                                <td style="padding:16px 18px;text-align:left;">
                                    <p style="margin:0;color:#475569;font-size:17px;line-height:1.5;">
                                        <strong>Nota:</strong> Si no recuerdas qu&eacute; es LDAP, corresponde a las mismas credenciales que usas para iniciar sesi&oacute;n en tu correo corporativo o al iniciar tu computador.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td style="padding:10px 36px 0 36px;">
                        <div style="text-align:center;">
                            <a href="{{ $platformUrl }}" class="btn-primary">
                                Ingresar a la plataforma
                            </a>
                        </div>
                        <div style="height:1px;background:#d7e1e8;margin:20px 0 0 0;"></div>
                    </td>
                </tr>

                <tr>
                    <td style="background:#eef1f4;padding:28px 36px;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td align="left" valign="middle">
                                    <img src="https://res.cloudinary.com/dbltaelkk/image/upload/v1773255175/logocasamoneda_p2fhc9.png" alt="Casa de Moneda Chile" width="84" style="display:block;border:0;outline:none;text-decoration:none;">
                                </td>
                                <td align="right" valign="middle">
                                    <p style="margin:0;color:#003d5b;font-size:30px;line-height:1.1;font-weight:700;text-decoration:underline;">TrackIoT</p>
                                    <p style="margin:6px 0 0 0;color:#6b7280;font-size:18px;line-height:1.3;">Casa de Moneda Chile</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
