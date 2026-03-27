import { Link } from "react-router-dom";
import { CalendarCheck, BookOpenText, Users, MessageCircleHeart, Mail, Phone } from "lucide-react";

function Footer() {
  const footerCurvePath = "M0,96C240,60,480,24,720,24C960,24,1200,60,1440,96";

  return (
    <footer className="relative mt-24 text-white overflow-visible">
      <svg
        className="pointer-events-none absolute -top-24 left-0 w-full h-24"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="#33353a"
          d={`${footerCurvePath}L1440,120L0,120Z`}
        />
      </svg>

      <div className="relative -mt-px bg-[#33353a] px-6 py-24">
        <div className="mx-auto max-w-6xl mb-10 grid gap-5 md:grid-cols-2 md:items-center">
          <p className="text-slate-100 text-base md:text-xl leading-relaxed font-medium">
            Still have questions, or just need to talk it through? We are here to help
            no matter what you are looking for, or where you are starting from.
          </p>

          <div className="flex flex-col md:items-end gap-2 text-slate-200 text-sm md:text-base">
            <span className="font-semibold text-xl">Reach out anytime at:</span>
            <a href="mailto:support@pccoe.com" className="inline-flex items-center gap-2 text-xl hover:text-white transition-colors underline underline-offset-4">
              <Mail size={18} />
              support@pccoe.com
            </a>
            <a href="tel:+912071171501" className="inline-flex items-center gap-2 hover:text-white transition-colors underline underline-offset-4 text-xl">
              <Phone size={18} />
              +91 20 7117 1501
            </a>
          </div>
        </div>

        <nav className="mx-auto pt-10 max-w-6xl flex flex-wrap justify-center gap-3 text-sm md:text-base">
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-slate-100 hover:bg-white/15 transition-colors text-xl"
          >
            <CalendarCheck size={16} />
            Counselling
          </Link>
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-slate-100 hover:bg-white/15 transition-colors text-xl"
          >
            <BookOpenText size={16} />
            Wellness Resources
          </Link>
          <Link
            to="/forum"
            className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-slate-100 hover:bg-white/15 transition-colors text-xl"
          >
            <Users size={16} />
            Community
          </Link>
          <Link
            to="/chatbot"
            className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-slate-100 hover:bg-white/15 transition-colors text-xl"
          >
            <MessageCircleHeart size={16} />
            Support
          </Link>
        </nav>

        <aside className="mt-6 text-center text-slate-300 text-xl">
          <p>Copyright © {new Date().getFullYear()} - All rights reserved by Saksham</p>
        </aside>
      </div>
    </footer>
  );
}

export default Footer;
