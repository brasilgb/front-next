import { customerColumns } from './columns'
import { getCustomers } from '@/lib/actions/customers'
import CustomersTable from './customer-table'
import AppLayout from '@/components/app/app-layout'
import { Icon } from '@/components/icon'
import { Users2Icon } from 'lucide-react'
import { BreadcrumbItem } from '@/types/app-types'

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
    title: 'Clientes',
    href: "#",
  },
];

export default async function Customers({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params?.page ?? 1)
  const pageSize = Number(params?.pageSize ?? 11)
  const search = params?.search ?? ""
  const sortBy = String(params?.sortBy ?? "created_at")
  const sortDir = String(params?.sortDir ?? "desc")

  const customers = await getCustomers({ page, pageSize, search, sortBy, sortDir }) as any;

  return (
    <AppLayout
      bredcrumbData={breadcrumbs}
      title="Clientes"
      icon={<Icon iconNode={Users2Icon} className='w-8 h-8' />}
    >
      <CustomersTable
        columns={customerColumns}
        data={customers.data ?? []}
        total={customers.total ?? 0}
        page={page}
        pageSize={pageSize}
        search={search}
      />
    </AppLayout>
  )
}