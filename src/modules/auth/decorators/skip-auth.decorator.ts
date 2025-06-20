import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export const SKIP_AUTH_KEY = 'skipAuth';
const SkipAuthDecorator = SetMetadata(SKIP_AUTH_KEY, true);

export const SkipAuth = () => {
  return applyDecorators(SkipAuthDecorator, ApiOperation({ security: [] }));
};
