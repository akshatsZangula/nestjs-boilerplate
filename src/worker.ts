import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WorkerModule } from './common/workers/worker.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(WorkerModule);
  process.env.WORKER_HTTP_PORT = process.env.WORKER_HTTP_PORT ?? '4001';
  await app.listen(process.env.WORKER_HTTP_PORT);
  console.debug(`Worker is running on ${await app.getUrl()}`);
}
void bootstrap();
