import { Client, CreateClientDto, UpdateClientDto } from '@/types/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const clientsApi = {
  // Получить всех клиентов
  async getAll(): Promise<Client[]> {
    const response = await fetch(`${API_URL}/clients`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch clients');
    }
    return response.json();
  },

  // Получить клиента по ID
  async getById(id: string): Promise<Client> {
    const response = await fetch(`${API_URL}/clients/${id}`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch client');
    }
    return response.json();
  },

  // Создать нового клиента
  async create(data: CreateClientDto): Promise<Client> {
    const response = await fetch(`${API_URL}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create client');
    }
    return response.json();
  },

  // Обновить клиента
  async update(id: string, data: UpdateClientDto): Promise<Client> {
    const response = await fetch(`${API_URL}/clients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update client');
    }
    return response.json();
  },

  // Удалить клиента
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/clients/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete client');
    }
  },
};
