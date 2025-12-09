import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../db/prisma.service";

import { NewsService } from "./news.service";

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
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
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

  it("should list all news", async () => {
    const result = await service.listAll();

    expect(result).toEqual([mockNoticia]);
    expect(prismaMock.noticia.findMany).toHaveBeenCalled();
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
