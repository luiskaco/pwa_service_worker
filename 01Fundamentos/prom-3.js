
function returnTrue () {
    return true;
}

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
            resolve(numero + 1)
        }, 300)

    })
}



//  sumarLento(5).then(console.log)
//  sumarRapido(10).then(console.log)





 // Promise tiene una funcion estatica llamda promise all

 let cosas = [sumarLento(5), sumarRapido(10), false ,'Hola mundo', returnTrue()]




 Promise.all(cosas)  // Ejecuta promesas en pararelo
        .then( respuestas => {
            console.log( respuestas )
        })
        .catch(console.log); // nota> si una falla, falla todo el codigo

        // Nota: Regresan en el mismo orden que se 
        // Permite recibe un arreglo de cosas

        