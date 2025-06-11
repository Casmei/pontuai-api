import { Injectable, PipeTransform } from '@nestjs/common'
import { PaginationQueryDto } from '../dto/pagination-query.dto'

@Injectable()
export class DefaultPaginationPipe implements PipeTransform {
  constructor(
    private defaultPage = 1,
    private defaultLimit = 10,
    private hasSearch = false,
  ) {}

  transform(value: PaginationQueryDto): PaginationQueryDto {
    const result: PaginationQueryDto = {
      page: value.page ?? this.defaultPage,
      limit: value.limit ?? this.defaultLimit,
    }

    if (this.hasSearch && typeof value.search === 'string') {
      result.search = value.search
    }

    return result
  }
}
