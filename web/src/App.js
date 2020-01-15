import React, { useState, useEffect } from 'react';
import api from './services/api';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

// Arquivo JSX = JS + HTML
// Componente: É uma função que retorna algum conteúdo HTML/CSS/JS. Colocar um componente por arquivo.
// Continuação - Bloco isolado de HTML, CSS e JS, o qual não interfere no restante da aplicação.

// Estado: Informação que o componente vai manipular. 
// useState - função do React para criar um estado. 
// const [counter, setCounter] = useState(0); onde counter é variável, setCounter é função para mudar o estado da 
// variável - exemplo: setCounter(counter + 1);, e o 0 representa o estado inicial de counter.
// Continuação: Informações mantidas pelo componente (Lembrar: imutabilidade) 

// Propriedade: Como se tivesse passando um atributo para um componente react. Ex.: <Header title="Dashboard" />
// Continuação - O parâmetro props em uma função representa todas as propriedades repassadas para determinado componente. 
// Ex.: function Header(props) { 
//         return <h1>{props.title}</h1>
//      }
// Continuação - Informações que um componente PAI passa para o componente FILHO

// navigator.geolocation.getCurrentPosition(): Permite obter a latitude e longitude do usuário

function App() {
  const [github_username, setGithubUsername] = useState('');
  const [techs, setTechs] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [devs, setDevs] = useState([]); // é preciso armazenar os devs (em loadDevs()) dentro de um estado

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

  // a busca dos Devs na API acontece apenas uma única vez dentro do ciclo de renderização do componente
  useEffect(() => {
    // chamada à API
    async function loadDevs() {
      const response = await api.get('/devs');

      setDevs(response.data); // pega tudo que vem da API
    }

    loadDevs(); // executa a função assim que useEffect for finalizado
  }, []);

  async function handleAddDev(e) {
    e.preventDefault(); // evita de enviar o usuário para outra tela assim que submete o formulário

    const response = await api.post('/devs', {
      github_username,
      techs,
      latitude,
      longitude,
    })

    setGithubUsername('');
    setTechs('');

    // vai simplesmente incluir um novo dev cadastrado no final do array de Devs, pois este não aparece automaticamente
    // na lista da tela, visto que a chamada da API para carregar a listagem de Devs só acontece uma única vez no começo do componente.
    // simplesmente cria um array do zero, copia todos os devs que já tem dentro do estado (...devs), e add o novo dev no final (response.data).
    setDevs([...devs, response.data]); 
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <form onSubmit={handleAddDev}>
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
      </aside>

      <main>
        <ul>
          {devs.map(dev => (
            <li key={dev._id} className="dev-item">
              <header>
                <img src={dev.avatar_url} alt={dev.name} />
                <div className="user-info">
                  <strong>{dev.name}</strong>
                  <span>{dev.techs.join(', ')}</span>
                </div>
              </header>
              <p>{dev.bio}</p>
              <a href={`https://github.com/${dev.github_username}`}>Acessar perfil no Github</a>
            </li>
          ))}
        </ul>
      </main>  
    </div>
  );
}

export default App;
