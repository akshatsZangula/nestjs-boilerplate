import {
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  UseGuards,
} from '@nestjs/common';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { Queue } from 'bull';
import { NotificationConsumer } from './consumers/notificationConsumer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from 'src/database/typeorm-config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from 'src/config/database.config';
@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'notifications',
      },
      {
        name: 'notifications2',
      },
    ),
    ConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
  ],
  providers: [NotificationConsumer, ConfigService],
  exports: [BullModule],
})
export class WorkerModule implements NestModule {
  @Inject(getQueueToken('notifications'))
  private readonly queue: Queue;

  configure(consumer: MiddlewareConsumer) {
    const serverAdapter = new ExpressAdapter();
    const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard(
      { queues: [new BullAdapter(this.queue)], serverAdapter },
    );

    serverAdapter.setBasePath('/api/admin/queues');
    consumer.apply(serverAdapter.getRouter()).forRoutes('/admin/queues');
  }
}
