import AppLayout from '@/components/app/app-layout';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BreadcrumbItem } from '@/types/app-types';
import { ArrowLeftCircle, Users2Icon } from 'lucide-react';
import Link from 'next/link';
import BudgetForm from '../budget-form';
import { listBudgets } from '@/lib/actions/budgets';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: "/app",
  },
  {
    title: 'Clientes',
    href: "/app/orcamentos",
  },
  {
    title: 'Novo Orçamento',
    href: "#",
  },
];

export default async function Create() {

const budgets = await listBudgets();

  return (
    <AppLayout
      bredcrumbData={breadcrumbs}
      title="Novo Orçamento"
      icon={<Icon iconNode={Users2Icon} className='w-8 h-8' />}
    >
      <div className='mb-4'>
        <Link href="/app/budgets">
          <Button variant={'outline'}>
            <ArrowLeftCircle className='w-4 h-4 mr-2' /> Voltar
          </Button>
        </Link>
      </div>
      <Card>
        <BudgetForm listbudgets={budgets} />
      </Card>
    </AppLayout>
  )
}