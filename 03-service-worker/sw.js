
// Ciclo de vida del SW

//nota: cuando se tiene el evento de instalacion , es necesario abrir otra pesta;a
self.addEventListener('install', event => {
        
        // PASOS QUE NORMALMENTE SE REALIZAN

        // Descargar assets
        // creamos un cache
        // console.log(event)
        console.log('SW: se ha instalado')

        //Nota> Ejecutamos codigo cuando se instala

        // Para hacer que se instale el nuevo service worker
        // self.skipWaiting();
        // Nota: No es siempre recomendable tenerlo activo. Ya que reemplza sin tomar en cuenta si se anda usando.
        // Se recomienda que se cierre la app y se vuelve a ejecutar


        const instalacion = new Promise((resolve, reject) => {

            setTimeout(() => {
                console.log('SW: Instalaciones Terminadas')
                self.skipWaiting();
                resolve();
            }, 1)

        })

        //Espera que (la promesa termine de realizarse)
        event.waitUntil(instalacion);

})

// Cuando el SW toma el control de la aplicacion
self.addEventListener('activate', event => {
    
    // borrar cache viejo
    console.log('SW2: Activo y listo para controlar la aplicacion')

    // nota> se avtica una vez el cliente cierre la aplicacion.
})


// FeTCH: Maneja de peticiones de http
self.addEventListener('fetch', event => {

    // Aplicar Estrategia del cache: es decir, toma de decisiones de almacenaje de cache
    
    // console.log('SW:', event.request.url)


    // if(event.request.url.includes('https://reqres.in/')){
    //         const resp = new Response(`{ok: false, mensaje: 'jajaja'}`)


    //         event.respondWith(resp)
    // }

})

//SYNC: Es cuando recuperamos la conexion a internet

self.addEventListener('sync', event => {


    console.log('Tenemos conexion!!!')
    console.log(event)
    console.log(event.log)

})



// PUSH: Manejar las push Notificacion

self.addEventListener('push', event => {

    console.log('Notifiacion recibidas')

})