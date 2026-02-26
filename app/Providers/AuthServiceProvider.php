<?php

namespace App\Providers;

use App\Models\Usuario;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     */
    public static $ignorePolicies = true;
    protected $policies = [];


    /**
     * Register any authentication / authorization services.
     */
    public function boot()
    {
    }
    
}