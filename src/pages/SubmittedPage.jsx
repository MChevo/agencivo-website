import React, { useState } from "react";
import { Check, ExternalLink, Mail, Eye, Users, Sparkles, ArrowRight, Plus, Star, Award, MessageSquare } from "lucide-react";
import { useApp } from "../context/AppContext";
import Button from "../components/Button";
import DotField from "../components/DotField";
import DotGrid from "../components/DotGrid";
import Footer from "../components/Footer";

export const SubmittedPage = () => {
  const { go, briefs, selectedBriefId, clearDraft, submitBriefFeedback } = useApp();

  // Ratings form states
  const [designRating, setDesignRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState("");

  // Find the recently submitted brief or fallback to the first one
  const currentBrief = briefs.find((b) => b.id === selectedBriefId) || briefs[0] || {};

  const handleStartAnotherBrief = () => {
    clearDraft();
    go("brief");
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!currentBrief.id) return;
    
    setLoading(true);
    const success = await submitBriefFeedback(currentBrief.id, {
      designRating,
      serviceRating,
      comments: comments.trim()
    });
    setLoading(false);

    if (success) {
      setFeedbackSuccess("تم إرسال تقييمك بنجاح! شكراً لمساعدتنا في تحسين خدماتنا.");
    } else {
      alert("عذراً، فشل إرسال التقييم. يرجى المحاولة مرة أخرى.");
    }
  };

  const formattedDate = currentBrief.submittedAt
    ? new Date(currentBrief.submittedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "Recently";

  // Determine active step index based on brief status
  // Statuses: "Code Unused", "New", "In Progress", "Review", "Completed"
  const getStatusStep = () => {
    switch (currentBrief.status) {
      case "New":
        return 1;
      case "In Progress":
        return 2;
      case "Review":
        return 3;
      case "Completed":
        return 4;
      default:
        return 1;
    }
  };

  const activeStep = getStatusStep();

  const steps = [
    { no: "01", label: "تم الإرسال", desc: "استلمنا تفاصيل مشروعك بنجاح.", key: "New" },
    { no: "02", label: "قيد التنفيذ", desc: "يعمل فريقنا حالياً على التصميمات.", key: "In Progress" },
    { no: "03", label: "المراجعة النهائية", desc: "التصميمات جاهزة بانتظار رأيك.", key: "Review" },
    { no: "04", label: "اكتمل المشروع", desc: "تم تسليم الملفات النهائية بنجاح.", key: "Completed" }
  ];

  return (
    <main className="relative bg-[#fbfbfa] px-8 py-10 lg:px-12">
      <DotGrid className="absolute left-12 top-24" />
      <DotField className="right-12 top-72 h-72 w-72" dense />

      <section className="mx-auto max-w-[1080px] text-center">
        
        {/* Success Icon branded */}
        <div 
          style={{ borderColor: "var(--brand-accent)", color: "var(--brand-accent)" }}
          className="mx-auto mt-10 flex h-20 w-20 items-center justify-center rounded-full border-2 bg-white shadow-sm"
        >
          <Check size={40} />
        </div>
        
        <h1 className="mt-8 text-6xl font-black tracking-[-0.06em]">Client Portal</h1>
        <p className="mt-4 text-xl text-neutral-700">تتبع حالة مشروعك والملفات الخاصة بك مباشرة.</p>
        <p className="mt-3 text-sm text-neutral-600">
          يمكنك مراجعة حالة التصميمات في الجدول أدناه، وبمجرد اكتمالها يمكنك تقييم الخدمة.
        </p>

        {/* Live Status Tracker Progress Stepper */}
        <div className="mt-12 rounded-2xl border border-neutral-200 bg-white p-8 text-left shadow-xs">
          <h3 className="text-lg font-bold text-black mb-8 flex items-center gap-2">
            <span style={{ backgroundColor: "var(--brand-accent)" }} className="h-2 w-2 rounded-full" />
            حالة خط الإنتاج الحالي (Live Project Pipeline)
          </h3>
          
          <div className="grid gap-6 md:grid-cols-4 relative">
            {steps.map((st, idx) => {
              const stepNum = idx + 1;
              const isDone = stepNum < activeStep;
              const isActive = stepNum === activeStep;
              const isFuture = stepNum > activeStep;

              return (
                <div key={st.no} className="relative flex flex-col items-start p-4 rounded-xl border border-neutral-100 bg-neutral-50/50">
                  <div className="flex items-center gap-3">
                    <span 
                      style={
                        isDone || isActive
                          ? { backgroundColor: "var(--brand-accent)", borderColor: "var(--brand-accent)", color: "white" }
                          : { backgroundColor: "white", borderColor: "#d4d4d4", color: "#737373" }
                      }
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-bold text-xs"
                    >
                      {isDone ? <Check size={14} /> : st.no}
                    </span>
                    <span className={`text-sm font-bold ${isActive ? "text-black" : "text-neutral-500"}`}>
                      {st.label}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-neutral-500 leading-relaxed">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Project Feedback/Voting Form */}
        {(currentBrief.status === "Review" || currentBrief.status === "Completed") && (
          <div className="mt-8 rounded-2xl border border-neutral-300 bg-white p-8 text-left relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 bg-neutral-50 rounded-full opacity-50" />
            <h3 className="text-2xl font-black text-black mb-2 flex items-center gap-2">
              <Award style={{ color: "var(--brand-accent)" }} size={24} />
              تقييم جودة المشروع (Project Voting & Feedback)
            </h3>
            <p className="text-xs text-neutral-500 mb-6">يسعدنا جداً معرفة رأيك حول مخرجات العمل وجودة التواصل لتطوير خدماتنا.</p>

            {feedbackSuccess ? (
              <div className="p-4 rounded-xl border border-green-200 bg-green-50 text-green-700 text-sm font-semibold flex items-center gap-2">
                <Check size={16} />
                {feedbackSuccess}
              </div>
            ) : currentBrief.feedback ? (
              <div className="p-6 rounded-xl border border-neutral-200 bg-neutral-50 space-y-4">
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">تم استلام تقييمك بنجاح</p>
                <div className="flex gap-8 text-sm font-semibold text-neutral-800">
                  <span className="flex items-center gap-1.5">
                    راضي عن التصميمات: 
                    <span className="flex text-amber-500">
                      {Array.from({ length: currentBrief.feedback.designRating }).map((_, i) => (
                        <Star key={i} size={14} className="fill-amber-500 text-amber-500" />
                      ))}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    راضي عن الخدمة والتواصل: 
                    <span className="flex text-amber-500">
                      {Array.from({ length: currentBrief.feedback.serviceRating }).map((_, i) => (
                        <Star key={i} size={14} className="fill-amber-500 text-amber-500" />
                      ))}
                    </span>
                  </span>
                </div>
                {currentBrief.feedback.comments && (
                  <p className="text-xs text-neutral-600 italic mt-2 border-t border-neutral-200 pt-3">
                    ملاحظاتك: "{currentBrief.feedback.comments}"
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                      راضي عن التصميمات؟ (Design Quality)
                    </label>
                    <div className="flex gap-2.5">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button
                          key={stars}
                          type="button"
                          onClick={() => setDesignRating(stars)}
                          className="p-1 focus:outline-none hover:scale-110 transition-transform"
                          aria-label={`Rate ${stars} stars`}
                        >
                          <Star 
                            size={24} 
                            className={stars <= designRating ? "fill-amber-500 text-amber-500" : "text-neutral-300"} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                      راضي عن الخدمة والتواصل؟ (Service & Communication)
                    </label>
                    <div className="flex gap-2.5">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button
                          key={stars}
                          type="button"
                          onClick={() => setServiceRating(stars)}
                          className="p-1 focus:outline-none hover:scale-110 transition-transform"
                          aria-label={`Rate ${stars} stars`}
                        >
                          <Star 
                            size={24} 
                            className={stars <= serviceRating ? "fill-amber-500 text-amber-500" : "text-neutral-300"} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                    ملاحظات أو تعليقات إضافية
                  </label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="اكتب أي ملاحظات ترغب في مشاركتها مع الوكالة..."
                    className="w-full rounded-xl border border-neutral-300 p-4 text-sm outline-none focus:border-black bg-white h-24 resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="px-8 py-3.5 flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  {loading ? "جاري الإرسال..." : "إرسال التقييم"}
                </Button>
              </form>
            )}
          </div>
        )}

        {/* Dynamic Brief Summary Box */}
        <div className="mt-8 rounded-2xl border border-neutral-300 bg-white p-8 text-left shadow-xs">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-neutral-500">
                Submitted Brief Details
              </div>
              <h2 className="mt-4 text-2xl font-bold">{currentBrief.brandName || "Untitled Project"}</h2>
              <p className="mt-2 text-sm text-neutral-600">Submitted on {formattedDate}</p>
            </div>
            <Button variant="light" onClick={() => go("details")} className="text-xs border border-neutral-300 hover:border-black">
              View Brief Details <ExternalLink size={15} />
            </Button>
          </div>

          <div className="mt-8 grid gap-6 border-t border-neutral-200 pt-6 md:grid-cols-3">
            {[
              ["BRAND NAME", currentBrief.brandName || "-"],
              ["PROJECT TYPE", currentBrief.projectType || "-"],
              ["VISUAL IDENTITY", currentBrief.identityVision ? currentBrief.identityVision.slice(0, 80) + (currentBrief.identityVision.length > 80 ? "..." : "") : "-"],
              [
                "BRAND COLORS",
                currentBrief.colors?.length > 0
                  ? currentBrief.colors.map((c) => c.hex).join("   ")
                  : "None specified"
              ],
              [
                "TARGET AUDIENCE",
                currentBrief.targetAgeMin && currentBrief.targetAgeMax
                  ? `${currentBrief.targetAgeMin}–${currentBrief.targetAgeMax} years old`
                  : "-"
              ],
              ["TIMELINE", "4–6 weeks"],
              [
                "DELIVERABLES",
                currentBrief.requiredDesigns?.length > 0
                  ? currentBrief.requiredDesigns.map((d) => `${d.name} (${d.quantity})`).join(", ")
                  : "None"
              ],
              ["ADDITIONAL NOTES", currentBrief.notes || "None specified"]
            ].map(([a, b]) => (
              <div key={a}>
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">{a}</div>
                <p className="mt-3 text-sm font-semibold leading-6 text-neutral-800 break-words">{b}</p>
              </div>
            ))}
          </div>
        </div>

        <h3 className="mt-12 text-2xl font-bold">What happens next?</h3>
        <div className="mt-8 grid gap-6 md:grid-cols-4">
          {[
            [Mail, "01", "Brief Received", "We’ve received your brief and it’s in our queue."],
            [Eye, "02", "Under Review", "Our team will review your brief and project details."],
            [Users, "03", "Agency Notified", "The agency has been notified about your project."],
            [MessageSquare, "04", "Chat Active", "Your project chat room is open for questions."]
          ].map(([Icon, n, t, b]) => (
            <div key={t} className="flex flex-col items-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-neutral-300 bg-white">
                <Icon size={20} className="text-black" />
              </div>
              <div 
                style={{ color: "var(--brand-accent)" }}
                className="mt-4 text-xs font-bold"
              >
                {n}
              </div>
              <h4 className="font-bold text-black mt-1">{t}</h4>
              <p className="mt-2 text-xs leading-5 text-neutral-600 max-w-[200px]">{b}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between rounded-2xl border border-neutral-300 bg-white p-5 text-left gap-4">
          <div className="flex items-center gap-5">
            <Sparkles style={{ color: "var(--brand-accent)" }} className="shrink-0" />
            <div>
              <b className="text-black">We’re excited to help bring your vision to life.</b>
              <p className="text-sm text-neutral-600">In the meantime, explore our platform or start a new brief.</p>
            </div>
          </div>
          <Button onClick={handleStartAnotherBrief} className="w-full md:w-auto shrink-0">
            Start Another Brief <Plus size={16} />
          </Button>
        </div>

        <div className="mt-8 flex justify-center gap-5 flex-wrap">
          <Button onClick={() => go("home")}>
            Back to Home <ArrowRight size={16} />
          </Button>
          <Button variant="light" onClick={() => go("dashboard")}>
            View Dashboard
          </Button>
        </div>
      </section>
      <div className="mt-12">
        <Footer compact />
      </div>
    </main>
  );
};

export default SubmittedPage;
