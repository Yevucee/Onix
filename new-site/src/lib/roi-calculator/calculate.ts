export const ROI_PRICING = {
  rack3kw: 2100,
  rack5kw: 3200,
  extraKwPerMonth: 500,
  crossConnectMRC: 100,
  crossConnectNRC: 200,
  cageNREPerRack: 1000,
  usdToGhs: 12,
  defaultTariff: 2.45,
  defaultPUE: 2.2,
  defaultKwPerRack3: 3,
  defaultKwPerRack5: 5,
  defaultSpaceFactor: 3.5,
  defaultSpaceCostM2: 200,
  defaultLabourRate: 120,
  defaultMaintenanceRate: 0.1,
  defaultAmortisationYears: 4,
  capexPerRack3kw: 70000,
  capexPerRack5kw: 110000,
  defaultFacilityCapex: 350000,
  facilityAmortisationYears: 10,
  defaultGenRunHours: 1200,
  defaultGenFuelCostPerHour: 160,
  hoursPerYear: 8760,
  staffingTiers: [
    { max: 2, hours: 300 },
    { max: 5, hours: 520 },
    { max: 10, hours: 1040 },
    { max: 20, hours: 2000 },
    { max: Infinity, hours: 4000 },
  ],
  crossConnectTiers: [
    { max: 1, qty: 1 },
    { max: 5, qty: 2 },
    { max: Infinity, qty: 2 },
  ],
  downtimeSensitivity: { low: 5000, moderate: 15000, high: 40000, critical: 100000 } as Record<string, number>,
} as const

export type RoiInputs = {
  racks: number
  workload: 'standard' | 'higher'
  tariff: number
  spaceCostM2: number
  facilityCapex: number
  genRunHours: number
  genFuelCost: number
  downtimeSens: keyof typeof ROI_PRICING.downtimeSensitivity
  downtimeHours: number
  segregation: boolean
  usdRate: number
  kw?: number
  pue?: number
  m2Factor?: number
  labourRate?: number
  maintRate?: number
  capexPerRack?: number
  crossConnects?: number
}

export type RoiBreakdownItem = { name: string; value: number }

export type RoiResult = {
  inHouseTotal: number
  onixTotal: number
  savings: number
  riskAdjustedInHouse: number
  riskSavings: number
  oneOff: number
  paybackMonths: number | null
  downtimeLoss: number
  inHouseBreakdown: RoiBreakdownItem[]
  onixBreakdown: RoiBreakdownItem[]
}

export function getStaffHours(racks: number): number {
  for (const tier of ROI_PRICING.staffingTiers) {
    if (racks <= tier.max) return tier.hours
  }
  return 4000
}

export function getCrossConnects(racks: number): number {
  for (const tier of ROI_PRICING.crossConnectTiers) {
    if (racks <= tier.max) return tier.qty
  }
  return 2
}

export function calculateRoi(input: RoiInputs): RoiResult | null {
  const P = ROI_PRICING
  const r = input.racks
  if (r <= 0 || input.usdRate <= 0) return null

  const defaultKw = input.workload === 'higher' ? P.defaultKwPerRack5 : P.defaultKwPerRack3
  const kw = input.kw ?? defaultKw
  const pue = input.pue ?? P.defaultPUE
  const m2Factor = input.m2Factor ?? P.defaultSpaceFactor
  const labourRate = input.labourRate ?? P.defaultLabourRate
  const maintRate = input.maintRate ?? P.defaultMaintenanceRate
  const usdRate = input.usdRate

  const ccQty = input.crossConnects ?? getCrossConnects(r)
  const staffHoursYear = getStaffHours(r)

  const itLoad = r * kw
  const facilityLoad = itLoad * pue
  const annualKwh = facilityLoad * P.hoursPerYear
  const powerCost = annualKwh * input.tariff

  const spaceRequired = r * m2Factor
  const annualSpaceCost = spaceRequired * input.spaceCostM2 * 12
  const annualStaffCost = staffHoursYear * labourRate

  const defaultCapex = kw >= 5 ? P.capexPerRack5kw : P.capexPerRack3kw
  const capexPerRack = input.capexPerRack ?? defaultCapex
  const capexTotal = r * capexPerRack
  const annualCapex = capexTotal / P.defaultAmortisationYears
  const maintenanceCost = capexTotal * maintRate
  const annualFacilityCapex = input.facilityCapex / P.facilityAmortisationYears
  const annualGenFuel = input.genRunHours * input.genFuelCost

  const inHouseTotal =
    powerCost + annualSpaceCost + annualStaffCost + maintenanceCost + annualCapex + annualFacilityCapex + annualGenFuel

  const downtimeCostPerHour = P.downtimeSensitivity[input.downtimeSens] ?? P.downtimeSensitivity.moderate
  const downtimeLoss = input.downtimeHours * downtimeCostPerHour
  const riskAdjustedInHouse = inHouseTotal + downtimeLoss

  const rackPriceUSD = kw >= 5 ? P.rack5kw : P.rack3kw
  const packageCap = kw >= 5 ? r * 5 : r * 3
  const extraKw = Math.max(0, itLoad - packageCap)
  const extraPowerAnnualUSD = extraKw * P.extraKwPerMonth * 12
  const rackCostUSD = r * rackPriceUSD * 12
  const ccMrcUSD = ccQty * P.crossConnectMRC * 12
  const ccNrcUSD = ccQty * P.crossConnectNRC
  const onixTotalUSD = rackCostUSD + ccMrcUSD + extraPowerAnnualUSD
  const onixTotal = onixTotalUSD * usdRate

  const cageNRE = input.segregation ? r * P.cageNREPerRack : 0
  const oneOff = (ccNrcUSD + cageNRE) * usdRate
  const savings = inHouseTotal - onixTotal
  const riskSavings = riskAdjustedInHouse - onixTotal
  const paybackMonths = savings > 0 && oneOff > 0 ? oneOff / (savings / 12) : null

  return {
    inHouseTotal,
    onixTotal,
    savings,
    riskAdjustedInHouse,
    riskSavings,
    oneOff,
    paybackMonths,
    downtimeLoss,
    inHouseBreakdown: [
      { name: 'Power', value: powerCost },
      { name: 'Space', value: annualSpaceCost },
      { name: 'Staff', value: annualStaffCost },
      { name: 'Maintenance', value: maintenanceCost },
      { name: 'Server CapEx', value: annualCapex },
      { name: 'Facility CapEx', value: annualFacilityCapex },
      { name: 'Generator Fuel', value: annualGenFuel },
      { name: 'Downtime', value: downtimeLoss },
    ],
    onixBreakdown: [
      { name: 'Rack Cost', value: rackCostUSD * usdRate },
      { name: 'Cross-Connect', value: ccMrcUSD * usdRate },
      { name: 'Addtl Power', value: extraPowerAnnualUSD * usdRate },
    ],
  }
}

export function formatGhs(amount: number): string {
  return `GH₵${Math.round(amount).toLocaleString('en-US')}`
}
