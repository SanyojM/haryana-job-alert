import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMockTestDto } from './dto/create-mock-test.dto';
import { UpdateMockTestDto } from './dto/update-mock-test.dto';
import { slugify } from '../utils/slugify';

@Injectable()
export class MockTestsService {
  constructor(private prisma: PrismaService) {}

  create(createMockTestDto: CreateMockTestDto) {
    const { title } = createMockTestDto;
    const slug = slugify(title);
    return this.prisma.mock_tests.create({
      data: {
        ...createMockTestDto,
        slug,
      },
    });
  }

  findAll() {
    return this.prisma.mock_tests.findMany({
      include: { mock_series_tests: { include: { series: true } } },
    });
  }

  async findOne(id: number) {
    const test = await this.prisma.mock_tests.findUnique({
      where: { id },
      include: { 
        mock_questions: true,
        mock_series_tests: { include: { series: true } } 
      },
    });

    if (!test) {
      throw new NotFoundException(`Mock Test with ID ${id} not found`);
    }
    return test;
  }

  async findBySlug(slug: string) {
    const seriesTest = await this.prisma.mock_series_tests.findUnique({
        where: { slug },
        include: {
            test: {
                include: {
                    mock_questions: true
                }
            },
            series: {
                include: {
                    mock_categories: true
                }
            }
        }
    });

    if (!seriesTest) {
        throw new NotFoundException(`Test with slug "${slug}" not found`);
    }
    return seriesTest;
  }

  async update(id: number, updateMockTestDto: UpdateMockTestDto) {
    await this.findOne(id);
    const data: any = { ...updateMockTestDto };
    if (updateMockTestDto.title) {
      data.slug = slugify(updateMockTestDto.title);
    }

    const updatedTest = await this.prisma.mock_tests.update({
      where: { id },
      data,
    });

    const seriesTests = await this.prisma.mock_series_tests.findMany({
        where: { test_id: id },
        include: {
            series: {
                include: {
                    mock_categories: true
                }
            }
        }
    });

    for (const seriesTest of seriesTests) {
        const categorySlug = seriesTest.series.mock_categories?.slug ?? 'unknown-category';
        const newSlug = `${categorySlug}/${seriesTest.series.slug}/${updatedTest.slug}`;
        await this.prisma.mock_series_tests.update({
            where: {
                series_id_test_id: {
                    series_id: seriesTest.series_id,
                    test_id: seriesTest.test_id
                }
            },
            data: {
                slug: newSlug
            }
        });
    }

    return updatedTest;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.mock_tests.delete({ where: { id } });
  }

  async submitTest(testId: number, userId: number, answers: Record<string, string>) {
    const questions = await this.prisma.mock_questions.findMany({
      where: { test_id: testId },
    });

    if (questions.length === 0) {
      throw new NotFoundException('No questions found for this test.');
    }

    let score = 0;
    for (const question of questions) {
      const userAnswer = answers[question.id.toString()];
      if (userAnswer && userAnswer === question.correct_answer) {
        score += question.marks || 1;
      }
    }

    return this.prisma.mock_attempts.create({
      data: {
        test_id: testId,
        user_id: userId,
        answers: answers as any,
        score,
        completed_at: new Date(),
      },
    });
  }
}