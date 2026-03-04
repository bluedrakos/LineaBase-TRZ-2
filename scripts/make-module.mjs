#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const rawName = process.argv[2];

if (!rawName) {
    console.error(
        'Uso: npm run make:module -- <NombreModulo> (ej: gestion-sensores)',
    );
    process.exit(1);
}

function toKebabCase(input) {
    return input
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
}

function toPascalCase(input) {
    return toKebabCase(input)
        .split('-')
        .filter(Boolean)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join('');
}

const moduleSlug = toKebabCase(rawName);
const moduleName = toPascalCase(rawName);

if (!moduleSlug) {
    console.error('Nombre de modulo invalido.');
    process.exit(1);
}

const moduleRoot = path.join('resources', 'js', 'modules', moduleSlug);

const folders = [
    moduleRoot,
    path.join(moduleRoot, 'pages'),
    path.join(moduleRoot, 'pages', 'components'),
    path.join(moduleRoot, 'hooks'),
    path.join(moduleRoot, 'services'),
    path.join(moduleRoot, 'schemas'),
    path.join(moduleRoot, 'store'),
];

const files = [
    {
        path: path.join(moduleRoot, 'index.js'),
        content: `export { default as ${moduleName}IndexPage } from './pages/Index';\n`,
    },
    {
        path: path.join(moduleRoot, 'pages', 'Index.jsx'),
        content: `import LayoutDashboard from '@/app/layouts/AdminLayout';\nimport { Head } from '@inertiajs/react';\n\nexport default function ${moduleName}IndexPage() {\n    return (\n        <LayoutDashboard>\n            <Head title='${moduleName}' />\n            <div className='max-w-[1240px] mx-auto w-full space-y-4 pt-4 md:px-8 md:pt-8 md:pb-8'>\n                <div>\n                    <h2 className='text-2xl font-bold tracking-tight'>${moduleName}</h2>\n                    <p className='text-muted-foreground'>\n                        Módulo \"${moduleSlug}\" creado automáticamente. Implementa aquí su UI.\n                    </p>\n                </div>\n            </div>\n        </LayoutDashboard>\n    );\n}\n`,
    },
    {
        path: path.join(moduleRoot, 'pages', 'components', '.gitkeep'),
        content: '',
    },
    {
        path: path.join(moduleRoot, 'hooks', '.gitkeep'),
        content: '',
    },
    {
        path: path.join(moduleRoot, 'services', '.gitkeep'),
        content: '',
    },
    {
        path: path.join(moduleRoot, 'schemas', '.gitkeep'),
        content: '',
    },
    {
        path: path.join(moduleRoot, 'store', '.gitkeep'),
        content: '',
    },
];

const run = async () => {
    await Promise.all(folders.map((dir) => fs.mkdir(dir, { recursive: true })));

    for (const file of files) {
        try {
            await fs.access(file.path);
            // Do not overwrite user changes if file already exists.
        } catch {
            await fs.writeFile(file.path, file.content, 'utf8');
        }
    }

    console.log(`Modulo creado: ${moduleRoot}`);
    console.log(`Pagina inicial: modules/${moduleSlug}/pages/Index.jsx`);
    console.log(`Uso Inertia esperado: "${moduleName}/Index" o "${moduleSlug}/Index" segun convención de rutas.`);
};

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
