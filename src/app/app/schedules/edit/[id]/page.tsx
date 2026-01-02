import AppLayout from '@/components/app/app-layout';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BreadcrumbItem } from '@/types/app-types';
import { ArrowLeftCircle, CalendarIcon, Users2Icon } from 'lucide-react';
import Link from 'next/link';
import ScheduleForm from '../../schedule-form';
import { listCustomers } from '@/lib/actions/customers';
import { listUsers } from '@/lib/actions/users';
import { getScheduleById } from '@/lib/actions/schedules';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/app',
  },
  {
    title: 'Agendamentos',
    href: '/app/schedules',
  },
  {
    title: 'Editar Agendamento',
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

  const schedule = await getScheduleById(Number(id));
  const customers = await listCustomers();
  const users = await listUsers();
  
  return (
    <AppLayout
      bredcrumbData={breadcrumbs} // Pequeno typo: 'breadcrumbData' seria mais correto
      title="Editar Agendamento"
      icon={<Icon iconNode={CalendarIcon} className="w-8 h-8" />}
    >
      <div className="mb-4">
        <Link href={`/app/schedules?page=${search.page}&pageSize=${search.pageSize}`}>
          <Button variant="outline">
            <ArrowLeftCircle className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>

      <Card>
        <ScheduleForm initialData={schedule} customers={customers} users={users} />
      </Card>
    </AppLayout>
  );
}
