const CACHE_NAME = 'madas-v1';
const ASSETS = [
  './',
  './library.html',
  './workout.html',
  './manifest.json',
  './sw.js',
  // הוסף כאן קבצים שחשוב שיטענו מהר/אופליין:
  // דוגמאות:
  // './images/logo.png',
  // './fonts/Rubik-VariableFont_wght.ttf',
  // './sounds/beep.mp3'
];

// התקנה – מכניסים לקאש
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
});

// ניקוי גרסאות ישנות של קאש
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// אסטרטגיה: Cache-first, ואז לשמור מהאינטרנט לשימוש הבא
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone)).catch(()=>{});
        return res;
      }).catch(() => cached);
    })
  );
});