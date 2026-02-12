export const TARGET_INTENSITY_2025 = 89.3368;
export const ENERGY_DENSITY_FACTOR = 41000; // MJ/tonne

/**
 * Computes the Compliance Balance (CB) based on fuel consumption and emission intensities.
 * 
 * Formula:
 * Energy (MJ) = fuelConsumption (tonnes) * 41000
 * CB = (Target Intensity - Actual Intensity) * Energy
 * 
 * @param targetIntensity The target GHG intensity (gCO2e/MJ)
 * @param actualIntensity The actual GHG intensity (gCO2e/MJ)
 * @param fuelConsumptionTonnes The amount of fuel consumed in metric tonnes
 * @returns The compliance balance (gCO2e)
 */
export function computeCB(
  targetIntensity: number,
  actualIntensity: number,
  fuelConsumptionTonnes: number
): number {
  const energyMJ = fuelConsumptionTonnes * ENERGY_DENSITY_FACTOR;
  const cb = (targetIntensity - actualIntensity) * energyMJ;
  return cb;
}
