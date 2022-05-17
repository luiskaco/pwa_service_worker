

function sumaruno( numero, callback ){


    setTimeout(()=>{
        callback(numero + 1)
    }, 800)
  
}

sumaruno(5, function(nuevoValor) {
    console.log( nuevoValor )
})