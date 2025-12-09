export type QueueJob = {
  type: string;
  payload: any;
};

export class InMemoryQueue {
  private queue: QueueJob[] = [];

  add(job: QueueJob) {
    this.queue.push(job);
    this.process(job);
  }

  private process(job: QueueJob) {
    setTimeout(() => {
      console.log("📢 Job processado:", job);
    }, 0);
  }

  getJobs() {
    return this.queue;
  }

  clear() {
    this.queue = [];
  }
}
