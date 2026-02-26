<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('acciones', function (Blueprint $table) {
            $table->id('acc_id');
            $table->string('acc_nombre', 100);
            $table->string('acc_slug', 100)->unique();
            $table->string('acc_icono', 50)->nullable();
            $table->boolean('acc_activo')->default(true);

            $table->unsignedBigInteger('acc_creado_por');
            $table->unsignedBigInteger('acc_actualizado_por')->nullable();

            $table->timestamps();

            $table->foreign('acc_creado_por')->references('usu_id')->on('usuarios')->onDelete('restrict');
            $table->foreign('acc_actualizado_por')->references('usu_id')->on('usuarios')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('acciones');
    }
};
