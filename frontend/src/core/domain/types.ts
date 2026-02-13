export interface Route {
  id: string;
  name: string;
  isBaseline: boolean;
  fuelConsumptionTonnes: number;
  ghgIntensity: number;
}

export interface CBRecord {
  shipId: string;
  year: number;
  totalComplianceBalance: number;
  details: Array<{
    routeId: string;
    routeName: string;
    cb: number;
  }>;
}

export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface Pool {
  id: string;
  name: string;
  year: number;
  totalCB: number;
  members: PoolMember[];
}

export interface BankingRecord {
  shipId: string;
  year: number;
  amount: number;
}
