import AppLayout from '@/components/app/app-layout';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BreadcrumbItem } from '@/types/app-types';
import { ArrowLeftCircle, Users2Icon } from 'lucide-react';
import Link from 'next/link';
import { getBudgetById } from '@/lib/actions/budgets';
import BudgetForm from '../../budget-form';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/app',
  },
  {
    title: 'Orçamentos',
    href: '/app/budgets',
  },
  {
    title: 'Editar Orçamento',
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

  const budget = await getBudgetById(Number(id));

  return (
    <AppLayout
      bredcrumbData={breadcrumbs} // Pequeno typo: 'breadcrumbData' seria mais correto
      title="Editar Orçamento"
      icon={<Icon iconNode={Users2Icon} className="w-8 h-8" />}
    >
      <div className="mb-4">
        <Link href={`/app/budgets?page=${search.page}&pageSize=${search.pageSize}`}>
          <Button variant="outline">
            <ArrowLeftCircle className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>

      <Card>
        <BudgetForm initialData={budget} />
      </Card>
    </AppLayout>
  );
}
