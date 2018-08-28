import React, { Component } from 'react';
import './App.css';
import './bulma.css';
import Processor from './containers/processor/processor.container.jsx';

class App extends Component {
  render() {
    return (
      <div className="App">
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
          integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
          crossOrigin="anonymous"
        />
        <Processor />
      </div>
    );
  }
}

export default App;
