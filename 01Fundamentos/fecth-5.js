// Peticion GET 
//https://reqres.in/api/users


fetch('https://reqres.in/api/users/1')
    .then(resp => {
      
        // Para oioder keer usamos en el body  clone
        resp.clone().json().then( usuario => {
            console.log(usuario.data)
        })

        resp.clone().json().then( usuario => {
            console.log(usuario.data)
        })

        resp.json().then( usuario => {
            console.log(usuario.data)
        })



    })
    .catch(error => {
        console.log('Error en la paticion')
        console.log(error)
    })