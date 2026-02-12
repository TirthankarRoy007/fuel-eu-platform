import express, { Request, Response } from 'express';
import cors from 'cors';
import { computeCB, TARGET_INTENSITY_2025 } from '../../core/domain/ComputeComplianceBalance';
import { PrismaRouteRepository } from '../../adapters/outbound/postgres/PrismaRouteRepository';
import { RouteService } from '../../core/application/RouteService';
import { RouteController } from '../../adapters/inbound/http/RouteController';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Dependency Injection
const routeRepository = new PrismaRouteRepository();
const routeService = new RouteService(routeRepository);
const routeController = new RouteController(routeService);

app.use('/routes', routeController.router);

app.post('/api/compliance/calculate', (req: Request, res: Response) => {
  const { actualIntensity, fuelConsumptionTonnes, targetIntensity } = req.body;

  if (actualIntensity === undefined || fuelConsumptionTonnes === undefined) {
    return res.status(400).json({ error: 'Missing required parameters: actualIntensity, fuelConsumptionTonnes' });
  }

  const target = targetIntensity || TARGET_INTENSITY_2025;
  const cb = computeCB(target, actualIntensity, fuelConsumptionTonnes);

  res.json({
    targetIntensity: target,
    actualIntensity,
    fuelConsumptionTonnes,
    complianceBalance: cb
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
