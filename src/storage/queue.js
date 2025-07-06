export default class SaveQueue {
  constructor(storage, batchSize = 300) {
    this.storage = storage;
    this.batchSize = batchSize;
    this.queue = [];
    this.processing = false;
    this.savedCount = 0;
  }

  setBatchSize(newSize) {
    this.batchSize = newSize;
  }

  async add(item) {
    this.queue.push(item);

    if (this.queue.length >= this.batchSize) {
      await this.process();
    }
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;
    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.batchSize);
      try {
        // eslint-disable-next-line no-await-in-loop
        await this.storage.createMany(batch);
        this.savedCount += batch.length;
      } catch (error) {
        console.error('Error saving batch:', error);
        this.queue.unshift(...batch);
        break;
      }
    }
    this.processing = false;
  }

  async flush() {
    await this.process();
  }

  get count() {
    return this.savedCount;
  }
}
