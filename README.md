# BibleProject Hyperlink Reader

BibleProject Hyperlink Reader is a static-first PWA Bible reader for following evidence-backed thematic links through Scripture. The current deployed MVP focuses on the **Dragon / Chaos Waters** theme and uses the public-domain **Berean Standard Bible (BSB)** as its reader substrate.

This is an independent project and is not affiliated with, endorsed by, or sponsored by BibleProject. BibleProject content use remains subject to BibleProject's own terms and licensing.

## Current MVP

The app now includes:

- Offline-capable static PWA shell.
- Full BSB text normalized by book/chapter/verse from [`https://bereanbible.com/bsb.txt`](https://bereanbible.com/bsb.txt).
- Mobile/e-reader-friendly reader UI with night and sepia modes.
- Dragon / Chaos Waters theme toggles, visual highlight markers, and an anchor trail.
- Source-linked seed insight packets that cite BibleProject public episode/video/guide pages and podcast chapter timestamps where available.
- Mechanical data validator for BSB structure, app JSON Schemas, verse anchors, sources, and timestamps.
- Vitest unit tests and Playwright browser tests.

## Important Source Policy

The MVP’s Dragon / Chaos Waters data is a **source-metadata seed**, not the final transcript-extracted corpus. It is designed to prove the reader/data shape while preserving the core policy:

- Agents may not invent theology.
- Transcript-derived claims require source-span evidence and QC before becoming approved data.
- Raw BibleProject audio/transcripts stay outside git under `/home/yeshu/media/bibleproject-reader`.
- This repo publishes only app code, public-domain Bible text, and lightweight source metadata/links.

## Development

```bash
npm install
npm run data:bsb      # regenerate public/data/bibles/bsb.json from BereanBible.com
npm run validate:data # mechanical data checks
npm run test          # unit tests
npm run build         # production build; generates dist/sw.js with hashed asset precache
npm run test:e2e      # Playwright browser tests against preview, including offline reload
npm run verify        # full local gate
npm run verify:netlify # Netlify build gate: data validation, unit tests, production build
```

## Orientation

- [Architecture](docs/architecture.md) describes the static app, local pipeline, and media boundary.
- [Agentic Source Workflow](docs/agentic-source-workflow.md) defines the agent and reviewer roles.
- [Data Layout](docs/data-layout.md) documents the repo layout and the external media root.
- [QC Gates](docs/qc-gates.md) defines the required review gates.
- [`schemas/`](schemas) contains JSON Schemas for app-consumed Bible/insight payloads plus draft source-record, pairing-packet, insight-packet, relation-packet, and theme review formats.
