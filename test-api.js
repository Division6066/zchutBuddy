#!/usr/bin/env node

/**
 * Simple test script to verify API model configuration
 * Usage: node test-api.js
 */

const testMessage = "מה זה תביעת נכות כללית?";

async function testAPI() {
  console.log("🧪 Testing API endpoint: POST /api/chat");
  console.log(`📝 Message: "${testMessage}"`);
  console.log("⏳ Sending request...\n");

  try {
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: testMessage,
      }),
    });

    const data = await response.json();

    console.log("📊 Response Status:", response.status);
    console.log("📦 Response Body:");
    console.log(JSON.stringify(data, null, 2));

    if (data.ok) {
      console.log("\n✅ API call successful!");
      if (data.data?.mode === "answer") {
        console.log("📄 Answer mode detected");
        console.log("🇮🇱 Hebrew:", data.data.answer?.he?.substring(0, 100) + "...");
        console.log("🇬🇧 English:", data.data.answer?.en?.substring(0, 100) + "...");
      } else if (data.data?.mode === "clarify") {
        console.log("❓ Clarify mode detected");
        console.log("Questions:", data.data.clarifying_questions?.length || 0);
      }
    } else {
      console.log("\n❌ API call failed!");
      console.log("Error:", data.error?.message || "Unknown error");
      if (data.error?.raw) {
        console.log("Raw error:", data.error.raw.substring(0, 200));
      }
    }
  } catch (error) {
    console.error("\n❌ Request failed:", error.message);
    if (error.code === "ECONNREFUSED") {
      console.error("💡 Make sure the dev server is running on http://localhost:3000");
    }
    process.exit(1);
  }
}

testAPI();
