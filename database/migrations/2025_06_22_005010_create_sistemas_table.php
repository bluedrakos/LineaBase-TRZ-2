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
        Schema::create('sistemas', function (Blueprint $table) {
            $table->id('sis_id');
            $table->timestamp('sis_instancia')->useCurrent();
            $table->timestamps();
            $table->enum('sis_tipo', ['Publico', 'Privado']);
            $table->string('sis_nombre', 100);
            $table->string('sis_descripcion', 255)->nullable();
            $table->string('sis_valor', 255)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sistemas');
    }
};
