

// Nota: Cuando responder cuando tenemos una conexion o no
// self.addEventListener('fetch', event => {

//     // Response(): Nos permite crear respuesta
//     const offlineResp = new Response(`
//          Bienvenido a mi Página Web

//          Disculpa para usarla Necesitas internet
//     `)

//     const resp = fetch(event.request)
//                 // Si no tiene internet, responde el catch
//                 .catch(() =>  offlineResp)


//     event.respondWith( resp )
// })



// Nota: Cuando responder cuando tenemos una conexion o no
self.addEventListener('fetch', event => {

    // Response(): Nos permite crear respuesta
    const offlineResp = new Response(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>Mi PWA</title>
            
            </head>
            <body class="container p-3">
                <h1>Offline mode</h1>
            </body>
            </html?
    `, 
        // Para que interprete el navegador
    {
        headers: {
            'content-Type':'text/html'
        }
    })


    const offlineResp2 = fetch('pages/offline.html')



    const resp = fetch(event.request)
                // Si no tiene internet, responde el catch
                .catch(() =>  offlineResp2)


    event.respondWith( resp )
})