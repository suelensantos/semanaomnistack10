import socketio from 'socket.io-client';

// autoConnect - não faz a conexão de forma automática
const socket = socketio('http://192.168.0.31:3333', {
    autoConnect: false,
});

// Ouve a mensagem do evento do socket (new-dev), e mostra o novo dev na tela do celular
function subscribeToNewDevs(subscribeFunction) {
    // ouve o evento, e dispara 
    socket.on('new-dev', subscribeFunction);
}

function connect(latitude, longitude, techs) {
    // envia esses parâmetros para o backend
    socket.io.opts.query = {
        latitude,
        longitude,
        techs,
    };

    socket.connect();

    // socket.on('message', text => {
    //     console.log(text);
    // })
}

function disconnect() {
    if(socket.connected) {
        socket.disconnect();
    }
}

export {
    connect,
    disconnect,
    subscribeToNewDevs,
};