import { PoolService } from '../../src/core/application/PoolService';
import { IPoolRepository } from '../../src/core/ports/IPoolRepository';

const mockRepo: IPoolRepository = {
  create: jest.fn().mockImplementation((name, year, members) => Promise.resolve({ id: '1', name, year, members, totalCB: 0 })),
  findAll: jest.fn()
};

describe('PoolService - Greedy Allocation', () => {
  let service: PoolService;

  beforeEach(() => {
    service = new PoolService(mockRepo);
  });

  it('should balance a pool where total CB is positive', async () => {
    const members = [
      { shipId: 'S1', cbBefore: 1000 },  // Surplus
      { shipId: 'S2', cbBefore: -600 }   // Deficit
    ];

    const result = await service.createPool('Test Pool', 2025, members);
    
    const s1 = result.members.find(m => m.shipId === 'S1')!;
    const s2 = result.members.find(m => m.shipId === 'S2')!;

    expect(s2.cbAfter).toBe(0); // Deficit covered
    expect(s1.cbAfter).toBe(400); // Remaining surplus
    expect(s1.cbAfter + s2.cbAfter).toBe(400); // Sum matches
  });

  it('should handle multiple surplus and deficit ships', async () => {
    const members = [
      { shipId: 'S1', cbBefore: 500 },
      { shipId: 'S2', cbBefore: 500 },
      { shipId: 'S3', cbBefore: -800 }
    ];

    const result = await service.createPool('Complex Pool', 2025, members);
    
    const sumAfter = result.members.reduce((sum, m) => sum + m.cbAfter, 0);
    const sumBefore = members.reduce((sum, m) => sum + m.cbBefore, 0);

    expect(sumAfter).toBe(sumBefore);
    expect(result.members.find(m => m.shipId === 'S3')!.cbAfter).toBe(0);
  });

  it('should throw error if total CB is negative', async () => {
    const members = [
      { shipId: 'S1', cbBefore: 100 },
      { shipId: 'S2', cbBefore: -200 }
    ];

    await expect(service.createPool('Failing Pool', 2025, members))
      .rejects.toThrow('Pool cannot be formed');
  });
});
