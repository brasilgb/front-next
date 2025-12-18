import { ReactNode } from "react"
import { Breadcrumbs } from "../breadcrumbs";

interface AppLayoutProps {
    children: ReactNode;
    bredcrumbData: any;
    title: string;
    icon: any;
}

function AppLayout({ children, bredcrumbData, title, icon }: AppLayoutProps) {
    return (
        <div className="w-full p-4">
            <div className="flex items-center justify-between mb-4 py-4">
                <div className='flex items-center gap-2'>
                    {icon}
                    <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                </div>
                <div><Breadcrumbs breadcrumbs={bredcrumbData} /></div>
            </div>
            {children}
        </div>
    )
}

export default AppLayout