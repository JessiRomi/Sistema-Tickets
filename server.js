const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

server.listen(8080, function() {
    console.log('Servidor corriendo en http://localhost:8080');
    })

// Es un array para almacenar los tickets y una variable para el número del próximo ticket
let tickets = [];
let nextTicketNumber = 1;

app.use(express.static('public'));

// Ruta para generar el siguiente ticket
app.get('/next', (req, res) => {
    const ticket = { number: nextTicketNumber++ };
    tickets.push(ticket); // Añade el ticket al array de tickets
    io.emit('newTicket', ticket);
    res.json(ticket);
});

 
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    
    // El evento es para cuando un cliente solicita el siguiente ticket
    socket.on('requestNextTicket', () => {
        if (tickets.length > 0) {
            const nextTicket = tickets.shift();
            io.emit('ticketServed', nextTicket);
        }
    });
});
