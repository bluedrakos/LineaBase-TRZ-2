import { z } from 'zod';

export function limpiarRut(rut) {
    return rut.replace(/[^0-9kK]/g, '').toUpperCase();
}

function calcularDigitoVerificador(T) {
    let M = 0,
        S = 1;
    for (; T; T = Math.floor(T / 10)) S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
    return S ? S - 1 : 'k';
}

export function validarRut(rut) {
    rut = limpiarRut(rut);
    if (rut.length < 2) return false;

    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1).toLowerCase();

    // Validar formato del cuerpo
    if (!/^[0-9]+$/.test(cuerpo)) return false;

    const dvCalc = calcularDigitoVerificador(cuerpo).toString();

    return dv === dvCalc;
}

export function formatearRut(rut) {
    rut = limpiarRut(rut);

    if (rut.length === 0) return '';
    if (rut.length === 1) return rut;

    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1);
    const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    if (!cuerpo) return dv;

    return `${cuerpoFormateado}-${dv}`;
}

export const usuarioSchema = z
    .object({
        usu_nombre: z
            .string()
            .min(1, { message: 'El nombre es obligatorio' })
            .max(50, { message: 'Máximo 50 caracteres' }),

        usu_apellidos: z
            .string()
            .min(1, { message: 'Los apellidos son obligatorios' })
            .max(100, { message: 'Máximo 100 caracteres' }),

        usu_rut: z
            .string()
            .min(1, { message: 'El RUT es obligatorio' })
            .transform((rut) => limpiarRut(rut))
            .refine(
                (rut) => {
                    const l = rut.length;
                    return l >= 7 && l <= 9;
                },
                { message: 'Largo de RUT inválido' },
            )
            .refine((rut) => validarRut(rut), { message: 'RUT inválido' }),

        usu_correo: z
            .string()
            .email({ message: 'Correo electrónico inválido' }),

        usu_telefono: z
            .string()
            .optional()
            .refine((val) => !val || /^\d+$/.test(val), {
                message: 'El teléfono debe contener solo números',
            }),

        usu_cargo: z.string().optional(),

        usu_tipo: z.enum(['Interno', 'Externo'], {
            errorMap: () => ({ message: 'Tipo de usuario inválido' }),
        }),

        rol_id: z
            .number({ invalid_type_error: 'El rol es obligatorio' })
            .int({ message: 'ID de rol inválido' }),

        area_id: z.number().int().nullable().optional(),
        ins_id: z.number().int().nullable().optional(),
        usu_ldap: z.string().optional(),
        usu_analisis: z
            .string()
            .max(50, { message: 'Máximo 50 caracteres' })
            .nullable()
            .optional(),
        usu_gerencia: z
            .string()
            .max(150, { message: 'Máximo 150 caracteres' })
            .nullable()
            .optional(),
        usu_password: z.string().optional(), // se ignora en validación
    })

    .superRefine(() => {
        // Validación condicional (si se desea obligar a tener LDAP e Interno, descomentar)
        /*
        if (data.usu_tipo === 'Interno' && !data.usu_ldap) {
            ctx.addIssue({
                code: 'custom',
                path: ['usu_ldap'],
                message: 'El campo LDAP es obligatorio para usuarios internos',
            });
        }
        */
    });

export const passwordSchema = z
    .object({
        password: z
            .string()
            .min(8, { message: 'Tiene que tener minimo 8 caracteres' })
            .max(50, { message: 'Máximo 50 caracteres' })
            .regex(/[a-z]/, {
                message:
                    'La contraseña debe contener al menos una letra minúscula',
            })
            .regex(/[A-Z]/, {
                message:
                    'La contraseña debe contener al menos una letra mayúscula',
            })
            .regex(/[0-9]/, {
                message: 'La contraseña debe contener al menos un número',
            })
            .regex(/[@$!#%*?&]/, {
                message:
                    'La contraseña debe contener al menos un carácter especial',
            }),
        confirmPassword: z
            .string()
            .min(8, { message: 'Tiene que tener minimo 8 caracteres' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas deben ser iguales',
        path: ['confirmPassword'],
    });
