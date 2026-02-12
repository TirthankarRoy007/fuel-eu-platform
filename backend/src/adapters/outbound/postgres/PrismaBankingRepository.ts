import { PrismaClient } from '@prisma/client';
import { BankingRecord } from '../../../core/domain/BankingRecord';
import { IBankingRepository } from '../../../core/ports/IBankingRepository';

const prisma = new PrismaClient();

export class PrismaBankingRepository implements IBankingRepository {
  async findByShipAndYear(shipId: string, year: number): Promise<BankingRecord | null> {
    const record = await prisma.bankingRecord.findUnique({
      where: { shipId_year: { shipId, year } }
    });
    return record;
  }

  async upsert(shipId: string, year: number, amount: number): Promise<BankingRecord> {
    return prisma.bankingRecord.upsert({
      where: { shipId_year: { shipId, year } },
      update: { amount },
      create: { shipId, year, amount }
    });
  }

  async createEntry(shipId: string, year: number, amount: number): Promise<BankingRecord> {
    return prisma.bankingRecord.create({
      data: { shipId, year, amount }
    });
  }
}
