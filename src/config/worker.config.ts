import { registerAs } from '@nestjs/config';
import { WorkerConfig } from './config.type';

export default registerAs<WorkerConfig>('worker', () => ({
  host: process.env.WORKER_HOST ? process.env.WORKER_HOST : 'localhost',
  port: process.env.WORKER_PORT ? parseInt(process.env.WORKER_PORT) : 6379,
}));
