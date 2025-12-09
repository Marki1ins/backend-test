import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/shared/utils/pagination.dto';

import { PrismaService } from '../../db/prisma.service';
import { CreateOrUpdateNewsDto } from './news.dto';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateOrUpdateNewsDto) {
    return await this.prisma.noticia.create({ data });
  }

  async listAll(query: PaginationDto) {
    const { page, perPage, sortKey, sortDirection, search } = query as any;
    return (await this.prisma.paginate({
      modelName: 'Noticia',
      where: {
        ...(search && {
          titulo: { contains: search },
        })
      },
      page,
      perPage,
      sortKey,
      sortDirection,
    })) || [];
  }

  async listById(id: number) {
    return await this.hasNoticia(id);
  }

  async update(id: number, data: CreateOrUpdateNewsDto) {
    await this.hasNoticia(id);
    return await this.prisma.noticia.update({ where: { id }, data });
  }

  async delete(id: number) {
    await this.hasNoticia(id);
    return await this.prisma.noticia.delete({ where: { id } });
  }

  async hasNoticia(id: number) {
    const noticia = await this.prisma.noticia.findUnique({ where: { id } });

    if (!noticia) throw new BadRequestException("Notícia não encontrada");

    return noticia;
  }
}
