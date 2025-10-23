import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const { tags, ...postData } = createPostDto;

    return this.prisma.posts.create({
      data: {
        ...postData,
        content: postData.content_html || '',
        created_by: userId,
        post_tags: tags
          ? {
              create: tags.map((tagId) => ({
                tags: {
                  connect: { id: tagId },
                },
              })),
            }
          : undefined,
      },
      include: {
        post_tags: {
          include: {
            tags: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.posts.findMany({
      include: {
        categories: true,
        post_templates: true,
        post_tags: { include: { tags: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.posts.findUnique({
      where: { id },
      include: {
        categories: true,
        post_templates: true,
        post_tags: { include: { tags: true } },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    console.log('--- PostsService Update ---');
    console.log('Received DTO:', JSON.stringify(updatePostDto, null, 2));
    // --- END DEBUG LOG ---

    await this.findOne(id); // Ensure post exists
    const { tags, ...postData } = updatePostDto;

    // Note: A full implementation for updating tags is more complex.
    // It requires disconnecting old tags and connecting new ones in a transaction.
    // We will tackle this advanced logic after confirming the create functionality works.
    return this.prisma.posts.update({
      where: { id },
      data: {
        ...postData,
      },
    });
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.posts.findUnique({
      where: { slug },
      include: {
        categories: true,
        post_templates: true,
        post_tags: { include: { tags: true } },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }
    return post;
  }

  async findByCategory(categoryId: number) {
    const posts = await this.prisma.posts.findMany({
      where: { category_id: categoryId },
      include: {
        categories: true,
        post_templates: true,
        post_tags: { include: { tags: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    return posts;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.posts.delete({ where: { id } });
  }
}