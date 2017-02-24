'use strict';
var request = require('request');
var fs = require('fs');
var places = require('./places.json');

var f = fs.openSync('./coordinates.json', 'w');

var results = [];
var count = places.length;
places.map(place => {
  request('http://maps.google.com/maps/api/geocode/json?address=' + place.address.replace(/ /g, '+'), function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var response = JSON.parse(body);
        results.push(
            {
              name: place.name,
              address: place.address,
              location: response.results[0].geometry.location,
            }
        );
        count--;
        if (count === 0) {
          fs.write(f, JSON.stringify(results));
        }
        // fs.write(f, `<Feature coordinates={[${location.lng}, ${location.lat}]}/>`);
      }
  })
});

