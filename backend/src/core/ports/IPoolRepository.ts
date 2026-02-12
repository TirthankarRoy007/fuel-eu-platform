import { Pool, PoolMember } from '../domain/Pool';

export interface IPoolRepository {
  create(name: string, year: number, members: Array<{ shipId: string, cbBefore: number, cbAfter: number }>): Promise<Pool>;
  findAll(): Promise<Pool[]>;
}
