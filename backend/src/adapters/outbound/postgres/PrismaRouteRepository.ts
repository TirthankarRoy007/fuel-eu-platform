import { PrismaClient } from '@prisma/client';
import { Route } from '../../../core/domain/Route';
import { IRouteRepository } from '../../../core/ports/IRouteRepository';

const prisma = new PrismaClient();

export class PrismaRouteRepository implements IRouteRepository {
  async findAll(): Promise<Route[]> {
    const routes = await prisma.route.findMany();
    return routes.map(r => ({
      id: r.id,
      name: r.name,
      isBaseline: r.is_baseline,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }

  async findById(id: string): Promise<Route | null> {
    const r = await prisma.route.findUnique({ where: { id } });
    if (!r) return null;
    return {
      id: r.id,
      name: r.name,
      isBaseline: r.is_baseline,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  }

  async setBaseline(id: string): Promise<void> {
    await prisma.$transaction([
      prisma.route.updateMany({
        where: { is_baseline: true },
        data: { is_baseline: false },
      }),
      prisma.route.update({
        where: { id },
        data: { is_baseline: true },
      }),
    ]);
  }

  async getBaseline(): Promise<Route | null> {
    const r = await prisma.route.findFirst({ where: { is_baseline: true } });
    if (!r) return null;
    return {
      id: r.id,
      name: r.name,
      isBaseline: r.is_baseline,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  }
}
