
import { DataTable } from '@/components/data-table'
import { customerColumns } from './columns'
import { getCustomers } from '@/lib/actions/customers'
import CustomersTable from './customer-table'


interface PageProps {
  searchParams?: {
    page?: string
    pageSize?: string
    search?: string
    sortBy: string
    sortDir: string
  }
}

export default async function Customers({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params?.page ?? 1)
  const pageSize = Number(params?.pageSize ?? 12)
  const search = params?.search ?? ""
  const sortBy = String(params?.sortBy ?? "created_at")
  const sortDir = String(params?.sortDir ?? "desc")

  const customers = await getCustomers({ page, pageSize, search, sortBy, sortDir })
console.log(customers);

  return (
    <div className="p-6">
      <CustomersTable
        columns={customerColumns}
        data={customers.data ?? []}
        total={customers.total ?? 0}
        page={page}
        pageSize={pageSize}
        search={search}
      />
    </div>
  )
}