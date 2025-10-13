import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMockTestDto } from './dto/create-mock-test.dto';
import { UpdateMockTestDto } from './dto/update-mock-test.dto';

@Injectable()
export class MockTestsService {
  constructor(private prisma: PrismaService) {}

  // The create method is now much simpler
  create(createMockTestDto: CreateMockTestDto) {
    return this.prisma.mock_tests.create({
      data: createMockTestDto,
    });
  }

  findAll() {
    return this.prisma.mock_tests.findMany({
      // Include the series a test is part of
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

    const newAttempt = await this.prisma.mock_attempts.create({
      data: {
        test_id: testId,
        user_id: userId,
        answers: answers as any, // Storing answers as JSON
        score,
        completed_at: new Date(),
      },
    });

    return newAttempt;
  }
}