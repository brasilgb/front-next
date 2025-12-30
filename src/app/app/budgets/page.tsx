import { budgetColumns } from './columns'
import { getBudgets } from '@/lib/actions/budgets'
import BudgetsTable from './budget-table'
import AppLayout from '@/components/app/app-layout'
import { Icon } from '@/components/icon'
import { PackagePlusIcon, Users2Icon } from 'lucide-react'
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
    title: 'Orçamentos',
    href: "#",
  },
];

export default async function Budgets({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params?.page ?? 1)
  const pageSize = Number(params?.pageSize ?? 11)
  const search = params?.search ?? ""
  const sortBy = String(params?.sortBy ?? "created_at")
  const sortDir = String(params?.sortDir ?? "desc")

  const budgets = await getBudgets({ page, pageSize, search, sortBy, sortDir }) as any;

  return (
    <AppLayout
      bredcrumbData={breadcrumbs}
      title="Orçamentos"
      icon={<Icon iconNode={PackagePlusIcon} className='w-8 h-8' />}
    >
      <BudgetsTable
        columns={budgetColumns}
        data={budgets.data ?? []}
        total={budgets.total ?? 0}
        page={page}
        pageSize={pageSize}
        search={search}
      />
    </AppLayout>
  )
}