const socketio = require('socket.io');

const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

let io;
const connections = [];

// adiciona ao servidor http que ele também o protocolo websocket
// a função setupWebsocket fará as primeiras configurações para o servidor aceitar as requisções no formato websocket
// ela recebe o servidor (server) como parâmetro
exports.setupWebsocket = (server) => {
    io = socketio(server);

    // ouvir evento de conexão
    // toda vez que o usuário se conectar na aplicação via protocolo websocket, receberá um objeto chamado socket
    io.on('connection', socket => {
        // console.log(socket.id);
        // console.log(socket.handshake.query);

        // setTimeout(() => {
        //     socket.emit('message', 'Hello Universe')
        // }, 3000);

        const { latitude, longitude, techs } = socket.handshake.query;

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            techs: parseStringAsArray(techs),
        });
    });
};

// Faz o filtro das conexões, recebendo as coordenadas do novo dev cadastradas e as tecnologias que ele trabalha
// Retorna todas as conexões que estão há 10km das coordenadas e que trabalham com as mesmas tecnologias
exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        // compara as coordenadas do novo dev cadastrado, com as coordenadas armazenadas em cada uma das conexões do websocket
        // e verifica se dentro das conexões do websocket, pelo menos uma das tecnologias está dentro das tecnologias do novo dev
        return calculateDistance(coordinates, connection.coordinates) < 10
          && connection.techs.some(item => techs.includes(item))
    })
}

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        // para quem vou enviar a mensagem
        io.to(connection.id).emit(message, data);
    })
}