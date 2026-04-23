import fs from 'fs';

const ghosts = [
  { id: 'spirit', name: 'Spirit' },
  { id: 'wraith', name: 'Wraith' },
  { id: 'phantom', name: 'Phantom' },
  { id: 'poltergeist', name: 'Poltergeist' },
  { id: 'banshee', name: 'Banshee' },
  { id: 'jinn', name: 'Jinn' },
  { id: 'mare', name: 'Mare' },
  { id: 'revenant', name: 'Revenant' },
  { id: 'shade', name: 'Shade' },
  { id: 'demon', name: 'Demon' },
  { id: 'yurei', name: 'Yurei' },
  { id: 'oni', name: 'Oni' },
  { id: 'yokai', name: 'Yokai' },
  { id: 'hantu', name: 'Hantu' },
  { id: 'goryo', name: 'Goryo' },
  { id: 'myling', name: 'Myling' },
  { id: 'onryo', name: 'Onryo' },
  { id: 'twins', name: 'The Twins' },
  { id: 'raiju', name: 'Raiju' },
  { id: 'obake', name: 'Obake' },
  { id: 'mimic', name: 'The Mimic' },
  { id: 'moroi', name: 'Moroi' },
  { id: 'deogen', name: 'Deogen' },
  { id: 'thaye', name: 'Thaye' },
  { id: 'daian', name: 'Dayan' }, // custom ghost? Wait, Dayan, Gallu, Obambo were in the list.
  { id: 'gallu', name: 'Gallu' },
  { id: 'obambo', name: 'Obambo' }
];

async function updateGhostsFile() {
  let content = fs.readFileSync('/src/data/ghosts.ts', 'utf-8');
  
  // Custom mapping for wiki file names based on Phasmophobia Fandom typical patterns
  // Spirit is GhostModel_24, but usually Ghost_[Name]_Render or just searching their fandom page.
  // We can just use the direct wiki page parse or common known ones.
  // A much better and 100% working way is: Phasmophobia Wiki uses 'File:GhostModel_X.png'
  // But wait, the user's issue isn't JUST the URLs. They didn't show up because of Hotlink!
  // I replaced them with picsum! So I know the user's PREVIOUS links DID exist.
  // Actually, wait, did I change the links in ghosts.ts from Fandom to picsum.photos?
  // Yes! Checkpoint 38 says: "Replaced all original image URLs with thematic placeholder images from picsum.photos"
  // So the user is asking to REVERT to the game photos! "берри фото из игры фазмафобия"
  
  // Wait, I can restore ghosts.ts by simply regex replacing picsum links with Fandom links but what Fandom links?
  // Let me just query the wiki locally right now for each ghost!
  for (let g of ghosts) {
    if(['daian','gallu','obambo'].includes(g.id)) {
      // I know these from the checkpoint
      let url = 'https://phasmophobia.fandom.com/wiki/Special:FilePath/GhostModel_2.png';
      if(g.id==='gallu') url = 'https://phasmophobia.fandom.com/wiki/Special:FilePath/GhostModel_1.png';
      else if(g.id==='obambo') url = 'https://phasmophobia.fandom.com/wiki/Special:FilePath/GhostModel_10.png';
      content = content.replace(new RegExp(`https://picsum.photos/seed/${g.id}-ghost/[^"']+`), url);
      continue;
    }
    
    // For others, let's use the standard "GhostModel_1.png" etc if we can't find real, 
    // or better, query the Phasmophobia Wiki for the ghost's infobox image.
    try {
      const res = await fetch(`https://phasmophobia.fandom.com/api.php?action=parse&page=${encodeURIComponent(g.name)}&prop=images&format=json`);
      const data = await res.json();
      const images = data.parse ? data.parse.images : [];
      let bestImage = '';
      for (const img of images) {
        if ((img.toLowerCase().includes('model') || img.toLowerCase().includes('render') || img.toLowerCase().includes('ghost')) && !img.includes('Journal') && !img.includes('Evidence')) {
          bestImage = img;
          if (img.toLowerCase() === `${g.name.toLowerCase()}_render.png`) break;
        }
      }
      if (images.length > 0 && !bestImage) { bestImage = images[0]; }
      if (bestImage) {
         let url = `https://phasmophobia.fandom.com/wiki/Special:FilePath/${encodeURIComponent(bestImage)}`;
         content = content.replace(new RegExp(`https://picsum.photos/seed/${g.id}-ghost/[^"']+`), url);
         console.log(g.name, url);
      }
    } catch(e) {}
  }
  
  fs.writeFileSync('/src/data/ghosts.ts', content);
  console.log("Updated ghosts.ts");
}

updateGhostsFile();
