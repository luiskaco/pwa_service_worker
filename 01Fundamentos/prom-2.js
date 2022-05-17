

function sumaruno( numero ){

    var promesa = new Promise(function(resolve, reject) {

        if(numero >= 7){
            reject('El numero es muy alto')
        }

        setTimeout(()=>{

            resolve(numero + 1) // parra poder obtener el valro dentro de una promesa

        }, 800)
    
    })


    return promesa;
  
}
// primero hace la promsea y luego resuelve con el then
// sumaruno(5)
//        .then(  nuevoNumero  => {
//         console.log(nuevoNumero)

//         return sumaruno(nuevoNumero);

//         }).then(nuevoNumero => {
//             console.log(nuevoNumero)
//             return sumaruno(nuevoNumero);
//         }).then(nuevoNumero => {
//             console.log(nuevoNumero)
        
//         })

// forma 2

 sumaruno(5)
         .then(  nuevoNumero  => sumaruno(nuevoNumero)
         ).then(nuevoNumero => sumaruno(nuevoNumero)).then(nuevoNumero => {
             console.log(nuevoNumero)
         
         })
 

//forma 3 - mejor

sumaruno(3)
        .then(sumaruno)
        .then(sumaruno)
        .then(sumaruno)
        .then(sumaruno)
        .then(sumaruno)
        .then(nuevoNumero => {
            console.log(nuevoNumero)

        }).catch(error => {
            console.log(error)
        })

        /** nota los casht se pueden ejecutar en cualquier part de la promesa
         * 
         * 
         */