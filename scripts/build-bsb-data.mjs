import { mkdir, writeFile } from 'node:fs/promises';

const BSB_URL = 'https://bereanbible.com/bsb.txt';
const BOOKS = [
  ['GEN', 'Genesis', 'OT'], ['EXO', 'Exodus', 'OT'], ['LEV', 'Leviticus', 'OT'], ['NUM', 'Numbers', 'OT'], ['DEU', 'Deuteronomy', 'OT'],
  ['JOS', 'Joshua', 'OT'], ['JDG', 'Judges', 'OT'], ['RUT', 'Ruth', 'OT'], ['1SA', '1 Samuel', 'OT'], ['2SA', '2 Samuel', 'OT'],
  ['1KI', '1 Kings', 'OT'], ['2KI', '2 Kings', 'OT'], ['1CH', '1 Chronicles', 'OT'], ['2CH', '2 Chronicles', 'OT'], ['EZR', 'Ezra', 'OT'],
  ['NEH', 'Nehemiah', 'OT'], ['EST', 'Esther', 'OT'], ['JOB', 'Job', 'OT'], ['PSA', 'Psalms', 'OT'], ['PRO', 'Proverbs', 'OT'],
  ['ECC', 'Ecclesiastes', 'OT'], ['SNG', 'Song of Solomon', 'OT'], ['ISA', 'Isaiah', 'OT'], ['JER', 'Jeremiah', 'OT'], ['LAM', 'Lamentations', 'OT'],
  ['EZK', 'Ezekiel', 'OT'], ['DAN', 'Daniel', 'OT'], ['HOS', 'Hosea', 'OT'], ['JOL', 'Joel', 'OT'], ['AMO', 'Amos', 'OT'],
  ['OBA', 'Obadiah', 'OT'], ['JON', 'Jonah', 'OT'], ['MIC', 'Micah', 'OT'], ['NAM', 'Nahum', 'OT'], ['HAB', 'Habakkuk', 'OT'],
  ['ZEP', 'Zephaniah', 'OT'], ['HAG', 'Haggai', 'OT'], ['ZEC', 'Zechariah', 'OT'], ['MAL', 'Malachi', 'OT'], ['MAT', 'Matthew', 'NT'],
  ['MRK', 'Mark', 'NT'], ['LUK', 'Luke', 'NT'], ['JHN', 'John', 'NT'], ['ACT', 'Acts', 'NT'], ['ROM', 'Romans', 'NT'],
  ['1CO', '1 Corinthians', 'NT'], ['2CO', '2 Corinthians', 'NT'], ['GAL', 'Galatians', 'NT'], ['EPH', 'Ephesians', 'NT'], ['PHP', 'Philippians', 'NT'],
  ['COL', 'Colossians', 'NT'], ['1TH', '1 Thessalonians', 'NT'], ['2TH', '2 Thessalonians', 'NT'], ['1TI', '1 Timothy', 'NT'], ['2TI', '2 Timothy', 'NT'],
  ['TIT', 'Titus', 'NT'], ['PHM', 'Philemon', 'NT'], ['HEB', 'Hebrews', 'NT'], ['JAS', 'James', 'NT'], ['1PE', '1 Peter', 'NT'],
  ['2PE', '2 Peter', 'NT'], ['1JN', '1 John', 'NT'], ['2JN', '2 John', 'NT'], ['3JN', '3 John', 'NT'], ['JUD', 'Jude', 'NT'], ['REV', 'Revelation', 'NT']
];
const bookByName = new Map(BOOKS.map(([id, name, testament]) => [name, { id, name, testament }]));
// BereanBible.com's flat text labels the Psalter as singular "Psalm" in refs.
bookByName.set('Psalm', { id: 'PSA', name: 'Psalms', testament: 'OT' });

function parseReference(reference) {
  const match = reference.match(/^(.*) (\d+):(\d+)$/);
  if (!match) throw new Error(`Could not parse reference: ${reference}`);
  const [, bookName, chapter, verse] = match;
  const book = bookByName.get(bookName);
  if (!book) throw new Error(`Unknown book name: ${bookName}`);
  return { book, chapter: Number(chapter), verse: Number(verse) };
}

const response = await fetch(BSB_URL);
if (!response.ok) throw new Error(`Failed to download BSB: ${response.status}`);
const text = (await response.text()).replace(/^\uFEFF/, '');
const lines = text.split(/\r?\n/).filter(Boolean);
const books = BOOKS.map(([id, name, testament]) => ({ id, name, testament, chapters: [] }));
const bookMap = new Map(books.map((book) => [book.id, book]));

for (const line of lines.slice(3)) {
  const [reference, verseText] = line.split('\t');
  if (!reference || !verseText) continue;
  const { book, chapter, verse } = parseReference(reference.trim());
  const targetBook = bookMap.get(book.id);
  let targetChapter = targetBook.chapters.find((candidate) => candidate.number === chapter);
  if (!targetChapter) {
    targetChapter = { number: chapter, verses: [] };
    targetBook.chapters.push(targetChapter);
  }
  targetChapter.verses.push({
    id: `${book.id}.${chapter}.${verse}`,
    bookId: book.id,
    bookName: book.name,
    chapter,
    verse,
    text: verseText.trim()
  });
}

const data = {
  translation: {
    id: 'BSB',
    name: 'Berean Standard Bible',
    abbreviation: 'BSB',
    sourceUrl: BSB_URL,
    license: 'This text of God’s Word has been dedicated to the public domain. Free resources and databases are available at BereanBible.com.',
    generatedAt: new Date().toISOString()
  },
  books
};

await mkdir('public/data/bibles', { recursive: true });
await writeFile('public/data/bibles/bsb.json', JSON.stringify(data));
console.log(`Wrote ${books.length} books and ${books.flatMap((book) => book.chapters.flatMap((chapter) => chapter.verses)).length} verses to public/data/bibles/bsb.json`);
