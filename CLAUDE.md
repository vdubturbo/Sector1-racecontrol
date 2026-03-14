# Sector1 Race Control

Motorsports race control operations module for [Sector1](https://sector1.ai). Deployed at `racecontrol.sector1.ai`.

## Stack
- **Next.js 16** (App Router) / TypeScript / Tailwind CSS v4
- **Supabase** for auth and data (not yet wired)
- **Bridge server** (separate Node.js service) provides real-time race data via WebSocket

## Dev
```bash
npm run dev    # runs on port 3030
npm run build
npm run lint
```

## Architecture
- Multi-window panel system: main hub (`/`) spawns panels into separate browser windows via `window.open()`
- Each panel is a standalone route under `/panels/*` with its own WebSocket connection
- Panels coordinate via `BroadcastChannel` API (not yet implemented)
- Panel state tracked in main window via `usePanelManager` hook

## Design System
- Dark industrial/mission control aesthetic — NOT a generic dashboard
- Colors defined as CSS custom properties in `globals.css`, mapped to Tailwind via `@theme`
- Fonts: JetBrains Mono (data), IBM Plex Sans (UI)
- Key colors: bg `#111111`, surface `#1a1a1a`, accent orange `#e8751a`, text `#f0f0f0`
