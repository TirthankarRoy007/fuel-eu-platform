import type { IApiPort } from '../ports/IApiPort';
import type { Route } from '../domain/types';

export class RouteService {
  constructor(private apiPort: IApiPort) {}

  async fetchRoutes(): Promise<Route[]> {
    return this.apiPort.getRoutes();
  }

  async setBaseline(id: string): Promise<void> {
    return this.apiPort.setBaseline(id);
  }
}
