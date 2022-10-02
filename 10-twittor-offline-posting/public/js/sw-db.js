//Logica necesaria para usar indexeDB 
// Debemos buscar la libreria https://pouchdb.com/download.html  -> PunchDB
 
const db = new PouchDB('mensaje');

//Utilidades para grabar PunchDB 
// Si se ejecuta esta función tenemos un posteo offLine 
function guardarMensaje(mensaje){

    mensaje._id = new Date().toISOString();
    return db.put(mensaje).then(()=>{

        //Le indicamos al SW que tiene tareas  que hacer apenas tengas internet 
        self.registration.sync.register('nuevo-post');
        //Se crea una respuesta ficticia ya que estamos en OffLine
        const newReponse = {ok:true, offline:true}
        //Así podemos crear y retornar una repuesta falsa ya que estamos en Offline 
        return new Response(JSON.stringify(newReponse));
    });

}

//Postear mensaje a la API 
function postearMensajes(){

    const posteos =[];

    //Forma de recorrer el db dbasesindexes 
    return db.allDocs({include_docs:true}).then(docs=>{
        
        //Bucle para validar el contenido 
        docs.rows.forEach(row=>{
            const doc = row.doc; 
            try {
                //Para ser una petición POST 
              const fetchPromesa =  fetch('/api', {
                                    method:'POST',
                                    headers:{
                                        'Content-Type':'application/json',
                                    },
                                    body:JSON.stringify(doc) })
                                    .then(res=>{
                                        //Lo elimino ya que si no cada ves que hagas un posteo te meterá el valor viejo una y otra vez 
                                       return db.remove(doc);
                                    }).catch(err=>console.log('app.js error', err));
                                    
                                    //Lo almacen en el arreglo
                                    posteos.push(fetchPromesa); 
            }catch(error){
                console.log('app.js error', error)
            }   
        });//fin del foreach 
        //Esto hace que espere y se ejecuten todas las promesas 
        return Promise.all(posteos);

    });


}
