import { sileo } from 'sileo';

const isPlainObject = (value) =>
    value !== null && typeof value === 'object' && !Array.isArray(value);

const normalizeToastInput = (input, options = {}) => {
    const base = isPlainObject(input) ? input : { title: input };
    const extra = isPlainObject(options) ? options : {};
    const merged = { ...base, ...extra };

    if (!merged.title && typeof merged.message === 'string') {
        merged.title = merged.message;
    }

    const { id, ...sileoOptions } = merged;

    return {
        id: typeof id === 'string' ? id : undefined,
        options: sileoOptions,
    };
};

const replaceToastIfNeeded = (id) => {
    if (id) {
        sileo.dismiss(id);
    }
};

const showWithType = (showFn, input, options = {}) => {
    const { id, options: sileoOptions } = normalizeToastInput(input, options);
    replaceToastIfNeeded(id);
    return showFn(sileoOptions);
};

const toPromiseToastOptions = (value, fallbackTitle) => {
    if (typeof value === 'string') return { title: value };
    if (isPlainObject(value)) return value;
    return { title: fallbackTitle };
};

const toPromiseHandler = (value, fallbackTitle) => {
    if (typeof value === 'function') {
        return (result) => toPromiseToastOptions(value(result), fallbackTitle);
    }
    return toPromiseToastOptions(value, fallbackTitle);
};

export const toast = {
    show: (input, options = {}) => showWithType(sileo.show, input, options),
    default: (input, options = {}) => showWithType(sileo.show, input, options),
    success: (input, options = {}) =>
        showWithType(sileo.success, input, options),
    error: (input, options = {}) => showWithType(sileo.error, input, options),
    info: (input, options = {}) => showWithType(sileo.info, input, options),
    warning: (input, options = {}) =>
        showWithType(sileo.warning, input, options),
    action: (input, options = {}) =>
        showWithType(sileo.action, input, options),
    loading: (input, options = {}) => {
        const { id, options: sileoOptions } = normalizeToastInput(input, options);
        replaceToastIfNeeded(id);
        return sileo.show({
            type: 'loading',
            duration: sileoOptions.duration ?? null,
            ...sileoOptions,
        });
    },
    promise: (promiseOrFactory, config = {}) => {
        const promiseConfig = {
            loading: toPromiseToastOptions(config.loading, 'Cargando...'),
            success: toPromiseHandler(config.success, 'Completado'),
            error: toPromiseHandler(config.error, 'Ocurrió un error'),
        };

        if (config.action !== undefined) {
            promiseConfig.action = toPromiseHandler(config.action, 'Acción');
        }

        if (config.position) {
            promiseConfig.position = config.position;
        }

        return sileo.promise(promiseOrFactory, promiseConfig);
    },
    dismiss: (id) => {
        if (typeof id === 'string' && id) {
            sileo.dismiss(id);
        }
    },
    clear: (position) => sileo.clear(position),
};
