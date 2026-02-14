import type { Route, CBRecord, Pool, BankingRecord } from '../domain/types';

export interface IApiPort {
  getRoutes(): Promise<Route[]>;
  setBaseline(id: string): Promise<void>;
  getComparison(): Promise<{ baseline: Route | null; others: Route[] }>;
  getAdjustedCompliance(shipId: string, year: number): Promise<CBRecord & { adjustedComplianceBalance: number }>;
  getBankingRecord(shipId: string, year: number): Promise<BankingRecord>;
  bankSurplus(shipId: string, year: number): Promise<BankingRecord>;
  applySurplus(shipId: string, year: number, amount: number): Promise<{
    cb_before: number;
    applied: number;
    cb_after: number;
    remaining_banked: number;
  }>;
  createPool(name: string, year: number, members: Array<{ shipId: string, cbBefore: number }>): Promise<Pool>;
  getPools(): Promise<Pool[]>;
}
