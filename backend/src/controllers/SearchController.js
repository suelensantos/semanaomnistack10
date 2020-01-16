const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    // Buscar todos devs num raio de 10km
    // Filtrar por tecnologia
    async index(request, response) {
        // console.log(request.query);
        const { latitude, longitude, techs } = request.query;

        const techsArray = parseStringAsArray(techs);

        // $in - operador lógico dentro do MongoDB
        const devs = await Dev.find({
            techs: {
                $in: techsArray,
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000,
                },
            },
        });

        return response.json({ devs });
    }
};