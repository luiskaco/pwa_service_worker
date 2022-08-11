
self.addEventListener('fetch', event => {


    // 1-- Forma de responder offline 

    // Forma basica de responder
    
        const offlineResp = new Response(`Bienvenido a mi pagina web
        
            Disculpa, para usarla, necesitas internet
        `);


    //  2 . como html en el codigo


            const offlineResp2 = new Response(`
                    <!DOCTYPE html>
                    <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <meta http-equiv="X-UA-Compatible" content="ie=edge">
                            <title>Mi PWA</title>
                        
                            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
                            <link rel="stylesheet" href="css/style.css">
                        </head>
                        <body class="container p-3">
                                <h1>Offline Mode </h1>
                        </body>
                    </html>
            
            
            `, 
            // Para que interprete el navegador
                {
                    headers: {
                        'content-Type':'text/html'
                    }
                })

    // 3 llamado de un archivo como respuesta

    const offlineResp3 = fetch('pages/offline.html')


    const resp = fetch(event.request)
    // Si no tiene internet, responde el catch
    .catch(() =>  offlineResp3)



    event.respondWith(resp)


});   