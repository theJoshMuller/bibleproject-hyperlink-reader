export type Testament = 'OT' | 'NT';

export interface Verse {
  id: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface Chapter {
  number: number;
  verses: Verse[];
}

export interface BibleBook {
  id: string;
  name: string;
  testament: Testament;
  chapters: Chapter[];
}

export interface BibleData {
  translation: {
    id: string;
    name: string;
    abbreviation: string;
    sourceUrl: string;
    license: string;
    generatedAt: string;
  };
  books: BibleBook[];
}

export interface Theme {
  id: string;
  name: string;
  shortName: string;
  color: string;
  description: string;
}

export interface SourceRecord {
  id: string;
  title: string;
  type: 'podcast' | 'video' | 'guide';
  pageUrl: string;
  audioUrl?: string;
  description: string;
  sourceStatus: 'metadata-seeded' | 'transcript-qc-pending' | 'approved';
  episodeChapters?: Array<{ title: string; startSeconds: number; endSeconds: number; label: string }>;
}

export interface InsightAnchor {
  verseId: string;
  ref: string;
  selector?: string;
  shape: 'circle' | 'square' | 'underline' | 'ribbon';
  color: string;
  note: string;
}

export interface SourceSpan {
  sourceId: string;
  startSeconds?: number;
  endSeconds?: number;
  timestampLabel?: string;
  evidenceNote: string;
}

export interface OriginalLanguageNote {
  language: 'Hebrew' | 'Greek' | 'Aramaic';
  term: string;
  transliteration: string;
  gloss: string;
  explanation: string;
}

export interface Insight {
  id: string;
  kind: 'hyperlink' | 'helpful-info';
  status: 'mvp-seed-source-metadata' | 'approved';
  themeIds: string[];
  title: string;
  shortLabel: string;
  explanation: string;
  pastoralUse: string;
  anchors: InsightAnchor[];
  originalLanguages: OriginalLanguageNote[];
  sourceSpans: SourceSpan[];
}

export interface InsightBundle {
  metadata: {
    version: string;
    status: string;
    generatedAt: string;
    policyNote: string;
  };
  themes: Theme[];
  sourceRecords: SourceRecord[];
  insights: Insight[];
}
