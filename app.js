const PORT = process.env.PORT || 8080
var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    fs = require('fs');
    

    // Chargement de la page index.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

    console.log(`Listening on ${ PORT }`);
    server.listen(PORT);


io.on('connection', function (socket, pseudo) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function(pseudo) {
        console.log('nouveau client')
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        console.log("message: " + message );
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    }); 

    // Dès que l'utilisateur se déconnecte, on prévient les autres utilisateurs
    socket.on('disconnect', function(){

        console.log(socket.pseudo + ' disconnected');
        socket.broadcast.emit('deconnexion_client', socket.pseudo);
      });
});



