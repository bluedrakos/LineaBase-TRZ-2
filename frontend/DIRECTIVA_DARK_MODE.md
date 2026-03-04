# Directiva General de Colores: Modo Oscuro (Dark Mode) en SICMO

Este documento establece las convenciones y utilidades de Tailwind CSS que deben utilizarse en todo el frontend de `sicmo_nuevo` para garantizar una apariencia limpia, premium y uniforme cuando la aplicación se encuentre en **Modo Oscuro** (Dark Mode).

---

## 1. Fondos Generales (Backgrounds)
Para mantener un contraste elegante que no fatigue la vista (evitando el negro puro `#000`), el sistema adopta la escala `slate` de Tailwind.

- **Fondo de página (Base):** `dark:bg-slate-950`
- **Fondo de Tarjetas/Módulos/Tablas (Superficies):** `dark:bg-slate-900`
- **Fondos de inputs, modales, o bloques destacados:** `dark:bg-slate-800`

## 2. Bordes y Separadores (Borders)
Los bordes deben ser sutiles. En modo oscuro, los bordes blancos/grises claros distraen y "rompen" el diseño.

- **Bordes de tarjetas y tablas:** `dark:border-slate-800`
- **Separadores internos (filas de tabla, divisiones de menú):** `dark:border-slate-800` o `dark:border-slate-800/50`

## 3. Tipografía (Textos)
Es crucial no usar blanco puro (`#FFF`) en párrafos largos para evitar el efecto de de "halo lumínico".

- **Títulos y Cabeceras (h1, h2, labels importantes):** `dark:text-gray-100` o `dark:text-slate-100`
- **Texto Normal (párrafos, celdas de tabla):** `dark:text-gray-300` o `dark:text-slate-300`
- **Texto Secundario (hints, placeholders, fechas, subtítulos):** `dark:text-gray-400` o `dark:text-slate-400`

## 4. Colores de Identidad y Acentos (Semantic Colors)
Al usar botones, iconos de menú, o alertas, asegúrate de utilizar las variantes luminosas para que resalten sobre los fondos oscuros.

- **Primario / Acción (Verde):** `dark:text-green-400` *Hover:* `dark:hover:text-green-300`
- **Información / Editar (Azul):** `dark:text-blue-400` *Hover:* `dark:hover:text-blue-300`
- **Peligro / Eliminar / Error (Rojo):** `dark:text-red-400` *Hover:* `dark:hover:text-red-300`
- **Advertencias (Naranja/Amarillo):** `dark:text-amber-400` *Hover:* `dark:hover:text-amber-300`

## 5. Esqueletos de Carga (Skeletons & Shimmering)
Para los estados `isLoading`, el flash de carga blanco arruina la experiencia nocturna.

- **Fondo base del bloque de carga:** `dark:bg-slate-800` (En caso de ser un pulso único sutil, usar `dark:bg-[#111827] dark:highlight-white/5` en reemplazo).
- **El brillo deslizante (`via` de un gradiente hover):** `dark:via-slate-800/50` o `dark:via-slate-700/50`. Nunca debe ser `via-slate-50`.

## 6. Estados de Interacción (Hover / Focus)
Los hovers transparentes permiten dar la sensación de profundidad.

- **Hover de una fila de tabla o elemento clickeable en lista:** `dark:hover:bg-slate-800/30` o `dark:hover:bg-slate-800/50`
- **Fondo de Botones Primarios Solid (Si aplica):** `dark:bg-blue-600 dark:hover:bg-blue-700`

---
> **⚡ Recomendación del Desarrollador (Antigravity):**
> Siempre que se cree un nuevo componente en React para la aplicación, revísalo en vista dual (Light y Dark). Si pones un `bg-white`, inmediatamente combínalo con un `dark:bg-slate-900`. Si agregas un `border-slate-200`, ciérralo con `dark:border-slate-800`.
