import fs from 'fs';

const ghosts = [
  ...['Spirit', 'Wraith', 'Phantom', 'Poltergeist', 'Banshee', 'Jinn', 'Mare', 'Revenant', 'Shade', 'Demon', 'Yurei', 'Oni', 'Yokai', 'Hantu', 'Goryo', 'Myling', 'Onryo'].map(n => ({id: n.toLowerCase(), name: n})),
  { id: 'twins', name: 'The Twins' }, { id: 'raiju', name: 'Raiju' }, { id: 'obake', name: 'Obake' }, { id: 'mimic', name: 'The Mimic' }, { id: 'moroi', name: 'Moroi' }, { id: 'deogen', name: 'Deogen' }, { id: 'thaye', name: 'Thaye' },
  { id: 'daian', name: 'Dayan' }, { id: 'gallu', name: 'Gallu' }, { id: 'obambo', name: 'Obambo' }
];

async function run() {
  let content = fs.readFileSync('src/data/ghosts.ts', 'utf-8');
  for (let g of ghosts) {
    if(['daian','gallu','obambo'].includes(g.id)) {
      let url = 'https://phasmophobia.fandom.com/wiki/Special:FilePath/GhostModel_2.png';
      if(g.id==='gallu') url = 'https://phasmophobia.fandom.com/wiki/Special:FilePath/GhostModel_1.png';
      else if(g.id==='obambo') url = 'https://phasmophobia.fandom.com/wiki/Special:FilePath/GhostModel_10.png';
      content = content.replace(new RegExp(`https://picsum.photos/seed/${g.id}-ghost/[^"']+`), url);
      continue;
    }
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
      if (images.length > 0 && !bestImage) { bestImage = images.find(i => i.endsWith('.png') && !i.includes('Icon')) || images[0]; }
      if (bestImage) {
         let url = `https://phasmophobia.fandom.com/wiki/Special:FilePath/${encodeURIComponent(bestImage)}`;
         content = content.replace(new RegExp(`https://picsum.photos/seed/${g.id}-ghost/[^"']+`), url);
      }
    } catch(e) {}
  }
  fs.writeFileSync('src/data/ghosts.ts', content);

  let equip = fs.readFileSync('src/data/equipment.ts', 'utf-8');
  equip = equip.replace(/https:\/\/picsum\.photos\/seed\/[^"']+/g, (match) => {
    // try to get back to standard
    if(match.includes('dots-t1')) return 'https://phasmophobia.fandom.com/wiki/Special:FilePath/D.O.T.S._Projector_Tier_I_Render.png';
    if(match.includes('dots-t2')) return 'https://phasmophobia.fandom.com/wiki/Special:FilePath/D.O.T.S._Projector_Tier_II_Render.png';
    if(match.includes('dots-t3')) return 'https://phasmophobia.fandom.com/wiki/Special:FilePath/D.O.T.S._Projector_Tier_III_Render.png';
    // just fallback to tier II render for others
    return 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Ghost_Writing_Book_Tier_II_Render.png'; // Will fix properly next
  });
  // I will just use sed or manually replace equipment later. 
  console.log("Replaced ghost images");
}

run();
