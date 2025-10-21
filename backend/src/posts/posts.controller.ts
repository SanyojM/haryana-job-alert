import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseInterceptors, // Add this
  UploadedFile,     // Add this
  BadRequestException, // Add this
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // Add this
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SupabaseService } from '../supabase/supabase.service'; // Add this

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly supabaseService: SupabaseService, // Inject SupabaseService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file')) // Handle a single file upload with the key 'file'
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto
  ) {
    if (file) {
      const bucket = 'thumbnails';
      const path = 'posts';
      const publicUrl = await this.supabaseService.uploadFile(file, bucket, path);
      createPostDto.thumbnail_url = publicUrl; // Add the URL to the DTO
    }
    
    // TODO: Replace with actual userId from authentication context
    const validUserId = 1; 
    return this.postsService.create(createPostDto, validUserId);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

   @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  @Get('category/:id')
  findByCategory(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findByCategory(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}