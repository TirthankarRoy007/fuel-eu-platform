import { Route } from '../domain/Route';

export interface IRouteRepository {
  findAll(): Promise<Route[]>;
  findById(id: string): Promise<Route | null>;
  setBaseline(id: string): Promise<void>;
  getBaseline(): Promise<Route | null>;
}
