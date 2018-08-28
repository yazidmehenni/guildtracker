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
    memberOrder: false,
    levelOrder: false
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

  sortListByLevel = () => {
    const orderBy = this.state.levelOrder ? 'desc' : 'asc';
    this.setState({
      members: _.orderBy(
        this.state.members,
        obj => obj.character.level,
        orderBy
      ),
      levelOrder: !this.state.levelOrder
    });
  };

  componentDidMount() {
    this.getRoster();
  }

  render() {
    return (
      <main className="content">
        <section className="hero is-info is-fullheight">
          <div className="hero-body">
            <div className="container">
              <h1 className="title is-3">{this.state.guild} Guild Stats</h1>
              <TableGenerator
                headers={[
                  <span className="thead">Portrait</span>,
                  <span className="thead" onClick={this.sortListByMember}>
                    {'Name '}
                    <i className="fas fa-sort" />
                  </span>,
                  <span className="thead" onClick={this.sortListByLevel}>
                    {'Level '}
                    <i className="fas fa-sort" />
                  </span>
                ]}
                rows={this.generateRows(this.state.members)}
              />
            </div>
          </div>
        </section>
      </main>
    );
  }
}
