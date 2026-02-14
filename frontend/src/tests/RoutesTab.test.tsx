import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RoutesTab from '../adapters/ui/components/RoutesTab';


// Mock the RouteService
vi.mock('../core/application/RouteService', () => {
  return {
    RouteService: vi.fn().mockImplementation(() => {
      return {
        fetchRoutes: vi.fn().mockResolvedValue([
          { id: '1', name: 'Test Route 1', fuelConsumptionTonnes: 100, ghgIntensity: 50, isBaseline: true },
          { id: '2', name: 'Test Route 2', fuelConsumptionTonnes: 200, ghgIntensity: 90, isBaseline: false },
        ]),
        setBaseline: vi.fn().mockResolvedValue(undefined),
      };
    }),
  };
});

// Mock AxiosApiAdapter as well since it's instantiated
vi.mock('../adapters/infrastructure/AxiosApiAdapter', () => {
  return {
    AxiosApiAdapter: vi.fn(),
  };
});

describe('RoutesTab', () => {
  it('renders route data correctly', async () => {
    render(<RoutesTab />);
    
    expect(screen.getByText(/Loading routes.../i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Test Route 1')).toBeInTheDocument();
      expect(screen.getByText('Test Route 2')).toBeInTheDocument();
    });
    
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('Baseline')).toBeInTheDocument();
  });
});
