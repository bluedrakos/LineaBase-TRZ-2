<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Tabla de grupos del menú sidebar
        Schema::create('grupo_menu', function (Blueprint $table) {
            $table->id('gme_id');
            $table->string('gme_nombre', 80);
            $table->string('gme_slug', 80)->unique();
            $table->unsignedInteger('gme_orden')->default(0);
            $table->boolean('gme_activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grupo_menu');
    }
};
