import { describe, expect, it } from 'vitest';
import { anchorMapForInsights, audioTimestampUrl, insightsForVerse, validatedInsightAnchors } from './insights';
import type { BibleData, Insight, SourceRecord } from './types';

const insight: Insight = {
  id: 'i1',
  kind: 'hyperlink',
  status: 'mvp-seed-source-metadata',
  themeIds: ['dragon-chaos-waters'],
  title: 'Dragon link',
  shortLabel: 'Dragon',
  explanation: 'A link',
  pastoralUse: 'Read slowly',
  anchors: [{ verseId: 'GEN.1.21', ref: 'Genesis 1:21', shape: 'circle', color: '#22d3ee', note: 'tannin anchor' }],
  originalLanguages: [],
  sourceSpans: [{ sourceId: 's1', startSeconds: 96, evidenceNote: 'chapter marker' }]
};

const bible: BibleData = {
  translation: { id: 'BSB', name: 'Berean Standard Bible', abbreviation: 'BSB', sourceUrl: 'https://bereanbible.com/bsb.txt', license: 'public domain', generatedAt: 'test' },
  books: [{ id: 'GEN', name: 'Genesis', testament: 'OT', chapters: [{ number: 1, verses: [{ id: 'GEN.1.21', bookId: 'GEN', bookName: 'Genesis', chapter: 1, verse: 21, text: 'great sea creatures' }] }] }]
};

describe('Insight helpers', () => {
  it('builds an anchor map only for active themes', () => {
    expect(anchorMapForInsights([insight], ['dragon-chaos-waters']).get('GEN.1.21')).toHaveLength(1);
    expect(anchorMapForInsights([insight], ['city']).get('GEN.1.21')).toBeUndefined();
  });

  it('filters insights by verse and active theme', () => {
    expect(insightsForVerse([insight], 'GEN.1.21', ['dragon-chaos-waters'])).toEqual([insight]);
    expect(insightsForVerse([insight], 'GEN.1.21', [])).toEqual([]);
  });

  it('appends media-fragment timestamps to source audio urls', () => {
    const source: SourceRecord = { id: 's1', type: 'podcast', title: 'Episode', pageUrl: 'https://example.test', audioUrl: 'https://cdn.example/audio.mp3', description: '', sourceStatus: 'metadata-seeded' };
    expect(audioTimestampUrl(source, 96)).toBe('https://cdn.example/audio.mp3#t=96');
  });

  it('reports missing anchors mechanically', () => {
    expect(validatedInsightAnchors(bible, [insight])).toEqual([]);
    expect(validatedInsightAnchors(bible, [{ ...insight, anchors: [{ ...insight.anchors[0], verseId: 'BAD.1.1' }] }])).toEqual(['i1:BAD.1.1']);
  });
});
