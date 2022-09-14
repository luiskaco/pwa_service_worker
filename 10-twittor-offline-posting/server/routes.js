// Routes.js - Módulo de rutas
var express = require('express');
var router = express.Router();


const mensajes = [
    {
        _id:'xxx',
        user:'spiderman',
        mensaje: 'Hola mundo, como estamos'
    },
    {
      _id:'xxy',
      user:'hulk',
      mensaje: 'Hola mundo, como estamos'
   },

]

// Get mensajes
router.get('/', function (req, res) {
  // res.json('Obteniendo mensajes');
    res.json(mensajes)
});


//Post Mensaje
router.post('/', function (req, res) {
  // res.json('Obteniendo mensajes');

    const mensaje = {
          mensaje: req.body.mensaje,
          user: req.body.user
    }

    mensajes.push(mensaje)

    console.log(mensaje)

    res.json({
        ok:true, 
        mensaje
    })
});


module.exports = router;