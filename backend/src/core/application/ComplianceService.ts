import { IRouteRepository } from '../ports/IRouteRepository';
import { computeCB, TARGET_INTENSITY_2025 } from '../domain/ComputeComplianceBalance';

export class ComplianceService {
  constructor(private routeRepository: IRouteRepository) {}

  async calculateCB(shipId: string, year: number) {
    // For this implementation, we assume shipId correlates to routes 
    // or we just fetch all routes for simplicity as requested.
    const routes = await this.routeRepository.findAll();
    
    let totalCB = 0;
    const details = routes.map(route => {
      const cb = computeCB(TARGET_INTENSITY_2025, route.ghgIntensity, route.fuelConsumptionTonnes);
      totalCB += cb;
      return {
        routeId: route.id,
        routeName: route.name,
        cb
      };
    });

    return {
      shipId,
      year,
      totalComplianceBalance: totalCB,
      details
    };
  }

  async calculateAdjustedCB(shipId: string, year: number) {
    const result = await this.calculateCB(shipId, year);
    // Adjusted CB logic could involve pool contributions, etc.
    // For now, we'll implement a simple placeholder logic.
    return {
      ...result,
      adjustedComplianceBalance: result.totalComplianceBalance * 0.95 // Example adjustment
    };
  }
}
