const request = require('request');

//ask for breed
const userInput = new Promise((resolve, reject) => {
  console.log('Enter breed name');
  process.stdin.once('data', breed => {
    breed = breed.toString().trim();
    if (breed) {
      resolve(breed);
    } else {
      reject('Incorrect breed syntax');
    }
  });
})

//fetch breed info
  .then(breed => {
    const resultPromise = new Promise((resolve, reject) =>
      request(`https://api.thecatapi.com/v1/breeds/search?q=${encodeURIComponent(breed)}`, (error, response, body) => {
        if (error || !response || response.statusCode !== 200) {
          reject('Cannot connect to API');
        } else {
          const cat = JSON.parse(body);
          if (!cat.length) {
            reject('Breed does not exist');
          } else {
            resolve(cat);
          }
        }
      })
    );

    return resultPromise;
  })

//print description
  .then(([{description}]) => console.log(description))
  .catch(e => console.error('Error', e))
  .finally(() => process.exit());