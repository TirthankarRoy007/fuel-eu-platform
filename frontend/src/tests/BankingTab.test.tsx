import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BankingTab from '../adapters/ui/components/BankingTab';


vi.mock('../core/application/BankingService', () => {
  return {
    BankingService: vi.fn().mockImplementation(() => {
      return {
        getCompliance: vi.fn().mockResolvedValue({ totalComplianceBalance: -500 }),
        getBankingRecord: vi.fn().mockResolvedValue({ amount: 0 }),
        bankSurplus: vi.fn(),
        applySurplus: vi.fn(),
      };
    }),
  };
});

vi.mock('../adapters/infrastructure/AxiosApiAdapter', () => {
  return {
    AxiosApiAdapter: vi.fn(),
  };
});

describe('BankingTab', () => {
  it('disables Bank Surplus button when compliance balance is negative', async () => {
    render(<BankingTab />);
    
    await waitFor(() => {
      expect(screen.getByText('-500')).toBeInTheDocument();
    });
    
    const bankButton = screen.getByRole('button', { name: /Bank Surplus/i });
    expect(bankButton).toBeDisabled();
  });
});
