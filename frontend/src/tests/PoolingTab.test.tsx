import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PoolingTab from '../adapters/ui/components/PoolingTab';


vi.mock('../core/application/PoolService', () => {
  return {
    PoolService: vi.fn().mockImplementation(() => {
      return {
        getAdjustedCompliance: vi.fn().mockImplementation((id) => {
          // These will be multiplied by modifiers [1.2, -0.8, 0.5] in PoolingTab
          if (id === 'SHIP-ALPHA') return Promise.resolve({ totalComplianceBalance: 1000 }); // 1200
          if (id === 'SHIP-BETA') return Promise.resolve({ totalComplianceBalance: 5000 }); // -4000
          return Promise.resolve({ totalComplianceBalance: 0 });
        }),
        getPools: vi.fn().mockResolvedValue([]),
        createPool: vi.fn(),
      };
    }),
  };
});

vi.mock('../adapters/infrastructure/AxiosApiAdapter', () => {
  return {
    AxiosApiAdapter: vi.fn(),
  };
});

describe('PoolingTab', () => {
  it('disables Create Pool button when net balance is negative', async () => {
    render(<PoolingTab />);
    
    await waitFor(() => {
      expect(screen.getByText('SHIP-ALPHA')).toBeInTheDocument();
      expect(screen.getByText('SHIP-BETA')).toBeInTheDocument();
    });
    
    const alphaButton = screen.getByText('SHIP-ALPHA').closest('button')!;
    const betaButton = screen.getByText('SHIP-BETA').closest('button')!;
    
    fireEvent.click(alphaButton);
    fireEvent.click(betaButton);
    
    // ALPHA: 1000 * 1.2 = 1200
    // BETA: 5000 * -0.8 = -4000
    // Total = -2800
    
    await waitFor(() => {
      expect(screen.getByText('-2,800')).toBeInTheDocument();
    });
    
    const createButton = screen.getByRole('button', { name: /Create Compliance Pool/i });
    expect(createButton).toBeDisabled();
  });
});
