import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { DevAuthService } from './dev.auth.service';

@Injectable()
export class DevOnlyGuard implements CanActivate {
    constructor(private devAuthService: DevAuthService) {}

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    private validateRequest(request: Request) {
        const JWTString = request.headers?.authorization?.split('Bearer ')[1];
        const res = this.devAuthService.verifyDevToken(JWTString);

        if (!res.isValid) {
            throw new ForbiddenException({
                code: 'wrong_token',
            });
        }

        request.token = res.payload;
        return true;
    }
}
