import React, { Component } from 'react';
import './App.css';
import './bulma.css';
import Processor from './containers/processor/processor.container.jsx';
import Form from './components/form.component.jsx';

class App extends Component {
  state = {
    guildName: '',
    realmName: '',
    formComplete: false,
    status: '',
    members: []
  };
  appCallBack = state => {
    this.setState(state);
  };
  render() {
    return (
      <div className="App">
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
          integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
          crossOrigin="anonymous"
        />
        {!this.state.formComplete && <Form appCallBack={this.appCallBack} />}
        {this.state.formComplete && (
          <Processor
            guildName={this.state.guildName}
            realmName={this.state.realmName}
            members={this.state.members}
          />
        )}
      </div>
    );
  }
}

export default App;
