import AppLayout from '@/components/app/app-layout';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BreadcrumbItem } from '@/types/app-types';
import { ArrowLeftCircle, CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import ScheduleForm from '../schedule-form';
import { listCustomers } from '@/lib/actions/customers';
import { listUsers } from '@/lib/actions/users';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: "/app",
  },
  {
    title: 'Agendamentos',
    href: "/app/schedules",
  },
  {
    title: 'Novo Agendamento',
    href: "#",
  },
];

export default async function Create() {

  const customers = await listCustomers();
  const users = await listUsers();

  return (
    <AppLayout
      bredcrumbData={breadcrumbs}
      title="Novo Agendamento"
      icon={<Icon iconNode={CalendarIcon} className='w-8 h-8' />}
    >
      <div className='mb-4'>
        <Link href="/app/schedules">
          <Button variant={'outline'}>
            <ArrowLeftCircle className='w-4 h-4 mr-2' /> Voltar
          </Button>
        </Link>
      </div>
      <Card>
        <ScheduleForm customers={customers} users={users} />
      </Card>
    </AppLayout>
  )
}