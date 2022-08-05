


self.addEventListener('fetch', event => {

    const offlineResp = new Response(`
        Bienvenido a mi Pagina Web
    
        Disculpa, para usarla, ecesitas internet
    `)

    const resp = fetch(event.request)
                 .catch(() => offlineResp)


    event.respondWith(resp)


});