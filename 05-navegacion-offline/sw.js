

// const CACHE_NAME = 'cache-1';
const CACHE_STATIC_NAME  = 'static-v5';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';

const CACHE_DYNAMIC_LIMIT = 50;

function limpiarCache( cacheName, numeroItems ) {


    caches.open( cacheName )
        .then( cache => {

            return cache.keys()
                .then( keys => {
                    
                    if ( keys.length > numeroItems ) {
                        cache.delete( keys[0] )
                            .then( limpiarCache(cacheName, numeroItems) );
                    }
                });

            
        });
}

self.addEventListener('install', e => {


    const cacheProm = caches.open( CACHE_STATIC_NAME )
        .then( cache => {

            return cache.addAll([
                '/',
                '/index.html',
                '/css/style.css',
                '/img/main.jpg',
                '/js/app.js',
                '/img/no-img.jpg',
                '/pages/offline.html'
            ]);

        
        });

    const cacheInmutable = caches.open( CACHE_INMUTABLE_NAME )
            .then( cache => cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'));


    e.waitUntil( Promise.all([cacheProm, cacheInmutable]) );

});

//Se activuando cuando esta lista la instalacion
self.addEventListener('activate', e => {
    
    // Extraemos todas la keys
    const activacion = caches.keys().then(keys => {
        
            //emplelo> Si es igual a static-v3 , lo borramos
        keys.forEach(key => {
            if(key !== CACHE_STATIC_NAME && key.includes('static')){
                return caches.delete(key)
            }
        })

    })
    
    
    e.waitUntil(activacion)
})



self.addEventListener('fech', e => {


    // 2- Cache with Network Fallback
    const respuesta = caches.match( e.request )
        .then( res => {

            if ( res ) return res;

            // No existe el archivo vamos 
            return fetch( e.request ).then( newResp => {

                caches.open( CACHE_DYNAMIC_NAME )
                .then( cache => {
                    cache.put( e.request, newResp );
                    limpiarCache( CACHE_DYNAMIC_NAME, 50 );
                });

                 return newResp.clone();
            }) // En caso de que fallen
            .catch(err => {

                    //Validamos si es un extension html
                    if ( e.request.headers.get('accept').includes('text/html') ) {
                        return caches.match('/pages/offline.html');
                    }
                   
            })
           });




    e.respondWith( respuesta );
})