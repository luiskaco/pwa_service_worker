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

    // Recorrer todas las subrcripciones
    suscripciones.forEach( (suscripcion, i) => {
        
        // enviar notificacion a la subcricripcion
         webpush.sendNotification(suscripcion, JSON.stringify(post)).then().catch(console.log);



    });

}