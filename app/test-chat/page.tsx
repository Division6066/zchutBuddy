"use client";

import { RightsFinderChat } from "@/components/rights-finder/rights-finder-chat";

export default function TestChatPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4" dir="rtl">
          בדיקת צ'אט מוצא זכויות
        </h1>
        <div className="h-[600px]">
          <RightsFinderChat
            onSessionCreated={(id) => console.log("Session created:", id)}
          />
        </div>
      </div>
    </div>
  );
}

