const fs = require('fs');
const https = require('https');

const GHOSTS = [
  'Spirit', 'Wraith', 'Phantom', 'Poltergeist', 'Banshee', 'Jinn', 'Mare', 'Revenant', 'Shade', 'Demon', 'Yurei', 'Oni', 'Yokai', 'Hantu', 'Goryo', 'Myling', 'Onryo', 'The Twins', 'Raiju', 'Obake', 'The Mimic', 'Moroi', 'Deogen', 'Thaye', 'Dayan', 'Gallu', 'Obambo'
];

async function fetchWikiImage(title) {
  return new Promise((resolve) => {
    const url = `https://phasmophobia.fandom.com/api.php?action=query&prop=imageinfo&titles=File:${encodeURIComponent(title)}&iiprop=url&format=json`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pageId === '-1' || !pages[pageId].imageinfo) resolve(null);
          else resolve(pages[pageId].imageinfo[0].url.split('/revision/')[0]);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  const images = {};
  for (let i=0; i<GHOSTS.length; i++) {
    const ghost = GHOSTS[i];
    let title = `${ghost}_Render.png`;
    let url = await fetchWikiImage(title);
    if (!url && ghost === 'The Twins') {
      url = await fetchWikiImage('The_Twins_Render.png');
    }
    if (!url && ghost === 'The Mimic') {
      url = await fetchWikiImage('The_Mimic_Render.png');
    }
    if (!url) {
      title = `GhostModel_${i+1}.png`; // Might not match perfectly but worth a try
      url = await fetchWikiImage(title);
    }
    images[ghost] = url || `https://phasmophobia.fandom.com/wiki/Special:FilePath/Ghost_model.png`;
    console.log(ghost, images[ghost]);
  }
  fs.writeFileSync('/ghost_urls.json', JSON.stringify(images, null, 2));
}

run();
