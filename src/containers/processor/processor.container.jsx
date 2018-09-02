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
    itemLevelOrder: false,
    AzeriteLvlOrder: false,
    roleOrder: false
  };

  getCharacterDetails = async character => {
    // get character audit, items
    //set up query string
    try {
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
    } catch (err) {
      return character;
    }
  };

  updateCharacterDetails = async () => {
    const updatedMembers = _.map(this.state.filteredMembers, obj => {
      try {
        return this.getCharacterDetails(obj.character.name);
      } catch (err) {
        return obj;
      }
    });
    const filteredMembers = await Promise.all(updatedMembers);
    this.setState({ filteredMembers: filteredMembers });
  };

  generateRows = members => {
    const rows = members.map((member, i) => {
      if (!_.get(member, 'character.spec')) return;
      return [
        // NUMBER ROW
        i + 1,
        //PORTRAIT ROW
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
        //RANK ROW
        member.rank === 0 ? 'Guild Master' : 'Rank ' + member.rank,
        //NAME ROW
        <span>
          <a
            href={`https://worldofwarcraft.com/en-us/character/${this.state.realm.replace(
              /\W/g,
              ''
            )}/${member.character.name}`}
            target="_blank"
          >
            {member.character.name}
            &nbsp;
            <span className="icon has-text-info">
              <img className="image is-16x16" src="/wow.png" />
            </span>
          </a>
          <a
            href={`https://www.warcraftlogs.com/character/us/${this.state.realm.replace(
              /\W/g,
              ''
            )}/${member.character.name}`}
            target="_blank"
          >
            <span className="icon has-text-info">
              <img className="image is-16x16" src="/logs.png" />
            </span>
          </a>
          <a
            href={`https://raider.io/characters/us/${this.state.realm.replace(
              /\W/g,
              ''
            )}/${member.character.name}`}
            target="_blank"
          >
            <span className="icon has-text-info">
              <img className="image is-16x16" src="/raider.png" />
            </span>
          </a>
        </span>,
        //SPEC ROW
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
        //ROLE ROW
        member.character.spec.role,
        //ITEMLEVEL ROW
        member.character.items
          ? member.character.items.averageItemLevel +
            (' (' + member.character.items.averageItemLevelEquipped + ')')
          : '',
        //AZERITE LEVEL ROW
        member.character.items
          ? member.character.items.neck.azeriteItem.azeriteLevel
          : '',
        //GEM ROW
        member.character.audit ? (
          member.character.audit.emptySockets === 0 ? (
            <span className="icon has-text-success">
              <i className="fas fa-check-circle" />
            </span>
          ) : (
            <span className="icon has-text-danger">
              <i className="fas fa-times-circle" />
            </span>
          )
        ) : (
          ''
        ),
        //MH ROW
        member.character.items ? (
          member.character.items.mainHand.tooltipParams.enchant ? (
            <span className="icon has-text-success">
              <i className="fas fa-check-circle" />
            </span>
          ) : (
            <span className="icon has-text-danger">
              <i className="fas fa-times-circle" />
            </span>
          )
        ) : (
          ''
        ),
        //OH ROW
        member.character.items ? (
          member.character.items.offHand ? (
            member.character.items.offHand.tooltipParams.enchant ? (
              <span className="icon has-text-success">
                <i className="fas fa-check-circle" />
              </span>
            ) : member.character.audit.unenchantedItems['16'] &&
            member.character.class !== 2 ? (
              <span className="icon has-text-danger">
                <i className="fas fa-times-circle" />
              </span>
            ) : (
              ''
            )
          ) : (
            ''
          )
        ) : (
          ''
        ),
        //RING1 ROW
        member.character.items ? (
          member.character.items.finger1.tooltipParams.enchant ? (
            <span className="icon has-text-success">
              <i className="fas fa-check-circle" />
            </span>
          ) : (
            <span className="icon has-text-danger">
              <i className="fas fa-times-circle" />
            </span>
          )
        ) : (
          ''
        ),
        //RING2 ROW
        member.character.items ? (
          member.character.items.finger2.tooltipParams.enchant ? (
            <span className="icon has-text-success">
              <i className="fas fa-check-circle" />
            </span>
          ) : (
            <span className="icon has-text-danger">
              <i className="fas fa-times-circle" />
            </span>
          )
        ) : (
          ''
        )
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
      members: _.orderBy(
        this.state.filteredMembers,
        obj => obj.character.items.averageItemLevel,
        orderBy
      ),
      itemLevelOrder: !this.state.itemLevelOrder
    });
  };

  sortListByRole = () => {
    const orderBy = this.state.roleOrder ? 'desc' : 'asc';
    this.setState({
      filteredMembers: _.orderBy(
        this.state.filteredMembers,
        obj => _.get(obj, 'character.spec.role'),
        orderBy
      ),
      members: _.orderBy(
        this.state.filteredMembers,
        obj => _.get(obj, 'character.spec.role'),
        orderBy
      ),
      roleOrder: !this.state.roleOrder
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

  sortListByAzeriteLvl = () => {
    if (!this.state.filteredMembers[0]) return;
    if (!this.state.filteredMembers[0].character.items) return;
    const orderBy = this.state.azeriteLvlOrder ? 'desc' : 'asc';
    this.setState({
      filteredMembers: _.orderBy(
        this.state.filteredMembers,
        obj => obj.character.items.neck.azeriteItem.azeriteLevel,
        orderBy
      ),
      members: _.orderBy(
        this.state.members,
        obj => obj.character.items.neck.azeriteItem.azeriteLevel,
        orderBy
      ),
      azeriteLvlOrder: !this.state.azeriteLvlOrder
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
        {'iLevel(equipped)'}
        &nbsp;
        <i className="fas fa-sort" />
      </span>
    );
    const rankHeader = (
      <span className="thead" onClick={this.sortListByRank}>
        Rank&nbsp;
        <i className="fas fa-sort" />
      </span>
    );

    const AzeriteLvlHeader = (
      <span className="thead" onClick={this.sortListByAzeriteLvl}>
        AzeriteLvl&nbsp;
        <i className="fas fa-sort" />
      </span>
    );

    const roleHeader = (
      <span className="thead" onClick={this.sortListByRole}>
        Role&nbsp;
        <i className="fas fa-sort" />
      </span>
    );

    return (
      <Animate to={'0.99'} from={'0.01'} attributeName="opacity" duration={500}>
        <section className="hero is-info is-fullheight">
          <section className="hero-body">
            <div className="customContainer">
              <div className="level">
                <Link to={process.env.PUBLIC_URL + '/'}>
                  <button className="button is-link is-inverted is-outlined level-left">
                    <i className="fas fa-chevron-left" />
                    &nbsp;Back
                  </button>
                </Link>
                <div className="customLevel">
                  <button
                    onClick={this.updateCharacterDetails}
                    className="button is-info is-inverted is-outlined level-item"
                  >
                    <i className="fas fa-cloud-download-alt" />
                    &nbsp;Get Details
                  </button>
                </div>
              </div>
              <div className="section">
                {this.state.status && (
                  <span className="tag is-danger is-large">
                    {this.state.status}
                  </span>
                )}
              </div>
              <h1 className="title is-3 level-center">
                {`<${this.state.guild}> Guild Stats`}
              </h1>

              <div className="field">
                <input
                  onInput={this.handleSearchInput}
                  className="input is-info"
                  type="text"
                  placeholder="Search"
                />
              </div>

              <TableGenerator
                headers={[
                  '#',
                  '',
                  rankHeader,
                  nameHeader,
                  'Spec',
                  roleHeader,
                  itemLevelHeader,
                  AzeriteLvlHeader,
                  'Gems',
                  'MH',
                  'OH',
                  'Ring1',
                  'Ring2'
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
