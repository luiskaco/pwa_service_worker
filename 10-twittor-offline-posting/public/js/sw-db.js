// Logica Auxiliar para almacena de dbid

const db = new PouchDB('mensajes')

// \nota: Cualquier interacion debe ser aqui\


// Utilidades para guardar postDB
function guardarMensaje( mensaje ) {

    mensaje._id = new Date().toISOString();

    return db.put( mensaje ).then( () => {

        self.registration.sync.register('nuevo-post');

       //Regrresarle esto al frontend de que esatamos guardando offlien
        const newResp = { ok: true, offline: true };

          //Retornamos una nueva respuesta
        return new Response( JSON.stringify(newResp) );

    });

}