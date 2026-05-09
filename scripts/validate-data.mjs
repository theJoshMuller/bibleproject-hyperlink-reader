import { readFile } from 'node:fs/promises';
import Ajv2020 from 'ajv/dist/2020.js';

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));
const fail = (message) => { throw new Error(message); };

const bible = await readJson('public/data/bibles/bsb.json');
const bundle = await readJson('public/data/insights/dragon-chaos-waters.json');
const bibleSchema = await readJson('schemas/app-bible.schema.json');
const insightBundleSchema = await readJson('schemas/app-insight-bundle.schema.json');

const ajv = new Ajv2020({ allErrors: true, strict: false, validateFormats: false });
const assertSchema = (schema, data, label) => {
  const validate = ajv.compile(schema);
  if (!validate(data)) {
    const details = validate.errors?.map((error) => `${error.instancePath || '/'} ${error.message}`).join('; ');
    fail(`${label} schema validation failed: ${details}`);
  }
};

const secondsFromClock = (clock) => {
  const parts = clock.split(':').map(Number);
  if (parts.some((part) => Number.isNaN(part))) fail(`Invalid clock label ${clock}`);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  fail(`Invalid clock label ${clock}`);
};

const assertLabelMatchesSeconds = (label, startSeconds, endSeconds, context) => {
  if (!label) return;
  const [startLabel, endLabel] = label.split('–');
  const expectedStart = secondsFromClock(startLabel);
  const expectedEnd = secondsFromClock(endLabel);
  if (startSeconds !== expectedStart || endSeconds !== expectedEnd) {
    fail(`${context} timestamp label ${label} does not match seconds ${startSeconds}–${endSeconds}`);
  }
};

assertSchema(bibleSchema, bible, 'BSB bible payload');
assertSchema(insightBundleSchema, bundle, 'Dragon/Chaos insight bundle');

if (bible.translation.id !== 'BSB') fail('Expected BSB translation id');
if (!/public domain/i.test(bible.translation.license)) fail('BSB license must state public domain');
if (!/bereanbible\.com\/bsb\.txt/i.test(bible.translation.sourceUrl)) fail('BSB source URL must remain documented');
if (bible.books.length !== 66) fail(`Expected 66 books, got ${bible.books.length}`);

const verseIds = new Set();
let verseCount = 0;
for (const book of bible.books) {
  const chapterNumbers = new Set();
  for (const chapter of book.chapters) {
    if (chapterNumbers.has(chapter.number)) fail(`Duplicate chapter ${book.id}.${chapter.number}`);
    chapterNumbers.add(chapter.number);
    for (const verse of chapter.verses) {
      if (verseIds.has(verse.id)) fail(`Duplicate verse id ${verse.id}`);
      if (verse.bookId !== book.id || verse.bookName !== book.name || verse.chapter !== chapter.number) fail(`Invalid verse linkage ${verse.id}`);
      verseIds.add(verse.id);
      verseCount += 1;
    }
  }
}
if (verseCount !== 31_086) fail(`Expected full BSB verse count 31086, got ${verseCount}`);
for (const required of ['GEN.1.1', 'GEN.1.2', 'PSA.74.13', 'ISA.27.1', 'JON.1.17', 'REV.12.3']) {
  if (!verseIds.has(required)) fail(`Missing required MVP verse ${required}`);
}

const themeIds = new Set(bundle.themes.map((theme) => theme.id));
const sourceIds = new Set(bundle.sourceRecords.map((source) => source.id));
if (!themeIds.has('dragon-chaos-waters')) fail('Missing dragon-chaos-waters theme');
if (bundle.insights.length < 4) fail('Expected at least four MVP insights');

for (const source of bundle.sourceRecords) {
  if (!source.pageUrl.includes('bibleproject.com/')) fail(`Source must link to BibleProject page: ${source.id}`);
  for (const chapter of source.episodeChapters ?? []) {
    if (chapter.endSeconds <= chapter.startSeconds) fail(`Episode chapter has non-positive duration: ${source.id}`);
    assertLabelMatchesSeconds(chapter.label, chapter.startSeconds, chapter.endSeconds, `Episode chapter ${source.id}:${chapter.title}`);
  }
}

for (const insight of bundle.insights) {
  if (!insight.themeIds.every((themeId) => themeIds.has(themeId))) fail(`Unknown theme in ${insight.id}`);
  if (!insight.anchors.length) fail(`Insight has no anchors: ${insight.id}`);
  if (!/mvp|seed|source/i.test(insight.status)) fail(`MVP insight status must remain clearly provisional: ${insight.id}`);
  for (const anchor of insight.anchors) {
    if (!verseIds.has(anchor.verseId)) fail(`Missing verse anchor ${insight.id}:${anchor.verseId}`);
  }
  for (const span of insight.sourceSpans) {
    if (!sourceIds.has(span.sourceId)) fail(`Missing source ${span.sourceId} in ${insight.id}`);
    if ((span.startSeconds === undefined) !== (span.endSeconds === undefined)) fail(`Incomplete timestamp span in ${insight.id}:${span.sourceId}`);
    if (span.startSeconds !== undefined) {
      if (span.endSeconds <= span.startSeconds) fail(`Source span has non-positive duration in ${insight.id}:${span.sourceId}`);
      assertLabelMatchesSeconds(span.timestampLabel, span.startSeconds, span.endSeconds, `Source span ${insight.id}:${span.sourceId}`);
    }
  }
}

console.log(`Data validation passed: schema-checked ${bible.books.length} books, ${verseCount} verses, ${bundle.sourceRecords.length} sources, ${bundle.insights.length} insights.`);
