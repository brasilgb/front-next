import AppLayout from '@/components/app/app-layout';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BreadcrumbItem } from '@/types/app-types';
import { ArrowLeftCircle, WrenchIcon } from 'lucide-react';
import Link from 'next/link';
import { listCustomers } from '@/lib/actions/customers';
import EditForm from '../../edit-form';
import { getOrderById } from '@/lib/actions/orders';
import { listUsers } from '@/lib/actions/users';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/app',
  },
  {
    title: 'Ordens',
    href: '/app/orders',
  },
  {
    title: 'Editar Ordem',
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

  const { id } = await params;
  const search = await searchParams;

  const customers = await listCustomers() as any;
  const order = await getOrderById(Number(id));
  const users = await listUsers() as any;

  return (
    <AppLayout
      bredcrumbData={breadcrumbs} // Pequeno typo: 'breadcrumbData' seria mais correto
      title="Editar Ordem"
      icon={<Icon iconNode={WrenchIcon} className="w-8 h-8" />}
    >
      <div className="mb-4">
        <Link href={`/app/orders?page=${search.page}&pageSize=${search.pageSize}`}>
          <Button variant="outline">
            <ArrowLeftCircle className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>

      <Card>
        <EditForm customers={customers as any} initialData={order as any} users={users as any} />
      </Card>
    </AppLayout>
  );
}
