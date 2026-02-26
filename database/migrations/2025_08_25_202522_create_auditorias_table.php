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
        Schema::create('auditorias', function (Blueprint $table) {
            $table->id('aud_id');
            $table->timestamps();
            $table->string('usu_id')->nullable();
            $table->string('aud_ip')->nullable();
            $table->string('aud_metodo');
            $table->string('aud_accion');
            $table->string('aud_descripcion')->nullable();
            $table->string('aud_id_afectado')->nullable();
            $table->json('aud_datos')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auditorias');
    }
};
