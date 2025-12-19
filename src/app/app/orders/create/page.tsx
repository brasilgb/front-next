"use client"

import AppLayout from '@/components/app/app-layout';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BreadcrumbItem, Customer } from '@/types/app-types';
import { ArrowLeftCircle, Users2Icon } from 'lucide-react';
import Link from 'next/link';
import CustomerForm from '../customer-form';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: "/app",
  },
  {
    title: 'Clientes',
    href: "/app/customers",
  },
  {
    title: 'Novo Cliente',
    href: "#",
  },
];

export default function Create() {

  return (
    <AppLayout
      bredcrumbData={breadcrumbs}
      title="Novo Cliente"
      icon={<Icon iconNode={Users2Icon} className='w-8 h-8' />}
    >
      <div className='mb-4'>
        <Link href="/app/customers">
          <Button variant={'outline'}>
            <ArrowLeftCircle className='w-4 h-4 mr-2' /> Voltar
          </Button>
        </Link>
      </div>
      <Card>

    <CustomerForm />

      </Card>
    </AppLayout>
  )
}