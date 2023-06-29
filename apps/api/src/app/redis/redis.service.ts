import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get(key);
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    // from cache-manager v5 they use milliseconds instead of seconds
    this.cache.set(key, value, ttl * 1000);
  }

  async reset(): Promise<void> {
    this.cache.reset();
  }

  async del(key: string): Promise<void> {
    this.cache.del(key);
  }

  async getStore() {
    return this.cache.store;
  }
}
