import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientEntity } from './entity/clients.entity';
import { UsersDto } from './dto/Users.dto';

describe('ClientsService', () => {
  let service: ClientsService;

  const mockClientEntity: ClientEntity = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    fullName: 'John Doe',
    email: 'john@example.com',
    description: 'Test description',
    createdAt: new Date('2024-01-01'),
    requests: [],
  };

  const mockClientsArray: ClientEntity[] = [
    mockClientEntity,
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      description: 'Another test description',
      createdAt: new Date('2024-01-02'),
      requests: [],
    },
  ];

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(ClientEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      mockRepository.find.mockResolvedValue(mockClientsArray);

      const result = await service.findAll();

      expect(result).toEqual(mockClientsArray);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: {
          createdAt: 'desc',
        },
      });
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no clients exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a client by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockClientEntity);

      const result = await service.findById(mockClientEntity.id);

      expect(result).toEqual(mockClientEntity);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockClientEntity.id },
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when client not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findById('non-existent-id')).rejects.toThrow(
        'User not found',
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'non-existent-id' },
      });
    });
  });

  describe('create', () => {
    it('should create and return a new client', async () => {
      const createDto: UsersDto = {
        fullName: 'John Doe',
        email: 'john@example.com',
        description: 'Test description',
      };

      mockRepository.create.mockReturnValue(mockClientEntity);
      mockRepository.save.mockResolvedValue(mockClientEntity);

      const result = await service.create(createDto);

      expect(result).toEqual(mockClientEntity);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockClientEntity);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update and return the client', async () => {
      const updateDto: UsersDto = {
        fullName: 'John Updated',
        email: 'john.updated@example.com',
        description: 'Updated description',
      };

      const updatedClient: ClientEntity = {
        ...mockClientEntity,
        ...updateDto,
      };

      mockRepository.findOne.mockResolvedValue(mockClientEntity);
      mockRepository.save.mockResolvedValue(updatedClient);

      const result = await service.update(mockClientEntity.id, updateDto);

      expect(result).toEqual(updatedClient);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockClientEntity.id },
      });
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when trying to update non-existent client', async () => {
      const updateDto: UsersDto = {
        fullName: 'John Updated',
        email: 'john.updated@example.com',
        description: 'Updated description',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', updateDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a client and return its id', async () => {
      mockRepository.findOne.mockResolvedValue(mockClientEntity);
      mockRepository.remove.mockResolvedValue(mockClientEntity);

      const result = await service.delete(mockClientEntity.id);

      expect(result).toEqual(mockClientEntity.id);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockClientEntity.id },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockClientEntity);
      expect(mockRepository.remove).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when trying to delete non-existent client', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });
});
