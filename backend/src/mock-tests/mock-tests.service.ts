import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMockTestDto } from './dto/create-mock-test.dto';
import { UpdateMockTestDto } from './dto/update-mock-test.dto';

@Injectable()
export class MockTestsService {
  constructor(private prisma: PrismaService) {}

  create(createMockTestDto: CreateMockTestDto) {
    const { series_id, ...testData } = createMockTestDto;
    return this.prisma.mock_tests.create({
      data: {
        ...testData,
        mock_series: {
          connect: { id: series_id },
        },
      },
    });
  }

  findAll() {
    return this.prisma.mock_tests.findMany({
      include: { mock_series: true },
    });
  }

  async findOne(id: number) {
    const test = await this.prisma.mock_tests.findUnique({
      where: { id },
      include: { mock_series: true, mock_questions: true }, // Include questions for this test
    });

    if (!test) {
      throw new NotFoundException(`Mock Test with ID ${id} not found`);
    }
    return test;
  }

  async update(id: number, updateMockTestDto: UpdateMockTestDto) {
    await this.findOne(id);
    return this.prisma.mock_tests.update({
      where: { id },
      data: updateMockTestDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.mock_tests.delete({ where: { id } });
  }
}