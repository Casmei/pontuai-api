import { applyDecorators } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'

type PaginationQueryOptions = {
  pageDefault?: number
  limitDefault?: number
  hasSearch?: boolean
}

export function ApiDefaultPagination(options: PaginationQueryOptions = {}) {
  const { pageDefault = 1, limitDefault = 10, hasSearch = false } = options

  const decorators = [
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: pageDefault,
      description: 'Page number',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      example: limitDefault,
      description: 'Items per page',
    }),
  ]

  if (hasSearch) {
    decorators.push(
      ApiQuery({
        name: 'search',
        required: false,
        type: String,
        example: 'example search',
        description: 'Text to filter by search',
      }),
    )
  }

  return applyDecorators(...decorators)
}
