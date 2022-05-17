

// Verificamos si soporta service worker
if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register('/sw.js');
}

//  nota: si soporta service Worker, entonces soporta cache


// Nota: La cache es parte del objeto windows

//  Verificamso si soporta cache. 
if(window,caches){
    //  Creamos cache
    caches.open('prueba-1')
    caches.open('prueba-2')

    //  Comprobamos cache
    caches.has('prueba-3').then(console.log)
    //  nota Devuelve promesa

    //  Eliminar cache
    //  caches.delete('prueba-1').then(console.log)

    caches.open('cache-v1.1').then( cache => {

             //  Agregamos en cache individualmente
             //  cache.add('/index.html')

             // Agregamos todo
            cache.addAll([
                '/index.html',
                '/css/style.css',
                '/img/main.jpg',
            ]).then(() => {
                
                // Eliminar Carche
                // cache.delete('/css/style.css').then(console.log)

                //  Reemplezamos el valor que este dentro del cache / llave valor
                cache.put('index.html', new Response(`Hola mundo`))

            })

            //  Leer Archivo
            //  cache.match('/index.html')
            //         .then(resp => {
            //     resp.text().then(console.log)
            // })
            //  Nota: Podemos actualizar la cache, para que el cliente tenga la version actualizad


    })


        // Retonar todos los caches
        caches.keys().then(keys => {
            console.log(keys)
        })


    // Nota: Eliminamos nuestros archivos y peticiones

}   

// Nota> la cache impacta en el disposivo