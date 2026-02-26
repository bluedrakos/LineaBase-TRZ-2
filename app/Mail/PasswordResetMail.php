<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;

use Illuminate\Contracts\Queue\ShouldQueue;

class PasswordResetMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $usu_correo;
    public $usu_tipo;
    public $changePasswordLink;

    public function __construct($usu_correo, $usu_tipo ,$changePasswordLink)
    {
        $this->usu_correo = $usu_correo;
        $this->usu_tipo = $usu_tipo;
        $this->changePasswordLink = $changePasswordLink;
    }

    /**
     * Define the envelope for the email.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->usu_tipo == 'Interno' 
                ? ' Inicia sesión con LDAP' 
                : 'Link de reestablecer contraseña',
            from: new Address(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'))
        );
    }

    /**
     * Define the content for the email.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content(): Content
    {
        if ($this->usu_tipo == 'Interno') {
            return new Content(
                view: 'emails.passwordInterno',
            );
        } else {
            return new Content(
                view: 'emails.passwordExterno',
                with: [
                    'usu_correo' => $this->usu_correo,
                    'changePasswordLink' => $this->changePasswordLink
                ]
            );
        }
    }
}
