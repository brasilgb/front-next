import AdminHeader from '@/components/admin/admin-header';
import { AppSidebar } from '@/components/app/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React, { ReactNode } from 'react'

interface AdminLayoutProps {
    children: ReactNode;
}
export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <AdminHeader />
                <div className="flex flex-1 flex-col">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
