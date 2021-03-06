import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Animate from 'react-smooth';
export default class Form extends Component {
  state = {
    guildName: 'Baewatch',
    realmName: 'malganis'
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
                <h1 className="logo title is-1">
                  <span className="threed">traqq.me</span>
                </h1>
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
                <Link
                  to={`results/${this.state.realmName}/${
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
