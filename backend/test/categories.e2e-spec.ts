import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

// Add this line to handle BigInt serialization for tests
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

describe('CategoriesController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        prisma = app.get<PrismaService>(PrismaService);
        await prisma.categories.deleteMany({});
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/categories', () => {
        let categoryId: string; // Use string to match the serialized BigInt

        it('POST /categories => should create a new category', () => {
            return request(app.getHttpServer())
                .post('/categories')
                .send({
                    name: 'Results',
                    description: 'Exam results and score cards',
                })
                .expect(201)
                .then((res) => {
                    expect(res.body).toEqual({
                        id: expect.any(String), // Expect a string now
                        name: 'Results',
                        description: 'Exam results and score cards',
                        created_at: expect.any(String),
                    });
                    categoryId = res.body.id;
                });
        });

        it('GET /categories => should return all categories', () => {
            return request(app.getHttpServer())
                .get('/categories')
                .expect(200)
                .then((res) => {
                    expect(res.body).toBeInstanceOf(Array);
                    expect(res.body.length).toBe(1);
                    expect(res.body[0].name).toBe('Results');
                });
        });

        it('GET /categories/:id => should return a single category by id', () => {
            return request(app.getHttpServer())
                .get(`/categories/${categoryId}`)
                .expect(200)
                .then((res) => {
                    expect(res.body).toEqual({
                        id: categoryId,
                        name: 'Results',
                        description: 'Exam results and score cards',
                        created_at: expect.any(String),
                    });
                });
        });

        it('PUT /categories/:id => should update a category', () => {
            return request(app.getHttpServer())
                .put(`/categories/${categoryId}`) // Ensure categoryId is a string
                .send({ name: 'Final Results' })
                .expect(200)
                .then((res) => {
                    expect(res.body.name).toBe('Final Results');
                });
        });

        it('DELETE /categories/:id => should delete the category', () => {
            return request(app.getHttpServer())
                .delete(`/categories/${categoryId}`) // Ensure categoryId is a string
                .expect(200);
        });

        it('GET /categories/:id => should return 404 after deletion', () => {
            return request(app.getHttpServer())
                .get(`/categories/${categoryId}`)
                .expect(404);
        });
    });
});