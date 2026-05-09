# Agentic Source Workflow

The workflow is agentic and evidence-backed. Agents decide, reviewers verify, and tools assist with mechanical checks. A script may find candidate files, validate schemas, compare hashes, or build manifests, but it must not be treated as the authority for source pairing or theological meaning.

## Roles

**Source Librarian Agent** catalogs BibleProject source material into source records. It records titles, source type, canonical URLs, local media paths when available, and licensing notes.

**Pairing Agent** evaluates whether sources belong together, such as a podcast episode and a related course or video source. It produces a pairing packet with evidence, uncertainty, and a decision of `paired`, `ambiguous`, `not_found`, or `rejected`.

**Pairing Reviewer** reviews pairing packets before any downstream extraction depends on them. The reviewer can approve, reject, or return the packet for revision.

**Transcript Agent** prepares transcript-span evidence with stable time ranges using `start_seconds` and `end_seconds`. It does not decide whether a claim is theologically faithful.

**Insight Extractor** proposes insight packets from reviewed source spans. It summarizes only what the source supports and must preserve uncertainty instead of filling gaps.

**Theological Fidelity Reviewer** checks whether the proposed insight is faithful to the cited BibleProject source span and does not overstate, merge, or invent claims.

**Data Steward** promotes approved packets into published app data and generated manifests. This role is responsible for keeping draft artifacts out of the runtime app.

## Evidence Artifacts

Pairing packets are evidence artifacts. They may include links, metadata observations, title comparisons, transcript overlap notes, and reviewer comments. They are not raw script output, even if tools assisted in collecting observations.

Insight packets are also evidence artifacts until approved. Extractor agents cannot write directly to published data; they write candidates for review. Published data is the result of review and stewardship, not automated synthesis.
