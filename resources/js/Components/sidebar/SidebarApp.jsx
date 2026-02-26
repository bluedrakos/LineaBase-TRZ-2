import { Link, usePage } from '@inertiajs/react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/Components/ui/sidebar';

import SvgMitra from '@/Components/General/SvgMitra';
import { NavMain } from './components/NavMain';
import { NavUser } from './components/NavUser';

export function AppSidebar({ user, logout, navItems, ...props }) {
    const { versionSistema, nombreSistema, descripcionSistema } = usePage().props;

    const versionLabel = versionSistema ? ` (v${versionSistema})` : '';

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <div className="text-sidebar-primary-foreground flex aspect-square size-9 items-center justify-center rounded-lg">
                                    {/* <Command className="size-4" /> */}
                                    <SvgMitra
                                        className="h-auto w-50"
                                        lightColor="rgb(0,64,100)"
                                        darkColor="#ffffff"
                                    />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold text-[rgb(0,64,100)] dark:text-white">
                                        {nombreSistema ?? 'Línea Base'}
                                    </span>

                                    <span className="truncate text-xs">
                                        {descripcionSistema ?? 'Trazabilidad'}{versionLabel}
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain sections={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={user} logout={logout} />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
