"use client";
import Button from "@/component/ui/button";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";

const Footer = () => {
  const [email, setEmail] = useState("");

  const subscribeHandler = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    toast.success("Subscribed successfully");
    setEmail("");
  };

  return (
    <div className="border-t border-[var(--ks-border)] bg-[var(--ks-ink)] text-[var(--ks-cream)] md:mt-12">
      <div className="container">
        <div className="grid gap-8 border-b border-white/10 py-10 md:grid-cols-[1.2fr_0.8fr_0.9fr_1fr]">
          {/* logo */}
          <div className="h-full flex flex-col">
            <Link href="/">
              <h4 className="text-[var(--ks-cream)] text-xl md:text-3xl font-semibold">
                Kutir Shilpo
              </h4>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/70">
              Handmade clay, bamboo, and glass pieces shaped for warm,
              antique-inspired homes.
            </p>
            <h4 className="mt-6 text-lg text-[var(--ks-cream)]">Follow Us</h4>
            <ul className="flex gap-3 mt-3">
              <li className="h-8 w-8 flex justify-center items-center bg-[var(--ks-clay)] text-white rounded">
                <Link href="/">
                  <Icon className="text-sm" icon="fa-brands:facebook-f" />
                </Link>
              </li>
              <li className="h-8 w-8 flex justify-center items-center bg-[var(--ks-clay)] text-white rounded">
                <Link href="/">
                  <Icon className="text-sm" icon="fa-brands:twitter" />
                </Link>
              </li>
              <li className="h-8 w-8 flex justify-center items-center bg-[var(--ks-clay)] text-white rounded">
                <Link href="/">
                  <Icon className="text-sm" icon="fa-brands:linkedin-in" />
                </Link>
              </li>
              <li className="h-8 w-8 flex justify-center items-center bg-[var(--ks-clay)] text-white rounded">
                <Link href="/">
                  <Icon className="text-sm" icon="fa-brands:youtube" />
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-[var(--ks-cream)]">
              <span className="border-b-2 border-[var(--ks-clay)]">Menu</span>
            </h4>
            <ul className="flex flex-col gap-2">
              <li className="text-sm font-medium text-white/75">
                <Link href="/">Home</Link>
              </li>
              <li className="text-sm font-medium text-white/75">
                <Link href="/products">Products</Link>
              </li>
              <li className="text-sm font-medium text-white/75">
                <Link href="/checkout">Cart</Link>
              </li>
              <li className="text-sm font-medium text-white/75">
                <Link href="/dashboard">Dashboard</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-[var(--ks-cream)]">
              <span className="border-b-2 border-[var(--ks-clay)]">Collections</span>
            </h4>
            <ul className="flex flex-col gap-2">
              <li className="text-sm font-medium text-white/75">
                <Link href="/products?search=clay">Clay Products</Link>
              </li>
              <li className="text-sm font-medium text-white/75">
                <Link href="/products?search=bamboo">Bamboo Products</Link>
              </li>
              <li className="text-sm font-medium text-white/75">
                <Link href="/products?search=glass">Glass Products</Link>
              </li>
              <li className="text-sm font-medium text-white/75">
                <Link href="/products">Special Offers</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-[var(--ks-cream)]">
              <span className="border-b-2 border-[var(--ks-clay)]">Newsletter</span>
            </h4>
            <p className="text-sm leading-6 text-white/75">
              Get product updates, handmade craft stories, and special offers
              in your inbox.
            </p>
            <form className="mt-4 space-y-3" onSubmit={subscribeHandler}>
              <input
                className="artisan-input w-full rounded px-3 py-2"
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Button className="w-full">Subscribe</Button>
            </form>
          </div>
        </div>
        {/* footer bottom part */}
        <div className="flex flex-col gap-2 py-5 text-sm text-white/65 md:flex-row md:justify-between">
          <p>Copyright © 2026 KutirShilpo.com | All rights reserved.</p>
          <div className="flex gap-2">
            <Link href="/">Privacy</Link> |
            <Link href="/">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
