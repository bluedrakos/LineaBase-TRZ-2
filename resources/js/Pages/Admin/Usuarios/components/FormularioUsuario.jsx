
import { usuarioSchema, limpiarRut, formatearRut } from '@/Schemas/usuario.schema.js';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'rut.js';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { router } from '@inertiajs/react';


import SoapUserSearch from './SoapUserSearch';
import PersonalDataFields from './PersonalDataFields';
import WorkDataFields from './WorkDataFields';
import AccountDataFields from './AccountDataFields';

export default function FormularioUsuario({
    onSuccess,
    roles = [],
    usuarioEdit,
    instituciones = [],
    setLoading,
}) {
    let rutInicial = format(usuarioEdit?.usu_rut || '');
    if (rutInicial === '-') {
        rutInicial = '';
    }

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(usuarioSchema),
        defaultValues: {
            usu_nombre: usuarioEdit?.usu_nombre || '',
            usu_apellidos: usuarioEdit?.usu_apellidos || '',
            usu_correo: usuarioEdit?.usu_correo || '',
            usu_rut: usuarioEdit?.usu_rut || '',
            usu_rut_display: rutInicial,
            usu_telefono: usuarioEdit?.usu_telefono || '',
            usu_cargo: usuarioEdit?.usu_cargo || '',
            rol_id: usuarioEdit?.rol_id || '',
            ins_id: usuarioEdit?.ins_id || '',
            usu_tipo: usuarioEdit?.usu_tipo || 'Externo',
            usu_ldap: usuarioEdit?.usu_ldap || '',
            usu_analisis: usuarioEdit?.usu_analisis || '',
            usu_gerencia: usuarioEdit?.usu_gerencia || '',
        },
    });


    const tipo = watch('usu_tipo');
    const correo = watch('usu_correo');

    const seleccionarUsuarioSoap = (data) => {
        console.log('Datos SOAP Seleccionados:', data);

        const nombres = data.pe_nombres || data.nombres || data.Nombre || '';
        const apellidos = data.pe_apellidos || data.apellidos || data.ApellidoPaterno || '';
        
        let rutRaw = '';
        if (data.pe_rut) {
            rutRaw = data.pe_rut + (data.pe_rutdiv ? '-' + data.pe_rutdiv : '');
        } else if (data.rut) {
            rutRaw = data.rut; 
        } else if (data.Rut) {
            rutRaw = data.Rut;
        }

        if (rutRaw) {
            const rutLimpio = limpiarRut(rutRaw);
            const rutFormato = formatearRut(rutLimpio);
            setValue('usu_rut', rutLimpio);
            setValue('usu_rut_display', rutFormato);
        }

        const email = data.pe_email || data.email || data.Correo || '';
        
        let telefono = data.pe_telefono || data.telefono || '';
        if (!telefono && data.pe_celular) telefono = data.pe_celular;
        if (!telefono && data.pe_anexo && data.pe_anexo != '0') telefono = data.pe_anexo;

        const cargo = data.pe_cargo || data.cargo || '';
        const gerencia = data.pe_gerencia || data.gerencia || '';

        const usuarioLdap = data.ldap || data.usuario || ''; 
        
        setValue('usu_nombre', nombres);
        setValue('usu_apellidos', apellidos);
        setValue('usu_correo', email);
        setValue('usu_telefono', telefono ? telefono.toString().replace(/\D/g, '') : '');
        setValue('usu_cargo', cargo);
        setValue('usu_gerencia', gerencia);

        if (usuarioLdap) {
            setValue('usu_ldap', usuarioLdap);
            setValue('usu_tipo', 'Interno');
        } else {
            setValue('usu_tipo', 'Externo');
        }

        toast.success('Datos cargados desde Agenda');
    };

    useEffect(() => {
        if (tipo === 'Interno' && correo?.includes('@')) {
            const ldap = correo.split('@')[0];
            setValue('usu_ldap', ldap);
        }
    }, [correo, tipo, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        const cleanedData = {
            ...data,
            usu_telefono: data.usu_telefono?.replace(/\D/g, ''),
        };

        const routeName = usuarioEdit?.usu_id 
            ? route('admin.usuarios.update', usuarioEdit.usu_id)
            : route('admin.usuarios.store');
        
        const method = usuarioEdit?.usu_id ? 'put' : 'post';

        router[method](routeName, cleanedData, {
            onSuccess: () => {
                toast.success(usuarioEdit?.usu_id ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
                setLoading(false);
                onSuccess?.();
            },
            onError: (err) => {
                toast.error(err?.error || 'Ocurrió un error al guardar.');
                setLoading(false);
                console.error('Errores de validación:', err);
            },
        });
    };

    return (
        <form
            id="form-crear-usuario"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            {/* Sección: Información Personal */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b pb-2">
                    Información Personal
                </h3>
                
                <SoapUserSearch 
                    onSelect={seleccionarUsuarioSoap}
                    register={register}
                    error={errors.usu_nombre}
                />

                <PersonalDataFields 
                    register={register} 
                    errors={errors} 
                    setValue={setValue} 
                    watch={watch} 
                    setLoading={setLoading}
                    onSelectSoap={seleccionarUsuarioSoap}
                />
            </div>

            {/* Sección: Información Laboral */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b pb-2">
                    Información Laboral
                </h3>
                <WorkDataFields 
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                    instituciones={instituciones}
                />
            </div>

            {/* Sección: Configuración de Cuenta */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b pb-2">
                    Configuración de Cuenta
                </h3>
                <AccountDataFields 
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                    roles={roles}
                />
            </div>
        </form>
    );
}
