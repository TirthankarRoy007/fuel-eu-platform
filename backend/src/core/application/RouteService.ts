import { IRouteRepository } from '../ports/IRouteRepository';
import { Route } from '../domain/Route';

export class RouteService {
  constructor(private routeRepository: IRouteRepository) {}

  async getAllRoutes(): Promise<Route[]> {
    return this.routeRepository.findAll();
  }

  async setBaseline(id: string): Promise<void> {
    const route = await this.routeRepository.findById(id);
    if (!route) {
      throw new Error('Route not found');
    }
    await this.routeRepository.setBaseline(id);
  }

  async getComparison(): Promise<{ baseline: Route | null; others: Route[] }> {
    const routes = await this.routeRepository.findAll();
    const baseline = routes.find(r => r.isBaseline) || null;
    const others = routes.filter(r => !r.isBaseline);
    return { baseline, others };
  }
}
