const https = require('https');
const fs = require('fs');
const path = require('path');

const bzDir = path.join(__dirname, 'i', 'bz');

// List of rainy mood known background variations
const backgrounds = [
    'https://rainymood.com/i/bz/10.jpg',
    'https://rainymood.com/i/bz/11.jpg',
    'https://rainymood.com/i/bz/12.jpg',
    'https://rainymood.com/i/bz/13.jpg',
    'https://rainymood.com/i/bz/14.jpg',
    'https://rainymood.com/i/bz/15.jpg',
    'https://rainymood.com/i/bz/01.jpg',
    'https://rainymood.com/i/bz/02.jpg',
    'https://rainymood.com/i/bz/03.jpg',
];

if (!fs.existsSync(bzDir)) {
    fs.mkdirSync(bzDir, { recursive: true });
}

async function downloadBackgrounds() {
    console.log('Fetching background variations...');
    for (const url of backgrounds) {
        const filename = path.basename(url);
        const dest = path.join(bzDir, filename);

        // Skip if already exists
        if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
            console.log(`Already have ${filename}`);
            continue;
        }

        try {
            await new Promise((resolve, reject) => {
                https.get(url, (res) => {
                    if (res.statusCode !== 200) {
                        reject(new Error(`Failed to fetch ${url} - Status ${res.statusCode}`));
                        res.resume();
                        return;
                    }
                    const writeStream = fs.createWriteStream(dest);
                    res.pipe(writeStream);
                    writeStream.on('finish', () => {
                        writeStream.close();
                        console.log(`Saved ${filename}`);
                        resolve();
                    });
                }).on('error', reject);
            });
        } catch (error) {
            console.error(error.message);
        }
    }
    console.log('Background downloads complete.');
}

downloadBackgrounds();
