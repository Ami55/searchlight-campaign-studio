# Searchlight Campaign Studio

Eight workspaces in one app: Search Campaign Planner, Creative Experiment Lab, Growth Simulator, Campaign Analyst, Landing Page Lab, Budget Planner, Measurement Planner, and Incrementality Lab. The existing standalone app sources are unchanged. EchoLens is not included in this bundle.

## GitHub → Vercel

1. Upload the extracted ZIP contents to a repository named `searchlight-campaign-studio`. Include `api/`, `public/`, `scripts/`, `tests/`, package.json, vercel.json, .gitignore, and .env.example. Do not upload the ZIP itself.
2. Import into Vercel. Framework: **Other**. Root: repository root. Build command: `npm run build`. Output: `dist`. These settings are in vercel.json. Node.js 22+; no external packages required.

Only the Search Campaign Planner calls an AI provider. All other modules use code calculations, local wording checks, templates, and editable notes. No app launches ads or connects to ad-platform accounts. The optional API is a portfolio endpoint with request limits/timeouts but no user authentication or durable rate limit; restrict access when enabling paid AI.

## Shared context and data

Shared brand, audience, offer, primary goal and target CAC are available at the top. Applying context refreshes search and creative template drafts. The growth simulator's subscription assumptions remain independent. The studio uses CAD; import only CAD campaign amounts.

Existing modules are embedded as same-origin workspaces to retain their functionality. Each retains its own detailed export. Studio export/import saves shared context, the new module inputs, imported campaigns, budget assumptions, and visible embedded form inputs. It does **not** replace module-specific exports for complete generated AI plans or alternate growth scenarios. Re-run derived checks after restore. Unexported edits are lost on reload. No cloud storage is included.

Campaign Analyst accepts normalized baseline/current CSV rows, not arbitrary platform exports. Example data is synthetic. Avoid duplicate or overlapping rows and align period duration, conversion definitions, currency, and attribution windows. Channel references can be copied to Budget Planner, which applies explicit CPA assumptions and does not optimize from response curves.

Landing Page Lab compares pasted wording locally. It does not crawl, assess full semantics, or judge real page performance. Incrementality Lab computes a two-group conversion difference; causal interpretation requires randomized, independent assignment. Its approximate normal interval is suppressed for sparse outcomes and is unsuitable for clustered geo designs, repeated users, or sequential testing. No sample-size planning or causal guarantees are provided.

## Local checks

```
npm test
npm run build
```

Serve `public/` over HTTP to preview embedded modules. Local static hosting supports all tools except the server-backed AI request. Serve the full app through Vercel to use the AI endpoint.

© 2026 searchlight. Developed by SEO Girl - Ami. All rights reserved.

## Shared Gemini connection

The campaign planner uses `https://gemini-proxy-boldstudio.vercel.app/api/gemini` through `api/plan.js`. No app-specific key is required. The original campaign instructions and JSON schema are preserved, and every supplied keyword must appear exactly once. The remaining workspaces continue to use browser-side calculations and templates.
