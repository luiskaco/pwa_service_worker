## Progressive Web App

Es una aplicacion web que progresivamente hace uso de caracteristicas como por ejemplo:

- Push Navigation, 
- Sin conexion 
- Nativo
- Actualizaciones
- Confiable 
- De poco tamano

#### Corazón de la PWA


- Push Server: enviar notificaciones
- indexedDB : Grabar en base de datos
- Manifest : Como luce la aplicacion en el home Screen
- Service Worker : motor de la PWA

#### Entre los listeners más comunes están:

- fetch
- sync
- install
- activate
- push

#### Ciclo de Vida

 - Install:Uso cuando se tiene el evento de instalacion, es necesario abrir otra pesta;a
```
      self.addEventListener('install', event => {

         // Descargar assets
         // creamos un cache
         // console.log(event)
         console.log('SW: se ha instalado')

         //Nota> Ejecutamos codigo cuando se instala

         // Para hacer que se instale el nuevo service worker
         // self.skipWaiting();
         // Nota: No es siempre recomendable tenerlo activo. Ya que reemplza sin tomar en cuenta si se anda usando.

         const instalacion = new Promise((resolve, reject) => {

               setTimeout(() => {
                  console.log('SW: Instalaciones Termiadas')
                  self.skipWaiting();
                  resolve();
               }, 1)

         })

         //Espera que
         event.waitUntil(instalacion);

   })
```
 - Activate: Uso Cuando el Service Worker toma el control de la aplicacion
```
self.addEventListener('activate', event => {
    
    // borrar cache viejo
    console.log('SW2: Activo y listo para controlar la aplicacion')
})
```

 - fetch: Uso cuando Maneja de peticiones de https

 ```
self.addEventListener('fetch', event => {

    // Aplicar Estrategia del cache: es decir, toma de decisiones de almacenaje de cache
    // console.log('SW:', event.request.url)
    
    if(event.request.url.includes('https://reqres.in/')){
             const resp = new Response(`{ok: false, mensaje: 'jajaja'}`)
             
            // Muestra
            event.respondWith(resp)
    }

})
```
- Sync: uso cuando recuperamos la conexion a internet

```
 self.addEventListener('sync', event => {


    console.log('Tenemos conexion!!!')
    console.log(event)
    console.log(event.log)

})
```

 - Push: Uso cuando Manejamos las  Notificacion push
 
```
   self.addEventListener('push', event => {

      console.log('Notifiacion recibidas')

   })

```

##### Introducción al Cache

Verificamos si soporta cache. 

```javascript
if(window,caches){

}
```

Creamos la cache
```javascript
    const cacheProm = caches.open(CACHE_NAME)
          .then(cache => console.log)
```

##### Estrategia del Cache

 1) Cache only: es cuando queremos que toda la web sea servida del cache
 2) Cache with Netowork Fallback: Intenta primero en el cache, si no encuentra busca en internet
 3) Network With Cache WFallback: Consulta en internet, si no busca en la cache
 4) Cache with network Update :  Rendimiento es critico \ cuando se requiere que se carge rapido el contenido
 5) Cache & network race : Esta es una competacia entre la cache y el internet para ver cual responde mas rapido


#### Definir app Shell

- Nota importante: el app shell es lo que necesita el codigo para funcionar

```javascriptself.addEventListener('install', e => {

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
```

##### Ejemplos

###### Cache only

``` javascripts
e.respondWith( caches.match( e.request ) );
```

###### Cache with Netowork Fallback

``` javascripts
  const respuesta = caches.match( e.request )
        .then( res => {

            if ( res ) return res;

            // No existe el archivo
            // tengo que ir a la web
            console.log('No existe', e.request.url );


            return fetch( e.request ).then( newResp => {

                caches.open( CACHE_DYNAMIC_NAME )
                    .then( cache => {
                        cache.put( e.request, newResp );
                        limpiarCache( CACHE_DYNAMIC_NAME, 50 );
                    });

                return newResp.clone();
            });


        });




    e.respondWith( respuesta );
```

###### Network With Cache Fallback

```
    const respuesta = fetch( e.request ).then( res => {

        if ( !res ) return caches.match( e.request );

        caches.open( CACHE_DYNAMIC_NAME )
            .then( cache => {
                cache.put( e.request, res );
                limpiarCache( CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT );
            });


        return res.clone();

    }).catch( err =>{
        return caches.match( e.request );
    });



    e.respondWith( respuesta );
```
###### Cache with network Update 
```
    Rendimiento es crítico
    Siempre estarán un paso atrás
    
    if ( e.request.url.includes('bootstrap') ) {
        return e.respondWith( caches.match( e.request ) );
    }

    const respuesta = caches.open( CACHE_STATIC_NAME ).then( cache => {

        fetch( e.request ).then( newRes => 
                cache.put( e.request, newRes ));

        return cache.match( e.request );

    });

    e.respondWith( respuesta );
```

###### Cache & network race 
```
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

```

##### Notas Recordatorias

- Nota: por lo general de se llama sw.js o service-workers.js
   Nota: el service worker siempre esta ejecutandose, hasta que sea eliminado o suplantado

- Nota: server workers, debe funcionar en https. 

- Nota: deshabiitar cache en la pestana network para tener las ultimas versiones | evitamos que chrome no mantega copias vieja

- Nota:  el service worker debe ir en el archivo raiz donde inicia la aplicacion

- Nota: Es importante que el service worker este en la raiz, porque si se especifica en una carpeta solo monitorearia los archivos que esten en esa carpeta

- Video 37 para configuracion del .jshintrc



#### Cache Storage / Documentacion

https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage


#### Documentacion de cache

https://davidwalsh.name/cache

https://web.dev/cache-api-quick-guide/


### tips

###### Verificar compatibildiad de alguna funcion en JS 

https://caniuse.com/


Buena Guia

https://github.com/LeoSan/CursoPWA

