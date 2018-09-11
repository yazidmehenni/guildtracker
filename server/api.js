const qs = require('qs');
const fetch = require('node-fetch');
const _ = require('lodash');
const { URL } = require('url');
const env = require('./env/env.js');

getRoster = async (guild, realm) => {
  //set up request string
  console.log('getting roster');
  const params = qs.stringify({
    locale: env.LOCALE,
    apikey: env.APIKEY,
    fields: 'members'
  });
  const requestString = `${env.WOW_API}/guild/${realm}/${guild}?${params}`;
  //get response
  const response = await fetch(requestString, {
    method: 'GET'
  });
  const guildRoster = await response.json();
  console.log('response:', guildRoster);
  //error handling
  let status = null;
  if (guildRoster.status === 'nok') {
    status = `Blizzard API: ${guildRoster.reason}`;
  }
  if (guildRoster.code) {
    status = `Blizzard API: ${guildRoster.type}`;
  }
  //filter response
  const filteredMembers = _.filter(
    guildRoster.members,
    obj => obj.character.level === 120
  );
  return { members: filteredMembers, status: status };
};

updateCharacterDetails = async (filteredMembers, realm) => {
  const updatedMembers = _.map(filteredMembers, obj => {
    try {
      return getCharacterDetails(obj.character.name, realm, filteredMembers);
    } catch (err) {
      console.log(err);
      return obj;
    }
  });
  const resolvedMembers = await Promise.all(updatedMembers);
  return resolvedMembers;
};

getCharacterDetails = async (character, realm, filteredMembers) => {
  // get character audit, items
  //set up query string
  try {
    const params = qs.stringify({
      locale: env.LOCALE,
      apikey: env.APIKEY,
      fields: 'items,audit'
    });
    const requestString = `${
      env.WOW_API
    }/character/${realm}/${character}?${params}`;
    //await fetch
    const response = await fetch(new URL(requestString), {
      method: 'GET'
    });
    const characterDetails = await response.json();
    //find correct old character object
    const oldCharacter = _.find(
      filteredMembers,
      obj => obj.character.name === character
    );
    //update the old object with new details
    oldCharacter.character.audit = characterDetails.audit;
    oldCharacter.character.items = characterDetails.items;
    return oldCharacter;
  } catch (err) {
    console.log(err);
    return oldCharacter;
  }
};

getSingleCharacter = async (character, realm) => {
  try {
    const params = qs.stringify({
      locale: env.LOCALE,
      apikey: env.APIKEY,
      fields: 'items,audit'
    });
    const requestString = `${
      env.WOW_API
    }/character/${realm}/${character}?${params}`;
    //await fetch
    const response = await fetch(new URL(requestString), {
      method: 'GET'
    });
    const characterDetails = await response.json();
    return characterDetails;
  } catch (err) {
    console.log(err);
    return {};
  }
};

module.exports = {
  getRoster,
  updateCharacterDetails,
  getSingleCharacter
};
