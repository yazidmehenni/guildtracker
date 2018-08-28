import React, { Component } from 'react';
import qs from 'qs';
import { WOW_API, LOCALE, APIKEY } from '../../env/env.js';

export default class Processor extends Component {
  state = {
    guild: 'Baewatch',
    realm: "Mal'Ganis",
    members: []
  };

  getRoster = async () => {
    const params = qs.stringify({
      locale: LOCALE,
      apikey: APIKEY,
      fields: 'members'
    });
    const requestString = `${WOW_API}/guild/${this.state.realm}/${
      this.state.guild
    }?${params}`;
    const guildRoster = await (await fetch(requestString, {
      method: 'GET'
    })).json();
    this.setState({ members: guildRoster.members });
  };

  generateTable = () => {
    return this.state.members.map(member => {
      return (
        <tr>
          <td key={member.character.name}>
            {member.character.name}
            {console.log(member.character.name)}
          </td>
        </tr>
      );
    });
  };

  componentDidMount() {
    this.getRoster();
  }

  render() {
    return (
      <main>
        <h1> {this.state.guild} Member Info</h1>
        <table>
          <tbody>
            <tr>
              <th>Character</th>
              <th>Rank</th>
              <th>iLevel</th>
            </tr>
            {this.generateTable()}
          </tbody>
        </table>
      </main>
    );
  }
}
