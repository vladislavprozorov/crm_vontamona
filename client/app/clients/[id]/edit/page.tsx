'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ClientForm from '@/components/ClientForm';
import { clientsApi } from '@/lib/api/clients';
import { Client, UpdateClientDto } from '@/types/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clientId, setClientId] = useState<string>('');

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const { id } = await params;
        setClientId(id);
        const data = await clientsApi.getById(id);
        setClient(data);
      } catch (error) {
        console.error('Error fetching client:', error);
        router.push('/clients');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [params, router]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateClientDto) => clientsApi.update(clientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      router.push(`/clients/${clientId}`);
    },
  });

  const handleSubmit = async (data: UpdateClientDto) => {
    await updateMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-black" />
          <p className="text-black/60">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4 text-black hover:bg-black/5">
            <Link href={`/clients/${clientId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к карточке клиента
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-black">Редактирование клиента</h1>
          <p className="mt-2 text-black/60">
            Обновите информацию о клиенте {client.fullName}
          </p>
        </div>

        <ClientForm
          initialData={{
            fullName: client.fullName,
            email: client.email,
            description: client.description,
          }}
          onSubmit={handleSubmit}
          submitLabel="Сохранить изменения"
        />
      </div>
    </div>
  );
}
