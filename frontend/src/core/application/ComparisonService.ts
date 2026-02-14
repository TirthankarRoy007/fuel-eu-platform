import type { IApiPort } from '../ports/IApiPort';
import type { Route } from '../domain/types';

export class ComparisonService {
  constructor(private apiPort: IApiPort) {}

  async getComparison(): Promise<{ baseline: Route | null; others: Route[] }> {
    return this.apiPort.getComparison();
  }
}
