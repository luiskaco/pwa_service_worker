var url = window.location.href;
var swLocation = '/twittor/sw.js';

//Valida si esta en Local o en Producción
if ( navigator.serviceWorker ) {
    if ( url.includes('localhost') ) {
        swLocation = './sw.js';
    }
    navigator.serviceWorker.register( swLocation );
}

// Referencias de jQuery
var titulo      = $('#titulo');
var nuevoBtn    = $('#nuevo-btn');
var salirBtn    = $('#salir-btn');
var cancelarBtn = $('#cancel-btn');
var postBtn     = $('#post-btn');
var avatarSel   = $('#seleccion');
var timeline    = $('#timeline');

var modal       = $('#modal');
var modalAvatar = $('#modal-avatar');
var avatarBtns  = $('.seleccion-avatar');
var txtMensaje  = $('#txtMensaje');

// El usuario, contiene el ID del hÃ©roe seleccionado
var usuario;


// ===== Codigo de la aplicación

function crearMensajeHTML(mensaje, personaje) {

    var content =`
    <li class="animated fadeIn fast">
        <div class="avatar">
            <img src="img/avatars/${ personaje }.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${ personaje }</h3>
                <br/>
                ${ mensaje }
            </div>
            
            <div class="arrow"></div>
        </div>
    </li>
    `;

    timeline.prepend(content);
    cancelarBtn.click();

}



// Globals
function logIn( ingreso ) {

    if ( ingreso ) {
        nuevoBtn.removeClass('oculto');
        salirBtn.removeClass('oculto');
        timeline.removeClass('oculto');
        avatarSel.addClass('oculto');
        modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg');
    } else {
        nuevoBtn.addClass('oculto');
        salirBtn.addClass('oculto');
        timeline.addClass('oculto');
        avatarSel.removeClass('oculto');

        titulo.text('Seleccione Personaje');
    
    }

}


// Seleccion de personaje
avatarBtns.on('click', function() {

    usuario = $(this).data('user');

    titulo.text('@' + usuario);

    logIn(true);

});

// Boton de salir
salirBtn.on('click', function() {

    logIn(false);

});

// Boton de nuevo mensaje
nuevoBtn.on('click', function() {

    modal.removeClass('oculto');
    modal.animate({ 
        marginTop: '-=1000px',
        opacity: 1
    }, 200 );

});

// Boton de cancelar mensaje
cancelarBtn.on('click', function() {
    if ( !modal.hasClass('oculto') ) {
        modal.animate({ 
            marginTop: '+=1000px',
            opacity: 0
         }, 200, function() {
             modal.addClass('oculto');
             txtMensaje.val('');
         });
    }
});

// Boton de enviar mensaje
postBtn.on('click', function() {

    var mensaje = txtMensaje.val();
    if ( mensaje.length === 0 ) {
        cancelarBtn.click();
        return;
    }

var data ={
    user:'ironman',
    mensaje:'Prueba tu post'
}

    

try {
       //Para ser una petición POST 
       fetch('/api', {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify(data)  
    }).then(res=>{
        console.log(res);
    }).then(resp=>{
        console.log(resp);
    }).catch(err=>console.log('app.js error', err));

    crearMensajeHTML( mensaje, usuario );
} catch (error) {
    console.log(error);
}



});


// Nuevas Funciones, 

//Obtener mensajes del API 
function getMensajes(){
    console.log("entro");
    fetch('http://localhost:3000/api')
        .then(res=> res.json())
        .then(posts =>{
            console.log(posts);
            posts.forEach(element => {
                crearMensajeHTML(element.mensaje, element.user);    
            });
            

        }).catch(console.log);
};

getMensajes();

//Metodo: Detectando conexion 
function isOnline(){
    if (navigator.onLine){
        console.log(`Estamos online`);
         $.mdtoast('OnLine.', 
         { 
            type: 'success',
            interaction:true, 
            interactionTimeout:1000, 
           actionText: 'ok!' 
        }); 
    }else{
        console.log(`Estamos offline`);
        $.mdtoast('OnLine.', 
        { 
           type: 'info',
           interaction:true, 
           interactionTimeout:1000, 
          actionText: 'ok!' 
       }); 
    }
}

//Eventos 

isOnline();

window.addEventListener('online', isOnline);

window.addEventListener('offline', isOnline);