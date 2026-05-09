export interface ReaderPreferences {
  bookId: string;
  chapter: number;
  activeThemeIds: string[];
  readerMode: 'night' | 'sepia';
}

const KEY = 'bp-reader:v1:preferences';

export function loadPreferences(): Partial<ReaderPreferences> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Partial<ReaderPreferences>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function savePreferences(preferences: ReaderPreferences): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(preferences));
}
