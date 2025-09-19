import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreatePostDto } from '../src/posts/dto/create-post.dto';

// Handle BigInt serialization
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let categoryId: bigint;
  let tagId: bigint;
  let templateId: bigint;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Clean up all tables in the correct order to respect foreign keys
    await prisma.post_tags.deleteMany({});
    await prisma.posts.deleteMany({});
    await prisma.users.deleteMany({});
    await prisma.categories.deleteMany({});
    await prisma.tags.deleteMany({});
    await prisma.post_templates.deleteMany({});

    // Reset the users_id_seq sequence to ensure our first user has ID 1
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE users_id_seq RESTART WITH 1;`);

    // Create the user that our controller expects (it will have ID 1)
    await prisma.users.create({
      data: {
        full_name: 'Test User',
        email: 'test@example.com',
        password_hash: 'somehash',
      },
    });

    // Create other prerequisite data
    const category = await prisma.categories.create({
      data: { name: 'Test Category' },
    });
    categoryId = category.id;

    const tag = await prisma.tags.create({ data: { name: 'Test Tag' } });
    tagId = tag.id;

    const template = await prisma.post_templates.create({
      data: {
        name: 'Test Template',
        structure: { fields: [{ key: 'message', type: 'string' }] },
      },
    });
    templateId = template.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/posts', () => {
    let postId: string;

    it('POST /posts => should create a new post with a template and tags', () => {
      const createPostDto: CreatePostDto = {
        title: 'My First Template-Driven Post',
        slug: 'my-first-template-driven-post',
        category_id: Number(categoryId),
        template_id: Number(templateId),
        content_json: { message: 'Hello World!' },
        tags: [Number(tagId)],
      };

      return request(app.getHttpServer())
        .post('/posts')
        .send(createPostDto)
        .expect(201)
        .then((res) => {
          expect(res.body.title).toBe(createPostDto.title);
          expect(res.body.created_by).toBe('1'); // Check that it was created by user 1
          expect(res.body.post_tags[0].tags.name).toBe('Test Tag');
          postId = res.body.id;
        });
    });

    it('GET /posts/:id => should retrieve the created post', () => {
        return request(app.getHttpServer())
          .get(`/posts/${postId}`)
          .expect(200)
          .then((res) => {
            expect(res.body.title).toBe('My First Template-Driven Post');
          });
      });

    it('DELETE /posts/:id => should delete the post', () => {
      return request(app.getHttpServer())
        .delete(`/posts/${postId}`)
        .expect(200);
    });

    it('GET /posts/:id => should return 404 after deletion', () => {
      return request(app.getHttpServer())
        .get(`/posts/${postId}`)
        .expect(404);
    });
  });
});