import { registerAs } from '@nestjs/config';
import { SwaggerConfig } from './config.type';

export default registerAs<SwaggerConfig>('swagger', () => ({
  enabled: process.env.SWAGGER_ENABLED
    ? process.env.SWAGGER_ENABLED.toLowerCase() === 'true'
    : true,
  route: process.env.SWAGGER_ROUTE ?? '/swagger',
  username: process.env.SWAGGER_USERNAME,
  password: process.env.SWAGGER_PASSWORD,
  port: process.env.SWAGGER_PORT ? parseInt(process.env.SWAGGER_PORT) : 3000,
}));
