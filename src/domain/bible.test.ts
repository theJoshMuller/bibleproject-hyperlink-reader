import { describe, expect, it } from 'vitest';
import { getChapter, getVerseById, nextChapter, passagePreview, previousChapter } from './bible';
import type { BibleData } from './types';

const fixture: BibleData = {
  translation: { id: 'BSB', name: 'Berean Standard Bible', abbreviation: 'BSB', sourceUrl: 'https://bereanbible.com/bsb.txt', license: 'public domain', generatedAt: 'test' },
  books: [
    { id: 'GEN', name: 'Genesis', testament: 'OT', chapters: [{ number: 1, verses: [{ id: 'GEN.1.1', bookId: 'GEN', bookName: 'Genesis', chapter: 1, verse: 1, text: 'In the beginning.' }] }] },
    { id: 'EXO', name: 'Exodus', testament: 'OT', chapters: [{ number: 1, verses: [{ id: 'EXO.1.1', bookId: 'EXO', bookName: 'Exodus', chapter: 1, verse: 1, text: 'These are the names.' }] }] }
  ]
};

describe('Bible domain helpers', () => {
  it('finds a chapter by book id and chapter number', () => {
    expect(getChapter(fixture, 'GEN', 1).verses[0].id).toBe('GEN.1.1');
  });

  it('finds verses globally by canonical verse id', () => {
    expect(getVerseById(fixture, 'EXO.1.1')?.text).toBe('These are the names.');
  });

  it('wraps previous and next chapter navigation across books', () => {
    expect(nextChapter(fixture, 'GEN', 1)).toEqual({ bookId: 'EXO', chapter: 1 });
    expect(previousChapter(fixture, 'GEN', 1)).toEqual({ bookId: 'EXO', chapter: 1 });
  });

  it('builds concise passage previews from verse ids', () => {
    expect(passagePreview(fixture, ['GEN.1.1'])).toContain('Genesis 1:1 In the beginning.');
  });
});
