'use client';

import { Client } from '@/types/client';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsApi } from '@/lib/api/clients';
import { useState } from 'react';

interface ClientCardProps {
  client: Client;
}

export default function ClientCard({ client }: ClientCardProps) {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clientsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const handleDelete = async () => {
    if (
      window.confirm(`Вы уверены, что хотите удалить клиента ${client.fullName}?`)
    ) {
      setIsDeleting(true);
      try {
        await deleteMutation.mutateAsync(client.id);
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Ошибка при удалении клиента');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate text-black">{client.fullName}</span>
          <span className="text-xs text-black/50 font-normal">
            {formatDistanceToNow(new Date(client.createdAt), {
              addSuffix: true,
              locale: ru,
            })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm text-black/50">Email</p>
          <p className="text-sm font-medium text-black">{client.email}</p>
        </div>
        {client.description && (
          <div>
            <p className="text-sm text-black/50">Описание</p>
            <p className="text-sm line-clamp-3 text-black/70">{client.description}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1 border-black/20 text-black hover:bg-black/5">
          <Link href={`/clients/${client.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Просмотр
          </Link>
        </Button>
        <Button asChild size="sm" className="flex-1 bg-[#FC0] hover:bg-[#FFDB4D] text-black shadow-none border-none">
          <Link href={`/clients/${client.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Изменить
          </Link>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting || deleteMutation.isPending}
          className="flex-1 bg-[#FF3333] hover:bg-[#E62E2E] border-none shadow-none"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isDeleting || deleteMutation.isPending ? 'Удаление...' : 'Удалить'}
        </Button>
      </CardFooter>
    </Card>
  );
}
