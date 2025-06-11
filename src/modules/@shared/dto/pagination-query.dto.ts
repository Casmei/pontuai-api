import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class PaginationQueryDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number

  @IsOptional()
  @IsString()
  search?: string
}
