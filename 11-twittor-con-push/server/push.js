// FileSystem
const fs = require("fs")
// importando el paquete urlsafeBase
const urlsafebase64 = require('urlsafe-base64')
// improtando llave jsons
const vapid = require("./vapid.json")
//  importamos el paquete para enviar push
const webpush = require('web-push')
// const suscripciones =
let suscripciones = require("./subs-db.json")


// Configuraciones del webpush
webpush.setVapidDetails(
  'mailto:luiskaco@gmail.com',  // importante configurar un correo de comunicacion
  vapid.publicKey,
  vapid.privateKey
);


// retornamos al public key
module.exports.getKey = () => {
    return urlsafebase64.decode(vapid.publicKey);
}


// Gurdar subcripcion
module.exports.addSubscription = (suscripcion) => {

    suscripciones.push( suscripcion );

    fs.writeFileSync(`${ __dirname }/subs-db.json`, JSON.stringify(suscripciones) );

    console.log("suscripciones")

} 


// Envio de notificacion
module.exports.sendPush = ( post ) => {
    // Mandando pushes
    console.log('Mandando Pushes')  
    
    // Definiendo mi arreglo de notificaiones
    const notificacionesEnviadas = [];
    

    // Recorrer todas las subrcripciones
    suscripciones.forEach( (suscripcion, i) => {
        
        // enviar notificacion a la subcricripcion
       const pushProm =  webpush.sendNotification(suscripcion, JSON.stringify(post))
                .then(console.log('notificaciones enviada'))
                .catch(err =>{

                    if(err.statusCode === 410){ // Ya no existe la supcripcion
                        suscripciones[i].borrar = true;
                    }

                });


                // A;adimos las promesas filtras al arreglo de notificaiones
                notificacionesEnviadas.push( pushProm );
                // nota: se esta realizando esto debido a la velocidad en que se reciben las respuesta de las notificaicones
    });



    /// Recorremos nuevamente las subcripciones

    Promise.all( notificacionesEnviadas ).then( () => {

                // Regresa todas las sub que no tengan borrar
                suscripciones = suscripciones.filter( subs => !subs.borrar );

        // Rescribimos en el archivo
        fs.writeFileSync(`${ __dirname }/subs-db.json`, JSON.stringify(suscripciones) );

    })

}