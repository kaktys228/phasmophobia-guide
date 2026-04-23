<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/c8453338-a500-40a7-967a-cfce6a65d038

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the AI variables in `.env.local`:
   Optional highest-priority provider: `PROXYAPI_OPENAI_API_KEY=...`
   Optional: `PROXYAPI_OPENAI_MODEL=gpt-5-nano`
   Optional: `PROXYAPI_OPENAI_BASE_URL=https://api.proxyapi.ru/openai/v1`
   `GEMINI_API_KEY=...`
   Optional: `GEMINI_MODEL=gemini-2.5-flash`
   Optional: `GEMINI_FALLBACK_MODELS=gemini-2.5-flash-lite,gemini-2.0-flash`
   Optional reserve provider: `GROQ_API_KEY=...`
   Optional: `GROQ_MODEL=openai/gpt-oss-20b`
3. Run the app:
   `npm run dev`

## Gemini Notes

- For the free Gemini Developer API flow in this project, the main required secret is `GEMINI_API_KEY`.
- If you want a higher-priority provider before Gemini, you can set `PROXYAPI_OPENAI_API_KEY` and the app will try ProxyAPI/OpenAI first.
- The default ProxyAPI/OpenAI model in this project is `gpt-5-nano` because it is the cheapest GPT-5 model in the OpenAI pricing table and it is listed by ProxyAPI among supported OpenAI models.
- ProxyAPI/OpenAI uses the OpenAI-compatible endpoint `https://api.proxyapi.ru/openai/v1`.
- For Gemini-only fallbacks you do not need any extra Google secret. The app can automatically switch to reserve Gemini models from `GEMINI_FALLBACK_MODELS` using the same key.
- If you also want an external reserve provider after Gemini quotas/errors, add `GROQ_API_KEY`.
- You do not need Yandex-style `folderId` or `modelUri`.
- Grounded search is done server-side through the local `/api/ai-identify` proxy, so the key is not exposed to the browser bundle.
- Gemini Developer API also requires that requests come from a supported country/IP. If you see `User location is not supported for the API use`, the key is valid but the request origin is blocked by Google region policy.
- Current fallback order in the app:
  `ProxyAPI/OpenAI primary model -> Gemini primary model -> Gemini fallback models -> Groq reserve model -> local heuristic analysis`
- Official docs:
  `https://proxyapi.ru/docs/openai-text-generation`
  `https://proxyapi.ru/docs/openai-models`
  `https://proxyapi.ru/docs/openai-compatible-api`
  `https://ai.google.dev/gemini-api/docs/api-key`
  `https://ai.google.dev/gemini-api/docs/quota`
  `https://ai.google.dev/gemini-api/docs/google-search`
  `https://ai.google.dev/gemini-api/docs/available-regions`
  `https://ai.google.dev/gemini-api/docs/pricing`
  `https://console.groq.com/docs/openai`
  `https://console.groq.com/docs/rate-limits`

## Windows Notes

- If PowerShell blocks `npm` with an execution policy error, use `npm.cmd install` and `npm.cmd run dev`.
- To preload local Phasmophobia images for evidence and cursed possessions, run:
  `npm run download:phasmo-media`
- AI search now goes through a local `/api/ai-identify` proxy served by the dev server, so the Gemini API key is not exposed to the browser bundle.
