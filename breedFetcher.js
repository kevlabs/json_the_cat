const request = require('request');

const fetchBreedDescription = function(breedName, callback) {
  if (typeof breedName !== 'string') {
    callback('input format is incorrect', null);
    return;
  }

  request(`https://api.thecatapi.com/v1/breeds/search?q=${encodeURIComponent(breedName)}`, (error, response, body) => {
    if (error || !response || response.statusCode !== 200) {
      callback('Cannot connect to API', null);
    } else {
      const cat = JSON.parse(body);
      if (!cat.length) {
        callback('Breed does not exist', null);
      } else {
        const [{description}] = cat;
        callback(null, description.trim());
      }
    }
  });
};

const printDesciption = function(error, description) {
  if (error) {
    console.error(error);
  } else {
    console.log(description);
  }
};

module.exports = {fetchBreedDescription};