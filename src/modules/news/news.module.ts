import { Module } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  providers: [NewsService, PrismaService],
  controllers: [NewsController],
})
export class NewsModule {}