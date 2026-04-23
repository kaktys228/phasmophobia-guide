import fs from 'fs';

const GHOSTS = [
  'Spirit', 'Wraith', 'Phantom', 'Poltergeist', 'Banshee', 'Jinn', 'Mare', 'Revenant', 'Shade', 'Demon', 'Yurei', 'Oni', 'Yokai', 'Hantu', 'Goryo', 'Myling', 'Onryo', 'The Twins', 'Raiju', 'Obake', 'The Mimic', 'Moroi', 'Deogen', 'Thaye', 'Dayan', 'Gallu', 'Obambo'
];

async function fetchWikiImage(title) {
  try {
    const url = `https://phasmophobia.fandom.com/api.php?action=query&prop=imageinfo&titles=File:${encodeURIComponent(title)}&iiprop=url&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pageId === '-1' || !pages[pageId].imageinfo) return null;
    return pages[pageId].imageinfo[0].url.split('/revision/')[0];
  } catch (e) {
    return null;
  }
}

async function run() {
  const images = {};
  for (let ghost of GHOSTS) {
    let title = `${ghost}_Render.png`;
    let url = await fetchWikiImage(title);
    if (!url) {
      title = `${ghost}_Model.png`;
      url = await fetchWikiImage(title);
    }
    if (!url) {
      title = `GhostModel_${ghost}.png`;
      url = await fetchWikiImage(title);
    }
    images[ghost] = url;
    console.log(ghost, url);
  }
  fs.writeFileSync('wiki_images.json', JSON.stringify(images, null, 2));
}

run();
