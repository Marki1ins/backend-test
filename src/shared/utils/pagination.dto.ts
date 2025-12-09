import { Transform, Type } from "class-transformer";
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";

export class PaginationDto {
  @Type(() => Number)
  @Min(0)
  page: number = 0;

  @Type(() => Number)
  @Min(1)
  perPage: number = 20;

  @IsOptional()
  @IsString()
  sortKey: string = "id";

  @IsEnum(["DESC", "ASC"])
  sortDirection: "DESC" | "ASC" = "DESC";

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === "" ? undefined : value))
  search?: string;
}
