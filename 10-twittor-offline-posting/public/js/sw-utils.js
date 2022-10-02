

// Guardar  en el cache dinamico
function actualizaCacheDinamico( dynamicCache, req, res ) {


    if ( res.ok ) {

        return caches.open( dynamicCache ).then( cache => {

            cache.put( req, res.clone() );
            
            return res.clone();

        });

    } else {
        return res;
    }

}

// Cache with network update
function actualizaCacheStatico( staticCache, req, APP_SHELL_INMUTABLE ) {


    if ( APP_SHELL_INMUTABLE.includes(req.url) ) {
        // No hace falta actualizar el inmutable
        // console.log('existe en inmutable', req.url );

    } else {
        // console.log('actualizando', req.url );
        return fetch( req )
                .then( res => {
                    return actualizaCacheDinamico( staticCache, req, res );
                });
    }



}


//Esto es para caches dinamicos usando APIS
// Network with cache fallback / Update 
// Nota-> cada vez que retornas algo debes manejar la caches para el offline 
function manejoApiMensajes(cacheName, req){
    
    //Estrategia especial para post ya que la cache no almacena post, si no get
    if(req.clone().method === 'POST'){
        
        //syncmanager -> No es soportado por todos los navegadores web 
        if (self.registration.sync){  // Validamos si es soportado

            //Posteo de un nuevo mensaje , podemos leer y obtener al objeto 
          return  req.clone().text().then(body=>{//Parte de la paranohia que tiene el sensei, recomienda clonar request 
                const bodyObj = JSON.parse(body); 
                //Hay que decirle que se guardo la tarea en modo offLines apenas regrese el internet hay que postear de verdad
                return guardarMensaje(bodyObj);//-> Colocamos return para que retorne la respuesta offLine

            }); 
        }else{//no lo puedo guardar como una tarea sincrona 
            //debemos validar si tenemos conexion a internet!!!             
            return fetch(req);//dejamos que la petición fluya 

        }
        
        
    }else{
        return  fetch(req)
        .then(resp=>{
            if (resp.ok){
                actualizaCacheDinamico(cacheName,req, resp.clone() );//Siempre las respuesta la clonamos para evitar los callback hell
                return resp.clone();//Para evitar que se ejecute primero
            }else{
                return caches.match(req);
            }
        }).catch(err =>{
            return caches.match(req);
        });

    }

}

