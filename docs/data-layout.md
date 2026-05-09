# Data Layout

Raw media and working source artifacts live outside the repository. The exact local media root is:

```text
/home/yeshu/media/bibleproject-reader/
```

## External Media Root

The approved media-root layout is:

```text
/home/yeshu/media/bibleproject-reader/
  audio/
    podcast/
      {bp_source_id}.mp3
  source-pages/
    podcast-html/
      {bp_source_id}.html
    show-notes/
      {bp_source_id}.md
  transcripts/
    whisper-srt/
      {bp_source_id}.srt
    whisper-json/
      {bp_source_id}.json
  youtube/
    page-snapshots/
      {youtube_video_id}.html
    metadata/
      {youtube_video_id}.json
  packets/
    source-pairings/
      draft/
      needs_revision/
      approved/
    insights/
      draft/
      needs_revision/
      approved/
    relations/
      draft/
      needs_revision/
      approved/
  manifests/
    source-registry.json
    approved-source-pairings.json
    approved-insights.json
    approved-relations.json
  qc/
    reviewer-notes/
    rejected/
```

Raw audio, transcript output, source-page snapshots, YouTube metadata snapshots, draft packets, reviewer notes, and local pipeline logs belong here rather than in git.

## Repository Layout

The repo-side layout is expected to stay publishable:

```text
docs/                 Project architecture, workflow, and QC documentation
schemas/              JSON Schemas for app payloads and reviewed data packets
data/themes/          Seed and approved theme metadata
data/sources/         Approved source records when ready
data/packets/         Approved insight and relation packets when ready
data/manifests/       Generated app manifests when ready
src/                  PWA source code
public/               Static app assets and publishable MVP data payloads
```

Phase 0 created docs, schemas, and one seed theme metadata file. The Phase 1 deployed MVP adds app code plus two publishable app-consumed datasets under `public/data/`: the public-domain BSB reader payload and a clearly labeled Dragon / Chaos Waters source-metadata seed. Raw media, transcripts, draft packets, and reviewer notes still remain outside git under `/home/yeshu/media/bibleproject-reader/`; only QC-approved future packets/manifests should be promoted beyond this labeled MVP seed exception.
