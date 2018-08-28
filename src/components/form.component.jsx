import React, { Component } from 'react';
import qs from 'qs';
import { WOW_API, LOCALE, APIKEY } from './../env/env.js';

//props: [your,table,headers], [[your,row,data],[4,2,3],[2,3,1]...]

export default class Form extends Component {
  state = {
    guildName: '',
    realmName: '',
    formComplete: false,
    members: [],
    loading: false
  };

  handleInputChange = event => {
    const field = event.target.name;
    const inputValue = event.target.value;
    const state = { [field]: inputValue };
    this.setState(state);
  };

  handleSubmit = async () => {
    await this.getRoster();
    const state = {
      guildName: this.state.guildName,
      realmName: this.state.realmName,
      formComplete: this.state.formComplete,
      members: this.state.members
    };
    this.props.appCallBack(state);
  };

  getRoster = async () => {
    const params = qs.stringify({
      locale: LOCALE,
      apikey: APIKEY,
      fields: 'members'
    });
    const requestString = `${WOW_API}/guild/${this.state.realmName}/${
      this.state.guildName
    }?${params}`;
    const guildRoster = await (await fetch(requestString, {
      method: 'GET'
    })).json();
    let formComplete = true;
    let status = null;
    if (guildRoster.status === 'nok') {
      formComplete = false;
      status = 'Invalid Guild Name or Realm';
    }
    this.setState({
      status: status,
      formComplete: formComplete,
      members: guildRoster.members
    });
    return true;
  };

  render() {
    return (
      <main className="content">
        <section className="hero is-dark is-fullheight">
          <main className="hero-body">
            <div className="container">
              <h1 className="title"> Enter Guild Information</h1>
              <div className="field">
                <div className="control">
                  <h3 className="subtitle">Guild Name:</h3>
                  <input
                    name="guildName"
                    onChange={this.handleInputChange}
                    className="input is-light"
                    type="text"
                    placeholder="Primary input"
                  />
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <h3 className="subtitle">Realm:</h3>
                  <input
                    name="realmName"
                    onChange={this.handleInputChange}
                    className="input is-light"
                    type="text"
                    placeholder="Primary input"
                  />
                </div>
              </div>
              <div className="section">
                {this.state.status && (
                  <span className="tag is-danger is-large">
                    {this.state.status}
                  </span>
                )}
              </div>
              <button className="button is-light" onClick={this.handleSubmit}>
                Submit
              </button>
            </div>
          </main>
        </section>
      </main>
    );
  }
}
