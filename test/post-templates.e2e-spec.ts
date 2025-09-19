import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

// Add this line to handle BigInt serialization for tests
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

describe('PostTemplatesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let sampleStructure: Record<string, any>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    // Clean the database before running tests
    await prisma.post_templates.deleteMany({});

    sampleStructure = {
      placeholders: [
        { key: 'job_title', type: 'string', label: 'Job Title' },
        { key: 'application_deadline', type: 'date', label: 'Apply Before' },
      ],
      blocks: [{ type: 'richtext', label: 'Job Description' }],
    };
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/post-templates', () => {
    let templateId: string;

    it('POST /post-templates => should create a new post template', () => {
      return request(app.getHttpServer())
        .post('/post-templates')
        .send({
          name: 'New Job Vacancy',
          description: 'Template for publishing new job alerts.',
          structure: sampleStructure,
        })
        .expect(201)
        .then((res) => {
          expect(res.body).toEqual({
            id: expect.any(String),
            name: 'New Job Vacancy',
            description: 'Template for publishing new job alerts.',
            structure: sampleStructure,
            created_at: expect.any(String),
          });
          templateId = res.body.id;
        });
    });

    it('GET /post-templates => should return all post templates', () => {
      return request(app.getHttpServer())
        .get('/post-templates')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body.length).toBe(1);
          expect(res.body[0].name).toBe('New Job Vacancy');
        });
    });

    it('GET /post-templates/:id => should return a single post template by id', () => {
      return request(app.getHttpServer())
        .get(`/post-templates/${templateId}`)
        .expect(200)
        .then((res) => {
          expect(res.body.structure).toEqual(sampleStructure);
        });
    });

    it('PUT /post-templates/:id => should update a post template', () => {
      return request(app.getHttpServer())
        .put(`/post-templates/${templateId}`)
        .send({ name: 'Updated Job Vacancy' })
        .expect(200)
        .then((res) => {
          expect(res.body.name).toBe('Updated Job Vacancy');
        });
    });

    it('DELETE /post-templates/:id => should delete the post template', () => {
      return request(app.getHttpServer())
        .delete(`/post-templates/${templateId}`)
        .expect(200);
    });

    it('GET /post-templates/:id => should return 404 after deletion', () => {
      return request(app.getHttpServer())
        .get(`/post-templates/${templateId}`)
        .expect(404);
    });
  });
});
