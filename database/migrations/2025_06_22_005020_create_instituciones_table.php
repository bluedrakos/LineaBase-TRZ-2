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
        Schema::create('instituciones', function (Blueprint $table) {
            $table->id('ins_id');
            $table->timestamp('ins_instancia')->useCurrent();;
            $table->timestamps();
            $table->string('ins_nombre', 100);
            $table->string('ins_rut', 100);
            $table->string('ins_sigla', 20);
            $table->string('ins_direccion', 200)->nullable();
            $table->string('ins_telefono', 20)->nullable();
            $table->string('ins_correo', 100)->nullable();
            $table->string('ins_descripcion', 200)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('instituciones');
    }
};
