
import { AppSidebar } from '@/components/app/app-sidebar';
import AppHeader from '@/components/app/app-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import React, { ReactNode } from 'react'

interface AppLayoutProps {
    children: ReactNode;
}
export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar />
            <SidebarInset>
                <AppHeader />
                <div className="flex flex-1 flex-col">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
