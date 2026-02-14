import type { IApiPort } from '../ports/IApiPort';
import type { Pool } from '../domain/types';

export class PoolService {
  constructor(private apiPort: IApiPort) {}

  async getPools(): Promise<Pool[]> {
    return this.apiPort.getPools();
  }

  async createPool(name: string, year: number, members: Array<{ shipId: string, cbBefore: number }>): Promise<Pool> {
    return this.apiPort.createPool(name, year, members);
  }

  async getAdjustedCompliance(shipId: string, year: number): Promise<CBRecord & { adjustedComplianceBalance: number }> {
    return this.apiPort.getAdjustedCompliance(shipId, year);
  }
}
