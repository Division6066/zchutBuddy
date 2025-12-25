#!/usr/bin/env node

/**
 * Query OpenRouter API to get list of available free models
 */

const apiKey = process.env.OPENROUTER_API_KEY || "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";

async function getModels() {
  console.log("🔍 Fetching available models from OpenRouter...\n");

  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("❌ Error:", response.status, error);
      return;
    }

    const data = await response.json();
    const models = data.data || [];

    // Filter for free models
    const freeModels = models.filter(
      (model) => model.pricing?.prompt === "0" || model.id?.includes(":free")
    );

    console.log(`📊 Found ${models.length} total models`);
    console.log(`🆓 Found ${freeModels.length} free models\n`);

    // Group by provider
    const byProvider = {};
    freeModels.forEach((model) => {
      const provider = model.id.split("/")[0];
      if (!byProvider[provider]) {
        byProvider[provider] = [];
      }
      byProvider[provider].push({
        id: model.id,
        name: model.name,
        context_length: model.context_length,
      });
    });

    console.log("🆓 FREE MODELS BY PROVIDER:\n");
    Object.entries(byProvider)
      .sort()
      .forEach(([provider, models]) => {
        console.log(`\n📦 ${provider.toUpperCase()}:`);
        models.forEach((model) => {
          console.log(`   • ${model.id}`);
          console.log(`     Name: ${model.name}`);
          console.log(`     Context: ${model.context_length?.toLocaleString() || "N/A"} tokens`);
        });
      });

    // Look for specific models we're interested in
    console.log("\n\n🔎 LOOKING FOR SPECIFIC MODELS:\n");
    const targetModels = [
      "meta-llama",
      "deepseek",
      "google/gemini",
      "mistralai/mistral",
    ];

    targetModels.forEach((searchTerm) => {
      const matches = models.filter((m) =>
        m.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (matches.length > 0) {
        console.log(`\n${searchTerm}:`);
        matches.forEach((m) => {
          const isFree = m.pricing?.prompt === "0" || m.id?.includes(":free");
          console.log(
            `  ${isFree ? "🆓" : "💰"} ${m.id} ${isFree ? "(FREE)" : ""}`
          );
        });
      }
    });
  } catch (error) {
    console.error("❌ Request failed:", error.message);
  }
}

getModels();

