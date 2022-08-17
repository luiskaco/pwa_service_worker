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

###### Cache with Network Fallback

``` javascripts
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
```

###### Network With Cache Fallback

```
       // Buscamos en la internet
      const respNetwork = fetch(e.request).then(res => {

          //Si la respuesta no existe, intentaos leer de la cache
          if(!res)  return caches.match(e.request)
          // console.log('fetch', res)

          // Creamos y abrimos cache
          caches.open(CACHE_DYNAMIC_NAME)
                .then(cache => {
                    // Guardamos lo que buscamos y su respuesta
                    cache.put(e.request, res);
                    limpiarCache(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT)  // Un buen numero de elementos en cache es 50
                })

          return res.clone();

      }).catch(err =>{
          // Buscamos si tenemos algo en la cache
          return caches.match(e.request) // Si existe algo en la cache con la peticion solicitada, retornamos
      })

      // DEVENTAJA de este metodo
      // 1 . Cuando esta en un mobil, va buscar siempre va buscar la informacion actualizada.
      // 2. Siempre va consumir datos.



    e.respondWith(respNetwork);
```
###### Cache with network Update 
```
     // Rendimiento es critico \ cuando se requiere que se carge rapido el contenido
    // Siempre estaran un paso atras nuestra actuaLIZACIONES


        // Resolver problema del cache con bootstrap
            if(e.request.url.includes('bootstrap')) {
                return e.respondWith(caches.match(e.request))
                // Busca la cache del inmutable
            }
        //

        const resp = caches.open(CACHE_STATIC_NAME).then(cache => {

            // Va a buscar los archivos actualizados en el servidor
            fetch(e.request).then(newResp => {
                // Los Guardamos en la cache statica
                cache.put(e.request, newResp);
            })  

            // Busca que coincida loq ue tengo en CACHE_STATCI_NAME en la peticon que solicita el cliente
            return cache.match(e.request)
        })

    e.respondWith(resp);
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

