import React, { Component } from 'react';
import './App.css';
import Processor from './containers/processor/processor.container.jsx';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Processor />
      </div>
    );
  }
}

export default App;
