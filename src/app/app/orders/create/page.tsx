import AppLayout from '@/components/app/app-layout';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BreadcrumbItem } from '@/types/app-types';
import { ArrowLeftCircle, WrenchIcon } from 'lucide-react';
import Link from 'next/link';
import CreateForm from '../create-form';
import { listCustomers } from '@/lib/actions/customers';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: "/app",
  },
  {
    title: 'Ordens',
    href: "/app/orders",
  },
  {
    title: 'Nova Ordem',
    href: "#",
  },
];

export default async function Create() {

const customers = await listCustomers() as any;

  return (
    <AppLayout
      bredcrumbData={breadcrumbs}
      title="Novo Ordem"
      icon={<Icon iconNode={WrenchIcon} className='w-8 h-8' />}
    >
      <div className='mb-4'>
        <Link href="/app/orders">
          <Button variant={'outline'}>
            <ArrowLeftCircle className='w-4 h-4 mr-2' /> Voltar
          </Button>
        </Link>
      </div>
      <Card>
    <CreateForm customers={customers} />
      </Card>
    </AppLayout>
  )
}