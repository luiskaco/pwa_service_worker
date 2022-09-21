// Routes.js - Módulo de rutas
const express = require('express');
const router = express.Router();

const mensajes = [

  {
    _id:'963',
    user:'spiderman',
    mensaje:'hola mundo'
  }


];





// Get mensajes
router.get('/', function (req, res) {
  //res.json('Obteniendo mensajes');
  res.json(mensajes);
});


// post de un  mensajes
router.post('/', function (req, res) {
  
  const mensaje = [
    {
      _id:'963',
      user:req.body.user,
      mensaje:req.body.mensaje
    }
  ];
  mensajes.push(mensaje);
  res.json({ok:true, mensaje});
});




module.exports = router;