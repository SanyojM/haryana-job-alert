import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagsModule } from './tags/tags.module';
import { PostTemplatesModule } from './post-templates/post-templates.module'; // <-- Add this import

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CoursesModule,
    PostsModule,
    CategoriesModule,
    TagsModule,
    PostTemplatesModule, // <-- Add this line
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}