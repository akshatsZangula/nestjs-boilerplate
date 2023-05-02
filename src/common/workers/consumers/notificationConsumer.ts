import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
@Processor('notifications')
export class NotificationConsumer {
  private readonly logger = new Logger('NotificationConsumer');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Process()
  async sendNotification(job: Job<unknown>) {
    let progress = 0;
    for (let i = 0; i < 100; i++) {
      const user = await this.userRepository.findOne({
        where: {
          id: 1,
        },
      });
      this.logger.log(`sending notification to ${JSON.stringify(user)}`);
      progress += 1;
      await job.progress(progress);
    }
    return {};
  }
}