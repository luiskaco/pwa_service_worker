
// FORMAS D ECOMPROBAR SI PODEMOS USAR SERVICE WORKER

// FORMA 1 
// if ( 'serviceWorker' in navigator ) {
//     console.log('Podemos usarlo')
// }

// FORMA 2 

if ( navigator.serviceWorker) {
    // 
    

    navigator.serviceWorker.register('/sw.js')
    // // Nota:  el service worker debe ir en el archivo raiz donde inicia la aplicacion
    // Es importante que el service worker este en la raiz, porque si se especifica en una carpeta solo monitorearia los archivos que esten en esa carpeta
}


