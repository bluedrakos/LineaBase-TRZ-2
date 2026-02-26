<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id('usu_id');
            $table->enum('usu_estado', ['Habilitado', 'Bloqueado']);
            $table->string('usu_rut', 10)->unique();
            $table->string('usu_ldap', 50)->unique()->nullable();
            $table->string('usu_password')->nullable();
            $table->enum('usu_tipo', ['Interno', 'Externo']);
            $table->string('usu_nombre', 50);
            $table->string('usu_apellidos', 100);
            $table->string('usu_analisis', 50)->nullable()->unique();
            $table->string('usu_seccion', 100)->nullable();
            $table->string('usu_avatar')->nullable();
            $table->string('usu_cargo')->nullable();
            $table->string('usu_gerencia', 150)->nullable();
            $table->string('usu_correo', 100)->unique();
            $table->string('usu_telefono', 20)->nullable();
            $table->enum('usu_terminos', ['Si', 'No'])->default('No');
            $table->tinyInteger('usu_intentos')->default(0);
            $table->dateTime('usu_acceso')->nullable();
            $table->dateTime('usu_instancia');
            $table->boolean('usu_activo')->default(true);
            $table->unsignedBigInteger('rol_id');
            $table->unsignedBigInteger('ins_id')->nullable();
            $table->timestamps();
            $table->rememberToken();
            $table->text('usu_passwordToken', 60)->nullable();
            $table->boolean('usu_cambiar_password');
            $table->datetime('usu_expiracionToken')->nullable();
            $table->string('usu_otp')->nullable();
            $table->datetime('usu_otp_expiracion')->nullable();
            $table->foreign('rol_id')->references('rol_id')->on('roles')->onDelete('cascade');
            $table->foreign('ins_id')->references('ins_id')->on('instituciones')->onDelete('set null');
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('reestablecer_contrasenas');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('usuarios');
        Schema::dropIfExists('password_reset_tokens');
    }
};
