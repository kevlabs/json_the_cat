const {fetchBreedDescription} = require('./breedFetcher');

fetchBreedDescription(process.argv.slice(2).join(' '), (error, description) => console.log(error ? error : description));