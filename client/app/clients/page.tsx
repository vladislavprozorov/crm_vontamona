'use client';

import Link from 'next/link';
import { clientsApi } from '@/lib/api/clients';
import ClientCard from '@/components/ClientCard';
import { Button } from '@/components/ui/button';
import { Home, Plus, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function ClientsPage() {
  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.getAll(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-black" />
          <p className="text-black/60">Загрузка клиентов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black">Клиенты</h1>
            <p className="mt-2 text-black/60">
              Управление клиентами вашей компании
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="border-black/20 text-black hover:bg-black/5">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                На главную
              </Link>
            </Button>
            <Button asChild className="bg-[#FC0] hover:bg-[#FFDB4D] text-black shadow-none border-none">
              <Link href="/clients/new">
                <Plus className="mr-2 h-4 w-4" />
                Добавить клиента
              </Link>
            </Button>
          </div>
        </div>

        {!clients || clients.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border-0">
            <p className="text-black/60 text-lg mb-4">Клиентов пока нет</p>
            <Button asChild className="bg-[#FC0] hover:bg-[#FFDB4D] text-black shadow-none border-none">
              <Link href="/clients/new">
                <Plus className="mr-2 h-4 w-4" />
                Создать первого клиента
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
