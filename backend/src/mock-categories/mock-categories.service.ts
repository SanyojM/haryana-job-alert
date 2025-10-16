import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMockCategoryDto } from './dto/create-mock-category.dto';
import { UpdateMockCategoryDto } from './dto/update-mock-category.dto';
import { slugify } from 'src/utils/slugify';

@Injectable()
export class MockCategoriesService {
  constructor(private prisma: PrismaService) {}

  create(createMockCategoryDto: CreateMockCategoryDto) {
    const { name, description } = createMockCategoryDto;
    const slug = slugify(name); // Generate slug from the name

    return this.prisma.mock_categories.create({
      data: {
        name,
        description,
        slug,
      },
    });
  }

  findAll() {
    return this.prisma.mock_categories.findMany();
  }

  async findOne(id: number) {
    const mockCategory = await this.prisma.mock_categories.findUnique({ where: { id } });
    if (!mockCategory) {
      throw new NotFoundException(`Mock Category with ID ${id} not found`);
    }
    return mockCategory;
  }

  async update(id: number, updateMockCategoryDto: UpdateMockCategoryDto) {
    await this.findOne(id);
    
    const data: any = { ...updateMockCategoryDto };

    // If the name is being updated, regenerate the slug as well
    if (updateMockCategoryDto.name) {
      data.slug = slugify(updateMockCategoryDto.name);
    }

    return this.prisma.mock_categories.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.mock_categories.delete({ where: { id } });
  }
}