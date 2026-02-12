import { computeCB, TARGET_INTENSITY_2025 } from '../../src/core/domain/ComputeComplianceBalance';

describe('computeCB', () => {
  it('should return positive CB when actual intensity is lower than target', () => {
    const actual = 50.0;
    const fuel = 100;
    const result = computeCB(TARGET_INTENSITY_2025, actual, fuel);
    expect(result).toBeGreaterThan(0);
    expect(result).toBe((TARGET_INTENSITY_2025 - actual) * fuel * 41000);
  });

  it('should return negative CB when actual intensity is higher than target', () => {
    const actual = 100.0;
    const fuel = 100;
    const result = computeCB(TARGET_INTENSITY_2025, actual, fuel);
    expect(result).toBeLessThan(0);
  });

  it('should return zero when actual intensity equals target', () => {
    const actual = TARGET_INTENSITY_2025;
    const fuel = 100;
    const result = computeCB(TARGET_INTENSITY_2025, actual, fuel);
    expect(result).toBe(0);
  });

  it('should return zero when fuel consumption is zero', () => {
    const actual = 50.0;
    const fuel = 0;
    const result = computeCB(TARGET_INTENSITY_2025, actual, fuel);
    expect(result).toBe(0);
  });
});
