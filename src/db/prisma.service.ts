import { Injectable, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { PaginationOptions } from "./types";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async paginate<Modelname extends Prisma.ModelName>(dto: PaginationOptions<Modelname>) {
    const { page, perPage, modelName, where, orderBy, include, sortKey, distinct, sortDirection } =
      dto;

    const db = this[modelName as string];

    const skip = page * perPage;

    const [total, data] = await Promise.all([
      db.count({
        where,
      }),
      db.findMany({
        distinct,
        where,
        orderBy: orderBy || {
          [sortKey]: sortDirection.toLowerCase(),
        },
        skip,
        include,
        take: perPage,
      }),
    ]);

    return {
      data,
      total,
      page,
      perPage,
    };
  }
}