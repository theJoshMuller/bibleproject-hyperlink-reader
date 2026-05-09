# BibleProject Hyperlink Reader

BibleProject Hyperlink Reader is a static-first PWA Bible reader concept intended for open-source release once application and content licensing boundaries are settled. Its aim is to help readers follow evidence-backed thematic links through Scripture, with insight data extracted from BibleProject podcast and course material through an agentic QC pipeline.

This is an independent project and is not affiliated with, endorsed by, or sponsored by BibleProject. BibleProject content use remains subject to BibleProject's own terms and licensing.

The reader should make the Bible text usable offline, especially on phones and e-reader-like screens. The data model starts with the Berean Standard Bible (BSB), then leaves room for a later translation abstraction once the reader substrate is stable.

## Current Phase

This repository is in Phase 0: scaffold, source policy, schemas, and workflow documentation. Phase 0 does not implement the app UI, download Bible text, ingest media, fetch transcripts, or synthesize insight data.

Phase 1 is expected to build the BSB reader substrate and the mechanical data validators needed by the app.

## Core Constraints

- Insights must be BibleProject-explicit. Agents may summarize what an approved source span says, but they must not invent theology or publish synthetic claims that are not grounded in BibleProject material.
- The app is static-first and offline-capable. The runtime should consume approved JSON packets and manifests, not reach into raw source media.
- Mobile and e-reader ergonomics come first. Desktop can be excellent, but it should not drive the core reading model.
- BSB is first. Multi-translation support is a later abstraction and should not complicate the Phase 1 substrate prematurely.
- Raw audio, transcripts, downloaded metadata, and working media artifacts live outside git under `/home/yeshu/media/bibleproject-reader`.
- Scripts and tools may validate structure, build static assets, and check mechanical consistency. Agents and reviewers make source-pairing and theological or semantic decisions.

## Source Policy Summary

The source workflow separates raw material, evidence artifacts, review decisions, and published app data.

Source records describe known BibleProject material. Pairing packets document evidence for whether two source records belong together; they are reviewed artifacts, not authoritative script output. Insight packets must cite source spans using `start_seconds` and `end_seconds`, then pass theological and source-fidelity review before publication.

Extractor agents do not write directly to published data. Approved packets are promoted by a data steward after review.

Content licensing needs explicit review before redistribution. This repository does not imply that BibleProject transcripts, audio, course material, or derived source excerpts are freely redistributable. The app license is still TBD; a permissive open-source license is recommended for original application code once content licensing boundaries are settled.

## Orientation

- [Architecture](docs/architecture.md) describes the static app, local pipeline, and media boundary.
- [Agentic Source Workflow](docs/agentic-source-workflow.md) defines the agent and reviewer roles.
- [Data Layout](docs/data-layout.md) documents the repo layout and the external media root.
- [QC Gates](docs/qc-gates.md) defines the required review gates.
- [Initial Thin Slice](docs/initial-thin-slice.md) scopes the first theme slice.
- [`schemas/`](schemas) contains draft JSON Schemas for source records, pairing packets, insight packets, relation packets, and themes.
- [`data/themes/dragon-chaos-waters.json`](data/themes/dragon-chaos-waters.json) is the only seed theme metadata in Phase 0.
