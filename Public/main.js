const socket = io(); // Conexión al servidor de Socket.io


// Se hace una función para cambiar entre pestañas
function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'block';
}


openTab('mainTab');// Muestra la pestaña principal por defecto

const ticketSound = document.getElementById('ticketSonido'); 

if (document.getElementById('solicitarButton')) {
    document.getElementById('solicitarButton').addEventListener('click', async () => {

    // Acá realiza una solicitud al servidor para obtener un nuevo ticket
        const response = await fetch('/next'); 
        const ticket = await response.json();
        document.getElementById('Numero-ticket').innerText = `Ticket: ${ticket.number}`;
    });

    socket.on('newTicket', (ticket) => {
        console.log('Nuevo ticket:', ticket.number);
    });
}

if (document.getElementById('Ticket-Siguiente')) {
    document.getElementById('Ticket-Siguiente').addEventListener('click', () => {
        socket.emit('requestNextTicket');
    });

    socket.on('ticketServed', (ticket) => {
        document.getElementById('Ticketactual').innerText = `Atendiendo Ticket: ${ticket.number}`;
        ticketSound.play(); // Reproduce el sonido cuando se atiende un ticket
    });
}

if (document.getElementById('ticket1')) {
    const ticketQueue = document.getElementById('ticket1');

    socket.on('newTicket', (ticket) => {
        const listItem = document.createElement('li');
        listItem.innerText = `Ticket: ${ticket.number}`;
        ticketQueue.appendChild(listItem);
    });

    socket.on('ticketServed', (ticket) => {
        const items = ticketQueue.getElementsByTagName('li');
        for (let i = 0; i < items.length; i++) {
            if (items[i].innerText === `Ticket: ${ticket.number}`) {
                ticketQueue.removeChild(items[i]);
                break;
            }
        }
    });
}
