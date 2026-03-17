import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const pages = import.meta.glob([
    '../../core/**/pages/**/*.jsx',
    '../../modules/**/pages/**/*.jsx',
]);

const coreDomainAliases = {
    admin: null,
    auth: 'auth',
    profile: 'perfiles',
    errors: 'errores',
    errores: 'errores',
    resetpassword: 'password',
    password: 'password',
    dashboard: 'panel',
    panel: 'panel',
    usuarios: 'usuarios',
    roles: 'roles',
    modulos: 'modulos',
    instituciones: 'instituciones',
    auditorias: 'auditorias',
    sistemas: 'sistemas',
};

function normalize(segment = '') {
    return segment
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]/g, '')
        .toLowerCase();
}

function toModuleFolder(segment = '') {
    return segment
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
}

function coreCandidates(name) {
    const parts = name.split('/').filter(Boolean);
    if (!parts.length) return [];

    const first = normalize(parts[0]);
    const isAdmin = first === 'admin' && parts.length >= 3;

    const domainRaw = isAdmin ? parts[1] : parts[0];
    const domain = coreDomainAliases[normalize(domainRaw)];
    if (!domain) return [];

    const page = `${parts[parts.length - 1]}.jsx`;
    return [`../../core/${domain}/pages/${page}`];
}

function moduleCandidates(name) {
    const parts = name.split('/').filter(Boolean);
    if (!parts.length) return [];

    const moduleFolder = toModuleFolder(parts[0]);
    const page = `${parts[parts.length - 1]}.jsx`;
    const nested = parts.slice(1, -1).join('/');

    const candidates = [
        `../../modules/${moduleFolder}/pages/${page}`,
        nested ? `../../modules/${moduleFolder}/pages/${nested}/${page}` : null,
    ].filter(Boolean);

    return candidates;
}

export async function resolveInertiaPage(name) {
    const candidates = [...coreCandidates(name), ...moduleCandidates(name)];
    const found = candidates.find((path) => pages[path]);

    if (!found) {
        throw new Error(
            `Inertia page "${name}" no encontrada en core/modules. Revisa convención de carpetas.`,
        );
    }

    const page = await resolvePageComponent(found, pages);
    return page.default || page;
}
