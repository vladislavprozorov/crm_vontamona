'use client';

import { useRouter } from 'next/navigation';
import ClientForm from '@/components/ClientForm';
import { clientsApi } from '@/lib/api/clients';
import { CreateClientDto } from '@/types/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function NewClientPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateClientDto) => clientsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      router.push('/clients');
    },
  });

  const handleSubmit = async (data: CreateClientDto) => {
    await createMutation.mutateAsync(data);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4 text-black hover:bg-black/5">
            <Link href="/clients">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к списку
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-black">Новый клиент</h1>
          <p className="mt-2 text-black/60">
            Заполните форму для добавления нового клиента
          </p>
        </div>

        <ClientForm onSubmit={handleSubmit} submitLabel="Создать клиента" />
      </div>
    </div>
  );
}
