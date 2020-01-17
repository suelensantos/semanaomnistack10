import React from 'react';
import { StatusBar, YellowBox } from 'react-native';

import Routes from './src/routes';

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket'
]);

// No React Native não se utiliza as tags HTML,assim como propriedades classes e ids, apenas no React. 
// Exemplo: <div></div>; className=""; id="".
// O arquivo princiapl é o App.js
// React Native não tem tags semânticos e estilização própria
// O css (estilização) é feito a partir da propriedade style={variável contento a estilização do elemento específico} dentro do componente.

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7D40E7" />
      <Routes />
    </>
  );
}
