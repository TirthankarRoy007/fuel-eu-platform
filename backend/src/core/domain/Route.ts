export interface Route {
  id: string;
  name: string;
  isBaseline: boolean;
  fuelConsumptionTonnes: number;
  ghgIntensity: number;
  createdAt: Date;
  updatedAt: Date;
}
