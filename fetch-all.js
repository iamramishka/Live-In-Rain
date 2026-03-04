const fs = require('fs');
const https = require('https');
const path = require('path');

const assets = [
    'https://rainymood.com/raindrop-fx-master/assets/css/style.css',
    'https://rainymood.com/raindrop-fx-master/bundle/index.js',
    'https://rainymood.com/css/marcellussc-regular-webfont.eot',
    'https://rainymood.com/css/marcellussc-regular-webfont.woff2',
    'https://rainymood.com/css/marcellussc-regular-webfont.woff',
    'https://rainymood.com/css/marcellussc-regular-webfont.ttf',
    'https://rainymood.com/css/marcellussc-regular-webfont.svg',
    'https://rainymood.com/i/bz/10.jpg',
    'https://rainymood.com/i/play4.png',
    'https://rainymood.com/i/pause4.png',
    'https://rainymood.com/i/spotify48.png',
    'https://rainymood.com/i/applemusic48.png',
    'https://rainymood.com/appad/appad-poster4.jpg',
    'https://rainymood.com/appad/appad.mp4',
    'https://rainymood.com/appad/appad.ogv',
    'https://rainymood.com/i/badgeApple1.png',
    'https://rainymood.com/i/icons/instagram/instagram-48a.png',
    'https://rainymood.com/i/icons/x/x-48.png',
    'https://rainymood.com/i/icons/facebook/facebook-48a.png',
    'https://rainymood.com/apple-touch-icon.png',
    'https://rainymood.com/favicon-32x32.png',
    'https://rainymood.com/favicon-16x16.png',
    'https://rainymood.com/safari-pinned-tab.svg',
    'https://rainymood.com/favicon.ico',
    'https://rainymood.com/site.webmanifest',
    'https://media.rainymood.com/0.m4a',
    'https://media.rainymood.com/0.ogg',
    'https://media.rainymood.com/0.mp3'
];

async function download(url, dest) {
    return new Promise((resolve, reject) => {
        const dir = path.dirname(dest);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const file = fs.createWriteStream(dest);
        https.get(url, function (response) {
            if (response.statusCode === 301 || response.statusCode === 302) {
                download(response.headers.location, dest).then(resolve).catch(reject);
                return;
            }
            response.pipe(file);
            file.on('finish', function () {
                file.close(resolve);
            });
        }).on('error', function (err) {
            fs.unlinkSync(dest);
            reject(err);
        });
    });
}

async function run() {
    console.log("Downloading files...");
    for (let url of assets) {
        let urlObj = new URL(url);
        let dest = '.' + urlObj.pathname;
        if (url.includes('media.rainymood.com')) {
            dest = './media' + urlObj.pathname;
        }
        console.log("Fetching", url, "to", dest);
        try {
            await download(url, dest);
        } catch (e) {
            console.error("Failed to fetch", url);
        }
    }

    // Now rewrite raw.html
    let html = fs.readFileSync('raw.html', 'utf8');

    // Replace media.rainymood.com -> ./media
    html = html.replace(/https:\/\/media\.rainymood\.com/g, './media');

    // Replace absolute assets -> relative
    html = html.replace(/https:\/\/rainymood\.com\//g, './');
    html = html.replace(/="\//g, '="./');
    html = html.replace(/url\('\//g, "url('./");
    html = html.replace(/url\(\//g, "url(./");
    html = html.replace(/background: "\//g, 'background: "./');

    // Replace references inside inline scripts
    html = html.replace(/background: "\/i\/bz\/10\.jpg"/g, 'background: "./i/bz/10.jpg"');

    // Replacements for requirements
    const block1 = /<br \/><p>Also available on<br \/>[\s\S]*?<\/p>/g;
    const block2 = /<p>Also available on<br \/>[\s\S]*?<\/p>/g;

    html = html.replace(block1, '<br /><p>Created By<br>Ramishka Madhushan</p>');
    html = html.replace(block2, '<br /><p>Created By<br>Ramishka Madhushan</p>');

    fs.writeFileSync('index.html', html);
    console.log("Ready!");
}
run();
