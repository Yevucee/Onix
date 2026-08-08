'use client'

import { useState } from 'react'
import Image from 'next/image'
import { OnixButton } from '@/components/onix/OnixButton'

const NETWORK_FEATURES = [
  { title: 'Meet many with one', body: 'A single cross-connect into LINX Accra lets you peer with local ISPs, CDNs and global networks to keep traffic local.' },
  { title: 'Simple pricing from LINX', body: '$130 per month includes a 10GE port with 2 Gbps of peering service at all LINX-operated sites, plus LINX account management and 24/7 NOC.' },
  { title: 'Where does Onix fit?', body: "LINX Accra operates inside Onix's Tier IV, carrier-neutral campus. If your network is at Onix, order one cross-connect to LINX Accra and peer with many partners through a single connection." },
]

const BUSINESS_FEATURES = [
  { title: 'More reliable connections', body: "When there's an issue on international links; local traffic still flows." },
  { title: 'Data stays local', body: 'When both sides of a service are in Ghana.' },
  { title: 'Better value over time', body: 'As networks reduce upstream costs and reinvest.' },
  { title: 'Snappier cloud apps and fintech tools', body: 'Thanks to shorter routes.' },
  { title: 'Improved user experience', body: 'For e-commerce, media, gaming and SaaS.' },
]

export function LinxAccraContent() {
  const [tab, setTab] = useState<'network' | 'business'>('network')

  return (
    <>
      <section className="bg-white py-12 md:py-16">
        <div className="onix-container">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--onix-red)]">LINX Accra</p>
          <h1 className="onix-heading-dark mt-2 max-w-3xl text-[40px] font-semibold leading-[48px]">
            The new Internet Exchange Point for West Africa
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-[22.4px] text-[var(--onix-body)]">
            Keep traffic local, reduce latency, and strengthen Ghana&apos;s connectivity ecosystem.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setTab('network')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${tab === 'network' ? 'bg-[var(--onix-navy)] text-white' : 'border border-[var(--onix-border,#e5e5e5)] bg-white text-[var(--onix-body)]'}`}
            >
              I run a network
            </button>
            <button
              type="button"
              onClick={() => setTab('business')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${tab === 'business' ? 'bg-[var(--onix-navy)] text-white' : 'border border-[var(--onix-border,#e5e5e5)] bg-white text-[var(--onix-body)]'}`}
            >
              I&apos;m a business or user
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[var(--onix-bg-alt)] py-12 md:py-16">
        <div className="onix-container grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="onix-heading-dark text-[32px] font-semibold">
              {tab === 'network' ? 'Peer at LINX Accra from Onix' : 'What this means for people'}
            </h2>
            <p className="mt-4 text-base leading-[22.4px] text-[var(--onix-body)]">
              {tab === 'network'
                ? 'Networks colocated at Onix can now access LINX Accra, the new Internet Exchange Point (IXP) for West Africa. LINX Accra is a fully redundant, interconnected, multi-site fabric designed to future-proof Ghana\'s connectivity ecosystem.'
                : 'Peering keeps internet traffic local — like delivery riders handing parcels at a neighbourhood hub instead of routing through another city.'}
            </p>
            <div className="mt-8 grid gap-6">
              {(tab === 'network' ? NETWORK_FEATURES : BUSINESS_FEATURES).map((item) => (
                <div key={item.title} className="bg-white p-6">
                  <h3 className="onix-heading-dark text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-[22.4px] text-[var(--onix-body)]">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
          <Image
            src="/images/linx/hero.jpg"
            alt="LINX Accra peering at Onix"
            width={640}
            height={427}
            className="h-auto w-full object-cover"
          />
        </div>
      </section>

      <section className="bg-[var(--onix-navy)] py-12 text-white md:py-16">
        <div className="onix-container text-center">
          <p className="text-sm uppercase tracking-wide text-white/70">Simple pricing from LINX</p>
          <p className="mt-4 text-6xl font-semibold text-[var(--onix-red)]">$130</p>
          <p className="text-xl">per month</p>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-[22.4px] text-white/80">
            Includes a 10GE port with 2 Gbps of peering service at all LINX-operated sites, plus LINX account management and 24/7 NOC.
          </p>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="onix-container text-center">
          <h2 className="onix-heading-dark text-[32px] font-semibold">Claim your free cross-connect</h2>
          <p className="mt-4 text-base text-[var(--onix-body)]">Join LINX Accra today</p>
          <OnixButton variant="primary-red" href="/contact-us" className="mt-8">
            Contact us
          </OnixButton>
        </div>
      </section>
    </>
  )
}
