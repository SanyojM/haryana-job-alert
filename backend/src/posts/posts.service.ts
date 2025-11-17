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
    await this.findOne(id);
    const { tags, ...postData } = updatePostDto;

    return this.prisma.$transaction(async (tsx) => {
      // Delete existing tag associations if tags array is provided (including empty array)
      if (Array.isArray(tags)) {
        await tsx.post_tags.deleteMany({
          where: { post_id: id },
        });
      }

      // Update the post and create new tag associations
      return tsx.posts.update({
        where: { id },
        data: {
          ...postData,
          post_tags: tags && tags.length > 0
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

  async findByTagName(tagName: string) {
    const posts = await this.prisma.posts.findMany({
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

    return posts;
  }

  async findLatestByCategory(categoryName: string, limit = 8) {
    const posts = await this.prisma.posts.findMany({
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

    return posts;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.$transaction(async (tsx) => {
      await tsx.post_tags.deleteMany({ where: { post_id: id } });

      const deletedPost = await tsx.posts.delete({ where: { id } });
      return deletedPost;
    })
  }
}