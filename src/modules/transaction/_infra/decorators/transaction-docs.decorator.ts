import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { AddPointsResponse } from '../http/responses/AddPoints.response';

export function DocumentCreateTransaction() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new transaction' }),
    ApiResponse({
      status: 201,
      description: 'The reward has been successfully created',
      type: AddPointsResponse,
    }),
    ApiHeader({ name: 'x-tenant-id', required: true }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function DocumentGetAllTransactions() {
  return applyDecorators(
    ApiOperation({ summary: 'Yeah bitch, surprise' }),
    ApiResponse({
      status: 200,
    }),
  );
}

export function DocumentRedemptionTransaction() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a reward redemption transaction' }),
    ApiResponse({
      status: 200,
    }),
    ApiHeader({ name: 'x-tenant-id', required: true }),
    ApiResponse({ status: 400, description: 'Bad request' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
