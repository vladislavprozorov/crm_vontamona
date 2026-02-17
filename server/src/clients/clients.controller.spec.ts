import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { UsersDto } from './dto/Users.dto';
import { ClientEntity } from './entity/clients.entity';
import { NotFoundException } from '@nestjs/common';

describe('ClientsController', () => {
  let controller: ClientsController;

  const mockClientEntity: ClientEntity = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    fullName: 'John Doe',
    email: 'john@example.com',
    description: 'Test description',
    createdAt: new Date('2024-01-01'),
  };

  const mockClientsArray: ClientEntity[] = [
    mockClientEntity,
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      description: 'Another test description',
      createdAt: new Date('2024-01-02'),
    },
  ];

  const mockClientsService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: mockClientsService,
        },
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      mockClientsService.findAll.mockResolvedValue(mockClientsArray);

      const result = await controller.findAll();

      expect(result).toEqual(mockClientsArray);
      expect(mockClientsService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no clients exist', async () => {
      mockClientsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(mockClientsService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a client by id', async () => {
      mockClientsService.findById.mockResolvedValue(mockClientEntity);

      const result = await controller.findById(mockClientEntity.id);

      expect(result).toEqual(mockClientEntity);
      expect(mockClientsService.findById).toHaveBeenCalledWith(
        mockClientEntity.id,
      );
      expect(mockClientsService.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when client not found', async () => {
      mockClientsService.findById.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.findById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockClientsService.findById).toHaveBeenCalledWith(
        'non-existent-id',
      );
    });
  });

  describe('create', () => {
    it('should create and return a new client', async () => {
      const createDto: UsersDto = {
        fullName: 'John Doe',
        email: 'john@example.com',
        description: 'Test description',
      };

      mockClientsService.create.mockResolvedValue(mockClientEntity);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockClientEntity);
      expect(mockClientsService.create).toHaveBeenCalledWith(createDto);
      expect(mockClientsService.create).toHaveBeenCalledTimes(1);
    });

    it('should handle validation errors', async () => {
      const invalidDto: UsersDto = {
        fullName: '',
        email: '',
        description: '',
      };

      mockClientsService.create.mockRejectedValue(
        new Error('Validation failed'),
      );

      await expect(controller.create(invalidDto)).rejects.toThrow();
      expect(mockClientsService.create).toHaveBeenCalledWith(invalidDto);
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

      mockClientsService.update.mockResolvedValue(updatedClient);

      const result = await controller.update(mockClientEntity.id, updateDto);

      expect(result).toEqual(updatedClient);
      expect(mockClientsService.update).toHaveBeenCalledWith(
        mockClientEntity.id,
        updateDto,
      );
      expect(mockClientsService.update).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when trying to update non-existent client', async () => {
      const updateDto: UsersDto = {
        fullName: 'John Updated',
        email: 'john.updated@example.com',
        description: 'Updated description',
      };

      mockClientsService.update.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(
        controller.update('non-existent-id', updateDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockClientsService.update).toHaveBeenCalledWith(
        'non-existent-id',
        updateDto,
      );
    });
  });

  describe('delete', () => {
    it('should delete a client and return its id', async () => {
      mockClientsService.delete.mockResolvedValue(mockClientEntity.id);

      const result = await controller.delete(mockClientEntity.id);

      expect(result).toEqual({ id: mockClientEntity.id });
      expect(mockClientsService.delete).toHaveBeenCalledWith(
        mockClientEntity.id,
      );
      expect(mockClientsService.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when trying to delete non-existent client', async () => {
      mockClientsService.delete.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.delete('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockClientsService.delete).toHaveBeenCalledWith('non-existent-id');
    });
  });
});
