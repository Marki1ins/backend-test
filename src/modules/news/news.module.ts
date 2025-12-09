import { Module } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { InMemoryCache } from 'src/shared/cache/in-memory.cache';
import { InMemoryQueue } from 'src/shared/queue/in-memory.queue';

import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  providers: [NewsService, PrismaService, InMemoryQueue, InMemoryCache],
  controllers: [NewsController],
})
export class NewsModule {}