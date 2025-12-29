import { customerColumns } from './columns'
import CustomersTable from './user-table'
import AppLayout from '@/components/app/app-layout'
import { Icon } from '@/components/icon'
import { User2Icon, Users2Icon } from 'lucide-react'
import { BreadcrumbItem } from '@/types/app-types'
import { getUsers } from '@/lib/actions/users'
import UsersTable from './user-table'

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
    title: 'Usuários',
    href: "#",
  },
];

export default async function Users({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params?.page ?? 1)
  const pageSize = Number(params?.pageSize ?? 11)
  const search = params?.search ?? ""
  const sortBy = String(params?.sortBy ?? "created_at")
  const sortDir = String(params?.sortDir ?? "desc")

  const users = await getUsers({ page, pageSize, search, sortBy, sortDir }) as any;

  return (
    <AppLayout
      bredcrumbData={breadcrumbs}
      title="Usuários"
      icon={<Icon iconNode={User2Icon} className='w-8 h-8' />}
    >
      <UsersTable
        columns={customerColumns}
        data={users.data ?? []}
        total={users.total ?? 0}
        page={page}
        pageSize={pageSize}
        search={search}
      />
    </AppLayout>
  )
}