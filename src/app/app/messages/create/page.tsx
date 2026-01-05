import AppLayout from '@/components/app/app-layout';
import { Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BreadcrumbItem } from '@/types/app-types';
import { ArrowLeftCircle, MessageSquareMoreIcon } from 'lucide-react';
import Link from 'next/link';
import { listUsers } from '@/lib/actions/users';
import MessageForm from '../message-form';
import { getSession } from 'next-auth/react';
import { auth } from '@/auth';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: "/app",
  },
  {
    title: 'Mensagens',
    href: "/app/messages",
  },
  {
    title: 'Nova Mensagem',
    href: "#",
  },
];

export default async function Create() {
  const session = await auth();
  
  const users = await listUsers();

  return (
    <AppLayout
      bredcrumbData={breadcrumbs}
      title="Nova Mensagem"
      icon={<Icon iconNode={MessageSquareMoreIcon} className='w-8 h-8' />}
    >
      <div className='mb-4'>
        <Link href="/app/messages">
          <Button variant={'outline'}>
            <ArrowLeftCircle className='w-4 h-4 mr-2' /> Voltar
          </Button>
        </Link>
      </div>
      <Card>
        <MessageForm users={users} sender={session?.user?.id} />
      </Card>
    </AppLayout>
  )
}