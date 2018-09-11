import React, { Component } from 'react';
import './App.css';
import './bulma.css';
import Processor from './containers/processor/processor.container.jsx';
import Form from './components/form.component.jsx';
import { Roster } from './containers/roster/roster.container.jsx';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

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
  renderProcessor = routerData => {
    return (
      <Processor
        guildName={routerData.match.params.guildName}
        realmName={routerData.match.params.realmName}
        members={this.state.members}
      />
    );
  };
  renderRoster = routerData => {
    return (
      <Roster
        guildName={routerData.match.params.guildName}
        realmName={routerData.match.params.realmName}
      />
    );
  };
  renderForm = () => {
    return <Form appCallBack={this.appCallBack} />;
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
        <BrowserRouter>
          <Switch>
            <Route
              exact={false}
              path={process.env.PUBLIC_URL + '*/results/:realmName/:guildName'}
              render={this.renderProcessor}
            />
            <Route
              exact={true}
              path={process.env.PUBLIC_URL + '*/roster/:realmName/:guildName'}
              render={this.renderRoster}
            />
            <Route
              exact={false}
              path={process.env.PUBLIC_URL + '*/'}
              render={this.renderForm}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
