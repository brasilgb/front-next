import { orderColumns } from './columns'
import AppLayout from '@/components/app/app-layout'
import { Icon } from '@/components/icon'
import { Users2Icon, WrenchIcon } from 'lucide-react'
import { BreadcrumbItem } from '@/types/app-types'
import { getOrders } from '@/lib/actions/orders'
import OrdersTable from './order-table'

interface PageProps {
  searchParams?: {
    page?: string
    pageSize?: string
    search?: string
    sortBy: string
    sortDir: string
  }
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: "/app",
  },
  {
    title: 'Ordens',
    href: "#",
  },
];

export default async function Orders({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params?.page ?? 1)
  const pageSize = Number(params?.pageSize ?? 11)
  const search = params?.search ?? ""
  const sortBy = String(params?.sortBy ?? "created_at")
  const sortDir = String(params?.sortDir ?? "desc")

  const orders = await getOrders({ page, pageSize, search, sortBy, sortDir }) as any;

  return (
    <AppLayout
      bredcrumbData={breadcrumbs}
      title="Ordens"
      icon={<Icon iconNode={WrenchIcon} className='w-8 h-8' />}
    >
      <OrdersTable
        columns={orderColumns}
        data={orders.data ?? []}
        total={orders.total ?? 0}
        page={page}
        pageSize={pageSize}
        search={search}
      />
    </AppLayout>
  )
}