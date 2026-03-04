import { Link, usePage } from '@/shared/app-bridge';
import * as Icons from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuBadge,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/shared/ui/sidebar';

// Resuelve un ícono de lucide-react por nombre, con fallback a HelpCircle
const resolveIcon = (iconName) => {
    if (!iconName) return Icons.HelpCircle;
    const Icon = Icons[iconName];
    return Icon || Icons.HelpCircle;
};

// Estilo del label de cada sección del sidebar
const sectionLabelClass =
    'px-2 mb-1 text-[12px] font-semibold tracking-[0.02em] text-slate-500 dark:text-slate-300';

// Capitaliza la primera letra del label
const formatLabel = (value) => {
    const text = String(value ?? '').trim();
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export function NavMain({ sections = [] }) {
    const { url } = usePage();
    const { state } = useSidebar();
    const collapsed = state === 'collapsed';
    // Calcula todos los items aplanados para detectar cuál está activo
    const allItems = useMemo(
        () => sections.flatMap((section) => section.items ?? []),
        [sections],
    );

    const [openMenus, setOpenMenus] = useState(() => {
        const initialState = {};
        sections.flatMap((section) => section.items ?? []).forEach((item) => {
            const isActive = (item.items ?? []).some(
                (sub) => url === sub.url,
            );
            if (isActive) {
                initialState[item.title] = true;
            }
        });
        return initialState;
    });

    useEffect(() => {
        setOpenMenus((prev) => {
            const nextState = { ...prev };
            let changed = false;
            allItems.forEach((item) => {
                const isActive = (item.items ?? []).some(
                    (sub) => url === sub.url,
                );
                if (isActive && !nextState[item.title]) {
                    nextState[item.title] = true;
                    changed = true;
                }
            });
            return changed ? nextState : prev;
        });
    }, [allItems, url]);

    const toggleMenu = (title) => {
        setOpenMenus((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    // Renderiza un item del menú con sus sub-items
    const renderMenuItem = (item, keyPrefix = 'item') => {
        const isOpen = openMenus[item.title];
        const subItems = item.items || [];
        const itemKey = `${keyPrefix}-${formatLabel(item.title)}`;
        const ItemIcon = resolveIcon(item.icon);

        return (
            <SidebarMenuItem key={itemKey}>
                {collapsed ? (
                    subItems.length > 0 ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    aria-label={formatLabel(item.title)}
                                    className="hover:bg-muted/40 flex size-9 h-9 w-9 items-center justify-center rounded-lg"
                                >
                                    <ItemIcon className="size-4" />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                className="w-52"
                                side="right"
                                align="start"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="text-sm font-normal text-slate-800 dark:text-slate-100">
                                    {formatLabel(item.title)}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {subItems.map((subItem, subIndex) => {
                                    const SubIcon = resolveIcon(subItem.icon);
                                    return (
                                        <DropdownMenuItem
                                            key={`${itemKey}-sub-${subIndex}`}
                                            asChild
                                        >
                                            <Link
                                                href={subItem.url}
                                                className={`hover:bg-muted/40 flex w-full items-center gap-2 text-sm font-normal ${
                                                    url === subItem.url ? 'bg-muted/50 text-slate-900 font-semibold dark:text-white dark:bg-slate-800' : 'text-slate-800 dark:text-slate-100'
                                                }`}
                                            >
                                                <SubIcon className="h-4 w-4" />
                                                <span>
                                                    {formatLabel(subItem.title)}
                                                </span>
                                            </Link>
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <SidebarMenuButton
                            asChild
                            tooltip={{
                                children: formatLabel(item.title),
                                side: 'right',
                                align: 'center',
                                sideOffset: 8,
                                className:
                                    'rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-800 shadow-md [&_.rotate-45]:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
                            }}
                        >
                            <Link
                                href={item.url || '#'}
                                aria-label={formatLabel(item.title)}
                            >
                                <ItemIcon className="h-4 w-4" />
                                <span>{formatLabel(item.title)}</span>
                            </Link>
                        </SidebarMenuButton>
                    )
                ) : subItems.length > 0 ? (
                    <>
                        <SidebarMenuButton
                            onClick={() => toggleMenu(item.title)}
                            isActive={subItems.some((sub) => url === sub.url)}
                            className="text-sm font-normal text-slate-800 dark:text-slate-100"
                        >
                            <ItemIcon className="size-4" />
                            <span>{formatLabel(item.title)}</span>
                            <ChevronRight
                                className={`ml-auto size-4 transition-transform duration-200 ${
                                    isOpen ? 'rotate-90' : ''
                                }`}
                            />
                        </SidebarMenuButton>
                        <SidebarMenuSub
                            className={`overflow-hidden transition-all duration-300 ease-out ${
                                isOpen
                                    ? 'mt-1 max-h-96 translate-y-0 opacity-100'
                                    : 'pointer-events-none max-h-0 -translate-y-1 opacity-0'
                            }`}
                            aria-hidden={!isOpen}
                        >
                            {subItems.map((subItem, subIndex) => {
                                const SubIcon = resolveIcon(subItem.icon);
                                return (
                                    <SidebarMenuSubItem
                                        key={`${itemKey}-sub-${subIndex}`}
                                    >
                                        <SidebarMenuSubButton asChild isActive={url === subItem.url}>
                                            <Link
                                                href={subItem.url}
                                                className="hover:bg-muted/40 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-normal text-slate-800 dark:text-slate-100"
                                            >
                                                <SubIcon className="h-4 w-4" />
                                                <span>
                                                    {formatLabel(subItem.title)}
                                                </span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                        {subItem.badge && (
                                            <SidebarMenuBadge className="rounded-full bg-blue-600 px-1.5 text-white dark:bg-blue-500">
                                                {subItem.badge}
                                            </SidebarMenuBadge>
                                        )}
                                    </SidebarMenuSubItem>
                                );
                            })}
                        </SidebarMenuSub>
                    </>
                ) : (
                    <SidebarMenuButton asChild isActive={url === item.url}>
                        <Link href={item.url || '#'}>
                            <ItemIcon className="h-4 w-4" />
                            <span>{formatLabel(item.title)}</span>
                        </Link>
                    </SidebarMenuButton>
                )}
                {item.badge && subItems.length === 0 && (
                    <SidebarMenuBadge className="rounded-full bg-blue-600 px-1.5 text-white dark:bg-blue-500">
                        {item.badge}
                    </SidebarMenuBadge>
                )}
            </SidebarMenuItem>
        );
    };

    // Renderiza cada sección con su label y sus items
    return (
        <>
            {sections.map((section, sectionIndex) => (
                <SidebarGroup
                    key={`${section.slug || section.label}-${sectionIndex}`}
                >
                    <SidebarGroupLabel className={sectionLabelClass}>
                        {formatLabel(section.label)}
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {(section.items || []).map((item, itemIndex) =>
                            renderMenuItem(
                                item,
                                `section-${sectionIndex}-${itemIndex}`,
                            ),
                        )}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
}

export default NavMain;
