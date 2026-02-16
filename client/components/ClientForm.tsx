'use client';

import { useState } from 'react';
import { CreateClientDto } from '@/types/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ClientFormProps {
  initialData?: CreateClientDto;
  onSubmit: (data: CreateClientDto) => Promise<void>;
  submitLabel?: string;
}

export default function ClientForm({
  initialData,
  onSubmit,
  submitLabel = 'Создать',
}: ClientFormProps) {
  const [formData, setFormData] = useState<CreateClientDto>(
    initialData || {
      fullName: '',
      email: '',
      description: '',
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName || formData.fullName.length < 3) {
      newErrors.fullName = 'Имя должно содержать минимум 3 символа';
    }

    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.description) {
      newErrors.description = 'Описание обязательно';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Произошла ошибка при сохранении');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-black">Информация о клиенте</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-black">
              Полное имя <span className="text-[#FF3333]">*</span>
            </Label>
            <Input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="Иван Иванов"
              className={errors.fullName ? 'border-[#FF3333]' : 'border-black/20'}
            />
            {errors.fullName && (
              <p className="text-sm text-[#FF3333]">{errors.fullName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-black">
              Email <span className="text-[#FF3333]">*</span>
            </Label>
            <Input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="example@email.com"
              className={errors.email ? 'border-[#FF3333]' : 'border-black/20'}
            />
            {errors.email && (
              <p className="text-sm text-[#FF3333]">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-black">
              Описание <span className="text-[#FF3333]">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              placeholder="Описание клиента..."
              className={errors.description ? 'border-[#FF3333]' : 'border-black/20'}
            />
            {errors.description && (
              <p className="text-sm text-[#FF3333]">{errors.description}</p>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-[#FC0] hover:bg-[#FFDB4D] text-black shadow-none border-none font-medium">
            {isLoading ? 'Сохранение...' : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
