// Self-destroying ServiceWorker:
// https://github.com/NekR/self-destroying-sw
// eslint-disable-next-line no-restricted-globals
const ignored = self.__WB_MANIFEST;

self.addEventListener("install", function (e) {
  console.info("Installing service worker...");
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  console.info("Destroying old service worker...");
  self.registration
    .unregister()
    .then(function () {
      return self.clients.matchAll();
    })
    .then(function (clients) {
      clients.forEach((client) => client.navigate(client.url));
    });
});
