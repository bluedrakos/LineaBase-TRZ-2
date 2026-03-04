// Mapea los datos del perfil/sidebar a la estructura de secciones para NavMain
export function mapPerfilToNavMain(perfil) {
    if (!perfil?.modulos && !perfil?.sidebar) return [];

    const origen = perfil.modulos ?? perfil.sidebar;
    if (!Array.isArray(origen) || origen.length === 0) return [];

    // Formato agrupado: cada elemento tiene grupo_nombre e items
    const isGrouped =
        origen[0]?.grupo_nombre && Array.isArray(origen[0]?.items);

    if (isGrouped) {
        return origen.map((grupo) => ({
            label: grupo.grupo_nombre,
            slug: grupo.grupo_slug,
            order: grupo.grupo_orden ?? 999,
            items: (grupo.items ?? []).map((item) => ({
                title: item.title,
                url: item.url,
                icon: item.icon,
                items: (item.items ?? []).map((sub) => ({
                    title: sub.title,
                    url: sub.url,
                    icon: sub.icon,
                })),
            })),
        }));
    }

    // Compatibilidad con formato anterior del sidebar
    return origen.map((modulo) => ({
        label: modulo.nombre,
        slug: modulo.slug,
        items: [
            {
                title: modulo.nombre,
                url: null,
                icon: modulo.icono,
                items: (modulo.submodulos ?? []).map((sub) => ({
                    title: sub.nombre,
                    url: sub.path,
                    icon: sub.icono,
                })),
            },
        ],
    }));
}
