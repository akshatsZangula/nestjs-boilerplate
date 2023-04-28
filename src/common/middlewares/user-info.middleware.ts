import { Inject, NestMiddleware } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from '../../users/entities/user.entity';
import { UsersService } from "src/users/users.service";

export class UserInfoMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UsersService) {}

    async use(req: Request, res: Response, next: (error?: NextFunction) => void) {
        if (req.user) {
            const { id } = req.user;
            const userInfo = await this.usersService.findOne({
                id: +id,
            });
            Object.assign(req.user, userInfo);
        }   
        next();
    }
}