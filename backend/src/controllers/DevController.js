const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');


// responsável por receber a requisição e devolver uma resposta
// gravando a informação no banco de dados

// o controller tem geralmente cinco funções (utilizando o exemplo de dev como base): 
// - index: mostrar uma lista de devs
// - show: mostrar um único dev
// - store: criar um dev
// - update: atualizar um dev
// - destroy: deletar um dev

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    // async - representa que a função pode demorar pra responder (chamada a API do git)
    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        // let permite sobrepor variável, como exemplo o dev dentro do if
        let dev = await Dev.findOne({ github_username });

        if(!dev) {
            // para consumir a API do Gihub (faz chamadas para outras APIs disponíveis também) - biblioteca axios
            // await - aguarda a chamada ser finalizada pra devolver uma resposta e, em seguida, continuar com o restante do código
            // o retorno será uma resposta a ser obtida através da chamada a API
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
        
            // console.log(apiResponse.data);
            const { name = login, avatar_url, bio } = apiResponse.data;
        
            // console.log(name, avatar_url, bio, github_username);
        
            const techArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        
            // retorno do banco de dados
            // o dev já foi declarado acima
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techArray,
                location,
            });

            // Filtrar conexões que estão no máximo 10km de distância
            // e que o novo dev tenha pelo menos uma das tecnologias filtradas
            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techArray,
            )

            // console.log(sendSocketMessageTo);
            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }
    
        // return response.json({ message: 'Hello World!'});
        return response.json(dev);
    },

    // async update() { TO DO },

    // async destroy() { TO DO },
};