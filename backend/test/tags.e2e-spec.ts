import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

// Add this line to handle BigInt serialization for tests
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

describe('TagsController (e2e)', () => {
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
        // Clean the database before running tests
        await prisma.tags.deleteMany({});
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/tags', () => {
        let tagId: string;

        it('POST /tags => should create a new tag', () => {
            return request(app.getHttpServer())
                .post('/tags')
                .send({
                    name: 'SSC',
                })
                .expect(201)
                .then((res) => {
                    expect(res.body).toEqual({
                        id: expect.any(String),
                        name: 'SSC',
                    });
                    tagId = res.body.id;
                });
        });

        it('GET /tags => should return all tags', () => {
            return request(app.getHttpServer())
                .get('/tags')
                .expect(200)
                .then((res) => {
                    expect(res.body).toBeInstanceOf(Array);
                    expect(res.body.length).toBe(1);
                    expect(res.body[0].name).toBe('SSC');
                });
        });

        it('GET /tags/:id => should return a single tag by id', () => {
            return request(app.getHttpServer())
                .get(`/tags/${tagId}`)
                .expect(200)
                .then((res) => {
                    expect(res.body).toEqual({
                        id: tagId,
                        name: 'SSC',
                    });
                });
        });

        it('PUT /tags/:id => should update a tag', () => {
            return request(app.getHttpServer())
                .put(`/tags/${tagId}`) // Ensure tagId is a string
                .send({ name: 'SSC CGL' })
                .expect(200)
                .then((res) => {
                    expect(res.body.name).toBe('SSC CGL');
                });
        });

        it('DELETE /tags/:id => should delete the tag', () => {
            return request(app.getHttpServer())
                .delete(`/tags/${tagId}`) // Ensure tagId is a string
                .expect(200);
        });

        it('GET /tags/:id => should return 404 after deletion', () => {
            return request(app.getHttpServer())
                .get(`/tags/${tagId}`)
                .expect(404);
        });
    });
});