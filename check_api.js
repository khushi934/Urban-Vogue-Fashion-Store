const fs = require('fs');
const appJs = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
console.log('app.js API calls:');
const apiMatches = appJs.match(/fetch\(['"`].*?['"`]/g);
console.log(apiMatches ? apiMatches : 'none');
console.log('HTML forms:');
const formMatches = html.match(/<form.*?<\/form>/gs);
if (formMatches) {
    formMatches.forEach((f, i) => {
        console.log(`Form ${i}:`);
        console.log(f.substring(0, 150) + '...');
    });
} else {
    console.log('none');
}
