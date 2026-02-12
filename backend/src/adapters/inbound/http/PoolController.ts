import { Request, Response, Router } from 'express';
import { PoolService } from '../../../core/application/PoolService';

export class PoolController {
  public router: Router;

  constructor(private poolService: PoolService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.getPools.bind(this));
    this.router.post('/', this.createPool.bind(this));
  }

  private async getPools(req: Request, res: Response) {
    try {
      const pools = await this.poolService.getAllPools();
      res.json(pools);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  private async createPool(req: Request, res: Response) {
    try {
      const { name, year, members } = req.body;
      if (!name || !year || !members || !Array.isArray(members)) {
        return res.status(400).json({ error: 'Invalid input: name, year, and members array are required.' });
      }
      const pool = await this.poolService.createPool(name, year, members);
      res.status(201).json(pool);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
