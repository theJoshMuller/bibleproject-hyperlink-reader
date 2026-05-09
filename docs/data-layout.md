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
schemas/              JSON Schemas for reviewed data packets
data/themes/          Seed and approved theme metadata
data/sources/         Approved source records when ready
data/packets/         Approved insight and relation packets when ready
data/manifests/       Generated app manifests when ready
src/                  Future PWA source code
public/               Future static app assets
```

Phase 0 creates docs, schemas, and one seed theme metadata file only. Approved source records, insight packets, relation packets, generated manifests, and app code are later-phase work.
