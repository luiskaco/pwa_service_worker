 // Interesante haciendo uso del fecth como evento
self.addEventListener('fetch', event => {


    // Preguntar si el evento incluye style.css
    // console.log(event.request.url);
    if ( event.request.url.includes('.jpg') ) {
        console.log(event.request.url)
         // interceptamos para modificar valores
        
        // let respuesta = new Response(`
        //     img {
        //         transform: scaleY(-1);
        //     }
        // `, {
        //     headers: {
        //         'Content-Type': 'text/css'
        //     }
        // })

        let fotoReq = fetch('img/main-patas-arriba.jpg')
 
         event.respondWith( fotoReq );
    }
})