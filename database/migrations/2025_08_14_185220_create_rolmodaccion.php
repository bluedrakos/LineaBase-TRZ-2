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
        Schema::create('rol_modulo_acciones', function (Blueprint $table) {
            $table->id('rma_id');
            $table->unsignedBigInteger('rol_id');
            $table->unsignedBigInteger('mac_id');
            $table->timestamps();

            // Foreign keys
            $table->foreign('rol_id')->references('rol_id')->on('roles')
                  ->cascadeOnUpdate()->cascadeOnDelete();

            $table->foreign('mac_id')->references('mac_id')->on('modulo_acciones')
                  ->cascadeOnUpdate()->cascadeOnDelete();

            // Unique constraint para evitar duplicados
            $table->unique(['rol_id', 'mac_id']);

            // Índices para optimizar consultas
            $table->index('rol_id');
            $table->index('mac_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rol_modulo_acciones');
    }
};