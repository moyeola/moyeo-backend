import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { UserPermission } from 'src/entity';
import { RoleGuard } from './auth.guard';

export const Auth = (...roles: UserPermission[]) => {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(RoleGuard));
};
