import { HttpStatus, ResponseManager } from '@/shared/lib/ResponseManager';

export class ApiError extends Error {
    constructor(status, message, errors = {}, code = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.errors = errors;
        this.code = code;
        
        // Mantiene la traza de pila (stack trace) correcta en V8 (Chrome, Edge, Node)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }

    // --- Helpers de estado HTTP ---

    isValidationError() {
        return this.status === HttpStatus.UNPROCESSABLE_ENTITY;
    }

    isAuthenticationError() {
        return this.status === HttpStatus.UNAUTHORIZED;
    }

    isAuthorizationError() {
        return this.status === HttpStatus.FORBIDDEN;
    }

    isNotFoundError() {
        return this.status === HttpStatus.NOT_FOUND;
    }

    isServerError() {
        return this.status >= HttpStatus.INTERNAL_SERVER_ERROR;
    }

    // --- Helpers para validaciones ---

    getValidationErrors() {
        return this.errors || {};
    }

    getFirstValidationError(field) {
        if (this.errors && this.errors[field] && Array.isArray(this.errors[field])) {
            return this.errors[field][0];
        }
        return null;
    }

    getAllValidationMessages() {
        if (!this.errors) return [];
        return Object.values(this.errors).flat();
    }
}

/**
 * Función factory para convertir un error de Axios en nuestra clase ApiError
 * de manera centralizada.
 */
export function handleApiError(error) {

    if (error instanceof ApiError) {
        return error;
    }

    if (error.response) {

        const payload = error.response.data;
        
        return new ApiError(
            error.response.status,
            payload?.message || error.message || ResponseManager.getMessage(error.response.status) || 'Error del servidor',
            payload?.errors || {},
            payload?.errors?.code || null
        );
    } else if (error.request) {

        return new ApiError(
            0,
            'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
            {},
            'NETWORK_ERROR'
        );
    } else {
   
        return new ApiError(
            0,
            error.message || 'Error desconocido al configurar la petición.',
            {},
            'UNKNOWN_ERROR'
        );
    }
}
