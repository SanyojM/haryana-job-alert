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
import { MockTestsService } from './mock-tests.service';
import { CreateMockTestDto } from './dto/create-mock-test.dto';
import { UpdateMockTestDto } from './dto/update-mock-test.dto';

@Controller('mock-tests')
export class MockTestsController {
  constructor(private readonly mockTestsService: MockTestsService) {}

  @Post()
  create(@Body() createMockTestDto: CreateMockTestDto) {
    return this.mockTestsService.create(createMockTestDto);
  }

  @Get()
  findAll() {
    return this.mockTestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mockTestsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMockTestDto: UpdateMockTestDto,
  ) {
    return this.mockTestsService.update(id, updateMockTestDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mockTestsService.remove(id);
  }
}