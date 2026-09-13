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
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  TrendingUp,
  Leaf,
  LayoutDashboard,
  CheckCircle2,
} from "lucide-react";

export function LandingClient() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#0F172A]">
      {/* Top Navbar */}
      <header className="border-b border-slate-200/80 bg-[#004F38] text-white px-6 py-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#00CC88] flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-[#004F38]" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                RescueBites <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00CC88] text-[#004F38] font-black">TGTG Edition</span>
              </span>
              <span className="text-xs text-emerald-200/80 block -mt-0.5 font-medium">
                Surplus Food & Magic Bag Network
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <>
                <Link href="/redirect">
                  <Button variant="donate" size="sm" className="shadow-md">
                    <LayoutDashboard className="w-4 h-4 mr-1.5" /> Go to Console
                  </Button>
                </Link>
                <UserButton />
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="donate" size="sm" className="shadow-lg">
                    Join the Mission
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#004F38] text-white pt-16 pb-24 px-6">
        {/* Decorative background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00CC88]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF5A5F]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center flex flex-col items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00CC88]/20 border border-[#00CC88]/40 text-xs font-extrabold text-[#00CC88] mb-6 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-[#FFC72C]" />
            <span>SAVE GOOD FOOD FROM BEING WASTED</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 max-w-4xl"
          >
            Delicious surplus food from local stores, <span className="text-[#FFC72C]">up to 70% off.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-lg md:text-xl text-emerald-100/90 max-w-3xl mb-10 leading-relaxed font-medium"
          >
            Every day, top bakeries, cafes, and supermarkets package unsold fresh surplus into <strong>Surprise Magic Bags</strong> or list <strong>100% Free NGO Donations</strong>. Rescue food, save money, and feed your community!
          </motion.p>

          {/* Impact Stats Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-12 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-extrabold text-[#00CC88] flex items-center gap-1">
                <TrendingUp className="w-5 h-5 text-[#FFC72C]" /> 18,450+ kg
              </span>
              <span className="text-xs text-emerald-100/80 font-semibold uppercase tracking-wider mt-1">Food Rescued</span>
            </div>
            <div className="flex flex-col items-center border-y sm:border-y-0 sm:border-x border-white/15 py-3 sm:py-0">
              <span className="text-2xl md:text-3xl font-extrabold text-[#FFC72C] flex items-center gap-1">
                <Leaf className="w-5 h-5 text-[#00CC88]" /> 46,125 kg
              </span>
              <span className="text-xs text-emerald-100/80 font-semibold uppercase tracking-wider mt-1">CO₂ Emissions Offset</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-extrabold text-[#FF5A5F] flex items-center gap-1">
                <HeartHandshake className="w-5 h-5 text-pink-300" /> 14,200+
              </span>
              <span className="text-xs text-emerald-100/80 font-semibold uppercase tracking-wider mt-1">Meals Shared with NGOs</span>
            </div>
          </motion.div>

          {/* Quick Action Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl text-left"
          >
            <Link href={isSignedIn ? "/redirect" : "/sign-up?role=ngo"} className="w-full">
              <div className="p-6 rounded-2xl bg-white text-[#0F172A] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group border-2 border-transparent hover:border-[#00CC88]">
                <div className="w-12 h-12 rounded-xl bg-[#004F38] text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <HeartHandshake className="w-6 h-6 text-[#00CC88]" />
                </div>
                <h3 className="font-extrabold text-xl mb-1 text-[#004F38]">For NGOs & Shelters</h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Claim 100% free food donations matched to your daily meal capacity.
                </p>
                <span className="text-xs font-extrabold text-[#004F38] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Claim Free Food <ArrowRight className="w-4 h-4 text-[#00CC88]" />
                </span>
              </div>
            </Link>

            <Link href={isSignedIn ? "/redirect" : "/sign-up?role=business"} className="w-full">
              <div className="p-6 rounded-2xl bg-white text-[#0F172A] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group border-2 border-transparent hover:border-[#FF5A5F]">
                <div className="w-12 h-12 rounded-xl bg-[#FF5A5F] text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6 text-amber-200" />
                </div>
                <h3 className="font-extrabold text-xl mb-1 text-[#004F38]">For Bakeries & Stores</h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Turn unsold daily inventory into Surprise Magic Bags in under 30 seconds.
                </p>
                <span className="text-xs font-extrabold text-[#FF5A5F] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  List Your Store <ArrowRight className="w-4 h-4 text-[#FF5A5F]" />
                </span>
              </div>
            </Link>

            <Link href={isSignedIn ? "/redirect" : "/sign-up?role=buyer"} className="w-full">
              <div className="p-6 rounded-2xl bg-white text-[#0F172A] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all group border-2 border-transparent hover:border-[#FFC72C]">
                <div className="w-12 h-12 rounded-xl bg-[#FFC72C] text-[#0F172A] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-6 h-6 text-[#004F38]" />
                </div>
                <h3 className="font-extrabold text-xl mb-1 text-[#004F38]">For Food Rescuers</h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Buy delicious mystery bags & meals at 60-70% discount before closing time.
                </p>
                <span className="text-xs font-extrabold text-amber-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Browse Magic Bags <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Surprise Magic Bags Showcase */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-xs font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-[#FF5A5F]/10 text-[#FF5A5F] border border-[#FF5A5F]/20 mb-3 inline-block">
            FEATURED SURPRISE MAGIC BAGS
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#004F38] tracking-tight mb-3">
            What will you rescue today?
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto font-medium">
            Explore active surplus listings near you ready for collection today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sample Card 1 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="bg-[#004F38] p-5 text-white relative">
              <div className="flex justify-between items-start mb-3">
                <OutcomeBadge outcome="DISCOUNT" originalPrice={18.5} discountPrice={6.0} />
                <StatusPill status="OPEN" quantityLeft={2} />
              </div>
              <h3 className="font-extrabold text-xl text-white mb-1">Artisan Crumbs Bakery</h3>
              <p className="text-xs text-emerald-200/90 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00CC88]" /> 124 Market Street (0.4 km)
              </p>
            </div>
            <div className="p-5">
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Assorted sourdough loaves, croissants, and gourmet pastries baked fresh this morning.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1 text-[#FF5A5F]">
                  <Clock className="w-4 h-4" /> Pickup: 17:00 - 19:00
                </span>
                <Link href={isSignedIn ? "/redirect" : "/sign-up"}>
                  <Button variant="discount" size="sm">Reserve $6.00</Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Sample Card 2 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="bg-[#004F38] p-5 text-white relative">
              <div className="flex justify-between items-start mb-3">
                <OutcomeBadge outcome="DONATE" />
                <StatusPill status="OPEN" />
              </div>
              <h3 className="font-extrabold text-xl text-white mb-1">Green Leaf Bistro & Kitchen</h3>
              <p className="text-xs text-emerald-200/90 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00CC88]" /> 88 Commerce Boulevard (1.2 km)
              </p>
            </div>
            <div className="p-5">
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                35 portions of prepared quinoa salad boxes and healthy grain bowls ready for shelter distribution.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1 text-[#004F38]">
                  <CheckCircle2 className="w-4 h-4 text-[#00CC88]" /> Verified NGO Free
                </span>
                <Link href={isSignedIn ? "/redirect" : "/sign-up"}>
                  <Button variant="donate" size="sm">Claim Free</Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Sample Card 3 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="bg-[#004F38] p-5 text-white relative">
              <div className="flex justify-between items-start mb-3">
                <OutcomeBadge outcome="DISCOUNT" originalPrice={24.0} discountPrice={7.5} />
                <StatusPill status="OPEN" quantityLeft={1} />
              </div>
              <h3 className="font-extrabold text-xl text-white mb-1">Urban Grocer & Produce</h3>
              <p className="text-xs text-emerald-200/90 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00CC88]" /> 450 5th Avenue (1.8 km)
              </p>
            </div>
            <div className="p-5">
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Fresh organic fruit basket, artisan cheeses, and gourmet deli salad mystery box.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1 text-[#FF5A5F]">
                  <Clock className="w-4 h-4" /> Pickup: 18:30 - 20:00
                </span>
                <Link href={isSignedIn ? "/redirect" : "/sign-up"}>
                  <Button variant="discount" size="sm">Reserve $7.50</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Step-by-Step */}
      <section className="bg-white py-20 px-6 border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#004F38] tracking-tight mb-12">
            How RescueBites Works in 3 Simple Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-full bg-[#004F38] text-[#00CC88] font-black text-lg flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="font-extrabold text-lg text-[#004F38] mb-2">Find a Surprise Bag</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Use the interactive map or list feed to discover surplus food near you from bakeries, cafes, and supermarkets.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-full bg-[#004F38] text-[#FF5A5F] font-black text-lg flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="font-extrabold text-lg text-[#004F38] mb-2">Reserve in 1-Click</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reserve your Surprise Bag at 60-70% off or claim free donations instantly with double-allocation safety guards.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-slate-200/80 relative">
              <div className="w-10 h-10 rounded-full bg-[#004F38] text-[#FFC72C] font-black text-lg flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="font-extrabold text-lg text-[#004F38] mb-2">Collect & Enjoy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Show your digital pickup voucher at the store during the collection window, take home your food, and celebrate!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#004F38] text-white py-12 px-6 mt-auto border-t border-emerald-900">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00CC88] flex items-center justify-center text-[#004F38] font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">RescueBites</span>
          </div>
          <p className="text-xs text-emerald-200/70 text-center">
            © 2026 RescueBites • Operations-Grade Food Redistribution & Surprise Magic Bag Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}

