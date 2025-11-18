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
        // If postData.category_id is null (from DTO), Prisma sets it to NULL in DB
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
    await this.findOne(id);
    const { tags, ...postData } = updatePostDto;

    return this.prisma.$transaction(async (tsx) => {
      // Handle Tags Update
      if (Array.isArray(tags)) {
        await tsx.post_tags.deleteMany({
          where: { post_id: id },
        });
      }

      // Update Post
      return tsx.posts.update({
        where: { id },
        data: {
          ...postData,
          // If postData.category_id is null, it sets DB column to NULL (removing category)
          post_tags:
            tags && tags.length > 0
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
          categories: true,
          post_templates: true,
          post_tags: { include: { tags: true } },
        },
      });
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

  // ... (rest of your find functions remain the same) ...
  async findByCategory(categoryId: number) {
    return this.prisma.posts.findMany({
      where: { category_id: categoryId },
      include: {
        categories: true,
        post_templates: true,
        post_tags: { include: { tags: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findByTagName(tagName: string) {
    return this.prisma.posts.findMany({
      where: {
        post_tags: {
          some: {
            tags: {
              name: { equals: tagName, mode: 'insensitive' },
            },
          },
        },
      },
      include: {
        categories: true,
        post_templates: true,
        post_tags: { include: { tags: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findLatestByCategory(categoryName: string, limit = 8) {
    return this.prisma.posts.findMany({
      where: {
        categories: {
          is: {
            name: { equals: categoryName, mode: 'insensitive' },
          },
        },
      },
      include: {
        categories: true,
        post_templates: true,
        post_tags: { include: { tags: true } },
      },
      orderBy: { created_at: 'desc' },
      take: limit,
    });
  }

  /**
   * Return summarized posts (only select fields) for each category.
   * Useful for homepage cards where full HTML content is not needed.
   */
  async findSummaryByCategories(limit = 25) {
    const categories = await this.prisma.categories.findMany({ orderBy: { name: 'asc' } });

    const result: Array<{ id: number; name: string; posts: Array<any> }> = [];

    for (const cat of categories) {
      const posts = await this.prisma.posts.findMany({
        where: { category_id: cat.id },
        orderBy: { created_at: 'desc' },
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          category_id: true,
          created_at: true,
        },
      });

      result.push({ id: Number(cat.id), name: cat.name, posts });
    }

    return result;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.$transaction(async (tsx) => {
      await tsx.post_tags.deleteMany({ where: { post_id: id } });
      return tsx.posts.delete({ where: { id } });
    });
  }
}