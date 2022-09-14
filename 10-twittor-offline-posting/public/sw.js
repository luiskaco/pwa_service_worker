// Import pouchDB
importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.3.0/dist/pouchdb.min.js')

// imports
importScripts('js/sw-db.js');
importScripts('js/sw-utils.js');


const STATIC_CACHE    = 'static-v4';
const DYNAMIC_CACHE   = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v2';


const APP_SHELL = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js',
    'https://cdn.jsdelivr.net/npm/pouchdb@7.3.0/dist/pouchdb.min.js' 
];



self.addEventListener('install', e => {


    const cacheStatic = caches.open( STATIC_CACHE ).then(cache => 
        cache.addAll( APP_SHELL ));

    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache => 
        cache.addAll( APP_SHELL_INMUTABLE ));



    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ])  );

});


self.addEventListener('activate', e => {

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

            if (  key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );

});





self.addEventListener( 'fetch', e => {

        let respuesta

        if(e.request.url.includes('/api'))
        {
            // Si incluye la palabra api

            // Buscar inmediato respuesta
            return manejoApiMensajes(DYNAMIC_CACHE, e.request)

        }else{
               
                    //Estrategia Network fall Update / estrategia numero 4
                     respuesta = caches.match( e.request ).then( res => {

                        if ( res ) {
                            
                            actualizaCacheStatico( STATIC_CACHE, e.request, APP_SHELL_INMUTABLE );
                            return res;
                        } else {

                            return fetch( e.request ).then( newRes => {

                                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );

                            });

                        }

                    });
            
        }


    e.respondWith( respuesta );

});


self.addEventListener('sync', e => {

    console.log("sw: sync")

   


})



// Manejo de Api
//Network with Cache Fallback / update
function manejoApiMensajes( cacheName, req ) {

  // nota : el cache no maneja post, por eso debe manejarse de otra forma
    if ( req.clone().method === 'POST' ) {
        // POSTEO de un nuevo mensaje

              // Validamos si el navegador soporta el sync manager / Verificar can i use syncmanager
        if ( self.registration.sync ) {
            return req.clone().text().then( body =>{
    
                // console.log(body);
                        //convertimos el string en objeto
                const bodyObj = JSON.parse( body );
                return guardarMensaje( bodyObj );
    
            });
        } else {
                // Tengo que guardar en INDEX db
            return fetch( req );
        }


    } else {

           // Para buscar inmediato las actualizacones de los post
        return fetch( req ).then( res => {
       //Si la respuesta es exitosa  o no 
            if ( res.ok ) {
              
                actualizaCacheDinamico( cacheName, req, res.clone() );
                return res.clone();
            } else {
                return caches.match( req );
            }
      
        }).catch( err => {
               // De no poseer internet
            return caches.match( req );
        });

    }


}