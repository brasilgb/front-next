import AppLayout from '@/components/app/app-layout';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BreadcrumbItem } from '@/types/app-types';
import { ArrowLeftCircle, MemoryStickIcon, Users2Icon } from 'lucide-react';
import Link from 'next/link';
import ProductForm from '../product-form';
import { listProducts } from '@/lib/actions/products';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: "/app",
  },
  {
    title: 'Produtos',
    href: "/app/products",
  },
  {
    title: 'Novo Produto',
    href: "#",
  },
];

export default async function Create() {

const products = await listProducts();

  return (
    <AppLayout
      bredcrumbData={breadcrumbs}
      title="Novo Produto"
      icon={<Icon iconNode={MemoryStickIcon} className='w-8 h-8' />}
    >
      <div className='mb-4'>
        <Link href="/app/products">
          <Button variant={'outline'}>
            <ArrowLeftCircle className='w-4 h-4 mr-2' /> Voltar
          </Button>
        </Link>
      </div>
      <Card>
        <ProductForm listproducts={products} />
      </Card>
    </AppLayout>
  )
}