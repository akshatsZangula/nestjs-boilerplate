import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector, 
        private jwtService: JwtService, 
        private configService: ConfigService,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const isAuthRequired = this.reflector.getAllAndOverride<boolean>('isAuthRequired', [
            context.getClass(),
            context.getHandler(),
        ]);
        const request = context.switchToHttp().getRequest();

        
        if (isAuthRequired === undefined || (isAuthRequired !== undefined && !isAuthRequired)) {
            return true;
        }

        const jwtToken = this.extractJWTFromHeaders(request.headers);
        try {
            const payload = this.jwtService.verify(
                jwtToken,
                {
                    secret: this.configService.get('auth.secret')
                },
            );
            request.user = payload;
            return true;
        } catch (e) {
            throw new UnauthorizedException();
        }
    }

    extractJWTFromHeaders(requestHeaders): string {
        const {
            authorization: authKey,
        } = requestHeaders;
        console.log(requestHeaders)
        if (authKey && authKey.startsWith("Bearer")) {
            return authKey.split(' ')[1];
        }
        throw new UnauthorizedException();
    }
}
