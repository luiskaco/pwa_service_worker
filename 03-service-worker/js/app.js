

// Detectar si podemos usar Service Workers
if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register('/sw.js')
            .then(reg => {


                // Registrar una tarea sync de engano para probar rl listenrer
                // setTimeout(()=> {
                //     reg.sync.register('Posteo de gatitos')
                //     console.log('Se enviaron fotos de gatitos al server')
                // }, 3000)

                Notification.requestPermission().then( result => {

                    // Si el usuairo acepta, envia la notitifacion, si no.

                    console.log(result)
                    reg.showNotification('Hola mundo!!!')
            
                })


            })




}



//  if( window.syncManager)
//  Nota: para verificar si existe el syncmanage Escribimos enla concola del navegador window.syncManager


// fetch('https://reqres.in/api/users')
//     .then(resp => resp.text())
//     .then(console.log)