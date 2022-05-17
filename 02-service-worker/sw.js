 // Interesante haciendo uso del fecth como evento
self.addEventListener('fetch', event => {


    const resp =  fetch(event.request)
                    .then(resp => {
                        // console.log(resp)

                        // if(resp.ok){
                        //     return resp;
                        // }else{
                        //     return fetch('img/main.jpg')
                        // }
                        return resp.ok ? resp : fetch('img/main.jpg');

                        // Nota: una respueta 404, no es un manejado por el fecth
                    })

    event.respondWith(resp)

})