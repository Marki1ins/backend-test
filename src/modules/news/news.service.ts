import { BadRequestException, Injectable } from "@nestjs/common";
import { PaginationDto } from "src/shared/utils/pagination.dto";

import { PrismaService } from "../../db/prisma.service";
import { InMemoryCache } from "../../shared/cache/in-memory.cache";
import { InMemoryQueue } from "../../shared/queue/in-memory.queue";
import { CreateOrUpdateNewsDto } from "./news.dto";
import { Noticia } from "@prisma/client";

@Injectable()
export class NewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queue: InMemoryQueue,
    private readonly cache: InMemoryCache,
  ) {}

  async create(data: CreateOrUpdateNewsDto) {
    const noticia = await this.prisma.noticia.create({ data });

    if (!noticia) throw new BadRequestException("Erro ao criar notícia");

    this.queue.add({
      type: "NOTIFY_NEW_NEWS",
      payload: noticia,
    });

    return noticia;
  }

  async listAll(query: PaginationDto) {
    const { page, perPage, sortKey, sortDirection, search } = query as any;
    const cacheKey = `news:${page}:${perPage}:${sortKey}:${sortDirection}:${search ?? ""}`;

    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.prisma.paginate({
      modelName: "Noticia",
      where: {
        ...(search && {
          titulo: { contains: search },
        }),
      },
      page,
      perPage,
      sortKey,
      sortDirection,
    });

    this.cache.set(cacheKey, result);

    return result || [];
  }

  async listById(id: number) {
    return await this.hasNoticia(id);
  }

  async update(id: number, data: CreateOrUpdateNewsDto) {
    await this.hasNoticia(id);
    const noticia = await this.prisma.noticia.update({ where: { id }, data });
    this.cache.del(this.getCacheKey(id));
    return noticia;
  }

  async delete(id: number) {
    await this.hasNoticia(id);
    const noticia = await this.prisma.noticia.delete({ where: { id } });
    this.cache.del(this.getCacheKey(id));
    return noticia;
  }

  async hasNoticia(id: number) {
    const cacheKey = this.getCacheKey(id);
    const cachedEmployee = this.cache.get<Noticia>(cacheKey);

    if (cachedEmployee) return cachedEmployee;

    const noticia = await this.prisma.noticia.findUnique({ where: { id } });

    if (!noticia) throw new BadRequestException("Notícia não encontrada");

    this.cache.set(cacheKey, noticia);
    return noticia;
  }

  private getCacheKey(id: number) {
    return `noticia:${id}`;
  }
}
