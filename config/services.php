<?php


return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => getenv('POSTMARK_TOKEN') ?: null,
    ],

    'resend' => [
        'key' => getenv('RESEND_KEY') ?: null,
    ],

    'ses' => [
        'key' => getenv('AWS_ACCESS_KEY_ID') ?: null,
        'secret' => getenv('AWS_SECRET_ACCESS_KEY') ?: null,
        'region' => getenv('AWS_DEFAULT_REGION') ?: 'us-east-1',
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => getenv('SLACK_BOT_USER_OAUTH_TOKEN') ?: null,
            'channel' => getenv('SLACK_BOT_USER_DEFAULT_CHANNEL') ?: null,
        ],
    ],

    'agenda' => [
        'uri' => getenv('SOAP_URI') ?: null,
        'location' => getenv('SOAP_LOCATION_AGENDA') ?: null,
        'location_scdi' => getenv('SOAP_LOCATION_SCDI') ?: null,
        'proxy_host' => getenv('PROXY_HOST') ?: null,
        'proxy_port' => getenv('PROXY_PORT') ?: null,
    ],

    'ldap' => [
        'host' => env('LDAP_HOST'),
        'domain' => env('LDAP_DOMAIN'),
        'dn' => env('LDAP_DN'),
        'pass_dev' => env('PASS_DEV', false), // Added to config
    ],

];
