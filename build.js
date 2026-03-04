const fs = require('fs');
let html = fs.readFileSync('raw.html', 'utf8');

// Insert base href so all relative resources are fetched from rainymood.com
html = html.replace('<head>', '<head>\n<base href="https://rainymood.com/">');

// Replace the two occurrences of the "Also available on..." block.
const block1 = /<br \/><p>Also available on<br \/>[\s\S]*?<\/p>/g;
const block2 = /<p>Also available on<br \/>[\s\S]*?<\/p>/g;

html = html.replace(block1, '<br /><p>Created By<br>Ramishka Madhushan</p>');
html = html.replace(block2, '<br /><p>Created By<br>Ramishka Madhushan</p>');

// Write the modified HTML to index.html
fs.writeFileSync('index.html', html);
console.log('Successfully created index.html');
