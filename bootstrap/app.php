<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up'
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();

        $middleware->web(append: [
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'api.acc.mod' => \App\Http\Middleware\ApiPermitirModuloAccion::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Throwable $e, \Illuminate\Http\Request $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                $status = 500;
                $message = 'Error Interno del Servidor';
                $errors = [];

                if ($e instanceof \Illuminate\Validation\ValidationException) {
                    $status = $e->status;
                    $message = $e->getMessage();
                    $errors = $e->errors();
                } elseif ($e instanceof \Illuminate\Auth\AuthenticationException) {
                    $status = 401;
                    $message = 'No autenticado.';
                } elseif ($e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException || $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                    $status = 404;
                    $message = 'El recurso solicitado no fue encontrado.';
                }
                
                if ($e instanceof \Symfony\Component\HttpKernel\Exception\HttpExceptionInterface) {
                    $status = $e->getStatusCode();
                    $message = $e->getMessage() ?: \Symfony\Component\HttpFoundation\Response::$statusTexts[$status] ?? 'HttException';
                }

                // Si estamos en entorno Dev, agregamos el log completo del error
                if (config('app.debug') && config('app.env') !== 'testing' && $status >= 500) {
                    $message = $e->getMessage();
                    $errors = [
                        'exception' => get_class($e),
                        'file' => $e->getFile(),
                        'line' => $e->getLine(),
                        'trace' => collect($e->getTrace())->map(fn ($trace) => \Illuminate\Support\Arr::except($trace, ['args']))->all(),
                    ];
                }

                return response()->json([
                    'success' => false,
                    'message' => $message,
                    'errors' => (object) $errors,
                ], $status);
            }
        });
    })->create();
