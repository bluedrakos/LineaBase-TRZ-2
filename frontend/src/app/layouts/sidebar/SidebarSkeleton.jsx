import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/shared/ui/sidebar';
import { Skeleton } from '@/shared/ui/skeleton';

export function SidebarSkeleton() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" disabled>
                            <Skeleton className="size-8 rounded-lg" />
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="mt-1 h-3 w-20" />
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <div className="flex flex-col gap-2 p-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-3 w-40" />
                            <Skeleton className="h-3 w-36" />
                        </div>
                    ))}
                </div>
            </SidebarContent>

            <SidebarFooter>
                <div className="p-4">
                    <Skeleton className="mb-1 h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                </div>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
