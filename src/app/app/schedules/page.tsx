import { scheduleColumns } from './columns'
import AppLayout from '@/components/app/app-layout'
import { Icon } from '@/components/icon'
import { CalendarIcon } from 'lucide-react'
import { BreadcrumbItem } from '@/types/app-types'
import { getSchedules } from '@/lib/actions/schedules'
import SchedulesTable from './schedule-table'

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
    title: 'Agendamentos',
    href: "#",
  },
];

export default async function Schedules({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params?.page ?? 1)
  const pageSize = Number(params?.pageSize ?? 11)
  const search = params?.search ?? ""
  const sortBy = String(params?.sortBy ?? "created_at")
  const sortDir = String(params?.sortDir ?? "desc")

  const schedules = await getSchedules({ page, pageSize, search, sortBy, sortDir }) as any;

  return (
    <AppLayout
      bredcrumbData={breadcrumbs}
      title="Agendamentos"
      icon={<Icon iconNode={CalendarIcon} className='w-8 h-8' />}
    >
      <SchedulesTable
        columns={scheduleColumns}
        data={schedules.data ?? []}
        total={schedules.total ?? 0}
        page={page}
        pageSize={pageSize}
        search={search}
      />
    </AppLayout>
  )
}