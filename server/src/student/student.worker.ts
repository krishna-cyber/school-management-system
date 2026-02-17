import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('importQueue', { concurrency: 5 })
export class StudentProcessor extends WorkerHost {
  async process(job: Job) {
    console.log(`Got a new job with id ${job.id} and data:`, job.data);
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log(`Finished processing job with id ${job.id}`);
  }
}
