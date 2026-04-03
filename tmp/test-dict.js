import fs from 'fs';
const WEBSTERS_URL = 'https://raw.githubusercontent.com/matthewreagan/WebstersEnglishDictionary/master/dictionary_alpha_arrays.json';
async function test() {
  const response = await fetch(WEBSTERS_URL);
  const websters = await response.json();
  console.log('Is Array?', Array.isArray(websters));
  if (Array.isArray(websters)) {
    console.log('Length:', websters.length);
    console.log('Keys in [0]:', Object.keys(websters[0]).length);
    console.log('Keys in [1]:', Object.keys(websters[1]).length);
  }
}
test();
