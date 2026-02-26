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
        Schema::create('modulo_acciones', function (Blueprint $table) {
            $table->id('mac_id');
            $table->unsignedBigInteger('mod_id');
            $table->unsignedBigInteger('acc_id');
            $table->timestamps();

            // Foreign keys
            $table->foreign('mod_id')->references('mod_id')->on('modulos')
                  ->cascadeOnUpdate()->cascadeOnDelete();

            $table->foreign('acc_id')->references('acc_id')->on('acciones')
                  ->cascadeOnUpdate()->cascadeOnDelete();

            // Unique constraint para evitar duplicados
            $table->unique(['mod_id', 'acc_id']);

            // Índices para optimizar consultas
            $table->index('mod_id');
            $table->index('acc_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modulo_acciones');
    }
};