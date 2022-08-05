// const CACHE_NAME = 'cache-1'

// OPTIMIZACION

const CACHE_STATIC_NAME = 'static-v2'
const CACHE_DYNAMIC_NAME = 'dynamic-v1'
const CACHE_INMUTABLE_NAME = 'inmutable-v1'

// Nota: Cambiar un valor del nombre de la cache, ya es un cambio en el service Worker. 

// FUNCION PARA LIMPIAR CACHE
function limpiarCache(cacheName,  numItems) {

    caches.open(cacheName)
          .then(cache => {

              return cache.keys()
                          .then(keys => {
                            //  console.log(keys)

                                //Si hay mas item de lo que soporta cache
                                if(keys.length > numItems){
                                  console.log(keys.length)
                                    cache.delete(keys[0]).then(limpiarCache(cacheName,  numItems))
                                }
                          })
          })

}



// Nota importante: el app shell es lo que necesita el codigo para funcionar
// Nota: es importante elimiminar la cache vieja una vez se cambie la version
self.addEventListener('install', e => {

    // Creamos la cache
    const cacheProm = caches.open(CACHE_STATIC_NAME)
          .then(cache => {

           // APP SHELL es este cuerpo de cache
           return cache.addAll([
                '/',   // la raiz debe especificarse porque es parte de ddone parte la cache
                '/index.html',
                '/css/style.css',
                '/img/main.jpg',
                '/js/app.js'
            ]);

          })
          // nota: Guardamos la app sheell en nuestra cache estatica

    const cachePromInmutable = caches.open(CACHE_INMUTABLE_NAME)
          .then(cache => cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'))
           // nota: Guardamos la app sheell en nuestra cache INMUTABLE. gUARDAMOS LOS ARCHIVO QUE SABEMOS QUE NO VAN HACER NUNCA MODIFICADO

          // el install no espera por eso usamos el 
          // e.waitUntil([cacheProm, cachePromInmutable]);
          e.waitUntil( Promise.all([cacheProm, cachePromInmutable]));

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
                    caches.open(CACHE_DYNAMIC_NAME)
                           .then(cache => {

                                //Agregamos el nuevo cache
                                cache.put(e.request, newResp)
                                //PRimer agumento: la peticion y lo que va regresar como respuesta
                                
                            
                                // Limpiamos cache
                                limpiarCache(CACHE_DYNAMIC_NAME, 5)  // Un buen numero de elementos en cache es 50
                                // Nota< Se recomienda limpiar la cache donde se guarda

                           })

                    return newResp.clone();
                })

              })

              // NotaL el cache dinamico puede crecer mucho, por eso es importante separar las cache



              e.respondWith(resProm)

              
   

})