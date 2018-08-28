import React, { Component } from 'react';
import qs from 'qs';
import { WOW_API, LOCALE, APIKEY } from '../../env/env.js';
import TableGenerator from '../../components/tablegenerator.component.jsx';
import _ from 'lodash';
export default class Processor extends Component {
  state = {
    guild: 'Baewatch',
    realm: "Mal'Ganis",
    members: [],
    memberOrder: false
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
    console.log(guildRoster);
    this.setState({ members: guildRoster.members });
  };

  generateRows = members => {
    const rows = members.map(member => {
      return [
        <img
          alt={'character portrait for ' + member.character.name}
          src={
            'https://render-us.worldofwarcraft.com/character/' +
            member.character.thumbnail
          }
        />,
        member.character.name,
        member.character.level
      ];
    });
    return rows;
  };

  sortListByMember = () => {
    const orderBy = this.state.memberOrder ? 'desc' : 'asc';
    this.setState({
      members: _.orderBy(
        this.state.members,
        obj => obj.character.name,
        orderBy
      ),
      memberOrder: !this.state.memberOrder
    });
  };

  componentDidMount() {
    this.getRoster();
  }

  render() {
    return (
      <main>
        <button onClick={this.sortListByMember}>
          {this.state.memberOrder ? '<' : '>'}
        </button>
        <h1>{this.state.guild} Guild Stats</h1>
        <TableGenerator
          headers={['Portrait', 'Name', 'Level']}
          rows={this.generateRows(this.state.members)}
        />
      </main>
    );
  }
}
