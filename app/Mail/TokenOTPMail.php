<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;

use Illuminate\Contracts\Queue\ShouldQueue;

class TokenOTPMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $usu_correo;
    public $tokenOTP;

    public function __construct($usu_correo, $tokenOTP)
    {
        $this->usu_correo = $usu_correo;    
        $this->tokenOTP = $tokenOTP;    
    }

    /**
     * Define the envelope for the email.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Código para reestablecer la contraseña',
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
        return new Content(
            view: 'emails.PasswordOTP',
            with: ['usu_correo' => $this->usu_correo,
                   'tokenOTP' => $this->tokenOTP,]
        );
    }
}

