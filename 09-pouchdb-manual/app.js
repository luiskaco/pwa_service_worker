

// Entrenamiento PouchDB

// 1- Crear la base de datos
// Nombre:  mensajes
let db = new PouchDB('mensajes');

// Objeto a grabar en base de datos
let mensaje = {
    _id: new Date().toISOString(),
    user: 'spiderman',
    mensaje: 'Mi tía hizo unos panqueques muy buenos',
    sincronizado: false
};

// 2- Insertar en la base de datos
 db.put(mensaje)
   .then(console.log('Insertando'))
   .catch(console.log)


// 3- Leer todos los mensajes offlineW
// Que aparezcan en la consola



// 4- Cambiar el valor 'sincronizado' de todos los objetos
//  en la BD a TRUE




// 5- Borrar todos los registros, uno por uno, evaluando
// cuales estan sincronizados
// deberá de comentar todo el código que actualiza
// el campo de la sincronización 





