import { notFound } from 'next/navigation';
import { clientsApi } from '@/lib/api/clients';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, List, Mail, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let client;
  try {
    client = await clientsApi.getById(id);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" className="text-black hover:bg-black/5">
            <Link href="/clients">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к списку
            </Link>
          </Button>
        </div>

        <Card className="border-0 shadow-sm bg-white">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-4xl mb-2 text-black">
                  {client.fullName}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-base text-black/60">
                  <Mail className="h-4 w-4" />
                  {client.email}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-sm text-black/50">
                <Calendar className="h-4 w-4" />
                <span>
                  Создан{' '}
                  {formatDistanceToNow(new Date(client.createdAt), {
                    addSuffix: true,
                    locale: ru,
                  })}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div>
              <h2 className="text-xl font-semibold mb-3 text-black">Описание</h2>
              <p className="text-black/70 whitespace-pre-wrap">
                {client.description}
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3">
            <Button asChild className="flex-1 bg-[#FC0] hover:bg-[#FFDB4D] text-black shadow-none border-none">
              <Link href={`/clients/${client.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Редактировать
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 border-black/20 text-black hover:bg-black/5">
              <Link href="/clients">
                <List className="mr-2 h-4 w-4" />
                К списку клиентов
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
