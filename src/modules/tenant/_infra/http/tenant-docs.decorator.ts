import { applyDecorators } from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ApiDefaultPagination } from 'src/modules/@shared/decorators/api-default-pagination';
import { CreateTenantResponse } from './Responses/create-tenant.response';
import { PaginatedCustomerResponse } from 'src/modules/customer/_infra/http/responses/paginated-customer-response';
import { GetCustomerDetailResponse } from 'src/modules/customer/_infra/http/responses/get-customer-detail.response';
import { CustomerTransactionsResponse } from 'src/modules/customer/_infra/http/responses/customer-transactions-response';
import { GetCustomerBalanceStatsResponse } from 'src/modules/customer/_infra/http/responses/get-customer-balance-stats.response';
import { CustomerStatsResponse } from 'src/modules/customer/_infra/http/responses/customer-stats.response';

export function DocumentCreateTenant() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new tenant' }),
    ApiResponse({
      status: 201,
      description: 'The tenant has been successfully created',
      type: CreateTenantResponse,
    }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function DocumentUpdateTenantSettings() {
  return applyDecorators(
    ApiOperation({ summary: 'Get customers' }),
    ApiResponse({
      status: 200,
      description: 'The customer list has been successfully loaded',
      type: PaginatedCustomerResponse,
    }),
    ApiHeader({ name: 'x-tenant-id', required: true }),
    ApiDefaultPagination({ limitDefault: 5, hasSearch: true }),
  );
}

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
  );
}

export function DocumentGetCustomerTransactions() {
  return applyDecorators(
    ApiOperation({ summary: 'Get customer transactions' }),
    ApiResponse({
      status: 200,
      description: 'The customer transactions has been successfully loaded',
      type: CustomerTransactionsResponse,
    }),
    ApiHeader({ name: 'x-tenant-id', required: true }),
    ApiParam({
      name: 'customerId',
      description: 'UUID that identifies the customer',
      example: 'bb66747b-cbc0-42fe-94d1-48436b275356',
    }),
    ApiDefaultPagination({ limitDefault: 5, hasSearch: true }),
  );
}

export function DocumentGetCustomerBalanceStats() {
  return applyDecorators(
    ApiOperation({ summary: 'Get customer transaction details' }),
    ApiResponse({
      status: 200,
      description:
        'The transaction customer details  has been successfully loaded',
      type: GetCustomerBalanceStatsResponse,
    }),
    ApiHeader({ name: 'x-tenant-id', required: true }),
    ApiParam({
      name: 'customerId',
      description: 'UUID that identifies the customer',
      example: 'bb66747b-cbc0-42fe-94d1-48436b275356',
    }),
  );
}

export function DocumentGetCustomerStats() {
  return applyDecorators(
    ApiOperation({ summary: 'Get customer stats' }),
    ApiResponse({
      status: 200,
      description:
        'The transaction customer stats has been successfully loaded',
      type: CustomerStatsResponse,
    }),
    ApiHeader({ name: 'x-tenant-id', required: true }),
  );
}
