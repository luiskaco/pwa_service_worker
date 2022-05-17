
function sumarLento( numero ){
    return new Promise(function(resolve, reject) {

        setTimeout(() => {
            resolve(numero + 1)
        }, 800)

    })
}


let sumarRapido = numero => {
    return new Promise((resolve, reject) => {

        setTimeout(() => {
            // resolve(numero + 1)
            reject('Error en sumar rapido')
        }, 300)

    })
}


// Promise race : Pone a competir todos los parametros, y solo devuelve la que resonda proimero, si ambas responden al mismo tiempo, tomara el parametros que se encuentre mas  hacia el lado izquierdo


Promise.race([sumarLento(5), sumarRapido(10)])
        .then(respuesta => {
            console.log(respuesta)
        })
        .catch(console.log)

        // Nota: cuando una de las promesa da error, se cancelan todoas


        // Promsea ALL
        // https://developer.mozilla.org/es/docs/web/javascript/reference/global_objects/promise/all


        // promise race
        //https://developer.mozilla.org/es/docs/web/javascript/reference/global_objects/promise/race