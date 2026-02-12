import { IBankingRepository } from '../ports/IBankingRepository';
import { ComplianceService } from './ComplianceService';

export class BankingService {
  constructor(
    private bankingRepository: IBankingRepository,
    private complianceService: ComplianceService
  ) {}

  async getRecords(shipId: string, year: number) {
    return this.bankingRepository.findByShipAndYear(shipId, year);
  }

  async bankSurplus(shipId: string, year: number) {
    const compliance = await this.complianceService.calculateCB(shipId, year);
    
    if (compliance.totalComplianceBalance <= 0) {
      throw new Error('No surplus available to bank. Compliance Balance must be positive.');
    }

    // In a real app, we'd mark the CB as 'banked' so it's not used twice.
    return this.bankingRepository.upsert(shipId, year, compliance.totalComplianceBalance);
  }

  async applyBankedSurplus(shipId: string, year: number, amount: number) {
    const record = await this.bankingRepository.findByShipAndYear(shipId, year);
    
    if (!record || record.amount < amount) {
      throw new Error(`Insufficient banked surplus. Available: ${record?.amount || 0}`);
    }

    const complianceBefore = await this.complianceService.calculateCB(shipId, year);
    
    // Logic: reducing the banked amount and returning the effect
    const updatedRecord = await this.bankingRepository.upsert(shipId, year, record.amount - amount);

    return {
      cb_before: complianceBefore.totalComplianceBalance,
      applied: amount,
      cb_after: complianceBefore.totalComplianceBalance + amount, // Applying surplus improves balance
      remaining_banked: updatedRecord.amount
    };
  }
}
