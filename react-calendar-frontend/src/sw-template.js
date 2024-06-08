importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
);

workbox.loadModule("workbox-background-sync");

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

const { registerRoute } = workbox.routing;
const { CacheFirst, NetworkFirst, NetworkOnly } = workbox.strategies;
const { BackgroundSyncPlugin } = workbox.backgroundSync;

// Rutas
const cacheNetworkFirst = [
  '/api/auth/renew',
  '/api/events',
];

registerRoute(({ url, request }) => {
  // console.log({url, request});
  if ( cacheNetworkFirst.includes( url.pathname ) ) return true;

  return false;
}, new NetworkFirst());

// CDN
const cacheFirstNetwork = [
  'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css',
];

registerRoute(({ url, request }) => {
  if ( cacheFirstNetwork.includes( url.href ) ) return true;

  return false;
}, new CacheFirst());

// Bootstrap CDN (Referencia)
// registerRoute(
//   new RegExp(
//     "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
//   ),
//   new CacheFirst()
// );

// Ruta para /api/renew (Referencia)
// registerRoute(
//   new RegExp( 'http://localhost:4000/api/auth/renew' ),
//   new NetworkFirst()
// );

// Posteos Offline
const bgSyncPlugin = new BackgroundSyncPlugin("posteos-offline", {
  maxRetentionTime: 24 * 60, // Reintentar durante un máximo de 24 horas (especificado en minutos)
});

registerRoute(
  new RegExp("http://localhost:4000/api/events"),
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "POST"
);

registerRoute(
  new RegExp("http://localhost:4000/api/events/"),
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "PUT"
);

registerRoute(
  new RegExp("http://localhost:4000/api/events/"),
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "DELETE"
);
