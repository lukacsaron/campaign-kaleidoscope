# Campaign Kaleidoscope

A UTM link builder that remembers your campaigns, so the tags stay consistent across everyone tagging links.

## The problem it solves

UTM parameters only work if a team agrees on spelling. One person writes `utm_source=facebook`, the next writes `FB`, and the analytics report splits one channel into three rows. Every fix afterwards costs more than the discipline would have.

So: define a campaign once, pick it from a dropdown, and the builder writes `utm_campaign` from its slug. Sources and mediums come from a fixed list, with a free-text escape hatch for the cases the list does not cover.

## What it does

- Create campaigns with a name, a description and an auto-generated slug
- Build a tagged URL, validated before it lets you copy
- Keep every link you generated grouped under its campaign
- One-click copy, with a recent-links panel

Campaigns and links live in `localStorage`. No account, no server, no database. Each browser holds its own set, which suits a single marketer and does not suit a team sharing one list. Wiring it to a backend means replacing `src/hooks/useCampaigns.tsx` and nothing else.

Click tracking was in an early draft and I removed it. Redirecting through your own domain to count clicks means owning a redirect service, and the tags already do the counting in the analytics tool.

## Run it

```bash
npm install
npm run dev       # http://localhost:8080
```

```bash
docker compose up -d
```

nginx serves the built bundle. Configured for Coolify.

## Stack

Vite, React, TypeScript, Tailwind, shadcn/ui, framer-motion, React Router. Scaffolded with Lovable, then reworked by hand.

## Files

```
src/pages/Campaigns.tsx     campaign list and creation
src/pages/GenerateUTM.tsx   the builder
src/hooks/useCampaigns.tsx  localStorage persistence, the layer to replace
src/utils/utmUtils.ts       URL assembly, validation, source and medium lists
src/components/ui/          shadcn primitives
```

## License

MIT.
