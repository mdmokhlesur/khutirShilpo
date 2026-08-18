"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";

const offers = [
  {
    title: "Clay Home Week",
    text: "Warm earthen decor pieces for shelves, corners, and slow evenings.",
    offer: "Up to 20% off",
    icon: "heroicons-outline:fire",
    href: "/products?search=clay",
  },
  {
    title: "Bamboo Craft Picks",
    text: "Lightweight handmade bamboo pieces with natural woven texture.",
    offer: "Bundle deals",
    icon: "heroicons-outline:sparkles",
    href: "/products?search=bamboo",
  },
  {
    title: "Glass Accent Finds",
    text: "Soft reflective accents for tabletops, cabinets, and gift boxes.",
    offer: "New arrivals",
    icon: "heroicons-outline:gift",
    href: "/products?search=glass",
  },
];

const OffersSection = () => {
  return (
    <section className="py-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--ks-bamboo)]">
            Seasonal offers
          </p>
          <h2 className="artisan-section-title text-2xl">
            Handmade Deals For Your Home
          </h2>
        </div>
        <Link
          className="hidden text-sm font-semibold text-[var(--ks-clay-dark)] underline md:inline"
          href="/products"
        >
          View all products
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {offers.map((item) => (
          <Link
            className="artisan-card group rounded p-5"
            href={item.href}
            key={item.title}
          >
            <div className="mb-5 flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded bg-[var(--ks-cream)] text-2xl text-[var(--ks-clay)]">
                <Icon icon={item.icon} />
              </span>
              <span className="rounded bg-[var(--ks-clay)] px-3 py-1 text-xs font-bold uppercase text-white">
                {item.offer}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--ks-ink)]">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--ks-muted)]">
              {item.text}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ks-clay-dark)]">
              Shop now
              <Icon
                className="transition group-hover:translate-x-1"
                icon="heroicons-outline:arrow-right"
              />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default OffersSection;
