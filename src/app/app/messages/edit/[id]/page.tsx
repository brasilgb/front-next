import AppLayout from '@/components/app/app-layout';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BreadcrumbItem } from '@/types/app-types';
import { ArrowLeftCircle, MessageSquareMoreIcon } from 'lucide-react';
import Link from 'next/link';
import { listUsers } from '@/lib/actions/users';
import { getMessageById } from '@/lib/actions/messages';
import MessageForm from '../../message-form';
import { auth } from '@/auth';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/app',
  },
  {
    title: 'Mensagens',
    href: '/app/messages',
  },
  {
    title: 'Editar Mensagem',
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
  const session = await auth();

  const message = await getMessageById(Number(id));
  const users = await listUsers();
  
  return (
    <AppLayout
      bredcrumbData={breadcrumbs} // Pequeno typo: 'breadcrumbData' seria mais correto
      title="Editar Mensagem"
      icon={<Icon iconNode={MessageSquareMoreIcon} className="w-8 h-8" />}
    >
      <div className="mb-4">
        <Link href={`/app/messages?page=${search.page}&pageSize=${search.pageSize}`}>
          <Button variant="outline">
            <ArrowLeftCircle className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>

      <Card>
        <MessageForm initialData={message} users={users} sender={session?.user?.id} />
      </Card>
    </AppLayout>
  );
}
