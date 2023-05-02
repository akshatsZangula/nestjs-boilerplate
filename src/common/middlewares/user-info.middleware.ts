import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UsersService } from "src/users/users.service";

export class UserInfoMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UsersService) {}

    async use(req: Request, res: Response, next: (error?: NextFunction) => void) {
        if (res.locals.user) {
            const id = res.locals.user?.id;
            const userInfo = await this.usersService.findOne({
                id: +id,
            });
            Object.assign(res.locals.user, userInfo);
        }   
        next();
    }
}