import React, { Component } from 'react';
import qs from 'qs';
import { WOW_API, LOCALE, APIKEY } from '../../env/env.js';

export default class Processor extends Component {
  state = {
    guild: 'Baewatch',
    realm: "Mal'Ganis"
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
  };
  componentDidMount() {
    this.getRoster();
  }
  render() {
    return <div />;
  }
}
