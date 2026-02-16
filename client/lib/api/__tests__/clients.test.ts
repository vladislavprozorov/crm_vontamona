import { describe, it, expect, beforeEach, vi } from 'vitest'
import { clientsApi } from '@/lib/api/clients'
import type { Client, CreateClientDto } from '@/types/client'

global.fetch = vi.fn()

describe('clientsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockClient: Client = {
    id: '1',
    fullName: 'Test User',
    email: 'test@example.com',
    description: 'Test description',
    createdAt: '2024-01-01T00:00:00.000Z',
  }

  describe('getAll', () => {
    it('должен получить всех клиентов', async () => {
      const mockClients = [mockClient]
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockClients,
      } as Response)

      const result = await clientsApi.getAll()

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/clients', {
        cache: 'no-store',
      })
      expect(result).toEqual(mockClients)
    })

    it('должен выбросить ошибку при неудачном запросе', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      await expect(clientsApi.getAll()).rejects.toThrow('Failed to fetch clients')
    })
  })

  describe('getById', () => {
    it('должен получить клиента по ID', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockClient,
      } as Response)

      const result = await clientsApi.getById('1')

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/clients/1', {
        cache: 'no-store',
      })
      expect(result).toEqual(mockClient)
    })
  })

  describe('create', () => {
    it('должен создать нового клиента', async () => {
      const newClient: CreateClientDto = {
        fullName: 'New User',
        email: 'new@example.com',
        description: 'New description',
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockClient, ...newClient }),
      } as Response)

      const result = await clientsApi.create(newClient)

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      })
      expect(result.fullName).toBe(newClient.fullName)
    })
  })

  describe('update', () => {
    it('должен обновить клиента', async () => {
      const updateData: CreateClientDto = {
        fullName: 'Updated User',
        email: 'updated@example.com',
        description: 'Updated description',
      }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockClient, ...updateData }),
      } as Response)

      const result = await clientsApi.update('1', updateData)

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/clients/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })
      expect(result.fullName).toBe(updateData.fullName)
    })
  })

  describe('delete', () => {
    it('должен удалить клиента', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '1' }),
      } as Response)

      await clientsApi.delete('1')

      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/clients/1', {
        method: 'DELETE',
      })
    })
  })
})
