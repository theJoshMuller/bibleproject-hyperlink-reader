import type { BibleData, InsightBundle } from './types';

export async function loadBible(): Promise<BibleData> {
  const response = await fetch('/data/bibles/bsb.json');
  if (!response.ok) throw new Error(`Unable to load BSB data: ${response.status}`);
  return response.json() as Promise<BibleData>;
}

export async function loadInsightBundle(): Promise<InsightBundle> {
  const response = await fetch('/data/insights/dragon-chaos-waters.json');
  if (!response.ok) throw new Error(`Unable to load insight bundle: ${response.status}`);
  return response.json() as Promise<InsightBundle>;
}
