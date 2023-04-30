import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';


@Injectable()
@Processor('notifications')
export class NotificationConsumer {

    @Process()
    async sendNotification(job: Job<unknown> ) {
        let progress = 0;
        for (let i=0; i < 100; i++) {
            console.log(`sent notification to ${i}th friend`);
            progress +=1;
            await job.progress(progress);
        }
        return {}
    }
}