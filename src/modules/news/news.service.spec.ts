import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../db/prisma.service";

import { NewsService } from "./news.service";
import { InMemoryQueue } from "../../shared/queue/in-memory.queue";
import { InMemoryCache } from "../../shared/cache/in-memory.cache";

describe("NewsService", () => {
  let service: NewsService;

  const mockNoticia = { id: 1, titulo: "Notícia 1", descricao: "Descrição" };

  const prismaMock = {
    noticia: {
      create: jest.fn().mockResolvedValue(mockNoticia),
      findMany: jest.fn().mockResolvedValue([mockNoticia]),
      findUnique: jest.fn().mockResolvedValue(mockNoticia),
      update: jest.fn().mockResolvedValue(mockNoticia),
      delete: jest.fn().mockResolvedValue(mockNoticia),
    },
    paginate: jest.fn(),
  } as any;

  beforeEach(async () => {
    const queueMock = {
      add: jest.fn(),
    };
    const cacheMock = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: InMemoryQueue,
          useValue: queueMock,
        },
        {
          provide: InMemoryCache,
          useValue: cacheMock,
        },
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a news", async () => {
    const payload = { titulo: "Notícia 1", descricao: "Descrição" };

    const result = await service.create(payload);

    expect(result).toEqual(mockNoticia);
    expect(prismaMock.noticia.create).toHaveBeenCalledWith({ data: payload });
  });

  it("should add a job to queue after creating news", async () => {
    const queue = {
      add: jest.fn(),
    };

    const cacheMock = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const prismaMock = {
      noticia: {
        create: jest.fn().mockResolvedValue(mockNoticia),
      },
    };

    const service = new NewsService(prismaMock as any, queue as any, cacheMock as any);

    const payload = { titulo: "Nova notícia", descricao: "Desc" };

    const result = await service.create(payload);

    expect(result).toEqual(mockNoticia);
    expect(queue.add).toHaveBeenCalledWith({
      type: "NOTIFY_NEW_NEWS",
      payload: mockNoticia,
    });
  });

  it("should list all news (paginated)", async () => {
    const query = {
      page: 0,
      perPage: 10,
      sortKey: "id",
      sortDirection: "DESC",
      search: undefined,
    };

    const mockPaginated = {
      data: [mockNoticia],
      total: 1,
      page: 0,
      perPage: 10,
    };

    prismaMock.paginate.mockResolvedValue(mockPaginated);

    const result = await service.listAll(query as any);

    expect(result).toEqual(mockPaginated);
    expect(prismaMock.paginate).toHaveBeenCalled();
  });

  it("should list a news by id", async () => {
    const result = await service.listById(1);

    expect(result).toEqual(mockNoticia);
    expect(prismaMock.noticia.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("should update a news", async () => {
    const payload = { titulo: "Notícia Atualizada", descricao: "Descrição Atualizada" };

    const result = await service.update(1, payload);

    expect(prismaMock.noticia.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prismaMock.noticia.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: payload,
    });
    expect(result).toEqual(mockNoticia);
  });

  it("should throw error when updating non-existing news", async () => {
    prismaMock.noticia.findUnique.mockResolvedValueOnce(null);

    await expect(service.update(99, { titulo: "X", descricao: "Y" })).rejects.toThrow(
      BadRequestException,
    );

    expect(prismaMock.noticia.findUnique).toHaveBeenCalledWith({ where: { id: 99 } });
  });

  it("should delete a news", async () => {
    const result = await service.delete(1);

    expect(prismaMock.noticia.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prismaMock.noticia.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(mockNoticia);
  });

  it("should throw error when deleting non-existing news", async () => {
    prismaMock.noticia.findUnique.mockResolvedValueOnce(null);

    await expect(service.delete(99)).rejects.toThrow(BadRequestException);

    expect(prismaMock.noticia.findUnique).toHaveBeenCalledWith({ where: { id: 99 } });
  });
});
