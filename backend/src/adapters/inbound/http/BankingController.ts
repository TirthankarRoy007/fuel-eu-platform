import { Request, Response, Router } from 'express';
import { BankingService } from '../../../core/application/BankingService';

export class BankingController {
  public router: Router;

  constructor(private bankingService: BankingService) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/records', this.getRecords.bind(this));
    this.router.post('/bank', this.bank.bind(this));
    this.router.post('/apply', this.apply.bind(this));
  }

  private async getRecords(req: Request, res: Response) {
    try {
      const shipId = req.query.shipId as string || 'SHIP001';
      const year = parseInt(req.query.year as string) || 2025;
      const result = await this.bankingService.getRecords(shipId, year);
      res.json(result || { message: 'No records found' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  private async bank(req: Request, res: Response) {
    try {
      const { shipId, year } = req.body;
      const result = await this.bankingService.bankSurplus(shipId || 'SHIP001', year || 2025);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  private async apply(req: Request, res: Response) {
    try {
      const { shipId, year, amount } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be positive' });
      }
      const result = await this.bankingService.applyBankedSurplus(shipId || 'SHIP001', year || 2025, amount);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
