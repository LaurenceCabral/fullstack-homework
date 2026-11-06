const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

const getData = async function getData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Rick and Morty API request failed (HTTP ${response.status}).`);
  }
  return response.json();
};

const getRecords = async function getRecords(resource, limit) {
  const url = `https://rickandmortyapi.com/api/${resource}`;
  const data = await getData(url);
  if (!data.info || typeof data.info.count !== 'number' || !Array.isArray(data.results)) {
    throw new Error('The API returned an unexpected response.');
  }

  let { count } = data.info;
  if (limit && limit < count) {
    count = limit;
  }
  if (count <= data.results.length) {
    return data.results.slice(0, count);
  }

  // The API lets us request several IDs in one GET request.
  const ids = [];
  for (let id = 1; id <= count; id += 1) {
    ids.push(id);
  }
  const records = await getData(`${url}/${ids.join(',')}`);
  if (!Array.isArray(records)) {
    throw new Error('The API returned an unexpected response.');
  }
  return records;
};

const getCharacters = async function getCharacters(limit) {
  const records = await getRecords('character', limit);
  return records.map((record) => {
    const character = record || {};
    return {
      name: character.name || 'Name not available',
      image: character.image || '',
      species: character.species || 'Species not available',
      status: character.status || 'Status not available',
    };
  });
};

app.get('/home', (req, res) => {
  res.render('home', { title: 'Rick and Morty' });
});

app.get('/characters', async (req, res) => {
  const characters = await getCharacters(100);
  res.render('characters', { title: 'First 100 Characters', characters });
});

app.get('/species', async (req, res) => {
  const characters = await getCharacters();
  const species = [];
  characters.forEach((character) => {
    let group = species.find((item) => item.name === character.species);
    if (!group) {
      group = { name: character.species, characters: [] };
      species.push(group);
    }
    group.characters.push(character.name);
  });
  species.sort((first, second) => first.name.localeCompare(second.name));
  res.render('species', { title: 'Characters by Species', species });
});

app.get('/locations', async (req, res) => {
  const locations = await getRecords('location');
  const types = [];
  locations.forEach((record) => {
    const location = record || {};
    const name = location.type || 'Type not available';
    let group = types.find((item) => item.name === name);
    if (!group) {
      group = { name, count: 0 };
      types.push(group);
    }
    group.count += 1;
  });
  types.sort((first, second) => first.name.localeCompare(second.name));
  res.render('locations', { title: 'Locations by Type', types });
});

app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: 'This page does not exist.',
  });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }
  res.status(502).render('error', {
    title: 'Data Could Not Be Loaded',
    message: 'The Rick and Morty API is unavailable. Please try again.',
  });
});

if (require.main === module) {
  app.listen(port, () => {
    process.stdout.write(`Server running at http://localhost:${port}/home\n`);
  });
}

module.exports = app;
