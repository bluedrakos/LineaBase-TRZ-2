import { ModeToggle } from '@/Components/sidebar/components/mode-toggle';
import { NotificacionesPopover } from '@/Components/sidebar/components/NotificacionesPopover';
import { mapPerfilToNavMain } from '@/Components/sidebar/components/SidebarMap';
import { ToggleFullscreenButton } from '@/Components/sidebar/components/ToggleFullscreenButton';
import { AppSidebar } from '@/Components/sidebar/SidebarApp';
import { SidebarSkeleton } from '@/Components/sidebar/SidebarSkeleton';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/Components/ui/breadcrumb';
import { Separator } from '@/Components/ui/separator';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/Components/ui/sidebar';
import { Toaster } from '@/Components/ui/sonner';
import { Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

export default function LayoutDashboard({ children }) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const sidebar = props.auth?.sidebar ?? [];
    const validRoutes = props.validRoutes ?? [];

    if (!user) return <SidebarSkeleton />;

    const navItems = mapPerfilToNavMain({ modulos: sidebar });

    const pathSegments = url.split('/').filter(Boolean);
    const breadcrumbs = pathSegments.map((segment, index) => {
        const href = '/' + pathSegments.slice(0, index + 1).join('/');
        const label =
            segment.charAt(0).toUpperCase() +
            segment.slice(1).replace(/-/g, ' ');
        return { href, label };
    });

    const routeExists = (href) => validRoutes.includes(href);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    useEffect(() => {
        const saved = localStorage.getItem('sidebarOpen');
        if (saved !== null) {
            setSidebarOpen(saved === 'true');
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('sidebarOpen', sidebarOpen);
    }, [sidebarOpen]);

    return (
        <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <AppSidebar user={user} logout={props.logout} navItems={navItems} />

            <SidebarInset>
                <header className="mt-1 flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    {/* Breadcrumbs + trigger */}
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink asChild>
                                        <Link href="/">Inicio</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>

                                {breadcrumbs.map((crumb, index) => (
                                    <React.Fragment key={crumb.href}>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            {index === breadcrumbs.length - 1 ||
                                            !routeExists(crumb.href) ? (
                                                <BreadcrumbPage>
                                                    {crumb.label}
                                                </BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link href={crumb.href}>
                                                        {crumb.label}
                                                    </Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex items-center gap-0.5">
                        <NotificacionesPopover />
                        <ToggleFullscreenButton />
                        <ModeToggle />
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                    <Toaster richColors position="top-right" />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
