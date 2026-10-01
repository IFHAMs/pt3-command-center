/* PT3 Command Center — Service Worker */

const CACHE = 'pt3-v2';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

/* Install: cache everything */
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

/* Activate: clear old caches */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* Fetch: serve from cache, fallback network */
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});

/* ---------- NOTIFICATION SCHEDULER ---------- */
/* The main thread posts { type:'schedule', reminders:[{time,title,body}] } */
/* We just keep them and rely on the page being alive OR Android PWA to wake us */

let reminders = [];

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'schedule') {
    reminders = e.data.reminders || [];
  }
  if (e.data && e.data.type === 'notify') {
    self.registration.showNotification(e.data.title, {
      body: e.data.body,
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      vibrate: [200, 100, 200],
      tag: e.data.tag || 'pt3'
    });
  }
});

/* Notification click → focus the app */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      for (const c of list) if ('focus' in c) return c.focus();
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});