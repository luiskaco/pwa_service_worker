 // Interesante haciendo uso del fecth como evento
self.addEventListener('fetch', event => {


    // Preguntar si el evento incluye style.css
    console.log(event.request.url);
    if ( event.request.url.includes('style.css') ) {

         // interceptamos para modificar valores
        
        let respuesta = new Response(`
            body {
                background-color: red !important;
                color: pink;
            }
        `, {
            headers: {
                'Content-Type': 'text/css'
            }
        })
 
        event.respondWith( respuesta );
    }
})