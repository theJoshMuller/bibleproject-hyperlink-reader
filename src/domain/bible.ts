import type { BibleBook, BibleData, Chapter, Verse } from './types';

export function getBook(bible: BibleData, bookId: string): BibleBook {
  const book = bible.books.find((candidate) => candidate.id === bookId);
  if (!book) throw new Error(`Unknown book: ${bookId}`);
  return book;
}

export function getChapter(bible: BibleData, bookId: string, chapterNumber: number): Chapter {
  const chapter = getBook(bible, bookId).chapters.find((candidate) => candidate.number === chapterNumber);
  if (!chapter) throw new Error(`Unknown chapter: ${bookId} ${chapterNumber}`);
  return chapter;
}

export function getVerseById(bible: BibleData, verseId: string): Verse | undefined {
  for (const book of bible.books) {
    for (const chapter of book.chapters) {
      const verse = chapter.verses.find((candidate) => candidate.id === verseId);
      if (verse) return verse;
    }
  }
  return undefined;
}

export function nextChapter(bible: BibleData, bookId: string, chapterNumber: number): { bookId: string; chapter: number } {
  const bookIndex = bible.books.findIndex((book) => book.id === bookId);
  if (bookIndex === -1) throw new Error(`Unknown book: ${bookId}`);
  const book = bible.books[bookIndex];
  if (chapterNumber < book.chapters.length) return { bookId, chapter: chapterNumber + 1 };
  const next = bible.books[bookIndex + 1] ?? bible.books[0];
  return { bookId: next.id, chapter: 1 };
}

export function previousChapter(bible: BibleData, bookId: string, chapterNumber: number): { bookId: string; chapter: number } {
  const bookIndex = bible.books.findIndex((book) => book.id === bookId);
  if (bookIndex === -1) throw new Error(`Unknown book: ${bookId}`);
  if (chapterNumber > 1) return { bookId, chapter: chapterNumber - 1 };
  const previous = bible.books[bookIndex - 1] ?? bible.books[bible.books.length - 1];
  return { bookId: previous.id, chapter: previous.chapters.length };
}

export function referenceLabel(verse: Verse): string {
  return `${verse.bookName} ${verse.chapter}:${verse.verse}`;
}

export function passagePreview(bible: BibleData, verseIds: string[], max = 3): string {
  return verseIds
    .slice(0, max)
    .map((id) => getVerseById(bible, id))
    .filter((verse): verse is Verse => Boolean(verse))
    .map((verse) => `${referenceLabel(verse)} ${verse.text}`)
    .join(' · ');
}
