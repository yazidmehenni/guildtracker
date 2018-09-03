const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(
  cors()
  //  {
  //   origin: function(origin, callback) {
  //     // allow requests with no origin
  //     // (like mobile apps or curl requests)
  //     if (!origin) return callback(null, true);
  //     if (allowedOrigins.indexOf(origin) === -1) {
  //       var msg =
  //         'The CORS policy for this site does not ' +
  //         'allow access from the specified Origin.';
  //       return callback(new Error(msg), false);
  //     }
  //     return callback(null, true);
  //   }
  // })
);
app.use(bodyParser.raw({ type: '*/*', limit: '20mb' }));
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
  const guild = req.query.guild;
  const realm = req.query.realm;
  const roster = await api.getRoster(guild, realm);
  res.send(JSON.stringify(roster));
});

app.listen(4000, () => console.log('Listening on port 4000!'));
