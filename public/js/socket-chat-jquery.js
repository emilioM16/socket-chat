var params = new URLSearchParams(window.location.search);

//referencias de jquery

var divUsuarios = $('#divUsuarios');
var divChatbox = $('#divChatbox');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');

//Funciones para renderizar usuarios\

function renderizarUsuarios(personas){
    var html = '';

    html += '<li>'
    html +=     '<a href="java>script:void(0)" class="active"> Chat de <span>' + params.get('sala') + '</span></a>'
    html += '</li>'

    for (let i = 0; i < personas.length; i++) {
        html += '<li>'
        html +=     '<a data-id="'+ personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + '<small class="text-success">online</small></span></a>'
        html += '</li>'
    }

    divUsuarios.html(html);
}


//Listeners

divUsuarios.on('click', 'a', function(){ //click en un elemento de la lista de usuarios
    var id = $(this).data('id');
    console.log(id);
});


formEnviar.on('submit', function(e){
    e.preventDefault();
    if(txtMensaje.val().trim().length === 0 ){
        return;
    }
    socket.emit('crearMensaje', {
        nombre: params.get('nombre'),
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        txtMensaje.val('').focus();
        renderizarMensaje(mensaje, true);
        scrollBottom();
    });
});

//Funciones para renderizar los mensajes

function renderizarMensaje(datos, yo){
    var html = '';
    var hora = new Date(datos.fecha);
    hora = hora.getHours() + ':' + (hora.getMinutes() < 10 ? '0' : '') + hora.getMinutes();
    var adminClass = 'inverse';
    if (datos.nombre === 'Administrador') {
        adminClass = 'danger';
    }
    if(yo){
        html += '<li class="animated fadeIn">'
        html += '    <div class="chat-content">'
        html += '        <h5>'+ datos.nombre +'</h5>'
        html += '        <div class="box bg-light-info">'+ datos.mensaje +'</div>'
        html += '    </div>'
        html += '    <div class="chat-time">'+ hora +'</div>'
        html += '</li>';
    }else{
        html += '<li class=" reverse animated fadeIn">'
        html += '    <div class="chat-content">'
        html += '        <h5>'+ datos.nombre +'</h5>'
        html += '        <div class="box bg-light-'+ adminClass +'">'+ datos.mensaje +'</div>'
        html += '    </div>'
        if (datos.nombre !== 'Administrador') {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>'
        }        
        html += '    <div class="chat-time">'+ hora +'</div>'
        html += '</li>';
    }
    divChatbox.append(html);
}


function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}
