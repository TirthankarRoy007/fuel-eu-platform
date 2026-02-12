import { IPoolRepository } from '../ports/IPoolRepository';
import { Pool } from '../domain/Pool';

export class PoolService {
  constructor(private poolRepository: IPoolRepository) {}

  async createPool(name: string, year: number, inputMembers: Array<{ shipId: string, cbBefore: number }>): Promise<Pool> {
    const totalCB = inputMembers.reduce((sum, m) => sum + m.cbBefore, 0);

    if (totalCB < 0) {
      throw new Error('Pool cannot be formed: Total Compliance Balance must be non-negative.');
    }

    // Deep copy to avoid mutating inputs
    const members = inputMembers.map(m => ({ ...m, cbAfter: m.cbBefore }));

    // Greedy Allocation
    // Sort: Deficits (negative) first (most negative to least), then Surpluses (least to most)
    // Actually, simpler: Surpluses (most positive to least) to give to Deficits (most negative to least)
    const surpluses = members.filter(m => m.cbBefore > 0).sort((a, b) => b.cbBefore - a.cbBefore);
    const deficits = members.filter(m => m.cbBefore < 0).sort((a, b) => a.cbBefore - b.cbBefore);

    for (const deficit of deficits) {
      let needed = Math.abs(deficit.cbAfter);

      for (const surplus of surpluses) {
        if (needed <= 0) break;
        if (surplus.cbAfter <= 0) continue;

        const take = Math.min(needed, surplus.cbAfter);
        surplus.cbAfter -= take;
        deficit.cbAfter += take;
        needed -= take;
      }
    }

    // Validation of Rules
    for (const m of members) {
      if (m.cbBefore < 0 && m.cbAfter < m.cbBefore) {
        throw new Error(`Deficit ship ${m.shipId} exited with a worse balance.`);
      }
      if (m.cbBefore > 0 && m.cbAfter < 0) {
        throw new Error(`Surplus ship ${m.shipId} exited with a negative balance.`);
      }
    }

    return this.poolRepository.create(name, year, members);
  }

  async getAllPools(): Promise<Pool[]> {
    return this.poolRepository.findAll();
  }
}
