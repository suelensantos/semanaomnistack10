const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
;
const app = express();

mongoose.connect('mongodb+srv://omnistack10:omnistack10@cluster0-krgxg.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

// tornar esta API acessível ao React - extensão que evita o bloqueio: cors
// app.use(cors({ origin: 'http://localhost:3000' }));
app.use(cors()); // libera acesso externo pra todo tipo de aplicação
app.use(express.json()); // todas as rotas da aplicação passam a entender as requisições que têm o corpo e o formato json
app.use(routes);

// Métodos HTTP:
// - GET (buscar informação)
// - POST (criar informação)
// - PUT (editar informação)
// - DELETE (deletar informação)
// Utilizar aplicações como insomnia ou postman para visualizar rotas como POST e PUT, pois 
// no browser só se consegue visualizar GET

// Tipos de parâmetros no express:
// - Query Params: GET - request.query (Filtros, ordenação, paginação, ...). Exemplo: http://localhost:3333/users?search=Suelen
// - Route Params: PUT e DELETE - request.params (Identificar um recurso na alteração ou remoção). Exemplo: http://localhost:3333/users/1 - app.put('/users/:id',...)
// - Body: POST e PUT - request.body (Dados para criação ou alteração de um registro). Exemplo: { "name": "Suelen", "email": "suelen_cordeiro@hotmail.com" } no Body em Insomnia no formato json

// MongoDB (Não-relacional) - Pode ser utilizado na nuvem -> MongoDB Atlas
// mongoose - biblioteca que vai dar acesso do node.js dentro da base de dados do mongo
// MongoDB Compass Community- É uma aplicação cliente para acessar o MongoDB

app.listen(3333);
