 // Interesante haciendo uso del fecth como evento
self.addEventListener('fetch', event => {


        // compranbo los archvos sean servidos con SW
        // console.log(event)
        // if(event.request.url.includes('style.css')) {
        //     event.respondWith( null )
        // }else {
        //     event.respondWith( fetch(event.request) )
        // }

        // Conmprbando que la imagen sea servida
  
        if(event.request.url.includes('.jpg')) {
            // console.log(event.request.url)

            let fotoReq = fetch('img/main.jpg)
            //  let fotoReq = fetch(event.request.url)
            //  let fotoReq = fetch('img/main.jpg')

            event.respondWith(fotoReq)
       }
})