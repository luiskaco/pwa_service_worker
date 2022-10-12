class Camara {

    //asinamos la referencia
    constructor(videoNode) {
        this.videoNode = videoNode

        console.log("Camara iniciada")
    }

    encender(){
        //Verificamo si tiene 
        if(navigator.mediaDevices){

            navigator.mediaDevices.getUserMedia({
                audio:false,
                video: { width: 300, height: 300}

            }).then(stream => {
                //Devuelve un stram de vdeo

                this.videoNode.srcObject = stream
                this.stream = this.stream


            })

            // 1 - Podemos pasar un objeto de opciones.
            // 2 - el get user devuelve una promesa
            // 3 - Si no se especifica el tamno de la el video el va tomar el tamano de la resolucinn posible
            // Documentacion: https://developer.mozilla.org/es/docs/Web/API/MediaDevices/getUserMedia
        }
        
    }

    apagar(){
        //Congelar el video
        this.videoNode.pause();

        // Deneter el stream del video
        if(this.stream){
            this.stream.getTracks()[0].stop();
        }
        // Nota: especificamos la primera posicion referenciando al video.

    }


    tomarFoto(){
        // Crear un elemento canvas para renderizar la foto
        let canvas = document.createElement('canvas')

        // Colocar las dimensiones igual al elemento del video 
        canvas.setAttribute('width', 300)
        canvas.setAttribute('height', 300)

        // Obtener el contexto del canvas
        let context = canvas.getContext('2d') // Es una simple imagen

        //Dibuamos la imagen
        context.drawImage(this.videoNode, 0,0, canvas.width, canvas.height)

        // posiciion / Inicio/ tamano

        // Extraer imagenes
        this.foto = context.canvas.toDataURL()

        // Limpieza
        canvas = null
        context = null


        return this.foto
    }

}