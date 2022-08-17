// Importar
importScripts('js/sw-utils.js')

// // nota: ' para que  importScripts no de error, es necesario incluirla en 
// el jshlntrc en el apartado globals'

// Constante
const STATIC_CACHE = 'static-v1'
const DYNAMIC_CACHE = 'dynamic-v1'
const INMUTABLE_CACHE = 'inmutable-v1'

// CREAMOS LOS OBJETOS SHELL
const APP_sHELL = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js'
];

const APP_sHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
]


//Instalamos el service workers
self.addEventListener('install', e => {

    // Guardamos la cache
    const cacheStatic = caches.open(STATIC_CACHE).then(cache => {
        cache.addAll(APP_sHELL)
    })

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => {
        cache.addAll(APP_sHELL_INMUTABLE)
    })

    // Esperamos que termine
   
    e.waitUntil( Promise.all([cacheStatic, cacheInmutable]));

})

// Configuramos procesaos al estar instalada la cache

self.addEventListener('activate', e => {
     // Creamos un proceso para eliminar la cahce que no funciona
     // Extraemos todas la keys
     const activacion = caches.keys().then(keys => {
        
            //emplelo> Si es igual a static-v3 , lo borramos
        keys.forEach(key => {
            if(key !== STATIC_CACHE && key.includes('static')){
                return caches.delete(key)
            }
        })

    })

    e.waitUntil(activacion)

})


// ESTRATEGIA DE CACHE REPASOS

self.addEventListener('fetch', e => {
    //with networ fallback

    const respuesta = caches.match(e.request).then(res => {

        if(res){
            return res
        }else{
            console.log(e.request.url)

            return fetch(e.request).then(newRes => {
               
                //Guardar en la cache dinamica
                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes)
            })
            //
           

        }


    })



    e.respondWith( respuesta );
})

