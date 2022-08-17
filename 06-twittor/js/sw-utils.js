
//Actualiza cache dinamico
function actualizaCacheDinamico(dynamicCache, req, res) {
    
    // la respuesta tiene data
    if(res.ok){
        // ?        

                // Abrirmsel cache
        return  caches.open(dynamicCache).then(cache => {

            //Guardamos en la cache la req  y la respuesta
            cache.put(req, res.clone());

            return res.clone();


        })

    }else{

        //En caso de falar cache y red , que no devuelva lo que sea que regrese
        return res;
    }
}