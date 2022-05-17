const CACHE_NAME = 'cache-1'




// Nota importante: el app shell es lo que necesita el codigo para funcionar

self.addEventListener('install', e => {

    // Creamos la cache
    const cacheProm = caches.open(CACHE_NAME)
          .then(cache => {

           // APP SHELL es este cuerpo de cache
           return cache.addAll([
                '/',   // la raiz debe especificarse porque es parte de ddone parte la cache
                '/index.html',
                '/css/style.css',
                '/img/main.jpg',
                'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
                '/js/app.js'
            ]);

          })


          // el install no espera por eso usamos el 
          e.waitUntil(cacheProm);

});


// Nota: recoerdar que las estrategia de cache, siempre se hacen en el fetch
self.addEventListener('fetch', e => {

   
    // 1 - Cache Only : es cuando queremos que toda la web sea servida del cache

    // e.respondWith( caches.match( e.request ))

    /* nota: al pasar caches.match dentro del respondWith; estamos relacionando que todas las caches 
        deben corresponder al mismo dominio de la web
    */

    // Desventajas:
    //  Para modificar un ardhivo es necesario actualizar el servide worker

    //  --------------------------------------------------------------------------------------------

    // 2 - Cache with Netowork Fallback: Intenta primero en el cache, si no encuentra busca en internet


        // Consultamos
        const resProm = caches.match(e.request)
              .then(res => {

                // Si existe respuesta
                if(res) return res;

                // No existeo | Debo ir a la web
                
                console.log('no existe', e.request.url)

                return fetch(e.request).then(newResp => {

                    // Si ya lo tengo de itnernet, lo metemos en cache
                    caches.open(CACHE_NAME)
                           .then(cache => {

                                //Agregamos el nuevo cache
                                cache.put(e.request, newResp)
                                //PRimer agumento: la peticion y lo que va regresar como respuesta

                           })

                    return newResp.clone();
                })

              })



              e.respondWith(resProm)

              
   

})