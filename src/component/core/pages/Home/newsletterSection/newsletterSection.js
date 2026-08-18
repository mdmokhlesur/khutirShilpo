"use client";

import Button from "@/component/ui/button";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { toast } from "react-hot-toast";

const NewsletterSection = () => {
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
    <section className="my-10 overflow-hidden rounded border border-[var(--ks-border)] bg-[var(--ks-paper)]">
      <div className="grid gap-6 p-6 md:grid-cols-[1fr_0.9fr] md:p-8 lg:p-10">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--ks-bamboo)]">
            Newsletter
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-[var(--ks-ink)]">
            Stories From The Workshop
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--ks-muted)]">
            Get new handmade collections, care tips, and limited craft offers
            before they reach the shelves.
          </p>
        </div>

        <form
          className="flex flex-col gap-3 self-center sm:flex-row"
          onSubmit={subscribeHandler}
        >
          <div className="relative flex-1">
            <Icon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ks-muted)]"
              icon="heroicons-outline:mail"
            />
            <input
              className="artisan-input w-full rounded py-3 pl-11 pr-4"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              type="email"
              value={email}
            />
          </div>
          <Button className="py-3">Subscribe</Button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
