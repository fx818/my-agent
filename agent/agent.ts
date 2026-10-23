import { defineAgent } from "eve";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

// Self-hosted LiteLLM gateway (OpenAI-compatible API).
const litellm = createOpenAICompatible({
  name: "litellm",
  baseURL: process.env.LITELLM_BASE_URL ?? "https://imllm.intermesh.net/v1",
  apiKey: process.env.LITELLM_API_KEY,
});

export default defineAgent({
  // Model id/alias exactly as it appears in the LiteLLM config.
  // Haiku 4.5 costs $1/$5 per MTok vs Sonnet 5's $2/$10 — half the price, and
  // plenty for itinerary drafting. Swap LITELLM_MODEL to trade up.
  model: litellm(process.env.LITELLM_MODEL ?? "anthropic/claude-haiku-4.5"),
  // LiteLLM is a direct provider, so eve can't read the context window from the
  // AI Gateway catalog — set it here to match the model. Haiku 4.5 is 200K.
  modelContextWindowTokens: Number(process.env.LITELLM_CONTEXT_WINDOW ?? 200_000),
});