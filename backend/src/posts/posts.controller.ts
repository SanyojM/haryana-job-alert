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
  Query,
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

  // Latest posts by category (case-insensitive name match) with optional limit
  // IMPORTANT: Must come BEFORE @Get(':id') to avoid route conflicts
  @Get('latest')
  findLatestByCategory(
    @Query('category') category: string,
    @Query('limit') limit?: string,
  ) {
    const take = Number.isFinite(Number(limit)) ? Number(limit) : 8;
    if (!category || !category.trim()) {
      throw new BadRequestException('Query param "category" is required');
    }
    return this.postsService.findLatestByCategory(category, take);
  }

  // Specific routes with string params (slug, tag, category)
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  @Get('category/:id')
  findByCategory(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findByCategory(id);
  }

  // Find posts by tag name (case-insensitive)
  @Get('tag/:name')
  findByTagName(@Param('name') name: string) {
    return this.postsService.findByTagName(name);
  }

  // Generic :id route MUST come AFTER all specific routes
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updatePostDto: UpdatePostDto,
  ) {
   if (file) {
      const bucket = 'thumbnails';
      const path = 'posts'; // Or another path for updates if desired
      const publicUrl = await this.supabaseService.uploadFile(file, bucket, path);
      updatePostDto.thumbnail_url = publicUrl; // Add/overwrite the URL in the DTO
    }

    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}