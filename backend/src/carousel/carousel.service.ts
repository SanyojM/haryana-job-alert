import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarouselDto } from './dto/create-carousel.dto';
import { UpdateCarouselDto } from './dto/update-carousel.dto';

@Injectable()
export class CarouselService {
  constructor(private prisma: PrismaService) {}

  /**
   * If a new item is set to active, deactivate all others.
   */
  private async handleActiveState(is_active?: boolean) {
    if (is_active) {
      await this.prisma.carousel_texts.updateMany({
        where: { is_active: true },
        data: { is_active: false },
      });
    }
  }

  async create(createCarouselDto: CreateCarouselDto) {
    await this.handleActiveState(createCarouselDto.is_active);
    return this.prisma.carousel_texts.create({ data: createCarouselDto });
  }

  /**
   * Finds all carousel texts.
   * Public route, but we'll add an 'active' filter for non-admins.
   */
  findAll(onlyActive: boolean = false) {
    return this.prisma.carousel_texts.findMany({
      where: onlyActive ? { is_active: true } : {},
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.carousel_texts.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Carousel item with ID ${id} not found`);
    }
    return item;
  }

  async update(id: number, updateCarouselDto: UpdateCarouselDto) {
    await this.findOne(id);
    await this.handleActiveState(updateCarouselDto.is_active);
    
    return this.prisma.carousel_texts.update({
      where: { id },
      data: updateCarouselDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.carousel_texts.delete({ where: { id } });
  }
}