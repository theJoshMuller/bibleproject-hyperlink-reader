# Architecture

The project is a static-first PWA Bible reader backed by reviewed JSON data. The app should be able to ship as static assets, cache its reader substrate for offline use, and consume approved packets and manifests without needing live network access at reading time.

## System Shape

The repository has two major concerns:

- The app repo contains source code, schemas, docs, seed theme metadata, approved packets, and generated app manifests that are safe to publish.
- The media root at `/home/yeshu/media/bibleproject-reader` contains raw audio, transcripts, metadata dumps, working notes, caches, and other source-processing artifacts that must stay out of git.

The local/STORMFATHER pipeline prepares evidence artifacts outside the runtime app. It may use mechanical helpers for validation, indexing, format conversion, and build output, but theological interpretation and source-pairing decisions belong to agents and reviewers.

## Data Flow

Raw BibleProject source material is stored under the external media root. Agents create source records, pairing packets, transcript-span evidence, and insight candidates from that material. Reviewers approve or reject those artifacts through the QC gates.

Only approved packets and generated app manifests are consumed by the app. Raw source media, unreviewed transcript work, and draft extraction notes are never runtime dependencies.

## Phase Boundary

Phase 0 establishes documentation and data contracts. Phase 1 can add the BSB reader substrate, app build tooling, and mechanical validators against these schemas. Phase 1 should still avoid downloading source media or publishing theological insight data until the workflow has reviewed source artifacts to consume.
