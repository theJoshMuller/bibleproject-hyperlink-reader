# QC Gates

QC gates protect the boundary between raw source work, reviewed evidence, and published app data.

Vocabulary:

- **Pre-flight** means the artifact is complete enough to review.
- **Revision** means the artifact can continue after specific corrections.
- **Escalation** means a human or designated reviewer must resolve uncertainty.
- **Abort** means the artifact should not continue in its current form.

## Gate A: Source Pairing

Purpose: confirm whether source records belong together before extraction depends on the relationship.

Pre-flight requires source IDs, titles, URLs or local references, and evidence notes. Revision is appropriate when evidence is thin, timestamps are missing, or the decision is unclear. Escalation is required when plausible sources conflict or a pairing affects many downstream packets. Abort when no BibleProject-backed evidence supports the pairing, or when the pairing is rejected.

## Gate B: Transcript Span

Purpose: verify that cited source spans are stable, reviewable, and bounded by `start_seconds` and `end_seconds`.

Pre-flight requires a source ID, span timing, transcript excerpt or notes, and enough context to review the claim. Revision is appropriate when timing is imprecise or the excerpt is too narrow. Escalation is required when the transcript is uncertain, garbled, or materially changes the claim. Abort when the span cannot be located in the source.

## Gate C: Theological and Source Fidelity

Purpose: confirm that an insight says only what the cited BibleProject source supports.

Pre-flight requires approved source spans, a concise claim, passage anchors, and reviewer notes. Revision is appropriate when the claim is too broad, mixes sources without support, or needs clearer wording. Escalation is required for theological ambiguity, contested interpretation, or claims that depend on multiple sources. Abort when the claim is invented, unsupported, or contradicts the cited source.

## Gate D: Duplicate and Conflict

Purpose: prevent duplicate packets and unresolved conflicts from entering the app dataset.

Pre-flight requires theme ID, passage anchors, related packet IDs when known, and conflict notes. Revision is appropriate when packets should be merged, split, or cross-referenced. Escalation is required when two approved-looking packets disagree. Abort when a duplicate adds no distinct source support or reading value.

## Gate E: Mechanical App Data Validation

Purpose: ensure approved data can be consumed by the app.

Pre-flight requires schema-valid JSON, resolvable IDs, valid BSB anchors, and buildable manifests. Revision is appropriate for malformed JSON, missing IDs, invalid enum values, or broken references. Escalation is required when the schema cannot represent a reviewed decision cleanly. Abort when data cannot be made mechanically valid without changing the reviewed meaning.
