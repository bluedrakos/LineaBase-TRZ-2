export const HttpStatus = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SESSION_EXPIRED: 419,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
};

export class ResponseManager {
    // Diccionario centralizado de mensajes
    static messages = {
        [HttpStatus.OK]: 'Operación realizada correctamente.',
        [HttpStatus.CREATED]: 'Registro creado correctamente.',
        [HttpStatus.BAD_REQUEST]: 'Solicitud inválida.',
        [HttpStatus.UNAUTHORIZED]: 'No autorizado.',
        [HttpStatus.FORBIDDEN]: 'Acceso denegado.',
        [HttpStatus.NOT_FOUND]: 'No se encontraron datos.',
        [HttpStatus.SESSION_EXPIRED]: 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.',
        [HttpStatus.UNPROCESSABLE_ENTITY]: 'Error de validación en los datos enviados.',
        [HttpStatus.INTERNAL_SERVER_ERROR]: 'Ocurrió un error interno del servidor.',
    };

    /**
     * Obtiene el mensaje buscando en nuestro diccionario único.
     * Si el día de mañana quieres cambiar el mensaje de "OK",
     * solo lo cambias arriba y se actualizará en TODA la aplicación.
     * 
     * @param {Object|number} input - El response de Axios, el error, o directamente el status (e.g., 200)
     * @returns {string}
     */
    static getMessage(input) {
        // En caso de que pasen directamente el código (ej. 200)
        if (typeof input === 'number') {
            return this.messages[input] || 'Mensaje no definido.';
        }

        // Si pasan un response o un error que contiene un status
        const status = input?.status || input?.response?.status;

        if (status && this.messages[status]) {
            return this.messages[status];
        }

        return 'Ocurrió un error inesperado al procesar la solicitud.';
    }
}
