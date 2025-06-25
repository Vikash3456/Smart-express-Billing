self.addEventListener('install', function(event) {
    // Service worker installed
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    // Service worker activated
});

self.addEventListener('fetch', function(event) {
    // You can add caching logic here if needed
});

// document.querySelector('.camera-btn').addEventListener('click', function(e) {
//     e.preventDefault(); // Prevent default button behavior
//     document.getElementById('imageInput').click();
// });
