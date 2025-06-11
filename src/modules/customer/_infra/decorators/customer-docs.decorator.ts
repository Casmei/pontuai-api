import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiHeader, ApiParam } from '@nestjs/swagger'
import { GetCustomerDetailResponse } from '../http/responses/get-customer-detail.response'
import { GetCustomerTransactionDetailResponse } from '../http/responses/get-customer-transaction-detail.response'
import { PaginatedCustomerResponse } from '../http/responses/paginated-customer-response'
import { CreateCustomerResponse } from '../http/responses/creste-customer.response'
import { ApiDefaultPagination } from 'src/modules/@shared/decorators/api-default-pagination'

export function DocumentGetCustomerDetail() {
  return applyDecorators(
    ApiOperation({ summary: 'Get unique customer' }),
    ApiResponse({
      status: 200,
      description: 'The customer has been successfully loaded',
      type: GetCustomerDetailResponse,
    }),
    ApiHeader({ name: 'x-tenant-id', required: true }),
    ApiParam({
      name: 'customerId',
      description: 'UUID that identifies the customer',
      example: 'bb66747b-cbc0-42fe-94d1-48436b275356',
    }),
  )
}

export function DocumentGetCustomerTransactionsDetail() {
  return applyDecorators(
    ApiOperation({ summary: 'Get customer transaction details' }),
    ApiResponse({
      status: 200,
      description:
        'The transaction customer details  has been successfully loaded',
      type: GetCustomerTransactionDetailResponse,
    }),
    ApiHeader({ name: 'x-tenant-id', required: true }),
    ApiParam({
      name: 'customerId',
      description: 'UUID that identifies the customer',
      example: 'bb66747b-cbc0-42fe-94d1-48436b275356',
    }),
    ApiDefaultPagination({ limitDefault: 5 }),
  )
}

export function DocumentGetCustomers() {
  return applyDecorators(
    ApiOperation({ summary: 'Get customers' }),
    ApiResponse({
      status: 200,
      description: 'The customer list has been successfully loaded',
      type: PaginatedCustomerResponse,
    }),
    ApiHeader({ name: 'x-tenant-id', required: true }),
    ApiDefaultPagination({ limitDefault: 5, hasSearch: true }),
  )
}

export function DocumentCreateCustomer() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new customer' }),
    ApiResponse({
      status: 201,
      description: 'The customer has been successfully created',
      type: CreateCustomerResponse,
    }),
    ApiHeader({ name: 'x-tenant-id', required: true }),
  )
}
