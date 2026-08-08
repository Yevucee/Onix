import { describe, expect, it } from 'vitest'
import { calculateRoi, getCrossConnects, getStaffHours, ROI_PRICING } from '@/lib/roi-calculator/calculate'
import { pathFromSlugSegments } from '@/lib/page-resolver'

describe('ROI calculator', () => {
  it('calculates savings for default scenario', () => {
    const result = calculateRoi({
      racks: 4,
      workload: 'standard',
      tariff: ROI_PRICING.defaultTariff,
      spaceCostM2: ROI_PRICING.defaultSpaceCostM2,
      facilityCapex: ROI_PRICING.defaultFacilityCapex,
      genRunHours: ROI_PRICING.defaultGenRunHours,
      genFuelCost: ROI_PRICING.defaultGenFuelCostPerHour,
      downtimeSens: 'moderate',
      downtimeHours: 16,
      segregation: false,
      usdRate: 12,
    })
    expect(result).not.toBeNull()
    expect(result!.inHouseTotal).toBeGreaterThan(0)
    expect(result!.onixTotal).toBeGreaterThan(0)
  })

  it('returns null for invalid rack count', () => {
    expect(calculateRoi({ ...baseInput(), racks: 0 })).toBeNull()
  })

  it('uses staffing tiers', () => {
    expect(getStaffHours(1)).toBe(300)
    expect(getStaffHours(8)).toBe(1040)
  })

  it('uses cross-connect tiers', () => {
    expect(getCrossConnects(1)).toBe(1)
    expect(getCrossConnects(10)).toBe(2)
  })
})

function baseInput() {
  return {
    racks: 4,
    workload: 'standard' as const,
    tariff: ROI_PRICING.defaultTariff,
    spaceCostM2: ROI_PRICING.defaultSpaceCostM2,
    facilityCapex: ROI_PRICING.defaultFacilityCapex,
    genRunHours: ROI_PRICING.defaultGenRunHours,
    genFuelCost: ROI_PRICING.defaultGenFuelCostPerHour,
    downtimeSens: 'moderate' as const,
    downtimeHours: 16,
    segregation: false,
    usdRate: 12,
  }
}

describe('page resolver paths', () => {
  it('builds legacy paths from slug segments', () => {
    expect(pathFromSlugSegments(['home', 'our-solutions'])).toBe('/home/our-solutions/')
    expect(pathFromSlugSegments([])).toBe('/')
  })
})
