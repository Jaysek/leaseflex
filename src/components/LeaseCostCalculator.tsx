'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

function getLeaseFlexPrice(rent: number): number {
  if (rent < 3000) return 19;
  if (rent < 6000) return 39;
  if (rent < 10000) return 79;
  return 149;
}

function formatMoney(n: number): string {
  return n.toLocaleString('en-US');
}

export default function LeaseCostCalculator() {
  const [rent, setRent] = useState(3000);

  const terminationFee = rent * 2;
  const remainingRent = rent * 3;
  const totalPenalty = terminationFee + remainingRent;
  const monthlyPrice = getLeaseFlexPrice(rent);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            What breaking your lease actually costs
          </h2>
          <p className="mt-4 text-neutral-500 max-w-xl mx-auto">
            Most leases include penalties that can total $5,000&ndash;$15,000 if you need to move early.
          </p>
        </div>

        <div className="bg-neutral-50 rounded-2xl border border-neutral-100 p-8 md:p-10">
          {/* Rent slider */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-semibold text-neutral-900">Your monthly rent</span>
              <span className="text-2xl font-semibold text-neutral-900 tabular-nums">${formatMoney(rent)}<span className="text-sm font-normal text-neutral-400">/mo</span></span>
            </div>
            <input
              type="range"
              min={1500}
              max={7000}
              step={100}
              value={rent}
              onChange={(e) => setRent(Number(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-full appearance-none cursor-pointer accent-neutral-900 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neutral-900 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-neutral-400">$1,500</span>
              <span className="text-[10px] text-neutral-400">$7,000</span>
            </div>
          </div>

          <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-6">
            Typical ${formatMoney(rent)}/mo apartment lease
          </p>

          {/* Side-by-side comparison */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Without LeaseFlex */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-5">
                Without LeaseFlex
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Early termination</span>
                  <span className="font-medium text-neutral-900 tabular-nums">${formatMoney(terminationFee)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Remaining rent owed</span>
                  <span className="font-medium text-neutral-900 tabular-nums">${formatMoney(remainingRent)}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-neutral-100">
                <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-medium mb-1">Your liability</p>
                <p className="text-3xl font-bold text-neutral-900 tabular-nums">${formatMoney(totalPenalty)}</p>
                <p className="mt-1.5 text-xs text-neutral-400">
                  Due immediately out of pocket
                </p>
              </div>
            </div>

            {/* With LeaseFlex */}
            <div className="bg-white rounded-xl border-2 border-neutral-900 p-6">
              <p className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-5">
                With LeaseFlex
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Early termination</span>
                  <span className="font-medium text-neutral-300 tabular-nums line-through">${formatMoney(terminationFee)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Remaining rent owed</span>
                  <span className="font-medium text-neutral-300 tabular-nums line-through">${formatMoney(remainingRent)}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-neutral-200">
                <p className="text-[10px] text-neutral-900 uppercase tracking-wider font-medium mb-1">Your liability</p>
                <p className="text-3xl font-bold text-neutral-900 tabular-nums">$0</p>
                <p className="mt-1.5 text-xs text-neutral-400">
                  Covered for just ${monthlyPrice}/mo
                </p>
              </div>
            </div>
          </div>

          {/* Savings callout */}
          <div className="flex items-center justify-center gap-2 py-4 mb-4">
            <p className="text-sm text-neutral-500">
              You&apos;d save <span className="font-semibold text-neutral-900">${formatMoney(totalPenalty)}</span> for just ${monthlyPrice}/mo
            </p>
          </div>

          {/* Anchors */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {[
              { emoji: '\u{1F4F1}', label: 'a phone bill' },
              { emoji: '\u{1F3CB}', label: 'a gym membership' },
              { emoji: '\u{1F4E6}', label: 'a streaming bundle' },
            ].map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-neutral-100 text-xs text-neutral-600"
              >
                <span>{item.emoji}</span>
                Less than {item.label}
              </span>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/offer"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-sm font-medium rounded-full hover:bg-neutral-800 transition-colors"
            >
              See if my lease qualifies
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
