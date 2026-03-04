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
        Schema::table('modulos', function (Blueprint $table) {
            $table->string('mod_codigo', 100)->nullable()->unique()->after('mod_nombre');
        });

        // Actualizar datos existentes si es necesario (asumiremos que se limpia despues con BD limpia o se pueblan auto)
        
        Schema::table('modulos', function (Blueprint $table) {
            $table->dropForeign(['tmo_id']);
            $table->unsignedBigInteger('tmo_id')->nullable()->change();
            $table->foreign('tmo_id')->references('tmo_id')->on('tipo_modulo')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('modulos', function (Blueprint $table) {
            $table->dropForeign(['tmo_id']);
        });

        Schema::table('modulos', function (Blueprint $table) {
            $table->unsignedBigInteger('tmo_id')->nullable(false)->change();
            $table->foreign('tmo_id')->references('tmo_id')->on('tipo_modulo')->cascadeOnDelete();
            
            $table->dropColumn('mod_codigo');
        });
    }
};
