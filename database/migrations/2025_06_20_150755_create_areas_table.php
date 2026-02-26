<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('areas', function (Blueprint $table) {
            $table->id('area_id');
            $table->string('area_nombre', 100);
            $table->text('area_descripcion')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('areas');
    }
};
