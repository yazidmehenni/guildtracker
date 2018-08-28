import React, { Component } from 'react';
import qs from 'qs';
import { WOW_API, LOCALE, APIKEY } from '../../env/env.js';
import TableGenerator from '../../components/tablegenerator.component.jsx';
import _ from 'lodash';
export default class Processor extends Component {
  state = {
    guild: this.props.guildName,
    realm: this.props.realmName,
    members: this.props.members,
    filteredMembers: this.props.members,
    memberOrder: false,
    levelOrder: false,
    itemLevelOrder: false
  };

  getCharacterDetails = async character => {
    // get character audit, items
    const params = qs.stringify({
      locale: LOCALE,
      apikey: APIKEY,
      fields: 'items,audit'
    });
    const requestString = `${WOW_API}/character/${
      this.state.realm
    }/${character}?${params}`;
    const characterDetails = await (await fetch(requestString, {
      method: 'GET'
    })).json();
    const nestedCharacter = { character: characterDetails };
    return nestedCharacter;
  };

  updateCharacterDetails = async () => {
    const updatedMembers = _.map(this.state.filteredMembers, obj => {
      return this.getCharacterDetails(obj.character.name);
      // console.log({ details });
      // obj.character.audit = details.audit;
      // obj.character.items = details.items;
    });
    const filteredMembers = await Promise.all(updatedMembers);
    this.setState({ filteredMembers: filteredMembers });
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
        <figure className="image is-64x64">
          <img
            className="is-rounded"
            alt={'character portrait for ' + member.character.name}
            src={
              'https://render-us.worldofwarcraft.com/character/' +
              member.character.thumbnail
            }
          />
        </figure>,
        member.character.name,
        member.character.level,
        member.character.items ? member.character.items.averageItemLevel : ''
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

  sortListByItemLevel = () => {
    if (!this.state.filteredMembers[0].character.items) return;
    const orderBy = this.state.itemLevelOrder ? 'desc' : 'asc';
    this.setState({
      filteredMembers: _.orderBy(
        this.state.filteredMembers,
        obj => obj.character.items.averageItemLevel,
        orderBy
      ),
      itemLevelOrder: !this.state.itemLevelOrder
    });
  };

  handleSearchInput = event => {
    const searchValue = event.target.value.toLowerCase();
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
    //this.getRoster();
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
    const itemLevelHeader = (
      <span className="thead" onClick={this.sortListByItemLevel}>
        iLevel&nbsp;
        <i className="fas fa-sort" />
      </span>
    );
    return (
      <main className="content">
        <section className="hero is-info is-fullheight">
          <main className="hero-body">
            <div className="container">
              <h1 className="title is-3">{this.state.guild} Guild Stats</h1>
              <button onClick={this.updateCharacterDetails} className="button">
                Get Character Details
              </button>
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
                headers={[
                  portraitHeader,
                  nameHeader,
                  levelHeader,
                  itemLevelHeader
                ]}
                rows={this.generateRows(this.state.filteredMembers)}
              />
            </div>
          </main>
        </section>
      </main>
    );
  }
}
