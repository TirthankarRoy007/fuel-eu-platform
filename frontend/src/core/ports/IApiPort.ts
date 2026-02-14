import type { Route, CBRecord, Pool, BankingRecord } from '../domain/types';

export interface IApiPort {
  getRoutes(): Promise<Route[]>;
  setBaseline(id: string): Promise<void>;
  getComparison(): Promise<{ baseline: Route | null; others: Route[] }>;
  getCompliance(shipId: string, year: number): Promise<CBRecord>;
  getBankingRecord(shipId: string, year: number): Promise<BankingRecord>;
  bankSurplus(shipId: string, year: number): Promise<BankingRecord>;
  applySurplus(shipId: string, year: number, amount: number): Promise<any>;
  createPool(name: string, year: number, members: Array<{ shipId: string, cbBefore: number }>): Promise<Pool>;
  getPools(): Promise<Pool[]>;
}
