import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseGuards, Req
} from '@nestjs/common';
import { MockSeriesService } from './mock-series.service';
import { CreateMockSeriesDto } from './dto/create-mock-series.dto';
import { UpdateMockSeriesDto } from './dto/update-mock-series.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@Controller('mock-series')
export class MockSeriesController {
  constructor(private readonly mockSeriesService: MockSeriesService) {}

  @Get('slug/:categorySlug/:seriesSlug')
  findBySlugs(
    @Param('categorySlug') categorySlug: string,
    @Param('seriesSlug') seriesSlug: string,
  ) {
    return this.mockSeriesService.findBySlugs(categorySlug, seriesSlug);
  }

  @Post()
  create(@Body() createMockSeriesDto: CreateMockSeriesDto) {
    return this.mockSeriesService.create(createMockSeriesDto);
  }

  @Get()
  findAll() {
    return this.mockSeriesService.findAll();
  }

  @Post(':seriesId/tests/:testId')
  addTestToSeries(
    @Param('seriesId', ParseIntPipe) seriesId: number,
    @Param('testId', ParseIntPipe) testId: number,
  ) {
    return this.mockSeriesService.addTestToSeries(seriesId, testId);
  }

  @Delete(':seriesId/tests/:testId')
  removeTestFromSeries(
    @Param('seriesId', ParseIntPipe) seriesId: number,
    @Param('testId', ParseIntPipe) testId: number,
  ) {
    return this.mockSeriesService.removeTestFromSeries(seriesId, testId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mockSeriesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMockSeriesDto: UpdateMockSeriesDto,
  ) {
    return this.mockSeriesService.update(id, updateMockSeriesDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mockSeriesService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/check-enrollment')
  checkEnrollment(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.mockSeriesService.checkEnrollment(id, user.id);
  }
}