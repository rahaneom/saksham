import { Link } from "react-router-dom";
import { CalendarCheck, BookOpenText, Users, MessageCircleHeart } from "lucide-react";

function Footer() {
  return (
    <footer className="footer footer-center bg-base-200 text-base-content rounded p-8 mt-12 border-t border-base-300">
      <nav className="grid grid-flow-col gap-3 text-sm md:text-base">
        <Link
          to="/booking"
          className="link link-hover hover:bg-base-300 transition-colors rounded px-2 py-1 inline-flex items-center gap-2"
        >
          <CalendarCheck size={16} />
          Counselling
        </Link>
        <Link
          to="/resources"
          className="link link-hover hover:bg-base-300 transition-colors rounded px-2 py-1 inline-flex items-center gap-2"
        >
          <BookOpenText size={16} />
          Wellness Resources
        </Link>
        <Link
          to="/forum"
          className="link link-hover hover:bg-base-300 transition-colors rounded px-2 py-1 inline-flex items-center gap-2"
        >
          <Users size={16} />
          Community
        </Link>
        <Link
          to="/chatbot"
          className="link link-hover hover:bg-base-300 transition-colors rounded px-2 py-1 inline-flex items-center gap-2"
        >
          <MessageCircleHeart size={16} />
          Support
        </Link>
      </nav>
      <aside>
        <p>Copyright © {new Date().getFullYear()} - All rights reserved by Saksham</p>
      </aside>
    </footer>
  );
}

export default Footer;
