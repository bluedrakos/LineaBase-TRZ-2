<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('modulos');
        Schema::dropIfExists('submodulos');
        Schema::enableForeignKeyConstraints();

        Schema::create('modulos', function (Blueprint $table) {
            $table->id('mod_id');
            $table->string('mod_nombre', 100);
            $table->string('mod_slug', 100)->unique();
            $table->string('mod_icono', 50)->nullable();
            $table->integer('mod_orden')->nullable();
            $table->boolean('mod_activo')->default(true);

            $table->unsignedBigInteger('tmo_id');
            $table->unsignedBigInteger('gme_id')->nullable();
            $table->unsignedBigInteger('mod_padre_id')->nullable();
            $table->unsignedBigInteger('mod_creado_por');
            $table->unsignedBigInteger('mod_actualizado_por')->nullable();

            $table->timestamps();

            $table->foreign('tmo_id')->references('tmo_id')->on('tipo_modulo')->onDelete('cascade');
            $table->foreign('gme_id')->references('gme_id')->on('grupo_menu')->nullOnDelete();
            $table->foreign('mod_padre_id')->references('mod_id')->on('modulos')->nullOnDelete();
            $table->foreign('mod_actualizado_por')->references('usu_id')->on('usuarios')->onDelete('set null');
        });

        Schema::enableForeignKeyConstraints();

    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
