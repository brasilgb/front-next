import { productColumns } from './columns'
import { getProducts } from '@/lib/actions/products'
import ProductsTable from './product-table'
import AppLayout from '@/components/app/app-layout'
import { Icon } from '@/components/icon'
import { MemoryStickIcon, PackagePlusIcon, Users2Icon } from 'lucide-react'
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
    title: 'Produtos',
    href: "#",
  },
];

export default async function Products({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params?.page ?? 1)
  const pageSize = Number(params?.pageSize ?? 11)
  const search = params?.search ?? ""
  const sortBy = String(params?.sortBy ?? "created_at")
  const sortDir = String(params?.sortDir ?? "desc")

  const products = await getProducts({ page, pageSize, search, sortBy, sortDir }) as any;

  return (
    <AppLayout
      bredcrumbData={breadcrumbs}
      title="Produtos"
      icon={<Icon iconNode={MemoryStickIcon} className='w-8 h-8' />}
    >
      <ProductsTable
        columns={productColumns}
        data={products.data ?? []}
        total={products.total ?? 0}
        page={page}
        pageSize={pageSize}
        search={search}
      />
    </AppLayout>
  )
}