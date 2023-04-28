import { SetMetadata } from "@nestjs/common";


export const Authorized = () => SetMetadata('isAuthRequired', true);