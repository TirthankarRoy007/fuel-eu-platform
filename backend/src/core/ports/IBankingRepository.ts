import { BankingRecord } from '../domain/BankingRecord';

export interface IBankingRepository {
  findByShipAndYear(shipId: string, year: number): Promise<BankingRecord | null>;
  upsert(shipId: string, year: number, amount: number): Promise<BankingRecord>;
  createEntry(shipId: string, year: number, amount: number): Promise<BankingRecord>;
}
