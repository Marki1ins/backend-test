import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './db/prisma.service';
import { NewsModule } from './modules/news/news.module';

@Module({
  imports: [NewsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
