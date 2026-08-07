'use client'

import { useEffect, useMemo, useState } from 'react'
import { ROI_PRICING, calculateRoi, formatGhs, type RoiInputs } from '@/lib/roi-calculator/calculate'
import { Container, Section } from '@/components/layout/Container'
import { PageHero } from '@/components/sections/Hero'

const defaultInputs: RoiInputs = {
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
  usdRate: ROI_PRICING.usdToGhs,
}

export function RoiCalculator() {
  const [inputs, setInputs] = useState<RoiInputs>(defaultInputs)
  const [rateSource, setRateSource] = useState<'fetching' | 'live' | 'cached' | 'fallback'>('fetching')

  useEffect(() => {
    let cancelled = false
    async function loadRate() {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD')
        const data = await res.json()
        const rate = data?.rates?.GHS
        if (!cancelled && rate) {
          setInputs((prev) => ({ ...prev, usdRate: Math.round(rate * 100) / 100 }))
          setRateSource('live')
          return
        }
      } catch {
        // fallback below
      }
      if (!cancelled) {
        setInputs((prev) => ({ ...prev, usdRate: ROI_PRICING.usdToGhs }))
        setRateSource('fallback')
      }
    }
    loadRate()
    return () => {
      cancelled = true
    }
  }, [])

  const result = useMemo(() => calculateRoi(inputs), [inputs])

  return (
    <>
      <Section className="border-b">
        <Container>
          <PageHero
            title="CFO ROI Calculator"
            intro="Compare estimated in-house data centre costs against Onix colocation. Figures are indicative — review assumptions before making decisions."
          />
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Exchange rate: {inputs.usdRate} GH₵/USD ({rateSource})
          </p>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-8 lg:grid-cols-2">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Field label="Number of racks" id="racks" type="number" min={1} value={inputs.racks} onChange={(v) => setInputs({ ...inputs, racks: Number(v) })} />
            <label className="block text-sm font-medium">
              Workload density
              <select
                className="mt-1 w-full rounded border px-3 py-2"
                value={inputs.workload}
                onChange={(e) => setInputs({ ...inputs, workload: e.target.value as RoiInputs['workload'] })}
              >
                <option value="standard">Standard (3 kW/rack)</option>
                <option value="higher">Higher (5 kW/rack)</option>
              </select>
            </label>
            <Field label="Electricity tariff (GH₵/kWh)" id="tariff" type="number" step="0.01" value={inputs.tariff} onChange={(v) => setInputs({ ...inputs, tariff: Number(v) })} />
            <Field label="Downtime hours/year" id="downtimeHours" type="number" value={inputs.downtimeHours} onChange={(v) => setInputs({ ...inputs, downtimeHours: Number(v) })} />
            <label className="block text-sm font-medium">
              Downtime sensitivity
              <select
                className="mt-1 w-full rounded border px-3 py-2"
                value={inputs.downtimeSens}
                onChange={(e) => setInputs({ ...inputs, downtimeSens: e.target.value as RoiInputs['downtimeSens'] })}
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={inputs.segregation} onChange={(e) => setInputs({ ...inputs, segregation: e.target.checked })} />
              Cage segregation (one-off NRE)
            </label>
          </form>

          <div className="space-y-4">
            {!result ? (
              <p className="text-[var(--color-muted)]">Enter rack count to calculate.</p>
            ) : (
              <>
                <ResultCard label="In-house annual cost" value={formatGhs(result.inHouseTotal)} />
                <ResultCard label="Onix annual cost" value={formatGhs(result.onixTotal)} />
                <ResultCard
                  label={result.savings >= 0 ? 'Estimated annual savings' : 'Estimated annual difference'}
                  value={formatGhs(Math.abs(result.savings))}
                  highlight={result.savings >= 0 ? 'positive' : 'negative'}
                />
                <ResultCard
                  label="Payback period"
                  value={result.paybackMonths !== null ? `${Math.ceil(result.paybackMonths)} months` : 'N/A'}
                />
                <ResultCard label="Risk-adjusted savings (incl. downtime)" value={formatGhs(Math.abs(result.riskSavings))} />
              </>
            )}
            <p className="text-xs text-[var(--color-muted)]">
              Indicative model only. Onix pricing converted at {inputs.usdRate} GH₵ per USD ({rateSource} rate). Does not constitute a commercial offer.
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}

function Field({
  label,
  id,
  value,
  onChange,
  type = 'text',
  min,
  step,
}: {
  label: string
  id: string
  value: number
  onChange: (value: string) => void
  type?: string
  min?: number
  step?: string
}) {
  return (
    <label htmlFor={id} className="block text-sm font-medium">
      {label}
      <input
        id={id}
        type={type}
        min={min}
        step={step}
        className="mt-1 w-full rounded border px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

function ResultCard({ label, value, highlight }: { label: string; value: string; highlight?: 'positive' | 'negative' }) {
  const bg =
    highlight === 'positive'
      ? 'border-green-200 bg-green-50'
      : highlight === 'negative'
        ? 'border-red-200 bg-red-50'
        : 'border bg-white'
  return (
    <div className={`rounded-[var(--radius-card)] border p-4 ${bg}`}>
      <p className="text-sm text-[var(--color-muted)]">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  )
}
