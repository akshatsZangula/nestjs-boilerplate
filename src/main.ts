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
import * as passport from 'passport';
import { BasicStrategy } from 'passport-http';

async function bootstrap() {
  const appSettings = {
    cors: true,
  };

  // set logger levels by environment
  if (process.env.LOG_LEVELS !== undefined) {
    Object.assign(appSettings, { logger: process.env.LOG_LEVELS.split('::') });
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

  // protect [bull, swagger] dashboards
  passport.use(
    new BasicStrategy((username, password, done) => {
      if (
        configService.get('dashboard.username', { infer: true }) ===
          undefined ||
        configService.get('dashboard.username', { infer: true }) == undefined
      ) {
        done(null, true);
        return;
      } else {
        console.log(
          configService.get('dashboard.username', { infer: true }),
          configService.get('dashboard.password', { infer: true }),
        );
        if (
          username ===
            configService.get('dashboard.username', { infer: true }) &&
          password === configService.get('dashboard.password', { infer: true })
        ) {
          done(null, true);
        } else {
          done(null, false);
        }
      }
    }),
  );

  app.use(
    ['/api/admin/queues', '/swagger', '/docs'],
    passport.authenticate('basic', {
      session: false,
    }),
  );

  //  api version must picks from package json
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
