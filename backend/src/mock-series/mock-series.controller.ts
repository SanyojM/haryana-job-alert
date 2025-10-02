import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { MockSeriesService } from './mock-series.service';
import { CreateMockSeriesDto } from './dto/create-mock-series.dto';
import { UpdateMockSeriesDto } from './dto/update-mock-series.dto';

@Controller('mock-series')
export class MockSeriesController {
  constructor(private readonly mockSeriesService: MockSeriesService) {}

  @Post()
  create(@Body() createMockSeriesDto: CreateMockSeriesDto) {
    return this.mockSeriesService.create(createMockSeriesDto);
  }

  @Get()
  findAll() {
    return this.mockSeriesService.findAll();
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
}