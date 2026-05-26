import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Layers3, Shield, HelpCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import Button from "../components/Button";
import DotField from "../components/DotField";
import Footer from "../components/Footer";

export const PricingPage = () => {
  const { go, subscribe, setSalesModalOpen, setLoginModalOpen } = useApp();
  const [isYearly, setIsYearly] = useState(true);

  const starterPrice = isYearly ? "$29" : "$35";
  const professionalPrice = isYearly ? "$79" : "$99";

  const handleSubscribe = (plan) => {
    subscribe(plan);
    go("dashboard");
  };

  const plans = [
    {
      name: "Starter",
      price: starterPrice,
      sub: isYearly ? "Billed yearly" : "Billed monthly",
      features: ["Up to 3 Team Members", "50 Active Clients", "Unlimited Briefs", "Basic Analytics"],
      cta: "Get Started",
      popular: false,
      onClick: () => handleSubscribe("starter")
    },
    {
      name: "Professional",
      price: professionalPrice,
      sub: isYearly ? "Billed yearly" : "Billed monthly",
      features: ["Up to 15 Team Members", "150 Active Clients", "Advanced Analytics", "Priority Support", "Custom Branding"],
      cta: "Get Started",
      popular: true,
      onClick: () => handleSubscribe("professional")
    },
    {
      name: "Enterprise",
      price: "Custom",
      sub: "Let’s talk",
      features: ["Unlimited Members", "Unlimited Clients", "Advanced Security", "Dedicated Support", "SLA + Onboarding"],
      cta: "Contact Sales",
      popular: false,
      onClick: () => setSalesModalOpen(true)
    }
  ];

  return (
    <main className="relative overflow-hidden bg-[#fbfbfa] px-8 py-10 lg:px-12">
      <DotField className="right-0 top-32 h-[460px] w-[360px]" dense />
      <button
        onClick={() => go("home")}
        className="ml-10 mt-4 flex items-center gap-3 text-sm font-semibold hover:text-neutral-600 focus:outline-none"
      >
        <ArrowRight className="rotate-180" size={16} /> Back to Home
      </button>

      <section className="mx-auto grid max-w-[1650px] grid-cols-1 items-center gap-12 py-16 lg:grid-cols-[0.45fr_0.55fr]">
        <div className="relative">
          <div className="absolute -left-24 top-52 hidden text-[10px] font-bold uppercase leading-7 text-neutral-600 xl:block">
            <p>Brief.</p>
            <p>Build.</p>
            <p>Deliver.</p>
            <p>Repeat.</p>
            <div className="mt-4 h-px w-6 bg-black" />
          </div>
          <h1 className="text-7xl font-black leading-[0.92] tracking-[-0.07em] xl:text-[105px]">
            Agency
            <br />
            Subscription
          </h1>
          <p className="mt-8 max-w-[410px] text-2xl leading-tight tracking-[-0.04em] text-neutral-700">
            Choose the plan that fits your agency’s ambition.
          </p>

          <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-neutral-300 bg-white p-1 text-sm">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full transition-all focus:outline-none ${
                !isYearly ? "bg-black text-white" : "text-neutral-600 hover:text-black"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`rounded-full px-7 py-2 transition-all focus:outline-none ${
                isYearly ? "bg-black text-white" : "text-neutral-600 hover:text-black"
              }`}
            >
              Yearly
            </button>
            <span className="pr-4 text-xs font-semibold text-[#ff6a00]">Save 20%</span>
          </div>

          {/* Already subscribed link */}
          <p className="mt-6 text-sm text-neutral-600">
            Already subscribed?{" "}
            <button
              onClick={() => setLoginModalOpen(true)}
              className="font-bold text-black hover:underline hover:text-[#ff6a00] focus:outline-none transition-colors"
            >
              Log In to your Account
            </button>
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map(({ name, price, sub, features, cta, popular, onClick }) => (
            <motion.div
              whileHover={{ y: -3 }}
              key={name}
              className={`relative rounded-2xl border bg-white p-8 ${
                popular ? "border-black shadow-[0_10px_40px_rgba(0,0,0,0.04)]" : "border-neutral-300"
              }`}
            >
              {popular && (
                <span className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-black px-5 py-2 text-xs font-bold text-white whitespace-nowrap">
                  Most Popular
                </span>
              )}
              <div className={popular ? "pt-10" : ""}>
                <h3 className="text-xl font-semibold">{name}</h3>
                <div className="mt-6 text-5xl font-black tracking-[-0.05em]">
                  {price}
                  <span className="text-base font-medium">{price !== "Custom" && " /mo"}</span>
                </div>
                <p className="mt-3 text-sm text-neutral-600">{sub}</p>
                <div className="my-8 h-px bg-neutral-200" />
                <ul className="space-y-5 text-sm text-neutral-800">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-black shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={popular ? "dark" : "light"}
                  className="mt-10 w-full"
                  onClick={onClick}
                >
                  {cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="mx-auto mb-8 flex items-center justify-center gap-3 text-sm text-neutral-600">
        <Lock size={16} /> Secure. Reliable. Built for agencies.
      </div>

      <div className="mx-auto mb-8 grid max-w-[1240px] divide-y rounded-2xl border border-neutral-300 bg-white md:grid-cols-3 md:divide-x md:divide-y-0">
        {[
          [Layers3, "Built for scale", "Grow your agency with powerful tools and workflows."],
          [Shield, "Enterprise-grade security", "Your data is protected with industry-leading standards."],
          [HelpCircle, "Human support", "Real people. Real support. When you need it."]
        ].map(([Icon, title, body]) => (
          <div key={title} className="flex gap-6 p-8">
            <Icon size={32} className="shrink-0 text-neutral-800" />
            <div>
              <h4 className="font-bold">{title}</h4>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{body}</p>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </main>
  );
};

export default PricingPage;
