import { readFile, writeFile } from 'node:fs/promises';

const distIndex = await readFile('dist/index.html', 'utf8');
const assetPaths = [...distIndex.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1]);
const staticPaths = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon.svg',
  '/data/bibles/bsb.json',
  '/data/insights/dragon-chaos-waters.json',
  ...assetPaths
];
const precache = [...new Set(staticPaths)].sort();

const sw = `const CACHE = 'bp-hyperlink-reader-${Date.now()}';
const PRECACHE = ${JSON.stringify(precache, null, 2)};

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => caches.match('/index.html'));
    })
  );
});
`;

await writeFile('dist/sw.js', sw);
console.log(`Generated dist/sw.js with ${precache.length} precached assets.`);
