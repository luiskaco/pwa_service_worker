// const CACHE_NAME = 'cache-1'

// OPTIMIZACION
const CACHE_STATIC_NAME = 'static-v2'
const CACHE_DYNAMIC_NAME = 'dynamic-v1'
const CACHE_INMUTABLE_NAME = 'inmutable-v1'

const CACHE_DYNAMIC_LIMIT = 50;
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
                '/js/app.js',
                '/img/no-img.jpg'
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

    // 5 - Cache & network race 
    // Esta es una competacia entre la cache y el internet para ver cual responde mas rapido


    console.log(e.request)

    const respuesta = new Promise( (resolve, reject) =>{

        let rechazada = false;

        const falloUnaVez = () => {

            if ( rechazada ) {
                
                if ( /\.(png|jpg)$/i.test( e.request.url ) ) {

                    resolve( caches.match('/img/no-img.jpg')  );

                } else { 
                    reject('No se encontro respuesta');
                }


            } else {
                rechazada = true;
            }


        };



        fetch( e.request ).then( res => {
            res.ok ? resolve(res) : falloUnaVez();
        }).catch( falloUnaVez );


        caches.match( e.request ).then( res => {
            res ? resolve( res ) : falloUnaVez();
        }).catch( falloUnaVez );


    });




    e.respondWith(respuesta);
})