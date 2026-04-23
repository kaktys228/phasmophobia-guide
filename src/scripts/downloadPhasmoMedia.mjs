import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const apiBase = 'https://phasmophobia.fandom.com/api.php';

const explicitAssets = [
  {
    title: 'Ouija_Board_New.png',
    output: 'public/images/phasmo/cursed/ouija-board.png',
  },
  {
    title: 'Tarot_Cards.png',
    output: 'public/images/phasmo/cursed/tarot-cards.png',
  },
  {
    title: 'Voodoo_Doll_New.jpg',
    output: 'public/images/phasmo/cursed/voodoo-doll.jpg',
  },
  {
    title: 'Cursed_Mirror.jpg',
    output: 'public/images/phasmo/cursed/haunted-mirror.jpg',
  },
  {
    title: 'Music_box_display.jpg',
    output: 'public/images/phasmo/cursed/music-box.jpg',
  },
  {
    title: 'Sc_new1.jpg',
    output: 'public/images/phasmo/cursed/summoning-circle.jpg',
  },
  {
    title: 'Monkey_Paw.png',
    output: 'public/images/phasmo/cursed/monkey-paw.png',
  },
  {
    title: 'EMF_5_0.3.1.2.png',
    output: 'public/images/phasmo/evidence/emf-level-5.png',
  },
  {
    title: 'SpiritBox090_T2.png',
    output: 'public/images/phasmo/evidence/spirit-box.png',
  },
  {
    title: 'Thermometer_Render.png',
    output: 'public/images/phasmo/evidence/freezing-temperatures.png',
  },
  {
    title: 'Fingerprints_3.png',
    output: 'public/images/phasmo/evidence/ultraviolet.png',
  },
  {
    title: 'GhostOrb.png',
    output: 'public/images/phasmo/evidence/ghost-orb.png',
  },
  {
    title: 'T1BookWriting1.png',
    output: 'public/images/phasmo/evidence/ghost-writing.png',
  },
  {
    title: 'DOTS090_T2.png',
    output: 'public/images/phasmo/evidence/dots-projector.png',
  },
];

const equipmentSources = [
  'src/data/equipment.ts',
  'src/data/equipmentSupplement.ts',
];

const equipmentImageTitleOverrides = {
  'D.O.T.S._Projector_Tier_I_Render.png': 'DOTS090_T1.png',
  'D.O.T.S._Projector_Tier_II_Render.png': 'DOTS090_T2.png',
  'D.O.T.S._Projector_Tier_III_Render.png': 'DOTS090_T3.png',
  'Spirit_Box_Tier_I_Render.png': 'SpiritBox090_T1.png',
  'Spirit_Box_Tier_II_Render.png': 'SpiritBox090_T2.png',
  'Spirit_Box_Tier_III_Render.png': 'SpiritBox090_T3.png',
  'UV_Light_Tier_I_Render.png': 'UV090_T1.png',
  'UV_Light_Tier_II_Render.png': 'UV090_T2.png',
  'UV_Light_Tier_III_Render.png': 'UV090_T3.png',
  'EMF_Reader_Tier_I_Render.png': 'EMF090_T1.png',
  'EMF_Reader_Tier_II_Render.png': 'EMF090_T2.png',
  'EMF_Reader_Tier_III_Render.png': 'EMF090_T3.png',
  'Ghost_Writing_Book_Tier_I_Render.png': 'WritingBook090_T1.png',
  'Ghost_Writing_Book_Tier_II_Render.png': 'WritingBook090_T2.png',
  'Ghost_Writing_Book_Tier_III_Render.png': 'WritingBook090_T3.png',
  'Thermometer_Tier_I_Render.png': 'Thermometer090_T1.png',
  'Thermometer_Tier_II_Render.png': 'Thermometer090_T2.png',
  'Thermometer_Tier_III_Render.png': 'Thermometer090_T3.png',
  'Video_Camera_Tier_I_Render.png': 'VideoCamera090_T1.png',
  'Video_Camera_Tier_II_Render.png': 'VideoCamera090_T2.png',
  'Video_Camera_Tier_III_Render.png': 'VideoCamera090_T3.png',
  'Flashlight_Tier_I_Render.png': 'Flash090_T1.png',
  'Flashlight_Tier_II_Render.png': 'Flash090_T2.png',
  'Flashlight_Tier_III_Render.png': 'Flash090_T3.png',
  'Crucifix_Tier_I_Render.png': 'Crucifix090_T1.png',
  'Crucifix_Tier_II_Render.png': 'Crucifix090_T2.png',
  'Crucifix_Tier_III_Render.png': 'Crucifix090_T3.png',
  'Head_Gear_Tier_I_Render.png': 'HeadGear090_T1.png',
  'Head_Gear_Tier_II_Render.png': 'HeadGear090_T2.png',
  'Head_Gear_Tier_III_Render.png': 'HeadGear090_T3.png',
  'Incense_Tier_I_Render.png': 'Incense090_T1.png',
  'Incense_Tier_II_Render.png': 'Incense090_T2.png',
  'Incense_Tier_III_Render.png': 'Incense090_T3.png',
  'Parabolic_Microphone_Tier_I_Render.png': 'Parabolic090_T1.png',
  'Parabolic_Microphone_Tier_II_Render.png': 'Parabolic090_T2.png',
  'Parabolic_Microphone_Tier_III_Render.png': 'Parabolic090_T3.png',
  'Salt_Tier_I_Render.png': 'Salt090_T1.png',
  'Salt_Tier_II_Render.png': 'Salt090_T2.png',
  'Salt_Tier_III_Render.png': 'Salt090_T3.png',
  'Tripod_Tier_I_Render.png': 'Tripod090_T1.png',
  'Tripod_Tier_II_Render.png': 'Tripod090_T2.png',
  'Tripod_Tier_III_Render.png': 'Tripod090_T3.png',
  'Firelight_Tier_I_Render.png': 'FireLight090_T1.png',
  'Firelight_Tier_II_Render.png': 'FireLight090_T2.png',
  'Firelight_Tier_III_Render.png': 'FireLight090_T3.png',
  'Igniter_Tier_I_Render.png': 'Igniter090_T1.png',
  'Igniter_Tier_II_Render.png': 'Igniter090_T2.png',
  'Igniter_Tier_III_Render.png': 'Igniter090_T3.png',
  'Motion_Sensor_Tier_I_Render.png': 'MotionSensor090_T1.png',
  'Motion_Sensor_Tier_II_Render.png': 'MotionSensor090_T2.png',
  'Motion_Sensor_Tier_III_Render.png': 'MotionSensor090_T3.png',
  'Photo_Camera_Tier_I_Render.png': 'PhotoCamera090_T1.png',
  'Photo_Camera_Tier_II_Render.png': 'PhotoCamera090_T2.png',
  'Photo_Camera_Tier_III_Render.png': 'PhotoCamera090_T3.png',
  'Sanity_Medication_Tier_I_Render.png': 'Med090_T1.png',
  'Sanity_Medication_Tier_II_Render.png': 'Med090_T2.png',
  'Sanity_Medication_Tier_III_Render.png': 'Med090_T3.png',
  'Sound_Sensor_Tier_I_Render.png': 'SoundSensor090_T1.png',
  'Sound_Sensor_Tier_II_Render.png': 'SoundSensor090_T2.png',
  'Sound_Sensor_Tier_III_Render.png': 'SoundSensor090_T3.png',
};

async function collectEquipmentAssets() {
  const titles = new Map();
  const pattern = /Special:FilePath\/([^'"`\s)]+)/g;

  for (const source of equipmentSources) {
    const absoluteSource = path.join(projectRoot, source);
    const content = await readFile(absoluteSource, 'utf8');

    for (const match of content.matchAll(pattern)) {
      const title = decodeURIComponent(match[1]);
      const actualTitle = equipmentImageTitleOverrides[title] ?? title;
      titles.set(actualTitle, {
        title: actualTitle,
        output: `public/images/phasmo/equipment/${actualTitle}`,
      });
    }
  }

  return Array.from(titles.values());
}

async function resolveImageUrl(title) {
  const params = new URLSearchParams({
    action: 'query',
    prop: 'imageinfo',
    titles: `File:${title}`,
    iiprop: 'url',
    format: 'json',
  });

  const response = await fetch(`${apiBase}?${params}`);
  if (!response.ok) {
    throw new Error(`Failed to resolve ${title}: ${response.status}`);
  }

  const data = await response.json();
  const pages = data?.query?.pages ?? {};
  const page = Object.values(pages)[0];
  const url = page?.imageinfo?.[0]?.url;

  if (url) {
    return url;
  }

  const fallbackUrl = `https://phasmophobia.fandom.com/wiki/Special:FilePath/${encodeURIComponent(title)}`;
  const fallbackResponse = await fetch(fallbackUrl);

  if (!fallbackResponse.ok) {
    throw new Error(`Missing image URL for ${title}`);
  }

  return fallbackResponse.url;
}

async function downloadAsset({ title, output }) {
  const url = await resolveImageUrl(title);
  const absoluteOutput = path.join(projectRoot, output);

  await mkdir(path.dirname(absoluteOutput), { recursive: true });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${title}: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(absoluteOutput, buffer);

  console.log(`Saved ${output}`);
}

const assets = [
  ...explicitAssets,
  ...(await collectEquipmentAssets()),
];

for (const asset of assets) {
  await downloadAsset(asset);
}
