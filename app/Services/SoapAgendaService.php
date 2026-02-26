<?php

namespace App\Services;

use SoapClient;
use SoapHeader;
use SoapVar;
use Exception;
use Illuminate\Support\Facades\Log;

/**
 * Servicio para consumir la API SOAP de Agenda.
 */
class SoapAgendaService
{
    protected $uri;
    protected $location;
    protected $username;
    protected $password;

    /**
     * Constructor que inicializa la configuración SOAP.
     */
    public function __construct()
    {
        $this->uri = env('SOAP_URI', 'https://bisain.casamoneda.cl');
        $this->location = env('SOAP_LOCATION_AGENDA', 'https://bisain.casamoneda.cl/AGENDA/wservice.php');
        
        // El usuario en .env es el MD5 de BISAIN (470f857def68ed7bb47aaf5d5636b744)
        // Pero el servicio espera el valor real "BISAIN".
        $usuarioEnv = env('SOAP_USUARIO');
        if ($usuarioEnv === '470f857def68ed7bb47aaf5d5636b744' || empty($usuarioEnv)) {
            $this->username = 'BISAIN';
        } else {
            $this->username = $usuarioEnv;
        }
        
        // Obtener la clave del .env o usar la lógica de encriptación AES del debug
        $claveEnv = env('SOAP_CLAVE');
        if (empty($claveEnv) || strlen($claveEnv) === 32) {
            $this->password = trim(openssl_encrypt(
                hash('sha256', env('SOAP_FALLBACK_DATA_KEY')),
                'AES-256-CBC',
                env('SOAP_FALLBACK_ENCRYPTION_KEY'),
                0,
                env('SOAP_FALLBACK_IV')
            ));
        } else {
            $this->password = $claveEnv;
        }
    }

    /**
     * Recupera un usuario de la agenda mediante SOAP.
     *
     * @param string $nombre
     * @param string $rut
     * @param int $limit
     * @param int $flagMultiples
     * @return mixed
     */
    public function wsRecuperarUsuarioAgenda($nombre = '', $rut = '', $limit = 1, $flagMultiples = 0)
    {
        // Configuración del contexto para omitir validación SSL
        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ]);

        $options = [
            'stream_context' => $context,
            'location' => $this->location,
            'uri' => $this->uri,
            'trace' => 1,
            'exceptions' => true,
            'connection_timeout' => 15,
            'cache_wsdl' => WSDL_CACHE_NONE,
        ];

        try {
            // Instanciar el cliente SOAP en modo no-WSDL
            $client = new SoapClient(null, $options);

            // Generar el header de seguridad WSSE (UsernameToken)
            $wsse = '
<wsse:Security SOAP-ENV:mustUnderstand="1"
 xmlns:wsse="http://schemas.xmlsoap.org/ws/2003/06/secext"
 xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
  <wsse:UsernameToken>
    <wsse:Username>' . htmlspecialchars($this->username) . '</wsse:Username>
    <wsse:Password>' . htmlspecialchars($this->password) . '</wsse:Password>
  </wsse:UsernameToken>
</wsse:Security>';

            $header = new SoapHeader(
                'http://schemas.xmlsoap.org/ws/2003/06/secext',
                'Security',
                new SoapVar($wsse, XSD_ANYXML)
            );

            $client->__setSoapHeaders([$header]);

            $resultado = $client->AgendaEntregaPersonaLimit($nombre, $rut, $limit);

            // Convertir a array para consistencia
            if (is_object($resultado)) {
                $resultado = json_decode(json_encode($resultado), true);
            }

            return $resultado;

        } catch (Exception $e) {
            Log::error("Error en SoapAgendaService: " . $e->getMessage());
            return [
                'idMensaje' => -1,
                'mensaje' => 'Error al consultar el servicio: ' . $e->getMessage()
            ];
        }
    }
}
