import Link from "next/link";
import Image from "next/image";
import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

function SidebarLogo() {
    return (
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href="/app" className="flex items-center justify-left gap-2">
                            {/* LOGO */}
                            <Image
                                src="/default.png"
                                alt="Minha Empresa"
                                width={28}
                                height={28}
                                className="shrink-0"
                            />

                            {/* NOME DO SITE */}
                            <span className="font-semibold text-base leading-none truncate">
                                Minha Empresa
                            </span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
    )
}

export default SidebarLogo