import { Request, Response, Router } from 'express';
import { RouteService } from '../../../core/application/RouteService';

export class RouteController {
  public router: Router;

  constructor(private routeService: RouteService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.getRoutes.bind(this));
    this.router.post('/:id/baseline', this.setBaseline.bind(this));
    this.router.get('/comparison', this.getComparison.bind(this));
  }

  private async getRoutes(req: Request, res: Response) {
    try {
      const routes = await this.routeService.getAllRoutes();
      res.json(routes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  private async setBaseline(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Route ID must be a string' });
      }
      await this.routeService.setBaseline(id);
      res.json({ message: `Route ${id} set as baseline` });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  private async getComparison(req: Request, res: Response) {
    try {
      const comparison = await this.routeService.getComparison();
      res.json(comparison);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
