"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { OutcomeBadge } from "@/components/shared/OutcomeBadge";
import { StatusPill } from "@/components/shared/StatusPill";
import { useUser, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  HeartHandshake,
  ShoppingBag,
  ShieldCheck,
  Zap,
  LayoutDashboard,
} from "lucide-react";

export function LandingClient() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E8]">
      {/* Top Bar */}
      <header className="border-b border-[#E3DBC9] bg-white px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#B84A16] flex items-center justify-center text-white font-bold text-lg font-serif shadow-xs">
              F
            </div>
            <div>
              <span className="font-serif font-semibold text-lg text-[#211D19]">
                FoodBridge
              </span>
              <span className="text-xs text-[#6B6157] block -mt-1 font-sans">
                Redistribution Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <>
                <Link href="/redirect">
                  <Button variant="primary" size="sm">
                    <LayoutDashboard className="w-4 h-4 mr-1.5" /> Go to Console
                  </Button>
                </Link>
                <UserButton />

              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Entrance Motion */}
      <section className="px-6 py-16 md:py-24 max-w-5xl mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEAE0] border border-[#E3DBC9] text-xs font-medium text-[#6B6157] mb-6"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#B84A16]" />
          <span>Operations-Grade Surplus Logistics Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="font-serif text-4xl md:text-6xl font-medium text-[#211D19] leading-tight mb-6 max-w-3xl"
        >
          Redirect surplus food to verified NGOs or discounted sales in seconds.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-base md:text-lg text-[#6B6157] max-w-2xl mb-8 leading-relaxed"
        >
          Connecting restaurants, bakeries, and cafeterias with shelters and public buyers. 
          Reduce food waste with structured matching, double-allocation guards, and full audit transparency.
        </motion.p>

        {/* Dynamic CTAs / Role Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-12"
        >
          <Link href={isSignedIn ? "/redirect" : "/sign-up?role=business"} className="w-full">
            <div className="p-5 rounded-xl bg-white border border-[#E3DBC9] hover:border-[#B84A16] hover:shadow-md transition-all text-left group">
              <div className="w-10 h-10 rounded-lg bg-[#F5F1E8] flex items-center justify-center mb-3 group-hover:bg-[#B84A16] group-hover:text-white transition-colors">
                <Building2 className="w-5 h-5 text-[#B84A16] group-hover:text-white" />
              </div>
              <h3 className="font-semibold text-[#211D19] mb-1">Food Business</h3>
              <p className="text-xs text-[#6B6157] mb-3">List surplus, choose donate or discount path in seconds.</p>
              <span className="text-xs font-medium text-[#B84A16] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Business Portal <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>

          <Link href={isSignedIn ? "/redirect" : "/sign-up?role=ngo"} className="w-full">
            <div className="p-5 rounded-xl bg-white border border-[#E3DBC9] hover:border-[#25423A] hover:shadow-md transition-all text-left group">
              <div className="w-10 h-10 rounded-lg bg-[#F5F1E8] flex items-center justify-center mb-3 group-hover:bg-[#25423A] group-hover:text-white transition-colors">
                <HeartHandshake className="w-5 h-5 text-[#25423A] group-hover:text-white" />
              </div>
              <h3 className="font-semibold text-[#211D19] mb-1">NGO / Shelter</h3>
              <p className="text-xs text-[#6B6157] mb-3">Discover nearby donations matched to your capacity.</p>
              <span className="text-xs font-medium text-[#25423A] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                NGO Portal <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>

          <Link href={isSignedIn ? "/redirect" : "/sign-up?role=buyer"} className="w-full">
            <div className="p-5 rounded-xl bg-white border border-[#E3DBC9] hover:border-[#2E5E8C] hover:shadow-md transition-all text-left group">
              <div className="w-10 h-10 rounded-lg bg-[#F5F1E8] flex items-center justify-center mb-3 group-hover:bg-[#2E5E8C] group-hover:text-white transition-colors">
                <ShoppingBag className="w-5 h-5 text-[#2E5E8C] group-hover:text-white" />
              </div>
              <h3 className="font-semibold text-[#211D19] mb-1">Discount Buyer</h3>
              <p className="text-xs text-[#6B6157] mb-3">Purchase discounted surplus meals before closing.</p>
              <span className="text-xs font-medium text-[#2E5E8C] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Browse Offers <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        </motion.div>
      </section>

      {/* How it works section with Scroll Trigger Motion */}
      <section id="how-it-works" className="bg-white border-t border-[#E3DBC9] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl font-semibold text-[#211D19] mb-3">
              Unambiguous Outcomes, Operations-Grade Logistics
            </h2>
            <p className="text-sm text-[#6B6157] max-w-xl mx-auto">
              Every surplus batch follows a clear, two-fork outcome path with full status tracking.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Donate Path Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-6 rounded-xl bg-[#F5F1E8]/60 border border-[#E3DBC9]"
            >
              <div className="flex items-center justify-between mb-4">
                <OutcomeBadge outcome="DONATE" />
                <StatusPill status="MATCHED" />
              </div>
              <h3 className="font-semibold text-lg text-[#211D19] mb-2">
                Donation Path for Shelters
              </h3>
              <p className="text-xs text-[#6B6157] leading-relaxed mb-4">
                Businesses list surplus batches as donations. Nearby verified NGOs matching capacity and deadline limits request the batch. Double-allocation protection prevents race conditions.
              </p>
              <div className="text-xs text-[#25423A] font-medium flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Bounding-box location matching engine
              </div>
            </motion.div>

            {/* Discount Path Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="p-6 rounded-xl bg-[#F5F1E8]/60 border border-[#E3DBC9]"
            >
              <div className="flex items-center justify-between mb-4">
                <OutcomeBadge outcome="DISCOUNT" originalPrice={24.0} discountPrice={8.5} />
                <StatusPill status="SCHEDULED" />
              </div>
              <h3 className="font-semibold text-lg text-[#211D19] mb-2">
                Discounted Sale Path
              </h3>
              <p className="text-xs text-[#6B6157] leading-relaxed mb-4">
                Businesses set discounted prices for remaining unsold items. Public buyers reserve or purchase items directly, recovering costs while preventing safe food from being discarded.
              </p>
              <div className="text-xs text-[#2E5E8C] font-medium flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Instant reservation & pickup scheduling
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
