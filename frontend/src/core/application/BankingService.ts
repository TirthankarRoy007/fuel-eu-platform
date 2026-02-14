import type { IApiPort } from '../ports/IApiPort';
import type { CBRecord, BankingRecord } from '../domain/types';

export class BankingService {
  constructor(private apiPort: IApiPort) {}

  async getCompliance(shipId: string, year: number): Promise<CBRecord> {
    return this.apiPort.getCompliance(shipId, year);
  }

  async getBankingRecord(shipId: string, year: number): Promise<BankingRecord> {
    return this.apiPort.getBankingRecord(shipId, year);
  }

  async bankSurplus(shipId: string, year: number): Promise<BankingRecord> {
    return this.apiPort.bankSurplus(shipId, year);
  }

  async applySurplus(shipId: string, year: number, amount: number): Promise<{
    cb_before: number;
    applied: number;
    cb_after: number;
    remaining_banked: number;
  }> {
    return this.apiPort.applySurplus(shipId, year, amount);
  }
}
