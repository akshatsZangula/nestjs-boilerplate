import { Inject, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BaseAdapter } from '@bull-board/api/dist/src/queueAdapters/base';
import { BullModule, getQueueToken } from '@nestjs/bull'
import { BullAdapter } from '@bull-board/api/bullAdapter'
import { Queue } from "bull";
import { NotificationConsumer } from "./consumers/notificationConsumer";

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'notifications',
        }),
    ],
    providers: [
        NotificationConsumer,
    ],
    exports: [
        BullModule
    ]
})

export class WorkerModule implements NestModule {
    @Inject(getQueueToken('notifications'))
    private readonly queue: Queue
  
    configure(consumer: MiddlewareConsumer) {
      const serverAdapter = new ExpressAdapter()
      const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard(
        { queues: [new BullAdapter(this.queue)], serverAdapter },
      )
      serverAdapter.setBasePath('/api/admin/queues')
      consumer.apply(serverAdapter.getRouter()).forRoutes('/admin/queues')
    }
}