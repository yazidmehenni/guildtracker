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
    filteredMembers: [],
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
    this.setState({
      members: guildRoster.members,
      filteredMembers: guildRoster.members
    });
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
      filteredMembers: _.orderBy(
        this.state.filteredMembers,
        obj => obj.character.name,
        orderBy
      ),
      members: _.orderBy(
        this.state.members,
        obj => obj.character.level,
        orderBy
      ),
      memberOrder: !this.state.memberOrder
    });
  };

  sortListByLevel = () => {
    const orderBy = this.state.levelOrder ? 'desc' : 'asc';
    this.setState({
      filteredMembers: _.orderBy(
        this.state.filteredMembers,
        obj => obj.character.level,
        orderBy
      ),
      members: _.orderBy(
        this.state.members,
        obj => obj.character.level,
        orderBy
      ),
      levelOrder: !this.state.levelOrder
    });
  };

  handleSearchInput = event => {
    const searchValue = event.target.value.toLowerCase();
    console.log(searchValue);
    this.setState({
      filteredMembers: _.filter(this.state.members, obj => {
        //put all search conditions here and return true if any match
        const isName =
          obj.character.name.toLowerCase().indexOf(searchValue) !== -1;
        return isName;
      })
    });
  };

  componentDidMount() {
    this.getRoster();
  }

  render() {
    const portraitHeader = <span className="thead">Portrait</span>;
    const nameHeader = (
      <span className="thead" onClick={this.sortListByMember}>
        Name&nbsp;
        <i className="fas fa-sort" />
      </span>
    );
    const levelHeader = (
      <span className="thead" onClick={this.sortListByLevel}>
        Level&nbsp;
        <i className="fas fa-sort" />
      </span>
    );
    return (
      <main className="content">
        <section className="hero is-info is-fullheight">
          <main className="hero-body">
            <div className="container">
              <h1 className="title is-3">{this.state.guild} Guild Stats</h1>
              <div className="field">
                <div className="control">
                  <input
                    onInput={this.handleSearchInput}
                    className="input is-primary"
                    type="text"
                    placeholder="Search"
                  />
                </div>
              </div>
              <TableGenerator
                headers={[portraitHeader, nameHeader, levelHeader]}
                rows={this.generateRows(this.state.filteredMembers)}
              />
            </div>
          </main>
        </section>
      </main>
    );
  }
}
