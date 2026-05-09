import type { BibleData, Insight, InsightAnchor, InsightBundle, SourceRecord } from './types';
import { getVerseById } from './bible';

export function anchorMapForInsights(insights: Insight[], activeThemeIds: string[]): Map<string, InsightAnchor[]> {
  const map = new Map<string, InsightAnchor[]>();
  for (const insight of insights) {
    if (!insight.themeIds.some((themeId) => activeThemeIds.includes(themeId))) continue;
    for (const anchor of insight.anchors) {
      const existing = map.get(anchor.verseId) ?? [];
      existing.push(anchor);
      map.set(anchor.verseId, existing);
    }
  }
  return map;
}

export function insightsForVerse(insights: Insight[], verseId: string, activeThemeIds: string[]): Insight[] {
  return insights.filter((insight) =>
    insight.themeIds.some((themeId) => activeThemeIds.includes(themeId)) &&
    insight.anchors.some((anchor) => anchor.verseId === verseId)
  );
}

export function firstInsightForChapter(insights: Insight[], verseIds: string[], activeThemeIds: string[]): Insight | undefined {
  return insights.find((insight) =>
    insight.themeIds.some((themeId) => activeThemeIds.includes(themeId)) &&
    insight.anchors.some((anchor) => verseIds.includes(anchor.verseId))
  );
}

export function sourceById(bundle: InsightBundle, sourceId: string): SourceRecord {
  const source = bundle.sourceRecords.find((candidate) => candidate.id === sourceId);
  if (!source) throw new Error(`Unknown source: ${sourceId}`);
  return source;
}

export function audioTimestampUrl(source: SourceRecord, startSeconds?: number): string | undefined {
  if (!source.audioUrl) return undefined;
  if (typeof startSeconds !== 'number') return source.audioUrl;
  return `${source.audioUrl}#t=${Math.max(0, Math.floor(startSeconds))}`;
}

export function validatedInsightAnchors(bible: BibleData, insights: Insight[]): string[] {
  const missing: string[] = [];
  for (const insight of insights) {
    for (const anchor of insight.anchors) {
      if (!getVerseById(bible, anchor.verseId)) missing.push(`${insight.id}:${anchor.verseId}`);
    }
  }
  return missing;
}
