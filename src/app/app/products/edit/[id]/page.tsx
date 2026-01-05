import AppLayout from '@/components/app/app-layout';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BreadcrumbItem } from '@/types/app-types';
import { ArrowLeftCircle, MemoryStickIcon, Users2Icon } from 'lucide-react';
import Link from 'next/link';
import { getProductById, listProducts } from '@/lib/actions/products';
import ProductForm from '../../product-form';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/app',
  },
  {
    title: 'Produtos',
    href: '/app/products',
  },
  {
    title: 'Editar Produto',
    href: '#', // Pode ser removido se não houver link específico
  },
];

interface EditProps {
  params: {
    id: string
  };
  searchParams: {
    page: number
    pageSize: number
  };
}

export default async function Edit({ params, searchParams }: EditProps) {

const products = await listProducts();

  const { id } = await params;
  const search = await searchParams;

  const product = await getProductById(Number(id));

  return (
    <AppLayout
      bredcrumbData={breadcrumbs} // Pequeno typo: 'breadcrumbData' seria mais correto
      title="Editar Produto"
      icon={<Icon iconNode={MemoryStickIcon} className="w-8 h-8" />}
    >
      <div className="mb-4">
        <Link href={`/app/products?page=${search.page}&pageSize=${search.pageSize}`}>
          <Button variant="outline">
            <ArrowLeftCircle className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>

      <Card>
        <ProductForm initialData={product} listproducts={products} />
      </Card>
    </AppLayout>
  );
}
