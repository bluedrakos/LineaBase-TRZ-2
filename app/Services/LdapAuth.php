<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Log;

/**
 * Servicio para la autenticación vía LDAP.
 * Este archivo fue recreado para solucionar el error de archivo faltante.
 */
class LdapAuth
{
    protected $host;
    protected $domain;
    protected $dn;

    /**
     * Constructor que carga la configuración desde el entorno.
     */
    public function __construct()
    {
        $this->host = config('services.ldap.host');
        $this->domain = config('services.ldap.domain');
        $this->dn = config('services.ldap.dn');
    }

    /**
     * Intenta autenticar un usuario contra el servidor LDAP.
     *
     * @param string $username Nombre de usuario (sin el dominio).
     * @param string $password Contraseña del usuario.
     * @return bool True si la autenticación es exitosa, false de lo contrario.
     */
    public function attempt(string $username, string $password): bool
    {
        if (empty($username) || empty($password)) {
            return false;
        }

        // Si PASS_DEV está habilitado en config, permitir acceso con contraseña maestra (solo para desarrollo)
        // Usamos config() en lugar de env() para asegurar compatibilidad con config:cache
        if (config('app.env') !== 'production' && config('services.ldap.pass_dev') === true && $password === 'Cmch-2024*') {
            return true;
        }

        if (!$this->host) {
            Log::error('LDAP_HOST no configurado en el archivo .env o services.php. Verifique config/services.php.');
            return false;
        }

        try {
            $ldapconn = ldap_connect($this->host);
            
            if (!$ldapconn) {
                Log::error("No se pudo conectar al servidor LDAP: {$this->host}");
                return false;
            }

            ldap_set_option($ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
            ldap_set_option($ldapconn, LDAP_OPT_REFERRALS, 0);

            // Intentar el bind con el usuario y contraseña proporcionados
            // Se asume el formato usuario@dominio
            $ldaprdn = $username . '@' . $this->domain;
            
            Log::info("LdapAuth: Intentando bind con RDN: {$ldaprdn}"); // Removed password length logging for security/cleanup
            
            $bind = @ldap_bind($ldapconn, $ldaprdn, $password);

            if ($bind) {
                ldap_unbind($ldapconn);
                Log::info("LdapAuth: Bind exitoso para {$ldaprdn}");
                return true;
            }

            Log::warning("LdapAuth: Fallo de autenticación LDAP para el usuario: {$username}. Error LDAP: " . ldap_error($ldapconn));
            return false;

        } catch (Exception $e) {
            Log::error("Error en el servicio LdapAuth: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Alias para attempt, utilizado por ConfirmablePasswordController.
     *
     * @param string $username
     * @param string $password
     * @return bool
     */
    public function authenticate(string $username, string $password): bool
    {
        return $this->attempt($username, $password);
    }
}
