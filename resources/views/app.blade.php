<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'SICMO') }}</title>

        {{-- Carga de la aplicación React compilada por Vite --}}
        @vite(['src/app.jsx'])
    </head>
    <body>
        {{-- Punto de montaje de la SPA --}}
        <div id="app"></div>
    </body>
</html>
