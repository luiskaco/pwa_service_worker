let img = document.querySelector('img')

fetch('superman.png')
    // .then(console.log)
    .then(resp => resp.blob())
    .then(imagen => {
        // console.log(imagen)

        // Crea el url para poder obtener el objeto imagen
        var imgPath = URL.createObjectURL(imagen )

        img.src = imgPath
        
    })


    // documentacion de suar URL 

    // https://developer.mozilla.org/es/docs/Web/API/URL/createObjectURL