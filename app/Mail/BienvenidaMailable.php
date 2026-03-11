<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;

use Illuminate\Contracts\Queue\ShouldQueue;

class BienvenidaMailable extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $password;
    public $usu_correo;
    public $usu_tipo;
    public $usu_nombre;
    public $changePasswordLink;

    public function __construct($password, $usu_correo, $usu_tipo, $usu_nombre, $changePasswordLink)
    {
        $this->password = $password;
        $this->usu_correo = $usu_correo;
        $this->usu_tipo = $usu_tipo;
        $this->usu_nombre = $usu_nombre;
        $this->changePasswordLink = $changePasswordLink;
    }


    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->usu_tipo == 'Interno' 
                ? 'Bienvenido a TrackIoT - Inicia sesión con LDAP' 
                : 'Bienvenido a TrackIoT',
            from: new Address(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'))
        );
    }


    public function content(): Content
    {
        // El contenido específico del correo dependiendo del tipo de usuario.
        if ($this->usu_tipo == 'Interno') {
            return new Content(
                view: 'emails.BienvenidaInterno',
                with: ['usu_nombre' => $this->usu_nombre]
            );
        } else {
            return new Content(
                view: 'emails.BienvenidaExterno',
                with: [
                    'usu_correo' => $this->usu_correo,
                    'password' => $this->password,
                    'usu_nombre' => $this->usu_nombre,
                    'changePasswordLink' => $this->changePasswordLink
                ]
            );
        }
    }
}
