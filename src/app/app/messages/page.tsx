import { messageColumns } from './columns'
import AppLayout from '@/components/app/app-layout'
import { Icon } from '@/components/icon'
import { MessageSquareMoreIcon } from 'lucide-react'
import { BreadcrumbItem } from '@/types/app-types'
import MessagesTable from './message-table'
import { getMessages } from '@/lib/actions/messages'

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
    title: 'Mensagens',
    href: "#",
  },
];

export default async function Messages({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params?.page ?? 1)
  const pageSize = Number(params?.pageSize ?? 11)
  const search = params?.search ?? ""
  const sortBy = String(params?.sortBy ?? "created_at")
  const sortDir = String(params?.sortDir ?? "desc")

  const messages = await getMessages({ page, pageSize, search, sortBy, sortDir }) as any;

  return (
    <AppLayout
      bredcrumbData={breadcrumbs}
      title="Mensagens"
      icon={<Icon iconNode={MessageSquareMoreIcon} className='w-8 h-8' />}
    >
      <MessagesTable
        columns={messageColumns}
        data={messages.data ?? []}
        total={messages.total ?? 0}
        page={page}
        pageSize={pageSize}
        search={search}
      />
    </AppLayout>
  )
}