const request = require('request');


//ask for breed
const userInput = new Promise((resolve, reject) => {
  console.log('Enter breed info');
  process.stdin.once('data', breed => {
    breed = breed.toString().trim();
    if (typeof breed === 'string' && breed.length === 3) {
      resolve(breed);
    } else {
      reject('Incorrect breed syntax');
    }
  });
})

//fetch breed info
  .then(breed => {

    //setup return promise and ways to resolve it from the outer scope
    //we will resolve the promise from within request
    //this will allow for chaining of then's instead of console logging the cat description from within this callback

    let resolvePromise, rejectPromise;
    const resultPromise = new Promise((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    });

    request(`https://api.thecatapi.com/v1/breeds/search?q=${breed}`, (error, response, body) => {

      const settlePromise = (resolve, reject) => {
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
      };

      //make sure that outer scope resolve and reject have been set before settling promise
      const timer = setInterval(() => {
        if (resolvePromise && rejectPromise) {
          settlePromise(resolvePromise, rejectPromise);
          clearInterval(timer);
        }
      }, 100);

    });
    return resultPromise;
  })

//print description
  .then(([{description}]) => console.log(description))
  .catch(e => console.error('Error', e))
  .finally(() => process.exit());