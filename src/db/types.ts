import { Prisma } from "@prisma/client";

export type ModelNames = (typeof Prisma.ModelName)[keyof typeof Prisma.ModelName];

type PrismaOperations<ModelName extends ModelNames> =
  Prisma.TypeMap["model"][ModelName]["operations"];

type PrismaFindManyArgs<ModelName extends ModelNames> =
  PrismaOperations<ModelName>["findMany"]["args"];

type PrismaSortKey<ModelName extends ModelNames> =
  PrismaFindManyArgs<ModelName>["orderBy"] extends { [key: string]: any }
    ? keyof PrismaFindManyArgs<ModelName>["orderBy"]
    : never;

export type PaginationOptions<ModelName extends ModelNames> = {
  modelName: ModelName;
  distinct?: PrismaFindManyArgs<ModelName>["distinct"];
  where?: PrismaFindManyArgs<ModelName>["where"];
  orderBy?: PrismaFindManyArgs<ModelName>["orderBy"];
  select?: PrismaFindManyArgs<ModelName>["select"];
  include?: "include" extends keyof PrismaFindManyArgs<ModelName>
    ? PrismaFindManyArgs<ModelName>["include"]
    : never;
  page: number;
  perPage: number;
  sortDirection: "DESC" | "ASC";
  sortKey: PrismaSortKey<ModelName> | string;
};