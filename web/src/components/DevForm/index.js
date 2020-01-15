import React, { useState, useEffect } from 'react';

import './styles.css';

function DevForm({ onSubmit }) {
    const [github_username, setGithubUsername] = useState('');
    const [techs, setTechs] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    // navigator.geolocation.getCurrentPosition(): Permite obter a latitude e longitude do usuário

    // 1º parâmetro: Qual função ele precisa executar
    // 2º parâmetro: Quando essa função precisa ser executada - array vazio [] para executar apenas 1 vez
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log(position);
            const { latitude, longitude } = position.coords;

            setLatitude(latitude);
            setLongitude(longitude);
        },
        (err) => {
            console.log(err);
        },
        {
            timeout: 30000,
        }
        )
    }, []);

    async function handleSubmit(e) {
        e.preventDefault(); // evita de enviar o usuário para outra tela assim que submete o formulário       

        // visto que handleAddDev é assíncrona, espera-se ela finalizar (uso do await abaixo)
        // o data do handleAddDev() são as informações do onSubmit abiaxo
        await onSubmit({
            github_username,
            techs,
            latitude,
            longitude,
        });

        setGithubUsername('');
        setTechs('');
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="input-block">
                <label htmlFor="github_username">Usuário do Github</label>
                <input
                name="github_username"
                id="github_username"
                required
                value={github_username}
                onChange={e => setGithubUsername(e.target.value)}
                />
            </div>

            <div className="input-block">
                <label htmlFor="techs">Tecnologias</label>
                <input
                name="techs"
                id="techs"
                required
                value={techs}
                onChange={e => setTechs(e.target.value)}
                />
            </div>

            <div className="input-group">
                <div className="input-block">
                <label htmlFor="latitude">Latitude</label>
                <input
                    type="number"
                    name="latitude"
                    id="latitude"
                    required
                    value={latitude}
                    onChange={e => setLatitude(e.target.value)}
                />
                </div>

                <div className="input-block">
                <label htmlFor="longitude">Longitude</label>
                <input 
                    type="number"
                    name="longitude"
                    id="telongitudechs"
                    required
                    value={longitude}
                    onChange={e => setLongitude(e.target.value)}
                />
                </div>
            </div>

            <button type="submit">Salvar</button>    
        </form>
    );
}

export default DevForm;