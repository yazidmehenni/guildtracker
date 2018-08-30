import React, { Component } from 'react';
import qs from 'qs';
import { WOW_API, LOCALE, APIKEY } from '../../env/env.js';
import TableGenerator from '../../components/tablegenerator.component.jsx';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Animate from 'react-smooth';

export default class Processor extends Component {
  state = {
    guild: this.props.guildName,
    realm: this.props.realmName,
    members: [],
    filteredMembers: [],
    memberOrder: false,
    levelOrder: false,
    rankOrder: false,
    itemLevelOrder: false
  };

  getCharacterDetails = async character => {
    // get character audit, items
    //set up query string
    const params = qs.stringify({
      locale: LOCALE,
      apikey: APIKEY,
      fields: 'items,audit'
    });
    const requestString = `${WOW_API}/character/${
      this.state.realm
    }/${character}?${params}`;
    //await fetch
    const response = await fetch(requestString, {
      method: 'GET'
    });
    const characterDetails = await response.json();
    //find correct old character object
    const oldCharacter = _.find(
      this.state.filteredMembers,
      obj => obj.character.name === character
    );
    //update the old object with new details
    oldCharacter.character.audit = characterDetails.audit;
    oldCharacter.character.items = characterDetails.items;
    return oldCharacter;
  };

  updateCharacterDetails = async () => {
    const updatedMembers = _.map(this.state.filteredMembers, obj => {
      return this.getCharacterDetails(obj.character.name);
    });
    const filteredMembers = await Promise.all(updatedMembers);
    this.setState({ filteredMembers: filteredMembers });
  };

  generateRows = members => {
    const rows = members.map((member, i) => {
      if (!member.character.spec) return;
      return [
        i + 1,
        <figure className="image is-32x32">
          <img
            className="is-rounded"
            alt={'character portrait for ' + member.character.name}
            src={
              'https://render-us.worldofwarcraft.com/character/' +
              member.character.thumbnail
            }
          />
        </figure>,
        member.rank === 0 ? 'Guild Master' : 'Rank ' + member.rank,
        member.character.name,
        <figure className="image is-32x32">
          <img
            className="is-rounded"
            alt={'character portrait for ' + member.character.name}
            src={
              'https://render-us.worldofwarcraft.com/icons/56/' +
              _.get(member, 'character.spec.icon') +
              '.jpg'
            }
          />
        </figure>,
        member.character.spec.role,
        member.character.items
          ? member.character.items.averageItemLevel +
            (' (' + member.character.items.averageItemLevelEquipped + ')')
          : ''
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

  sortListByItemLevel = () => {
    if (!this.state.filteredMembers[0]) return;
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

  sortListByRank = () => {
    const orderBy = this.state.rankOrder ? 'desc' : 'asc';
    this.setState({
      filteredMembers: _.orderBy(
        this.state.filteredMembers,
        obj => obj.rank,
        orderBy
      ),
      members: _.orderBy(this.state.members, obj => obj.rank, orderBy),
      rankOrder: !this.state.rankOrder
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

  getRoster = async () => {
    //set up request string
    const params = qs.stringify({
      locale: LOCALE,
      apikey: APIKEY,
      fields: 'members'
    });
    const requestString = `${WOW_API}/guild/${this.props.realmName}/${
      this.props.guildName
    }?${params}`;
    //get response
    const response = await fetch(requestString, {
      method: 'GET'
    });
    const guildRoster = await response.json();
    //error handling
    let formComplete = true;
    let status = null;
    if (guildRoster.status === 'nok') {
      formComplete = false;
      status = 'Invalid Guild Name or Realm';
    }
    //filter response
    const filteredMembers = _.filter(
      guildRoster.members,
      obj => obj.character.level === 120
    );
    //update state
    this.setState({
      status: status,
      formComplete: formComplete,
      members: filteredMembers,
      filteredMembers: filteredMembers
    });
    return guildRoster.members;
  };

  async componentDidMount() {
    await this.getRoster();
  }

  render() {
    const nameHeader = (
      <span className="thead" onClick={this.sortListByMember}>
        Name&nbsp;
        <i className="fas fa-sort" />
      </span>
    );
    const itemLevelHeader = (
      <span className="thead" onClick={this.sortListByItemLevel}>
        iLevel&nbsp;
        {'(equipped)'}
        <i className="fas fa-sort" />
      </span>
    );
    const rankHeader = (
      <span className="thead" onClick={this.sortListByRank}>
        Rank
        <i className="fas fa-sort" />
      </span>
    );

    return (
      <Animate to={'0.99'} from={'0.01'} attributeName="opacity" duration={500}>
        <section className="hero is-info is-fullheight">
          <section className="hero-body">
            <div className="container">
              <div className="level">
                <Link to={process.env.PUBLIC_URL + '/'}>
                  <button className="button is-link is-inverted is-outlined level-left">
                    <i className="fas fa-chevron-left" />
                    &nbsp;Back
                  </button>
                </Link>
              </div>
              <div className="section">
                {this.state.status && (
                  <span className="tag is-danger is-large">
                    {this.state.status}
                  </span>
                )}
              </div>
              <h1 className="title is-3">
                {'<'}
                {this.state.guild}
                {'>'} Guild Stats
              </h1>
              <div className="field">
                <div className="level">
                  <input
                    onInput={this.handleSearchInput}
                    className="input is-info"
                    type="text"
                    placeholder="Search"
                  />
                  <div className="level-right">
                    <button
                      onClick={this.updateCharacterDetails}
                      className="button is-info is-inverted"
                    >
                      <i className="fas fa-cloud-download-alt" />
                      &nbsp;Get Details
                    </button>
                  </div>
                </div>
              </div>
              <TableGenerator
                headers={[
                  '#',
                  '',
                  rankHeader,
                  nameHeader,
                  'Spec',
                  'Role',
                  itemLevelHeader
                ]}
                rows={this.generateRows(this.state.filteredMembers)}
              />
            </div>
          </section>
        </section>
      </Animate>
    );
  }
}
