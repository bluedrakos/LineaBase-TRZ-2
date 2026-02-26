<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tipo_modulo', function (Blueprint $table) {
            $table->id('tmo_id');
            $table->string('tmo_nombre', 100);
            $table->string('tmo_slug', 100)->unique();
            $table->string('tmo_icono', 50)->nullable();
            $table->integer('tmo_orden')->default(0);
            $table->boolean('tmo_activo')->default(true);
            
            // Campos de auditoría
            $table->unsignedBigInteger('tmo_creado_por');
            $table->unsignedBigInteger('tmo_actualizado_por')->nullable();
            $table->timestamps();
            
            // Índices
            $table->index('tmo_activo');
            $table->index('tmo_orden');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tipo_modulo');
    }
};