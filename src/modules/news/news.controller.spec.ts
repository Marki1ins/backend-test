import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";

import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";

describe("NewsController", () => {
  let app: INestApplication;
  let newsService: NewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [
        {
          provide: NewsService,
          useValue: {
            create: jest
              .fn()
              .mockResolvedValue({ id: 1, titulo: "Notícia", descricao: "Descrição" }),
            listAll: jest.fn().mockResolvedValue([
              { id: 1, titulo: "Notícia 1", descricao: "Descrição 1" },
              { id: 2, titulo: "Notícia 2", descricao: "Descrição 2" },
            ]),
            listById: jest
              .fn()
              .mockResolvedValue({ id: 1, titulo: "Notícia", descricao: "Descrição" }),
            update: jest.fn().mockResolvedValue({
              id: 1,
              titulo: "Notícia Atualizada",
              descricao: "Descrição Atualizada",
            }),
            delete: jest.fn().mockResolvedValue({ id: 1 }),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    newsService = module.get<NewsService>(NewsService);
  });

  afterEach(async () => {
    await app.close();
  });

  it("should be defined", () => {
    expect(app).toBeDefined();
  });

  describe("POST /noticia", () => {
    it("should create a news", async () => {
      const newNews = { titulo: "Notícia", descricao: "Descrição" };
      return request(app.getHttpServer())
        .post("/noticia")
        .send(newNews)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual({
            id: 1,
            titulo: "Notícia",
            descricao: "Descrição",
          });
        });
    });
  });

  describe("GET /noticia", () => {
    it("should return a list of news", async () => {
      return request(app.getHttpServer())
        .get("/noticia")
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual([
            { id: 1, titulo: "Notícia 1", descricao: "Descrição 1" },
            { id: 2, titulo: "Notícia 2", descricao: "Descrição 2" },
          ]);
        });
    });
  });

  describe("GET /noticia/:id", () => {
    it("should return a single news by ID", async () => {
      return request(app.getHttpServer())
        .get("/noticia/1")
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({
            id: 1,
            titulo: "Notícia",
            descricao: "Descrição",
          });
        });
    });
  });

  describe("PUT /noticia/:id", () => {
    it("should update a news by ID", async () => {
      const updatedNews = { titulo: "Notícia Atualizada", descricao: "Descrição Atualizada" };
      return request(app.getHttpServer())
        .put("/noticia/1")
        .send(updatedNews)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({
            id: 1,
            titulo: "Notícia Atualizada",
            descricao: "Descrição Atualizada",
          });
        });
    });
  });

  describe("DELETE /noticia/:id", () => {
    it("should delete a news by ID", async () => {
      return request(app.getHttpServer())
        .delete("/noticia/1")
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ id: 1 });
        });
    });
  });
});