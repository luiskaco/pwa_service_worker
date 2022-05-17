// Peticion GET 
//https://reqres.in/api/users
let usuarioID = 1000;

fetch(`https://reqres.in/api/users/${usuarioID}`)
    .then(resp => {
      
    
        if(resp.ok ){
            return resp.json()
        }else {
            throw new Error( `No existe el usuario  ${usuarioID}`)
        }

    })
    .then(console.log)
    .catch(error => {
        console.log('Error en la paticion')
        console.log(error)
    })