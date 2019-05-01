'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/hello', (request, response) => {
  response.status(200).send('Hello');
});

app.get('/location', (request, response) => {
  try {
    const locationData = require('./data/geo.json');
    const locationObj = new Location(request.query.data, locationData);

    response.status(200).send(locationObj);
  } catch (error) {
    const errorResponse500 = {'status': 500, 'responseText': 'Sorry, something went wrong' };

    response.status(500).send(errorResponse500);
  }
});

app.get('/weather', (request, response) => {
  try {
    const weatherData = require('./data/darksky.json');
    const weatherObj = new Weather(weatherData);

    response.status(200).send(weatherObj.dailyForecast);
  } catch (error) {
    const errorResponse500 = {'status': 500, 'responseText': 'Sorry, something went wrong' };

    response.status(500).send(errorResponse500);
  }
});


app.use('*', (request, response) => response.send('Sorry, that route does not exist.'));

app.listen(PORT,() => console.log(`Listening on port ${PORT}`));

const Location = function(searchQuery, jsonData) {
  const formattedQuery = jsonData['results'][0]['formatted_address'];
  const latitude = jsonData['results'][0]['geometry']['location']['lat'];
  const longitude = jsonData['results'][0]['geometry']['location']['lng'];

  this.search_query = searchQuery;
  this.formatted_query = formattedQuery;
  this.latitude = latitude;
  this.longitude = longitude;
};

const Weather = function(jsonData) {
  this.dailyForecast = [...jsonData['daily']['data']].map(forecast => {
    const summary = forecast['summary'];
    const time = (new Date(forecast['time'] * 1000)).toDateString();
    return {
      'forecast': summary,
      'time': time
    };
  });
};
