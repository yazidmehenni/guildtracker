import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Animate from 'react-smooth';
export default class Form extends Component {
  state = {
    guildName: 'Baewatch',
    realmName: "mal'ganis"
  };

  handleInputChange = event => {
    const field = event.target.name;
    const inputValue = event.target.value;
    const state = { [field]: inputValue };
    this.setState(state);
  };

  render() {
    return (
      <Animate to={'0.99'} from={'0.01'} attributeName="opacity" duration={500}>
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
                      defaultValue="Baewatch"
                      onChange={this.handleInputChange}
                      className="input is-light"
                      type="text"
                      placeholder="Guild Name"
                    />
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <h3 className="subtitle">Realm:</h3>
                    <input
                      name="realmName"
                      defaultValue="mal'ganis"
                      onChange={this.handleInputChange}
                      className="input is-light"
                      type="text"
                      placeholder="Realm Name"
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
                <Link
                  to={`/results/${this.state.realmName}/${
                    this.state.guildName
                  }/`}
                >
                  <button className="button is-light">Submit</button>
                </Link>
              </div>
            </main>
          </section>
        </main>
      </Animate>
    );
  }
}
