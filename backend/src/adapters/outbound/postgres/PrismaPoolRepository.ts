import { PrismaClient } from '@prisma/client';
import { Pool } from '../../../core/domain/Pool';
import { IPoolRepository } from '../../../core/ports/IPoolRepository';

const prisma = new PrismaClient();

export class PrismaPoolRepository implements IPoolRepository {
  async create(name: string, year: number, members: Array<{ shipId: string, cbBefore: number, cbAfter: number }>): Promise<Pool> {
    const createdPool = await prisma.pool.create({
      data: {
        name,
        year,
        members: {
          create: members.map(m => ({
            shipId: m.shipId,
            cb_before: m.cbBefore,
            cb_after: m.cbAfter
          }))
        }
      },
      include: {
        members: true
      }
    });

    return {
      id: createdPool.id,
      name: createdPool.name,
      year: createdPool.year,
      totalCB: members.reduce((sum, m) => sum + m.cbBefore, 0),
      members: createdPool.members.map(m => ({
        id: m.id,
        shipId: m.shipId,
        cbBefore: m.cb_before,
        cbAfter: m.cb_after
      }))
    };
  }

  async findAll(): Promise<Pool[]> {
    const pools = await prisma.pool.findMany({
      include: { members: true }
    });

    return pools.map(p => ({
      id: p.id,
      name: p.name,
      year: p.year,
      totalCB: p.members.reduce((sum, m) => sum + m.cb_before, 0),
      members: p.members.map(m => ({
        id: m.id,
        shipId: m.shipId,
        cbBefore: m.cb_before,
        cbAfter: m.cb_after
      }))
    }));
  }
}
