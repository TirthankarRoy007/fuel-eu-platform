import { Request, Response, Router } from 'express';
import { ComplianceService } from '../../../core/application/ComplianceService';

export class ComplianceController {
  public router: Router;

  constructor(private complianceService: ComplianceService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/cb', this.getCB.bind(this));
    this.router.get('/adjusted-cb', this.getAdjustedCB.bind(this));
  }

  private async getCB(req: Request, res: Response) {
    try {
      const shipId = req.query.shipId as string || 'SHIP001';
      const year = parseInt(req.query.year as string) || 2025;
      const result = await this.complianceService.calculateCB(shipId, year);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  private async getAdjustedCB(req: Request, res: Response) {
    try {
      const shipId = req.query.shipId as string || 'SHIP001';
      const year = parseInt(req.query.year as string) || 2025;
      const result = await this.complianceService.calculateAdjustedCB(shipId, year);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
