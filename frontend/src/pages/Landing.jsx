import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import homeCircular from "../assets/continuum.svg";
import skyBg from "../assets/sky.png";
import emojiOne from "../assets/imgi_154_Frame_370079.svg";
import emojiTwo from "../assets/imgi_157_Frame_370079__2_.svg";
import emojiThree from "../assets/imgi_158_Frame_370346.svg";
import emojiFour from "../assets/imgi_159_Frame_370079__1_.svg";
import { BookOpen, Users, Bot, MessageCircle, ArrowDown } from "lucide-react";

function Landing() {
  const { user } = useSelector((state) => state.auth);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [statCounts, setStatCounts] = useState([0, 0, 0, 0]);

  const quotes = [
    "You do not have to control your thoughts, you only have to stop letting them control you.",
    "Small daily progress is still progress.",
    "Rest is not quitting. Rest is part of the journey.",
    "Your feelings are valid, and your growth is visible.",
    "Healing is not linear, but every step still counts.",
  ];

  const displayName = useMemo(() => {
    if (!user?.email) return "there";
    const local = user.email.split("@")[0] || "there";
    const firstName = local.split(/[._-]/)[0] || local;
    return firstName.charAt(0).toUpperCase() + firstName.slice(1);
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [quotes.length]);

  useEffect(() => {
    const targets = [4, 75, 87, 3];
    const duration = 1800;
    const frameMs = 30;
    const totalFrames = Math.round(duration / frameMs);
    let frame = 0;

    const counterTimer = setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);

      const nextValues = targets.map((target) =>
        Math.max(1, Math.round(target * progress)),
      );
      setStatCounts(nextValues);

      if (progress >= 1) {
        clearInterval(counterTimer);
      }
    }, frameMs);

    return () => clearInterval(counterTimer);
  }, []);

  const features = [
    {
      Icon: BookOpen,
      title: "Quality Resources",
      description:
        "Access curated content on mental wellness, stress management, and personal growth",
      topBg: "from-[#3d72b8] to-[#2f65ac]",
    },
    {
      Icon: Users,
      title: "Professional Support",
      description:
        "Book appointments with licensed counsellors for personalized guidance",
      topBg: "from-[#e19232] to-[#d98a2e]",
    },
    {
      Icon: Bot,
      title: "AI Chatbot",
      description: "Get instant support and answers to your questions 24/7",
      topBg: "from-[#1b5796] to-[#154f8d]",
    },
    {
      Icon: MessageCircle,
      title: "Community Forum",
      description:
        "Connect with peers, share experiences, and build supportive relationships",
      topBg: "from-[#0f6d80] to-[#0c6172]",
    },
  ];

  const statsData = [
    {
      format: "ratio",
      label: "students experience mental health challenges",
    },
    {
      format: "percent",
      label: "of mental health conditions begin before age 24",
    },
    {
      format: "percent",
      label: "students report academic stress",
    },
    {
      format: "ratio",
      label: "students struggle with sleep due to stress",
    },
  ];

  return (
    <div className="min-h-screen bg-base-100 animate-fadeIn">
      {/* Hero Section */}
      <section className="relative min-h-[106vh] flex items-center overflow-hidden px-4 py-32">
        {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(125,211,252,0.25),transparent_35%),radial-gradient(circle_at_75%_35%,rgba(186,230,253,0.2),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(153,246,228,0.16),transparent_40%),linear-gradient(140deg,#0c3f61_0%,#0a4d6d_45%,#0f5b63_100%)]"></div> */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.2),transparent_35%),linear-gradient(140deg,#5f9ea0_0%,#6fb1b7_45%,#a8dadc_100%)]"></div>
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.24)_1px,transparent_1px)] [background-size:22px_22px]"></div>
        <div className="absolute -top-10 right-[-8%] h-80 w-80 rounded-full bg-sky-200/20 blur-3xl"></div>
        <div className="absolute top-[28%] right-[16%] h-72 w-72 rounded-full bg-indigo-200/20 blur-2xl"></div>
        <div className="absolute -bottom-24 left-[42%] h-96 w-96 rounded-full bg-emerald-200/20 blur-3xl"></div>

        <div className="relative z-10 w-full max-w-6xl mx-auto grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          <div className="max-w-4xl lg:max-w-none">
            <h1 className="text-white text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.03] mb-6 animate-slideDown">
              {user ? `Welcome, ${displayName}` : "Mental Wellness Platform"}
            </h1>

            <p
              className="max-w-3xl mb-8 text-lg leading-relaxed sm:text-2xl text-slate-100/90 animate-slideUp"
              style={{ animationDelay: "0.1s" }}
            >
              {user
                ? "We are glad to see you again. Take a breath, settle in, and continue your journey with support that feels calm and human."
                : "A safe digital space for support, guidance, and meaningful progress in your emotional well-being."}
            </p>

            <div
              className="max-w-3xl px-6 py-4 mb-10 border rounded-2xl bg-white/10 backdrop-blur-md border-white/30 animate-slideUp"
              style={{ animationDelay: "0.15s" }}
            >
              <p className="text-base italic transition-all duration-700 text-slate-100 sm:text-lg">
                "{quotes[quoteIndex]}"
              </p>
            </div>

            <div
              className="flex flex-col gap-4 sm:flex-row mb-14 animate-slideUp"
              style={{ animationDelay: "0.2s" }}
            >
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="font-bold transition-all duration-300 border-0 shadow-lg btn btn-lg bg-sky-100 hover:bg-white text-sky-900 hover:shadow-2xl hover:-translate-y-1"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14.5a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2v-7a2 2 0 012-2h14.5z"
                      />
                    </svg>
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="font-bold text-white transition-all duration-300 btn btn-outline btn-lg border-white/70 hover:bg-white hover:text-sky-900"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    Create Account
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/resources"
                    className="font-bold transition-all duration-300 border-0 shadow-lg btn btn-lg bg-sky-100 hover:bg-white text-sky-900 hover:shadow-2xl hover:-translate-y-1"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.25m20-11.25c0 .822-.3 1.624-.857 2.25M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Explore More
                  </Link>
                </>
              )}
            </div>

            <div
              className="flex flex-wrap gap-8 text-sm mb-14 animate-slideUp"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center gap-2 text-slate-100/90">
                <svg
                  className="w-5 h-5 text-emerald-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>100% Confidential</span>
              </div>
              <div className="flex items-center gap-2 text-slate-100/90">
                <svg
                  className="w-5 h-5 text-emerald-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Professional Support</span>
              </div>
              <div className="flex items-center gap-2 text-slate-100/90">
                <svg
                  className="w-5 h-5 text-emerald-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>24/7 Available</span>
              </div>
            </div>
          </div>

        </div>

        <a
          href="#offerings"
          className="absolute z-20 inline-flex items-center justify-center transition-colors -translate-x-1/2 left-1/2 bottom-40 text-slate-100/90 hover:text-white"
        >
          <span className="grid border rounded-full h-14 w-14 border-cyan-300/60 place-items-center bg-white/5 backdrop-blur-sm">
            <ArrowDown size={26} strokeWidth={1.5} />
          </span>
        </a>

        {/* Inverted Curve (Hero Bottom Cut) */}
        <svg
          className="pointer-events-none absolute -bottom-px left-0 w-full h-[150px] md:h-[170px] z-[2]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fill="#f5f2ed"
            d="M0,0L48,32C96,64,192,128,288,160C384,192,480,192,576,165.3C672,139,768,85,864,85.3C960,85,1056,139,1152,149.3C1248,160,1344,128,1392,112L1440,96L1440,320L0,320Z"
          />
        </svg>
      </section>

      {/* Features Section */}
      <div id="offerings" className="bg-[#f5f2ed] py-20 px-4 relative">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-4xl font-bold text-center animate-slideUp">
            What We Offer
          </h2>

          <div className="flex gap-6 pb-2 overflow-x-auto lg:overflow-visible">
            {features.map((feature, index) => (
              <div
                key={index}
                className="min-w-[290px] lg:min-w-0 lg:flex-1 rounded-3xl border border-[#d9d6d1] bg-[#f5f2ed] shadow-[0_12px_24px_rgba(0,0,0,0.08)] overflow-hidden hover:-translate-y-1 transition-all duration-300 animate-slideUp"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div
                  className={`h-36 bg-gradient-to-r ${feature.topBg} relative`}
                >
                  <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.45)_48%,transparent_100%)]"></div>
                  <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.3)_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <div className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(58deg,transparent_0_34px,rgba(255,255,255,0.5)_34px_36px)]"></div>
                  <div className="relative flex items-center h-full gap-3 px-6 text-white">
                    <feature.Icon size={50} strokeWidth={2.2} />
                    <h3 className="text-3xl font-bold leading-tight text-center">
                      {feature.title}
                    </h3>
                  </div>
                </div>

                <div className="px-6 py-7">
                  <p className="text-[1.06rem] text-[#243047] leading-8 text-center">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Well-Being Continuum Section */}
      <section className="bg-[#f5f2ed] pt-10 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-center md:text-4xl text-slate-900">
            Well-Being Continuum
          </h2>
          <p className="max-w-4xl mx-auto mb-10 text-base leading-relaxed text-center md:text-lg text-slate-800">
            Explore the spectrum of care from proactive wellness support to
            guided intervention, treatment, and long-term maintenance.
          </p>

          <img
            src={homeCircular}
            alt="Well-Being Continuum"
            className="object-contain w-full h-auto"
            loading="lazy"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(207,39,124,0.9),rgba(233,61,144,0.86))]"></div>
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(255,255,255,0.25)_1px,transparent_1px)] [background-size:18px_18px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14),transparent_35%),radial-gradient(circle_at_80%_75%,rgba(255,255,255,0.1),transparent_35%)]"></div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-10 text-center text-white sm:grid-cols-2 lg:grid-cols-4">
            {statsData.map((item, index) => {
              const displayValue =
                item.format === "ratio"
                  ? `1 in ${statCounts[index]}`
                  : `${statCounts[index]}%`;

              return (
                <div key={item.label}>
                  <p className="mb-4 text-5xl italic font-extrabold tracking-tight md:text-6xl">
                    {displayValue}
                  </p>
                  <p className="text-xs md:text-sm uppercase tracking-[0.2em] font-semibold leading-relaxed max-w-[17rem] mx-auto">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Sky CTA Section */}
      <section className="bg-[#f5f2ed] px-4 pb-16 pt-28">
        <div
          className="relative max-w-6xl mx-auto rounded-[2rem] overflow-hidden min-h-[300px] md:min-h-[500px] shadow-[0_24px_60px_rgba(10,77,109,0.2)]"
          style={{
            backgroundImage: `linear-gradient(120deg,rgba(10,77,109,0.22),rgba(79,155,220,0.1)),url(${skyBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_25%,rgba(255,255,255,0.2),transparent_35%),radial-gradient(circle_at_80%_75%,rgba(255,255,255,0.16),transparent_40%)]"></div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 py-24 text-center md:px-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border rounded-full border-white/60 bg-white/15 backdrop-blur-sm">
              <img src={emojiOne} alt="mood icon" className="w-6 h-6" />
              <img src={emojiTwo} alt="mood icon" className="w-6 h-6 -ml-2" />
              <img src={emojiThree} alt="mood icon" className="w-6 h-6 -ml-2" />
              <span className="ml-1 text-sm font-semibold tracking-wide text-white/95 md:text-base">
                Join thousands improving daily
              </span>
            </div>

            <h3 className="text-white text-3xl sm:text-4xl md:text-6xl font-bold leading-[1.08] max-w-4xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
              Build healthier habits with Saksham every day
            </h3>

            <Link
              to={user ? "/resources" : "/register"}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#2e2f33] hover:bg-[#242529] text-white font-bold px-8 py-3 text-base md:text-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              {user ? "Explore Now" : "Get Started Free"}
            </Link>
          </div>

          <img
            src={emojiOne}
            alt="emoji bubble"
            className="absolute z-10 p-2 rounded-full shadow-lg h-14 w-14 md:h-16 md:w-16 left-10 md:left-16 top-12 bg-white/85 backdrop-blur-sm"
          />
          <img
            src={emojiTwo}
            alt="emoji bubble"
            className="absolute z-10 p-2 rounded-full shadow-lg h-14 w-14 md:h-16 md:w-16 right-8 md:right-16 top-16 bg-white/85 backdrop-blur-sm"
          />
          <img
            src={emojiThree}
            alt="emoji bubble"
            className="absolute z-10 p-2 rounded-full shadow-lg h-14 w-14 md:h-16 md:w-16 left-24 md:left-48 bottom-10 bg-white/85 backdrop-blur-sm"
          />
          <img
            src={emojiFour}
            alt="emoji bubble"
            className="absolute z-10 p-2 rounded-full shadow-lg h-14 w-14 md:h-16 md:w-16 right-10 md:right-40 bottom-10 bg-white/85 backdrop-blur-sm"
          />
        </div>
      </section>
    </div>
  );
}

export default Landing;
