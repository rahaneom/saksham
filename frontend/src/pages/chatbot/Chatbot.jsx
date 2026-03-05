import { Bot } from "lucide-react";

function Chatbot() {
  return (
    <div className="p-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl flex items-center gap-2">
            <Bot size={28} />
            AI Support Assistant
          </h2>
          <p className="py-4">
            Chat with our intelligent chatbot for instant mental wellness support and guidance.
          </p>
          <div className="alert alert-info">
            <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Coming soon - AI chatbot will be available shortly</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Chatbot;
