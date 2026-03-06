import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BookOpen, Users, Bot, MessageCircle } from "lucide-react";

function Landing() {
  const { user } = useSelector((state) => state.auth);

  const features = [
    {
      Icon: BookOpen,
      title: "Quality Resources",
      description: "Access curated content on mental wellness, stress management, and personal growth",
    },
    {
      Icon: Users,
      title: "Professional Support",
      description: "Book appointments with licensed counsellors for personalized guidance",
    },
    {
      Icon: Bot,
      title: "AI Chatbot",
      description: "Get instant support and answers to your questions 24/7",
    },
    {
      Icon: MessageCircle,
      title: "Community Forum",
      description: "Connect with peers, share experiences, and build supportive relationships",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200 animate-fadeIn">
      {/* Hero Section */}
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-40 h-40 bg-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-secondary opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          </div>

          <div className="relative z-10">
            {/* Main Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 animate-slideDown">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent inline-block">
                Welcome to Saksham
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-base-content/70 mb-8 max-w-3xl mx-auto animate-slideUp" style={{ animationDelay: "0.1s" }}>
              Your comprehensive mental wellness hub designed for students. Get support, quality resources, and professional guidance to navigate your wellness journey with confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slideUp" style={{ animationDelay: "0.2s" }}>
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="btn btn-primary btn-lg font-bold shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14.5a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2v-7a2 2 0 012-2h14.5z" />
                    </svg>
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-outline btn-lg font-bold border-2 hover:border-primary hover:shadow-lg transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Create Account
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="btn btn-primary btn-lg font-bold shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m2-2l6.553-3.276A1 1 0 0112 2c4.418 0 8-1.79 8-4m0 16l-2 3m-2 2l-6.553 3.276A1 1 0 0112 22c-4.418 0-8 1.79-8 4m0-16l2-3m2-2l6.553-3.276A1 1 0 0112 2" />
                    </svg>
                    Dashboard
                  </Link>
                  <Link
                    to="/resources"
                    className="btn btn-outline btn-lg font-bold border-2 hover:border-primary hover:shadow-lg transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.25m20-11.25c0 .822-.3 1.624-.857 2.25M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Resources
                  </Link>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 mb-20 text-sm animate-slideUp" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-2 text-base-content/70">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>100% Confidential</span>
              </div>
              <div className="flex items-center gap-2 text-base-content/70">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Professional Support</span>
              </div>
              <div className="flex items-center gap-2 text-base-content/70">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>24/7 Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-base-100 py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 animate-slideUp">What We Offer</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card bg-gradient-to-br from-base-200 to-base-100 shadow-lg border border-base-300 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-slideUp"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className="card-body">
                  <div className="mb-4">
                    <feature.Icon size={48} className="text-primary" />
                  </div>
                  <h3 className="card-title text-xl font-bold">{feature.title}</h3>
                  <p className="text-base-content/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-16 px-4 text-center bg-gradient-to-r from-primary/5 to-secondary/5 animate-slideUp">
        <h3 className="text-3xl font-bold mb-6">Ready to Start Your Wellness Journey?</h3>
        {!user ? (
          <Link to="/register" className="btn btn-primary btn-lg font-bold">
            Get Started Now
          </Link>
        ) : (
          <Link to="/dashboard" className="btn btn-primary btn-lg font-bold">
            Go to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}

export default Landing;