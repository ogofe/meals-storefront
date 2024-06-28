// registerServiceWorker.js

export default function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('../public/sw.js').then(registration => {
        console.log('ServiceWorker registered: ', registration);
      }).catch(error => {
        console.error('ServiceWorker registration failed: ', error);
      });
    });
  }
}