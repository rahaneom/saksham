import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BookOpen, Calendar, Bot, MessageCircle } from "lucide-react";

function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  const features = [
    {
      title: "Resources",
      description: "Access curated mental wellness resources and materials",
      link: "/resources",
      Icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      delay: "0.1s",
    },
    {
      title: "Booking",
      description: "Schedule appointments with professional counsellors",
      link: "/booking",
      Icon: Calendar,
      color: "from-purple-500 to-purple-600",
      delay: "0.2s",
    },
    {
      title: "Chatbot",
      description: "Get instant support and guidance from AI chatbot",
      link: "/chatbot",
      Icon: Bot,
      color: "from-green-500 to-green-600",
      delay: "0.3s",
    },
    {
      title: "Forum",
      description: "Connect and share experiences with community members",
      link: "/forum",
      Icon: MessageCircle,
      color: "from-pink-500 to-pink-600",
      delay: "0.4s",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200 py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 animate-slideDown">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Welcome, {user?.email?.split("@")[0]}!
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl">
            Your personal wellness hub. Explore resources, book consultations, chat with AI, and connect with our community.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-slideUp" style={{ animationDelay: "0.05s" }}>
          <div className="card bg-base-100 shadow-lg border border-base-300 p-4 hover:shadow-xl transition-all duration-300">
            <div className="text-primary text-3xl font-bold">4</div>
            <div className="text-base-content/70 text-sm">Services Available</div>
          </div>
          <div className="card bg-base-100 shadow-lg border border-base-300 p-4 hover:shadow-xl transition-all duration-300">
            <div className="text-secondary text-3xl font-bold">∞</div>
            <div className="text-base-content/70 text-sm">Resources</div>
          </div>
          <div className="card bg-base-100 shadow-lg border border-base-300 p-4 hover:shadow-xl transition-all duration-300">
            <div className="text-success text-3xl font-bold">24/7</div>
            <div className="text-base-content/70 text-sm">Support Ready</div>
          </div>
          <div className="card bg-base-100 shadow-lg border border-base-300 p-4 hover:shadow-xl transition-all duration-300">
            <div className="text-accent text-3xl font-bold">100%</div>
            <div className="text-base-content/70 text-sm">Confidential</div>
          </div>
        </div>

        {/* Main Services Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-base-content animate-slideUp" style={{ animationDelay: "0.1s" }}>
            Explore Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link
                to={feature.link}
                key={feature.title}
                className="group h-full animate-slideUp"
                style={{ animationDelay: feature.delay }}
              >
                <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-lg border border-base-300 h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden">
                  {/* Gradient Background */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full -mr-10 -mt-10`}></div>

                  <div className="card-body relative z-10">
                    {/* Icon */}
                    <div className="mb-3 group-hover:scale-110 transition-transform duration-300">
                      <feature.Icon size={48} className="text-primary" />
                    </div>

                    {/* Title */}
                    <h2 className="card-title text-xl font-bold group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-base-content/70 flex-grow">
                      {feature.description}
                    </p>

                    {/* Arrow */}
                    <div className="flex justify-between items-center pt-4 border-t border-base-300">
                      <span className="text-xs font-semibold text-primary">Explore →</span>
                      <svg
                        className="w-5 h-5 text-primary transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* How It Works */}
          <div className="card bg-base-100 shadow-lg border border-base-300 animate-slideUp" style={{ animationDelay: "0.5s" }}>
            <div className="card-body">
              <h3 className="card-title text-xl font-bold mb-4">How It Works</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">1.</span>
                  <span className="text-base-content/70">Explore resources and materials tailored to your needs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">2.</span>
                  <span className="text-base-content/70">Schedule appointments with qualified counsellors</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">3.</span>
                  <span className="text-base-content/70">Chat with AI for immediate guidance and support</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">4.</span>
                  <span className="text-base-content/70">Join our supportive community forum</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-lg border border-base-300 animate-slideUp" style={{ animationDelay: "0.6s" }}>
            <div className="card-body">
              <h3 className="card-title text-xl font-bold mb-4">💡 Quick Tips</h3>
              <ul className="space-y-3 text-sm text-base-content/70">
                <li>✓ Start with resources relevant to your concerns</li>
                <li>✓ Use our chatbot for 24/7 instant support</li>
                <li>✓ Book appointments in advance for better slots</li>
                <li>✓ Engage with the community for shared experiences</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center animate-slideUp" style={{ animationDelay: "0.7s" }}>
          <p className="text-base-content/60 text-sm">
            Need immediate help? Use our 24/7 chatbot or emergency services.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;