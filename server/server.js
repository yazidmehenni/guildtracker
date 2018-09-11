const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
app.use(cors());
app.use(bodyParser.raw({ type: '*/*', limit: '20mb' }));
app.use(express.static(path.join(__dirname, '../build')));
const api = require('./api.js');

app.post('/character', async (req, res) => {
  const body = req.body.toString();
  const parsedBody = JSON.parse(body);
  const filteredMembers = parsedBody.filteredMembers;
  const realm = parsedBody.realm;
  const newMembers = await api.updateCharacterDetails(filteredMembers, realm);
  res.send(JSON.stringify(newMembers));
});

app.get('/guild', async (req, res) => {
  console.log('getting guild');
  const guild = req.query.guild;
  const realm = req.query.realm;
  const roster = await api.getRoster(guild, realm);
  res.send(JSON.stringify(roster));
});

app.get('/singleCharacter', async (req, res) => {
  const character = req.query.character;
  const realm = req.query.realm;
  const detailedCharacter = await api.getSingleCharacter(character, realm);
  res.send(JSON.stringify(detailedCharacter));
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(process.env.PORT || 4000, () =>
  console.log(`Listening on port ${process.env.PORT || 4000}`)
);
