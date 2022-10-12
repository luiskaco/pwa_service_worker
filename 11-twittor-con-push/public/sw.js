// imports
importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js')

importScripts('js/sw-db.js');
importScripts('js/sw-utils.js');


const STATIC_CACHE    = 'static-v2';
const DYNAMIC_CACHE   = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';


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
    'js/sw-utils.js',
    'js/libs/plugins/mdtoast.min.js',
    'js/libs/plugins/mdtoast.min.css'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js',
    'https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js'
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

    let respuesta;

    if ( e.request.url.includes('/api') ) {

        // return respuesta????
        respuesta = manejoApiMensajes( DYNAMIC_CACHE, e.request );

    } else {

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


// tareas asíncronas
self.addEventListener('sync', e => {

    console.log('SW: Sync');

    if ( e.tag === 'nuevo-post' ) {

        // postear a BD cuando hay conexión
        const respuesta = postearMensajes();
        
        e.waitUntil( respuesta );
    }



});



// Escuchar push

self.addEventListener('push', e => {

    // console.log(e);
    // console.log(e.data.text());

    const data = JSON.parse(e.data.text())
    console.log(data['titulo'])

    // Cuerpoo de la notifiacion
    // const title = e.data.text();
    const title = data.titulo;
    const options = {
        body:data.cuerpo,
        icon:`img/avatars/${data.usuario}.jpg`,
        badge: 'img/favicon.ico',
        image:'https://i0.wp.com/codigoespagueti.com/wp-content/uploads/2021/12/Marvel-Quien-pudo-haber-comprado-la-Torre-de-los-Vengadores-compressed.jpg?resize=1280%2C720&quality=80&ssl=1',
        vibrate:[50,100,50,100,50,100,400,100,300,100,350,50,200,100,100,50,600],
        openUrl:'/',
        data:{
            // url:'https://www.google.com',
            url:'/',
            id:data.usuario,
            icon:'img/avatar/'
        },
        actions:[
            {
                action:'thor-action',
                title:'thor',
                icon:''
            },
            {
                action:'iroman-action',
                title:'Iroman',
                icon:''
            },
         ]
    };

    // Nota: solo recomienda que como maximo se usen solo 3 acciones


    /* Notificacion
        https://web.dev/push-notifications-display-a-notification/
        https://gearside.com/custom-vibration-patterns-mobile-devices/
    
    */
    
        // 
        // // icon:'img/icons/icon-72x72.png'
        // icon:`img/avatars/${data.usuario}.jpg`

    // espramos y enviamos la notificaicon
    e.waitUntil(self.registration.showNotification(title, options));

});


/// DOS EVENTOS ASOCIADO A LAS NOTIFICACIONEs


    // Cuando cerramo las notificaciones\
    self.addEventListener('notificationclose', e => {
        console.log('Notificacion cerrado', e)
    })

    // cuando se hace clic en una notificacion
    self.addEventListener('notificationclick', e =>{ // La notifiacion a estamos esta viniedo en E

        // Obtenemos una referencia mas comoda de la notificacion.
        const notificacion = e.notification;
        const action = e.action;

        console.log({ notificacion , action})

        // Verificamos si ya hay una ventana abierta para enviar la misma consulta a la misma ventana.
       const respuesta =  clients.matchAll()
             .then( clientes => {
                // Si encontramos un tab abierto, redireccionamos a esa vista
                let cliente = clientes.find(c => {
                    return c.visibilityState === 'visible'
                } )

                if (cliente !== undefined) {
                    // Redirecionamos a esa ventana
                    cliente.navigate(notificacion.data.url)
                    // Para que la ventana quede en focus
                    cliente.focus();
                    
                }else{
                    /// Hacemos regerencia a todos los objetos abierto. Entiendase pestana
                    clients.openWindow( notificacion.data.url )
                }
                /// Para cerrar la notificacion. Al momento de ser llamada
                return notificacion.close()
             })

        // /// Hacemos regerencia a todos los objetos abierto. Entiendase pestana
        // clients.openWindow( notificacion.data.url )

        // /// Para cerrar la notificacion. Al momento de ser llamada
        // notificacion.close()

        //Esperamos hasta que se resuelva todo
        e.waitUntil(respuesta)

    })



    // Nota: recordario, en el service worker no existe el objet windows.