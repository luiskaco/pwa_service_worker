// Routes.js - Módulo de rutas
const express = require('express');
const router = express.Router();
const push = require("./push");

const mensajes = [

  {
    _id: 'XXX',
    user: 'spiderman',
    mensaje: 'Hola Mundo'
  }

];


// Get mensajes
router.get('/', function (req, res) {
  // res.json('Obteniendo mensajes');
  res.json( mensajes );
});


// Post mensaje
router.post('/', function (req, res) {
  
  const mensaje = {
    mensaje: req.body.mensaje,
    user: req.body.user
  };

  mensajes.push( mensaje );

  console.log(mensajes);

  res.json({
    ok: true,
    mensaje
  });
});



// Almacenar suscripcions para las notificaciones


router.post("/subscribe", (req, res) => {

  // obtenemos subcricpion
    const subcr = req.body

    // console.log(subcr)

    // Guardamos subcripcion
    push.addSubscription(subcr)

 
    res.json("subscribe")
})



router.get('/key',(req, res) => {
    // Obtenemos la llave
    const key = push.getKey()

    res.send(key);

    // Nota: no es necesiario enviarlo en json
    // res.json(key);
})

// Enviar notificaciones push
// -- que nosotros queramos
// -- Normalmente esto es algo que se usado del lado del servidor. No debe ser expuesto como rest


router.post("/push", (req, res) => {

  const post = {
      titulo: req.body.titulo,
      cuerpo: req.body.cuerpo,
      usuario: req.body.usuario
  } 

  // Enviar notificacion
  push.sendPush(post)


  res.json(post)

})




module.exports = router;