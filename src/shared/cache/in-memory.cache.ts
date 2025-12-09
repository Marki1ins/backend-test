import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryCache {
  private store = new Map<string, any>();

  get<T>(key: string): T | undefined {
    return this.store.get(key);
  }

  set<T>(key: string, value: T): void {
    this.store.set(key, value);
  }

  del(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}
