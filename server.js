const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//Informando o conteudo do front
app.use(express.static(path.join(__dirname,'public')));
app.set('views',path.join(__dirname,'public'));
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');

app.use('/', (req,res) => {
    res.render('index.html');
});

let messages = [];

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
       messages.push(data);

        //Eventos do socket : 
        //EMIT - Enviar para o unico socket que fez a conexão
        //ON - Ouvir uma message
        //BROADCAST.EMIT - Enviar para todos os sockets conectatos
    
        socket.broadcast.emit('receiveMessage', data);

    });
});


server.listen(3000);