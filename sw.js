const CACHE_NAME = 'alwadi-platform-v1';
const assetsToCache = [
  'index.html',
  'manifest.json',
  'icona99.png'
];

// تثبيت ملف الـ Service Worker وتخزين الملفات الأساسية مؤقتاً
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(assetsToCache);
      })
  );
  self.skipWaiting();
});

// تفعيل وتحديث الـ Service Worker وحذف النسخ القديمة
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// التعامل مع طلبات الجلب والشبكة
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // العودة بالنسخة المخزنة مؤقتاً إن وجدت، وإلا جلبها من الشبكة
        return response || fetch(event.request);
      })
      .catch(() => {
        // يمكن تخصيص صفحة بديلة عند انقطاع الإنترنت تماماً هنا إذا لزم الأمر
      })
  );
});