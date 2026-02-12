export interface PoolMember {
  id: string;
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface Pool {
  id: string;
  name: string;
  year: number;
  members: PoolMember[];
  totalCB: number;
}
