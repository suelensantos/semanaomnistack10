import React, { useState, useEffect } from 'react';
import api from './services/api';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

import DevItem from './components/DevItem/index';
import DevForm from './components/DevForm/index';

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

function App() {

  const [devs, setDevs] = useState([]); // é preciso armazenar os devs (em loadDevs()) dentro de um estado

  // a busca dos Devs na API acontece apenas uma única vez dentro do ciclo de renderização do componente
  useEffect(() => {
    // chamada à API
    async function loadDevs() {
      const response = await api.get('/devs');

      setDevs(response.data); // pega tudo que vem da API
    }

    loadDevs(); // executa a função assim que useEffect for finalizado
  }, []);

  async function handleAddDev(data) {
    const response = await api.post('/devs', data)

    // vai simplesmente incluir um novo dev cadastrado no final do array de Devs, pois este não aparece automaticamente
    // na lista da tela, visto que a chamada da API para carregar a listagem de Devs só acontece uma única vez no começo do componente.
    // simplesmente cria um array do zero, copia todos os devs que já tem dentro do estado (...devs), e add o novo dev no final (response.data).
    setDevs([...devs, response.data]); 
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddDev} />
      </aside>

      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev._id} dev={dev} />
          ))}
        </ul>
      </main>  
    </div>
  );
}

// TO DO:
// - Colocar um botão em cada dev da listagem para que o usuário possa excluir um dev e, consequentemente, removê-lo do banco de dados
// - Colocar um botão de editar informação de um dev da listagem (talvez ir pra outra rota com a tela de cadastro para editar)

export default App;
