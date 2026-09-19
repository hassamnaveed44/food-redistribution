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

interface LandingClientProps {
  initialListings?: any[];
  stats?: {
    totalUsers: number;
    totalRescuedKg: number;
    co2OffsetKg: number;
  };
}

export function LandingClient({ initialListings = [], stats }: LandingClientProps) {
  const { isSignedIn } = useUser();

  const activeRescuedKg = stats?.totalRescuedKg || 450;
  const activeCo2 = stats?.co2OffsetKg || 1125;
  const activeUsers = stats?.totalUsers || 150;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#0F172A] overflow-x-hidden w-full max-w-full">
      {/* Top Navbar */}
      <header className="border-b border-emerald-950/20 bg-[#004F38] text-white px-3.5 sm:px-6 py-3 sm:py-4 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#00CC88] flex items-center justify-center text-white font-extrabold text-lg sm:text-xl shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Leaf className="w-4 h-4 sm:w-6 sm:h-6 text-[#004F38]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-white leading-tight">
                  RescueBites
                </span>
                <span className="hidden xs:inline-block text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00CC88] text-[#004F38] font-extrabold">
                  TGTG Edition
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-emerald-200/80 hidden sm:block -mt-0.5 font-medium">
                Surplus Food & Magic Bag Network
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            {isSignedIn ? (
              <>
                <Link href="/redirect">
                  <Button variant="donate" size="sm" className="shadow-md hover:scale-105 transition-transform text-xs px-2.5 sm:px-3 py-1.5">
                    <LayoutDashboard className="w-3.5 h-3.5 sm:mr-1.5" />
                    <span className="hidden xs:inline">Go to Console</span>
                    <span className="xs:hidden">Console</span>
                  </Button>
                </Link>
                <UserButton />
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 text-xs px-2 sm:px-3 py-1.5">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="donate" size="sm" className="shadow-md hover:scale-105 transition-transform text-xs px-2.5 sm:px-3 py-1.5">
                    Join
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#004F38] text-white pt-16 pb-24 px-6">
        <div className="max-w-6xl mx-auto text-center flex flex-col items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00CC88]/20 border border-[#00CC88]/30 text-xs font-extrabold text-[#00CC88] mb-6"
          >
            <Leaf className="w-4 h-4 text-[#00CC88]" />
            <span>ZERO FOOD WASTE MOVEMENT</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 max-w-4xl"
          >
            Save Good Food. Save Money. <span className="text-[#FFC72C]">Rescue Magic Bags Near You.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-lg md:text-xl text-emerald-100/90 max-w-3xl mb-10 leading-relaxed font-medium"
          >
            Every day, top bakeries, cafes, and markets list fresh unsold surplus as <strong>Surprise Magic Bags</strong> at up to 70% off or <strong>100% Free NGO Relief</strong>. Save delicious food and support local communities!
          </motion.p>

          {/* Impact Stats Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-12 bg-white/10 p-5 rounded-2xl border border-white/15 shadow-sm"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-extrabold text-[#00CC88] flex items-center gap-1">
                <TrendingUp className="w-5 h-5 text-[#FFC72C]" /> {activeRescuedKg}+ kg
              </span>
              <span className="text-xs text-emerald-100/80 font-semibold uppercase tracking-wider mt-1">Food Rescued</span>
            </div>
            <div className="flex flex-col items-center border-y sm:border-y-0 sm:border-x border-white/15 py-3 sm:py-0">
              <span className="text-2xl md:text-3xl font-extrabold text-[#FFC72C] flex items-center gap-1">
                <Leaf className="w-5 h-5 text-[#00CC88]" /> {activeCo2} kg
              </span>
              <span className="text-xs text-emerald-100/80 font-semibold uppercase tracking-wider mt-1">CO₂ Offset</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-extrabold text-[#FF5A5F] flex items-center gap-1">
                <HeartHandshake className="w-5 h-5 text-pink-300" /> {activeUsers}+
              </span>
              <span className="text-xs text-emerald-100/80 font-semibold uppercase tracking-wider mt-1">Active Rescuers</span>
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
            FEATURED SURPRISE MAGIC BAGS & DONATIONS
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#004F38] tracking-tight mb-3">
            What will you rescue today?
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto font-medium mb-6">
            Explore live surplus inventory listed in real-time by top local bakeries, cafes, and markets.
          </p>

          {/* Dual Action Options CTA Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-md max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <span className="text-xs font-extrabold text-[#004F38] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF5A5F]" /> Select your account path:
            </span>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Link href={isSignedIn ? "/redirect" : "/sign-up?role=buyer"} className="flex-1 sm:flex-none">
                <Button variant="discount" size="sm" className="w-full text-xs font-extrabold px-4 py-2 shadow-sm">
                  <ShoppingBag className="w-3.5 h-3.5 mr-1.5" /> Food Rescuer (60-70% Off)
                </Button>
              </Link>
              <Link href={isSignedIn ? "/redirect" : "/sign-up?role=ngo"} className="flex-1 sm:flex-none">
                <Button variant="donate" size="sm" className="w-full text-xs font-extrabold px-4 py-2 shadow-sm">
                  <HeartHandshake className="w-3.5 h-3.5 mr-1.5 text-[#00CC88]" /> Verified NGO (100% Free)
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialListings.length > 0 ? (
            initialListings.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between"
              >
                <div className="bg-[#004F38] p-5 text-white relative">
                  <div className="flex justify-between items-start mb-3">
                    <OutcomeBadge
                      outcome={item.outcome}
                      originalPrice={item.originalPrice}
                      discountPrice={item.discountPrice}
                    />
                    <StatusPill status={item.status} quantityLeft={item.quantity} />
                  </div>
                  <h3 className="font-extrabold text-xl text-white mb-1">{item.foodType}</h3>
                  <p className="text-xs text-emerald-200/90 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#00CC88]" /> {item.businessName}
                  </p>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    "{item.condition}" ({item.quantity} {item.unit})
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1 text-[#FF5A5F]">
                      <Clock className="w-4 h-4" />
                      Deadline: {new Date(item.collectionDeadline).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <Link href={isSignedIn ? "/redirect" : item.outcome === "DONATE" ? "/sign-up?role=ngo" : "/sign-up?role=buyer"}>
                      <Button variant={item.outcome === "DONATE" ? "donate" : "discount"} size="sm">
                        {item.outcome === "DONATE" ? "Claim Free" : `Reserve $${item.discountPrice || 6.0}`}
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <>
              {/* Fallback Display */}
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
                    <Link href={isSignedIn ? "/redirect" : "/sign-up?role=buyer"}>
                      <Button variant="discount" size="sm">Reserve $6.00</Button>
                    </Link>
                  </div>
                </div>
              </motion.div>

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
                    <Link href={isSignedIn ? "/redirect" : "/sign-up?role=ngo"}>
                      <Button variant="donate" size="sm">Claim Free</Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* How It Works Step-by-Step */}
      <section className="bg-white py-20 px-6 border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-xs font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-[#00CC88]/20 text-[#004F38] border border-[#00CC88]/30 mb-3 inline-block">
            SUSTAINABLE FOOD REDISTRIBUTION PROCESS
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#004F38] tracking-tight mb-12">
            How RescueBites Works in 3 Simple Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 rounded-3xl bg-[#FAF9F6] border border-slate-200/80 shadow-md relative group hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#004F38] text-[#00CC88] font-black text-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6 text-[#00CC88]" />
              </div>
              <h3 className="font-extrabold text-lg text-[#004F38] mb-2">1. Stores List Unsold Surplus</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bakeries, cafes, and supermarkets list unsold daily food as <strong>Surprise Magic Bags (60-70% off)</strong> or <strong>100% Free NGO Donations</strong> in under 30 seconds.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF9F6] border border-slate-200/80 shadow-md relative group hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5A5F] text-white font-black text-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6 text-amber-200" />
              </div>
              <h3 className="font-extrabold text-lg text-[#004F38] mb-2">2. Rescuers & Shelters Discover</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Local residents reserve discounted mystery bags while verified non-profit shelters claim free bulk meal allocations matched to daily capacity.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FAF9F6] border border-slate-200/80 shadow-md relative group hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#00CC88] text-[#004F38] font-black text-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-[#004F38]" />
              </div>
              <h3 className="font-extrabold text-lg text-[#004F38] mb-2">3. Present Token & Collect</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rescuers present their digital voucher token code at store pickup. The store confirms handover with 1 tap, logging sustainability impact.
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

