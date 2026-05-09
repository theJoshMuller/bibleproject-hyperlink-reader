import { useEffect, useMemo, useState } from 'react';
import type { BibleData, Chapter, Insight, InsightBundle } from './domain/types';
import { getBook, getChapter, getVerseById, nextChapter, passagePreview, previousChapter, referenceLabel } from './domain/bible';
import { anchorMapForInsights, audioTimestampUrl, firstInsightForChapter, insightsForVerse, sourceById } from './domain/insights';
import { loadBible, loadInsightBundle } from './domain/loaders';
import { loadPreferences, savePreferences, type ReaderPreferences } from './domain/storage';

type LoadState =
  | { state: 'loading' }
  | { state: 'error'; message: string }
  | { state: 'ready'; bible: BibleData; bundle: InsightBundle };

function useAppData(): LoadState {
  const [state, setState] = useState<LoadState>({ state: 'loading' });

  useEffect(() => {
    Promise.all([loadBible(), loadInsightBundle()])
      .then(([bible, bundle]) => setState({ state: 'ready', bible, bundle }))
      .catch((error: unknown) => setState({ state: 'error', message: error instanceof Error ? error.message : String(error) }));
  }, []);

  return state;
}

function formatTime(seconds?: number): string {
  if (typeof seconds !== 'number') return 'source page';
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
}

export function App() {
  const data = useAppData();

  if (data.state === 'loading') {
    return <main className="loading-shell"><div className="loading-card">Loading BSB reader substrate…</div></main>;
  }

  if (data.state === 'error') {
    return <main className="loading-shell"><div className="loading-card error">{data.message}</div></main>;
  }

  return <Reader bible={data.bible} bundle={data.bundle} />;
}

function Reader({ bible, bundle }: { bible: BibleData; bundle: InsightBundle }) {
  const defaults = loadPreferences();
  const [bookId, setBookId] = useState(defaults.bookId ?? 'GEN');
  const [chapterNumber, setChapterNumber] = useState(defaults.chapter ?? 1);
  const [activeThemeIds, setActiveThemeIds] = useState<string[]>(defaults.activeThemeIds ?? bundle.themes.map((theme) => theme.id));
  const [readerMode, setReaderMode] = useState<ReaderPreferences['readerMode']>(defaults.readerMode ?? 'night');
  const [selectedInsightId, setSelectedInsightId] = useState<string | undefined>(undefined);
  const [query, setQuery] = useState('');

  const book = getBook(bible, bookId);
  const chapter: Chapter = getChapter(bible, bookId, chapterNumber);
  const activeInsights = useMemo(
    () => bundle.insights.filter((insight) => insight.themeIds.some((themeId) => activeThemeIds.includes(themeId))),
    [activeThemeIds, bundle.insights]
  );
  const filteredInsights = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return activeInsights;
    return activeInsights.filter((insight) =>
      `${insight.title} ${insight.explanation} ${insight.anchors.map((anchor) => anchor.ref).join(' ')}`.toLowerCase().includes(normalized)
    );
  }, [activeInsights, query]);
  const anchorMap = useMemo(() => anchorMapForInsights(filteredInsights, activeThemeIds), [filteredInsights, activeThemeIds]);
  const selectedInsight = selectedInsightId
    ? bundle.insights.find((insight) => insight.id === selectedInsightId)
    : firstInsightForChapter(filteredInsights, chapter.verses.map((verse) => verse.id), activeThemeIds) ?? filteredInsights[0];

  useEffect(() => {
    savePreferences({ bookId, chapter: chapterNumber, activeThemeIds, readerMode });
  }, [bookId, chapterNumber, activeThemeIds, readerMode]);

  function jumpTo(targetBookId: string, targetChapter: number) {
    setBookId(targetBookId);
    setChapterNumber(targetChapter);
  }

  function jumpToVerseId(verseId: string) {
    const verse = getVerseById(bible, verseId);
    if (!verse) return;
    jumpTo(verse.bookId, verse.chapter);
    requestAnimationFrame(() => document.getElementById(verseId)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  }

  function toggleTheme(themeId: string) {
    setActiveThemeIds((current) => current.includes(themeId) ? current.filter((id) => id !== themeId) : [...current, themeId]);
  }

  const handlePrevious = () => {
    const target = previousChapter(bible, bookId, chapterNumber);
    jumpTo(target.bookId, target.chapter);
  };
  const handleNext = () => {
    const target = nextChapter(bible, bookId, chapterNumber);
    jumpTo(target.bookId, target.chapter);
  };

  return (
    <main className={`app-shell ${readerMode}`}>
      <header className="hero" aria-labelledby="app-title">
        <div>
          <p className="eyebrow">Offline PWA MVP · BSB reader substrate · source-linked insights</p>
          <h1 id="app-title">BibleProject Hyperlink Reader</h1>
          <p className="hero-copy">Follow the Dragon / Chaos Waters theme through Scripture, with original-language notes and podcast-source breadcrumbs kept visible.</p>
        </div>
        <div className="status-stack" aria-label="MVP status">
          <span className="pill success">Tested MVP</span>
          <span className="pill">{bible.translation.abbreviation} · public domain</span>
          <span className="pill warning">Transcript QC pending</span>
        </div>
      </header>

      <section className="control-panel" aria-label="Reader controls">
        <label>
          Book
          <select value={bookId} onChange={(event) => { setBookId(event.target.value); setChapterNumber(1); }}>
            {bible.books.map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.name}</option>)}
          </select>
        </label>
        <label>
          Chapter
          <select value={chapterNumber} onChange={(event) => setChapterNumber(Number(event.target.value))}>
            {book.chapters.map((candidate) => <option key={candidate.number} value={candidate.number}>{candidate.number}</option>)}
          </select>
        </label>
        <label className="search-box">
          Find an insight
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Jonah, Leviathan, sea…" />
        </label>
        <button className="ghost-button" onClick={() => setReaderMode(readerMode === 'night' ? 'sepia' : 'night')}>
          {readerMode === 'night' ? 'Sepia e-reader mode' : 'Night mode'}
        </button>
      </section>

      <section className="theme-strip" aria-label="Theme toggles">
        {bundle.themes.map((theme) => (
          <button
            key={theme.id}
            className={`theme-chip ${activeThemeIds.includes(theme.id) ? 'active' : ''}`}
            style={{ '--theme-color': theme.color } as React.CSSProperties}
            onClick={() => toggleTheme(theme.id)}
            aria-pressed={activeThemeIds.includes(theme.id)}
          >
            <span className="theme-dot" /> {theme.name}
          </button>
        ))}
      </section>

      <div className="reader-grid">
        <section className="reader-pane" aria-labelledby="chapter-title">
          <div className="chapter-toolbar">
            <button onClick={handlePrevious} aria-label="Previous chapter">←</button>
            <div>
              <p className="eyebrow">{bible.translation.name}</p>
              <h2 id="chapter-title">{book.name} {chapter.number}</h2>
            </div>
            <button onClick={handleNext} aria-label="Next chapter">→</button>
          </div>

          <article className="scripture" aria-label={`${book.name} ${chapter.number}`}>
            {chapter.verses.map((verse) => {
              const anchors = anchorMap.get(verse.id) ?? [];
              const verseInsights = insightsForVerse(filteredInsights, verse.id, activeThemeIds);
              return (
                <button
                  key={verse.id}
                  id={verse.id}
                  className={`verse ${anchors.length ? 'has-anchor' : ''}`}
                  onClick={() => verseInsights[0] && setSelectedInsightId(verseInsights[0].id)}
                >
                  <sup>{verse.verse}</sup>
                  <span>{verse.text}</span>
                  {anchors.length > 0 && <span className="anchor-stack" aria-label={`${anchors.length} insight anchors`}>
                    {anchors.map((anchor) => <span key={`${anchor.verseId}-${anchor.selector}-${anchor.shape}`} className={`anchor-marker ${anchor.shape}`} style={{ background: anchor.color }} />)}
                  </span>}
                </button>
              );
            })}
          </article>
        </section>

        <aside className="insight-pane" aria-label="Insight details">
          {selectedInsight ? (
            <InsightPanel insight={selectedInsight} bundle={bundle} bible={bible} onJump={jumpToVerseId} />
          ) : (
            <div className="empty-card">Turn on a theme or search for an insight.</div>
          )}
        </aside>
      </div>

      <section className="graph-strip" aria-label="Theme graph">
        <div>
          <p className="eyebrow">Hyperlink graph</p>
          <h2>Dragon / Chaos Waters anchor trail</h2>
        </div>
        <div className="graph-nodes">
          {filteredInsights.flatMap((insight) => insight.anchors.map((anchor) => (
            <button key={`${insight.id}-${anchor.verseId}`} className="graph-node" onClick={() => { setSelectedInsightId(insight.id); jumpToVerseId(anchor.verseId); }}>
              <span>{anchor.ref}</span>
              <small>{insight.shortLabel}</small>
            </button>
          )))}
        </div>
      </section>

      <footer className="footer-note">
        <strong>Licensing boundary:</strong> {bible.translation.license} Source: <a href={bible.translation.sourceUrl}>BereanBible.com</a>. BibleProject episode metadata is linked for review; transcripts/audio are not redistributed in this app bundle.
      </footer>
    </main>
  );
}

function InsightPanel({ insight, bundle, bible, onJump }: { insight: Insight; bundle: InsightBundle; bible: BibleData; onJump: (verseId: string) => void }) {
  return (
    <div className="insight-card">
      <p className="eyebrow">{insight.kind === 'hyperlink' ? 'Hyperlink' : 'Helpful info'} · {insight.status.replaceAll('-', ' ')}</p>
      <h2>{insight.title}</h2>
      <p>{insight.explanation}</p>
      <p className="pastoral">{insight.pastoralUse}</p>

      <div className="anchor-list">
        <h3>Passage anchors</h3>
        {insight.anchors.map((anchor) => {
          const verse = getVerseById(bible, anchor.verseId);
          return (
            <button key={anchor.verseId} className="anchor-card" onClick={() => onJump(anchor.verseId)}>
              <span className={`anchor-marker ${anchor.shape}`} style={{ background: anchor.color }} />
              <span>
                <strong>{anchor.ref}</strong>
                <small>{anchor.note}</small>
                {verse && <em>{verse.text}</em>}
              </span>
            </button>
          );
        })}
      </div>

      {insight.originalLanguages.length > 0 && (
        <div className="language-box">
          <h3>Original-language hook</h3>
          {insight.originalLanguages.map((note) => (
            <div key={`${note.language}-${note.term}`}>
              <strong>{note.language}: <span lang={note.language === 'Hebrew' ? 'he' : 'el'}>{note.term}</span> · {note.transliteration}</strong>
              <p>{note.gloss}. {note.explanation}</p>
            </div>
          ))}
        </div>
      )}

      <div className="source-list">
        <h3>Source trail</h3>
        {insight.sourceSpans.map((span) => {
          const source = sourceById(bundle, span.sourceId);
          const audioUrl = audioTimestampUrl(source, span.startSeconds);
          return (
            <div className="source-card" key={`${span.sourceId}-${span.startSeconds ?? 'page'}`}>
              <strong>{source.title}</strong>
              <p>{span.evidenceNote}</p>
              <div className="source-actions">
                <a href={source.pageUrl} target="_blank" rel="noreferrer">Open BP page</a>
                {audioUrl && <a href={audioUrl} target="_blank" rel="noreferrer">Open audio at {span.timestampLabel ?? formatTime(span.startSeconds)}</a>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="preview-box">
        <h3>Why this reads as a link</h3>
        <p>{passagePreview(bible, insight.anchors.map((anchor) => anchor.verseId), 4)}</p>
      </div>
    </div>
  );
}
