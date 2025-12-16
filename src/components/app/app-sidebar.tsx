"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CalendarIcon, FileTextIcon, LayoutDashboardIcon, List, MemoryStickIcon, MessageSquareMoreIcon, PackagePlusIcon, Settings2, ShoppingCartIcon, User, UserCog, Users2Icon, WrenchIcon } from "lucide-react"
import { NavMain } from "./nav-main"
import { NavSettings } from "./nav-settings"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/app",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Clientes",
      url: "/app/customers",
      icon: Users2Icon,
    },
    {
      title: "Ordens de Serviço",
      url: "/app/orders",
      icon: WrenchIcon,
    },
    {
      title: "Orçamentos",
      url: "/app/budgets",
      icon: PackagePlusIcon,
    },
    {
      title: "Agendamentos",
      url: "/app/schedules",
      icon: CalendarIcon,
    },
    {
      title: "Mensagens",
      url: "/app/messages",
      icon: MessageSquareMoreIcon,
    },
    {
      title: "Peças e Produtos",
      url: "/app/products",
      icon: MemoryStickIcon,
    },
    {
      title: "Vendas",
      url: "/app/sales",
      icon: ShoppingCartIcon,
    },
    {
      title: "Relatórios",
      url: "/app/reports",
      icon: FileTextIcon,
    },
  ],
  settings: [
    {
      title: "Configurações",
      url: "/app/settings",
      icon: Settings2,
      items: [
        {
          title: "Dados da Empresa",
          url: "/app/company",
        },
        {
          title: "Mensagens do Whatsapp",
          url: "/app/watsapp",
        },
        {
          title: "impressões de recibos",
          url: "/app/receipts",
        },
        {
          title: "Impressões de Etiquetas",
          url: "/app/label-printing",
        },
        {
          title: "Tipo de equipamento",
          url: "/app/equipments",
        },
        {
          title: "Checklist",
          url: "/app/checklists",
        },
        {
          title: "Outras Configurações",
          url: "/app/settings",
        },
      ],
    },
  ],
  users: [
     {
      title: "Usuários",
      url: "/app/users",
      icon: UserCog,
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/app/">

                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSettings items={data.settings} />
        <NavMain items={data.users} />
      </SidebarContent>
      <SidebarFooter>
        <p>Footer</p>
      </SidebarFooter>
    </Sidebar>
  )
}