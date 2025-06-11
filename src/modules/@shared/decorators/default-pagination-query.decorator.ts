import { Query } from '@nestjs/common'
import { DefaultPaginationPipe } from '../pipes/default-pagination.pipe'

type Options = {
  pageDefault?: number
  limitDefault?: number
  hasSearch?: boolean
}

export function DefaultPaginationQuery(options: Options = {}) {
  const { pageDefault = 1, limitDefault = 10, hasSearch = false } = options

  return Query(new DefaultPaginationPipe(pageDefault, limitDefault, hasSearch))
}
