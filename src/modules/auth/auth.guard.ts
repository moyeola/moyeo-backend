import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from './services/token.service';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { UserPermission } from 'src/entity';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private tokenService: TokenService) {}

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    private validateRequest(request: Request) {
        const JWTString = request.headers?.authorization?.split('Bearer ')[1];
        const res = this.tokenService.verifyAccessToken(JWTString);

        if (!res.isValid) {
            throw new UnauthorizedException({
                code: 'wrong_token',
            });
        }

        request.token = res.payload;
        return true;
    }
}

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private tokenService: TokenService,
        private reflector: Reflector,
    ) {}

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const roles =
            this.reflector.get<UserPermission[]>('roles', context.getClass()) ||
            this.reflector.get<UserPermission[]>('roles', context.getHandler());
        return this.validateRequest(roles, request);
    }

    private async validateRequest(roles: UserPermission[], request: Request) {
        const JWTString = request.headers?.authorization?.split('Bearer ')[1];
        const res = this.tokenService.verifyAccessToken(JWTString);

        if (!res.isValid) {
            throw new UnauthorizedException({
                code: 'wrong_token',
            });
        }

        request.token = res.payload;

        if (
            roles.every((role) =>
                (res.payload.permissions as UserPermission[]).includes(role),
            )
        ) {
            return true;
        } else {
            throw new ForbiddenException({
                code: 'permission_denied',
            });
        }
    }
}
