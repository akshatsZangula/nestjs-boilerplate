import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import validationOptions from './utils/validation-options';
import { AllConfigType } from './config/config.type';

async function bootstrap() {
  const appSettings = {
    cors: true,
  };

  // set logger levels by environment
  if (process.env.LOG_LEVELS !== undefined) {
    Object.assign(appSettings, {logger: process.env.LOG_LEVELS.split('::')});
  }

  const app = await NestFactory.create(AppModule, appSettings);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  if (configService.get('swagger.enabled', { infer: true })) {
    const swaggerDocsRoute = configService.get('swagger.route', {
      infer: true,
    });
    const options = new DocumentBuilder()
      .setTitle('API')
      .setDescription('API docs')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(swaggerDocsRoute ?? 'docs', app, document);
  }

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}
void bootstrap();
