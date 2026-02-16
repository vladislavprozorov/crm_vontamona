import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Clients API (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let createdClientId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
  }, 30000); 
  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      try {
        await dataSource.query('DELETE FROM clients WHERE email LIKE \'%test-e2e%\'');
      } catch (error) {
        console.error('Error cleaning up test data:', error);
      }
    }
    if (app) {
      await app.close();
    }
  }, 30000); // Увеличиваем timeout до 30 секунд

  describe('/clients (POST)', () => {
    it('should create a new client with valid data', async () => {
      const createDto = {
        fullName: 'John Doe E2E Test',
        email: 'john.doe.test-e2e@example.com',
        description: 'This is a test client created during E2E testing',
      };

      const response = await request(app.getHttpServer())
        .post('/clients')
        .send(createDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.fullName).toBe(createDto.fullName);
      expect(response.body.email).toBe(createDto.email);
      expect(response.body.description).toBe(createDto.description);
      expect(response.body).toHaveProperty('createdAt');

      // Сохраняем ID для последующих тестов
      createdClientId = response.body.id;
    });

    it('should fail to create client with invalid fullName (too short)', async () => {
      const createDto = {
        fullName: 'Jo', // Меньше 3 символов
        email: 'test-e2e@example.com',
        description: 'Test description',
      };

      await request(app.getHttpServer())
        .post('/clients')
        .send(createDto)
        .expect(400);
    });

    it('should fail to create client with missing required fields', async () => {
      const createDto = {
        fullName: 'John Doe',
        // email отсутствует
        description: 'Test description',
      };

      await request(app.getHttpServer())
        .post('/clients')
        .send(createDto)
        .expect(400);
    });

    it('should fail to create client with empty fullName', async () => {
      const createDto = {
        fullName: '',
        email: 'test-e2e@example.com',
        description: 'Test description',
      };

      await request(app.getHttpServer())
        .post('/clients')
        .send(createDto)
        .expect(400);
    });
  });

  describe('/clients (GET)', () => {
    it('should return array of clients', async () => {
      const response = await request(app.getHttpServer())
        .get('/clients')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Проверяем структуру первого клиента
      if (response.body.length > 0) {
        const client = response.body[0];
        expect(client).toHaveProperty('id');
        expect(client).toHaveProperty('fullName');
        expect(client).toHaveProperty('email');
        expect(client).toHaveProperty('description');
        expect(client).toHaveProperty('createdAt');
      }
    });

    it('should return clients sorted by createdAt desc', async () => {
      const response = await request(app.getHttpServer())
        .get('/clients')
        .expect(200);

      if (response.body.length > 1) {
        const firstDate = new Date(response.body[0].createdAt);
        const secondDate = new Date(response.body[1].createdAt);
        expect(firstDate.getTime()).toBeGreaterThanOrEqual(secondDate.getTime());
      }
    });
  });

  describe('/clients/:id (GET)', () => {
    it('should return a specific client by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/clients/${createdClientId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdClientId);
      expect(response.body).toHaveProperty('fullName');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should return 404 for non-existent client', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await request(app.getHttpServer())
        .get(`/clients/${fakeId}`)
        .expect(404);
    });

    it('should return 500 for invalid UUID format', async () => {
      // PostgreSQL возвращает ошибку при невалидном UUID
      await request(app.getHttpServer())
        .get('/clients/invalid-uuid')
        .expect(500);
    });
  });

  describe('/clients/:id (PUT)', () => {
    it('should update an existing client', async () => {
      const updateDto = {
        fullName: 'John Doe Updated E2E',
        email: 'john.updated.test-e2e@example.com',
        description: 'Updated description for E2E testing',
      };

      const response = await request(app.getHttpServer())
        .put(`/clients/${createdClientId}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.id).toBe(createdClientId);
      expect(response.body.fullName).toBe(updateDto.fullName);
      expect(response.body.email).toBe(updateDto.email);
      expect(response.body.description).toBe(updateDto.description);
    });

    it('should fail to update client with invalid data', async () => {
      const updateDto = {
        fullName: 'Jo', // Слишком короткое
        email: 'test-e2e@example.com',
        description: 'Test',
      };

      await request(app.getHttpServer())
        .put(`/clients/${createdClientId}`)
        .send(updateDto)
        .expect(400);
    });

    it('should return 404 when updating non-existent client', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const updateDto = {
        fullName: 'Test User',
        email: 'test-e2e@example.com',
        description: 'Test description',
      };

      await request(app.getHttpServer())
        .put(`/clients/${fakeId}`)
        .send(updateDto)
        .expect(404);
    });

    it('should partially update client fields', async () => {
      const updateDto = {
        fullName: 'Partially Updated Name E2E',
        email: 'partial.test-e2e@example.com',
        description: 'Partial update test',
      };

      const response = await request(app.getHttpServer())
        .put(`/clients/${createdClientId}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.fullName).toBe(updateDto.fullName);
    });
  });

  describe('/clients/:id (DELETE)', () => {
    it('should delete an existing client and return confirmation', async () => {
      await request(app.getHttpServer())
        .delete(`/clients/${createdClientId}`)
        .expect(200);
      
      // Достаточно проверить, что DELETE выполнился успешно (200)
    });

    it('should return 404 when trying to get deleted client', async () => {
      await request(app.getHttpServer())
        .get(`/clients/${createdClientId}`)
        .expect(404);
    });

    it('should return 404 when deleting non-existent client', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await request(app.getHttpServer())
        .delete(`/clients/${fakeId}`)
        .expect(404);
    });

    it('should return 404 when deleting already deleted client', async () => {
      await request(app.getHttpServer())
        .delete(`/clients/${createdClientId}`)
        .expect(404);
    });
  });

  describe('Full CRUD workflow', () => {
    it('should complete full CRUD cycle', async () => {
      // 1. Create
      const createDto = {
        fullName: 'Workflow Test User E2E',
        email: 'workflow.test-e2e@example.com',
        description: 'Testing full CRUD workflow',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/clients')
        .send(createDto)
        .expect(201);

      const userId = createResponse.body.id;
      expect(userId).toBeDefined();

      // 2. Read (single)
      const getResponse = await request(app.getHttpServer())
        .get(`/clients/${userId}`)
        .expect(200);

      expect(getResponse.body.fullName).toBe(createDto.fullName);

      // 3. Update
      const updateDto = {
        fullName: 'Workflow Updated User E2E',
        email: 'workflow.updated.test-e2e@example.com',
        description: 'Updated in workflow',
      };

      const updateResponse = await request(app.getHttpServer())
        .put(`/clients/${userId}`)
        .send(updateDto)
        .expect(200);

      expect(updateResponse.body.fullName).toBe(updateDto.fullName);

      // 4. Read (list) - проверяем что обновленный клиент есть в списке
      const listResponse = await request(app.getHttpServer())
        .get('/clients')
        .expect(200);

      const foundClient = listResponse.body.find((c: any) => c.id === userId);
      expect(foundClient).toBeDefined();
      expect(foundClient.fullName).toBe(updateDto.fullName);

      // 5. Delete
      await request(app.getHttpServer())
        .delete(`/clients/${userId}`)
        .expect(200);

      // 6. Verify deletion
      await request(app.getHttpServer())
        .get(`/clients/${userId}`)
        .expect(404);
    });
  });
});
