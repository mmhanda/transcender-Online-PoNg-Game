// redis.service.ts
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService { 
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: 'redis',
      port: 6379,
    });
  }

  async addJwtToBlacklist(key: string, value: string, expireIn: number): Promise<void> {
    await this.redisClient.set(key, value, 'EX', expireIn);
  }

  async isJwtBlacklisted(key: string): Promise<boolean> {
    const exists = await this.redisClient.exists(key);
    if (exists) return true;
  }
}
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjUsImlhdCI6MTcwMjEzNzE1MiwiZXhwIjoxNzAyMjIzNTUyfQ.ngT5Me2anIijOfmTt8hrPrhkZ3rCqs7A_eRGd5X-Ras