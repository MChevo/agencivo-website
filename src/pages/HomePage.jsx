import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import Button from "../components/Button";
import DotField from "../components/DotField";
import DotGrid from "../components/DotGrid";
import Footer from "../components/Footer";

const SectionIndex = ({ number }) => (
  <div className="flex items-center gap-5 text-xs font-semibold text-neutral-700">
    <span>{number}</span>
    <span className="tracking-[0.45em]">•••••</span>
  </div>
);

const RoleCard = ({ type, label, body, onClick }) => (
  <motion.button
    whileHover={{ y: -3 }}
    onClick={onClick}
    className="group relative min-h-[175px] overflow-hidden rounded-2xl border border-neutral-300 bg-white p-8 text-left shadow-[0_10px_40px_rgba(0,0,0,0.025)] w-full focus:outline-none focus:ring-2 focus:ring-black"
  >
    <DotField className="-bottom-20 right-0 h-40 w-56" dense />
    <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-neutral-500">{label}</div>
    <div className="mt-5 text-3xl font-bold">{type}</div>
    <p className="mt-5 max-w-[260px] text-sm leading-6 text-neutral-600">{body}</p>
    <div className="absolute right-7 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:translate-x-1">
      <ArrowRight size={18} />
    </div>
  </motion.button>
);

export const HomePage = () => {
  const { go, setDemoModalOpen } = useApp();

  const handleGetStartedClick = () => {
    document.getElementById("role-selection")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="relative overflow-hidden bg-[#fbfbfa]">
      <section className="relative min-h-[520px] border-b border-neutral-200 px-8 py-12 lg:px-12">
        <DotGrid className="absolute left-10 top-12" />
        <div className="absolute left-9 top-[310px] hidden text-[10px] font-bold uppercase leading-7 text-neutral-600 lg:block">
          <p>Brief.</p>
          <p>Build.</p>
          <p>Deliver.</p>
          <p>Repeat.</p>
          <div className="mt-4 h-px w-6 bg-black" />
        </div>
        <DotField className="-right-16 bottom-0 h-80 w-[650px]" dense />
        <div className="mx-auto grid max-w-[1620px] grid-cols-1 items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="pt-8 lg:pl-52">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[72px] font-black leading-[0.9] tracking-[-0.07em] sm:text-[110px] xl:text-[165px]"
            >
              Agencivo
            </motion.h1>
            <p className="mt-8 max-w-[520px] text-3xl leading-tight tracking-[-0.04em] text-neutral-700">
              The operating system for agencies and their clients.
            </p>
            <p className="mt-6 text-lg font-semibold">Brief. Build. Deliver. Repeat.</p>
            <div className="mt-8 flex items-center gap-8">
              <Button onClick={handleGetStartedClick}>Get Started</Button>
              <button
                onClick={() => setDemoModalOpen(true)}
                className="flex items-center gap-4 text-sm font-semibold hover:text-neutral-600 focus:outline-none focus:underline"
              >
                Book a Demo <ArrowRight size={17} />
              </button>
            </div>
          </div>
          <div className="relative hidden min-h-[350px] border-l border-neutral-300 pl-16 lg:block">
            <div className="font-mono text-3xl uppercase leading-tight tracking-[0.1em] text-neutral-700 [text-shadow:0_0_1px_#111]">
              <p>BUILT FOR</p>
              <p>AGENCIES.</p>
              <p>DESIGNED FOR</p>
              <p>CLARITY.</p>
            </div>
            <Plus className="absolute right-3 top-0 text-neutral-600" size={20} />
          </div>
        </div>
      </section>

      {/* Choose your path section */}
      <section id="role-selection" className="border-b border-neutral-200 px-8 py-12 lg:px-12 scroll-mt-20">
        <div className="mx-auto grid max-w-[1760px] gap-10 lg:grid-cols-[0.28fr_1fr]">
          <div>
            <SectionIndex number="01" />
            <h2 className="mt-9 text-3xl font-bold tracking-[-0.04em]">Choose your path</h2>
            <p className="mt-6 max-w-[230px] text-base leading-7 text-neutral-600">
              Agencivo is built for how modern agencies work.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <RoleCard
              label="For Agencies"
              type="Agency"
              body="Choose a subscription plan to manage clients, briefs, projects, and delivery."
              onClick={() => go("pricing")}
            />
            <RoleCard
              label="For Clients"
              type="Client"
              body="Have a project code? Enter it to submit your brief and get started."
              onClick={() => go("access")}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-200 px-8 py-8 lg:px-12">
        <div className="mx-auto grid max-w-[1760px] items-center gap-8 lg:grid-cols-[0.16fr_0.3fr_1fr_0.9fr]">
          <SectionIndex number="02" />
          <p className="text-sm font-medium leading-6 text-neutral-700">
            Trusted by modern agencies and forward-thinking brands
          </p>
          <div className="grid grid-cols-3 gap-6 text-center text-xl font-black tracking-[0.18em] lg:grid-cols-6">
            {["LUMEN", "VOID", "NEXORA", "STUDIO•A", "PIVOT", "FORMA"].map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
          <div className="grid grid-cols-4 divide-x divide-neutral-300 text-center">
            {[
              ["2K+", "AGENCIES"],
              ["18K+", "CLIENTS"],
              ["45K+", "BRIEFS DELIVERED"],
              ["98%", "SATISFACTION RATE"]
            ].map(([a, b]) => (
              <div key={a}>
                <div className="font-mono text-3xl tracking-widest">{a}</div>
                <div className="mt-2 text-[10px] font-bold">{b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default HomePage;
