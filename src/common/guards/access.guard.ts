import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    const request = context.switchToHttp().getRequest();
    const {
        user,
    } = request;
    const {
        id
    } = request.params;
    if (user.id === +id) {
        return true;
    }
    return false;
  }
}
