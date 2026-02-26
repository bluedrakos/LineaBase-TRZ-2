<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Services\LdapAuth;
use App\Services\SoapAgendaService;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(LdapAuth::class, function () {
            return new LdapAuth();
        });

        $this->app->bind(SoapAgendaService::class, function () {
            return new SoapAgendaService();
        });
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        \App\Models\Usuario::observe(\App\Observers\UsuarioObserver::class);
    }
}
