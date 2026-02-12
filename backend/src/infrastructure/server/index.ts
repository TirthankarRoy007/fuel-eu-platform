import express, { Request, Response } from 'express';
import cors from 'cors';
import { computeCB, TARGET_INTENSITY_2025 } from '../../core/domain/ComputeComplianceBalance';
import { PrismaRouteRepository } from '../../adapters/outbound/postgres/PrismaRouteRepository';
import { RouteService } from '../../core/application/RouteService';
import { RouteController } from '../../adapters/inbound/http/RouteController';
import { ComplianceService } from '../../core/application/ComplianceService';
import { ComplianceController } from '../../adapters/inbound/http/ComplianceController';
import { PrismaBankingRepository } from '../../adapters/outbound/postgres/PrismaBankingRepository';
import { BankingService } from '../../core/application/BankingService';
import { BankingController } from '../../adapters/inbound/http/BankingController';
import { PrismaPoolRepository } from '../../adapters/outbound/postgres/PrismaPoolRepository';
import { PoolService } from '../../core/application/PoolService';
import { PoolController } from '../../adapters/inbound/http/PoolController';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[LOG]: ${req.method} ${req.url}`);
  next();
});

// Dependency Injection
const routeRepository = new PrismaRouteRepository();
const routeService = new RouteService(routeRepository);
const routeController = new RouteController(routeService);

const complianceService = new ComplianceService(routeRepository);
const complianceController = new ComplianceController(complianceService);

const bankingRepository = new PrismaBankingRepository();
const bankingService = new BankingService(bankingRepository, complianceService);
const bankingController = new BankingController(bankingService);

const poolRepository = new PrismaPoolRepository();
const poolService = new PoolService(poolRepository);
const poolController = new PoolController(poolService);

app.get('/', (req, res) => {
  res.send('Fuel-EU Platform API is running');
});

app.use('/api/routes', routeController.router);
app.use('/api/compliance', complianceController.router);
app.use('/api/banking', bankingController.router);
app.use('/api/pools', poolController.router);

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

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

server.on('error', (e: any) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`[ERROR]: Port ${port} is already in use!`);
  } else {
    console.error(e);
  }
});
