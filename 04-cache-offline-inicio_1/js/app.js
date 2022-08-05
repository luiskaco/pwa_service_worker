

// Verificamos si soporta service worker
if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register('/sw.js');
}

//  nota: si soporta service Worker, entonces soporta cache

