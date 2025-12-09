import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PaginationDto } from '../../shared/utils/pagination.dto';
import { CreateOrUpdateNewsDto } from './news.dto';
import { NewsService } from './news.service';

@ApiTags("noticia")
@Controller("noticia")
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @ApiOperation({ summary: "Criar uma notícia" })
  @ApiBody({ type: CreateOrUpdateNewsDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateOrUpdateNewsDto })
  @Post("/")
  async create(@Body() payload: CreateOrUpdateNewsDto) {
    return await this.newsService.create(payload);
  }

  @ApiOperation({ summary: "Listar todas as notícias" })
  @ApiResponse({ status: HttpStatus.OK, type: [CreateOrUpdateNewsDto] })
  @Get("/")
  async listAll(@Query() query: PaginationDto) {
    return await this.newsService.listAll(query);
  }

  @ApiOperation({ summary: "Listar uma noticia" })
  @ApiParam({
    name: "id",
    type: "string",
    description: "ID da notícia",
    example: "1",
    required: true,
  })
  @ApiResponse({ status: HttpStatus.OK, type: CreateOrUpdateNewsDto })
  @Get("/:id")
  async listById(@Param("id") id: string) {
    return await this.newsService.listById(Number(id));
  }

  @ApiOperation({ summary: "Atualizar uma noticia" })
  @ApiParam({
    name: "id",
    type: "string",
    description: "ID da noticia",
    example: "1",
    required: true,
  })
  @ApiBody({ type: CreateOrUpdateNewsDto })
  @ApiResponse({ status: HttpStatus.OK, type: CreateOrUpdateNewsDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Noticia nao encontrada" })
  @Put("/:id")
  async update(@Param("id") id: string, @Body() payload: CreateOrUpdateNewsDto) {
    return await this.newsService.update(Number(id), payload);
  }

  @ApiOperation({ summary: "Deletar uma noticia" })
  @ApiParam({
    name: "id",
    type: "string",
    description: "ID da noticia",
    example: "1",
    required: true,
  })
  @ApiResponse({ status: HttpStatus.OK, type: CreateOrUpdateNewsDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Noticia nao encontrada" })
  @Delete("/:id")
  async delete(@Param("id") id: string) {
    return await this.newsService.delete(Number(id));
  }
}