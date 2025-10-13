import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMockSeriesDto } from './dto/create-mock-series.dto';
import { UpdateMockSeriesDto } from './dto/update-mock-series.dto';

@Injectable()
export class MockSeriesService {
  constructor(private prisma: PrismaService) {}

  async create(createMockSeriesDto: CreateMockSeriesDto) {
    // Destructure category_id out, along with tagIds
    const { tagIds, category_id, ...seriesData } = createMockSeriesDto;

    return this.prisma.mock_series.create({
      data: {
        ...seriesData, // Now 'seriesData' does not contain category_id
        // Connect to an existing category using the destructured variable
        mock_categories: {
          connect: { id: category_id },
        },
        // If tagIds are provided, create the connections in the join table
        mock_series_tags: tagIds
          ? {
              create: tagIds.map((id) => ({
                tag: {
                  connect: { id },
                },
              })),
            }
          : undefined,
      },
      include: {
        mock_categories: true,
        mock_series_tags: { include: { tag: true } },
      },
    });
  }

  findAll() {
    return this.prisma.mock_series.findMany({
      include: {
        mock_categories: true,
        mock_series_tags: { include: { tag: true } },
      },
    });
  }

  async findOne(id: number) {
    const series = await this.prisma.mock_series.findUnique({
      where: { id },
      include: {
        mock_categories: true,
        mock_series_tags: { include: { tag: true } },
        // Fetch tests through the join table
        mock_series_tests: { include: { test: true } }, 
      },
    });

    if (!series) {
      throw new NotFoundException(`Mock Series with ID ${id} not found`);
    }
    return series;
  }

  async addTestToSeries(seriesId: number, testId: number) {
    return this.prisma.mock_series_tests.create({
      data: {
        series_id: seriesId,
        test_id: testId,
      },
    });
  }

  // NEW: Method to remove a test from a series (without deleting the test)
  async removeTestFromSeries(seriesId: number, testId: number) {
    return this.prisma.mock_series_tests.delete({
      where: {
        series_id_test_id: {
          series_id: seriesId,
          test_id: testId,
        },
      },
    });
  }

  async update(id: number, updateMockSeriesDto: UpdateMockSeriesDto) {
    const { tagIds, ...seriesData } = updateMockSeriesDto;

    return this.prisma.$transaction(async (tx) => {
      const updatedSeries = await tx.mock_series.update({
        where: { id },
        data: seriesData,
      });

      if (tagIds) {
        await tx.mock_series_tags.deleteMany({ where: { series_id: id } });
        await tx.mock_series_tags.createMany({
          data: tagIds.map((tagId) => ({
            series_id: id,
            tag_id: tagId,
          })),
        });
      }

      return tx.mock_series.findUnique({
        where: { id },
        include: {
          mock_categories: true,
          mock_series_tags: { include: { tag: true } },
        },
      });
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.mock_series.delete({ where: { id } });
  }

  async checkEnrollment(seriesId: number, userId: number) {
    const payment = await this.prisma.payments.findFirst({
      where: {
        user_id: userId,
        mock_series_id: seriesId,
        status: 'success', // Check for a successful payment
      },
    });

    return { enrolled: !!payment }; // Returns { enrolled: true } if a payment exists, otherwise false
  }
}