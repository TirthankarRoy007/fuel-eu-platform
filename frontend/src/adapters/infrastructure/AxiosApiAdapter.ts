import axios from 'axios';
import { IApiPort } from '../../core/ports/IApiPort';
import { Route, CBRecord, Pool, BankingRecord } from '../../core/domain/types';

const API_BASE_URL = 'http://localhost:3001/api';

export class AxiosApiAdapter implements IApiPort {
  async getRoutes(): Promise<Route[]> {
    const response = await axios.get(`${API_BASE_URL}/routes`);
    return response.data;
  }

  async setBaseline(id: string): Promise<void> {
    await axios.post(`${API_BASE_URL}/routes/${id}/baseline`);
  }

  async getComparison(): Promise<{ baseline: Route | null; others: Route[] }> {
    const response = await axios.get(`${API_BASE_URL}/routes/comparison`);
    return response.data;
  }

  async getCompliance(shipId: string, year: number): Promise<CBRecord> {
    const response = await axios.get(`${API_BASE_URL}/compliance/cb`, {
      params: { shipId, year }
    });
    return response.data;
  }

  async bankSurplus(shipId: string, year: number): Promise<BankingRecord> {
    const response = await axios.post(`${API_BASE_URL}/banking/bank`, { shipId, year });
    return response.data;
  }

  async applySurplus(shipId: string, year: number, amount: number): Promise<any> {
    const response = await axios.post(`${API_BASE_URL}/banking/apply`, { shipId, year, amount });
    return response.data;
  }

  async createPool(name: string, year: number, members: Array<{ shipId: string, cbBefore: number }>): Promise<Pool> {
    const response = await axios.post(`${API_BASE_URL}/pools`, { name, year, members });
    return response.data;
  }

  async getPools(): Promise<Pool[]> {
    const response = await axios.get(`${API_BASE_URL}/pools`);
    return response.data;
  }
}
