import { describe, expect, it } from 'vitest'
import { resolveSolutionBlocks, SOLUTION_PAGE_PATHS, OUR_SOLUTIONS_SECTIONS } from '@/data/solution-pages'

describe('solution pages', () => {
  it('always returns structured blocks for known solution paths', () => {
    const vm = resolveSolutionBlocks('/home/virtual-machine/', [{ blockType: 'richText', body: '<p>elementor garbage</p>' }])
    expect(vm.some((b) => b.blockType === 'hero')).toBe(true)
    expect(vm.some((b) => b.blockType === 'featureCards')).toBe(true)
    expect(vm.some((b) => b.blockType === 'imageText')).toBe(true)
    expect(vm.some((b) => b.blockType === 'cta')).toBe(true)
    expect(vm.find((b) => b.blockType === 'hero')?.variant).toBe('banner')
  })

  it('returns finance blocks with hero and feature cards', () => {
    const finance = resolveSolutionBlocks('/home/finance/')
    expect(finance.length).toBeGreaterThan(3)
    expect(finance[0].blockType).toBe('hero')
  })

  it('covers all nine solution areas on our-solutions page', () => {
    const ids = OUR_SOLUTIONS_SECTIONS.map((s) => s.id)
    expect(ids).toContain('tangor')
    expect(ids).toContain('virtualmachines')
    expect(ids).toContain('managedservices')
    expect(ids).toContain('cybersecurity')
    expect(ids).toContain('internetexchange')
    expect(ids).toContain('carriern')
    expect(ids).toContain('candc')
    expect(ids).toContain('peering')
    expect(ids.length).toBe(8)
  })

  it('registers structured solution paths', () => {
    expect(SOLUTION_PAGE_PATHS.has('/home/virtual-machine/')).toBe(true)
    expect(SOLUTION_PAGE_PATHS.has('/home/finance/')).toBe(true)
    expect(SOLUTION_PAGE_PATHS.has('/home/our-solutions/')).toBe(true)
  })
})
