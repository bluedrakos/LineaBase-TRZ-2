import { ModeToggle } from '@/app/layouts/sidebar/components/mode-toggle';
import { NotificacionesPopover } from '@/app/layouts/sidebar/components/NotificacionesPopover';
import { mapPerfilToNavMain } from '@/app/layouts/sidebar/components/SidebarMap';
import { ToggleFullscreenButton } from '@/app/layouts/sidebar/components/ToggleFullscreenButton';
import { AppSidebar } from '@/app/layouts/sidebar/SidebarApp';
import { SidebarSkeleton } from '@/app/layouts/sidebar/SidebarSkeleton';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb';
import { Separator } from '@/shared/ui/separator';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/shared/ui/sidebar';
import { Toaster } from '@/shared/ui/sonner';
import { Link, usePage } from '@/shared/app-bridge';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function LayoutDashboard({ children }) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const sidebar = props.auth?.sidebar ?? [];
    const validRoutes = props.validRoutes ?? [];
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

    return (
        <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
            {!user ? (
                <Navigate to="/login" replace />
            ) : (
                <>
                    <AppSidebar user={user} logout={props.logout} navItems={navItems} />

                    <SidebarInset className="flex flex-col h-screen overflow-hidden">
                        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
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

                        <main className="flex-1 overflow-y-auto p-4">
                            <div className="flex flex-col gap-4">
                                {children}
                                <Toaster richColors position="top-right" />
                            </div>
                        </main>
                    </SidebarInset>
                </>
            )}
        </SidebarProvider>
    );
}
