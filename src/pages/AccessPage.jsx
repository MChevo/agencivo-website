import React, { useState } from "react";
import { ArrowRight, Shield, Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import Button from "../components/Button";
import DotField from "../components/DotField";
import DotGrid from "../components/DotGrid";
import Footer from "../components/Footer";

export const AccessPage = () => {
  const { go, validateCode } = useApp();
  const [code, setCode] = useState("AC-7X9P-L2Q4");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter a project code.");
      return;
    }
    const validatedBrief = await validateCode(code);
    if (validatedBrief) {
      setError("");
      if (validatedBrief.status && validatedBrief.status !== "Code Unused") {
        go("submitted");
      } else {
        go("brief");
      }
    } else {
      setError("Invalid project code. Please try 'AC-7X9P-L2Q4', 'AC-1234-ABCD', or check with your agency.");
    }
  };

  const handleInputChange = (e) => {
    let val = e.target.value.toUpperCase();
    // Help users format as AC-XXXX-XXXX if they are typing it in
    // Just simple formatting or normal text
    setCode(val);
    if (error) setError("");
  };

  return (
    <main className="relative overflow-hidden bg-[#fbfbfa]">
      <DotGrid className="absolute left-12 top-24" />
      <DotField className="-right-10 top-40 h-[520px] w-[450px]" dense />
      <DotField className="-left-28 bottom-60 h-[300px] w-[420px]" dense />

      <section className="mx-auto grid min-h-[680px] max-w-[1360px] grid-cols-1 items-center gap-10 px-8 py-16 lg:grid-cols-2 lg:px-12">
        <div>
          <h1 className="text-7xl font-black leading-[0.94] tracking-[-0.07em] xl:text-[100px]">
            Client
            <br />
            Access
          </h1>
          <p className="mt-8 max-w-[360px] text-3xl leading-tight tracking-[-0.04em] text-neutral-700">
            Enter your project code to access your brief.
          </p>
          <Plus className="mt-24 text-neutral-600" />
        </div>

        <div>
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-neutral-300 bg-white p-9 shadow-[0_10px_40px_rgba(0,0,0,0.025)]"
          >
            <label htmlFor="project-code" className="text-lg font-bold text-black block">
              Project Code
            </label>
            <input
              id="project-code"
              type="text"
              value={code}
              onChange={handleInputChange}
              placeholder="AC-XXXX-XXXX"
              className="mt-6 w-full rounded-xl border border-neutral-300 bg-white px-6 py-5 font-mono text-3xl tracking-[0.08em] text-neutral-800 outline-none focus:border-black"
            />
            {error && (
              <p className="mt-3 text-sm font-semibold text-[#ff6a00]" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" className="mt-7 w-full py-4 text-base">
              Access Brief <ArrowRight size={18} />
            </Button>
            <p className="mt-8 text-base leading-7 text-neutral-700">
              Don’t have a code?
              <br />
              Contact your agency.
            </p>
          </form>
          <p className="mt-10 flex justify-center gap-3 text-sm text-neutral-600">
            <Shield size={16} /> Secure. Reliable. Built for agencies.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default AccessPage;
