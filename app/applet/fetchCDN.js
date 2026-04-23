import fs from 'fs';

const titlesToFetch = [
  'D.O.T.S._Projector_Tier_I_Render.png',
  'D.O.T.S._Projector_Tier_II_Render.png',
  'D.O.T.S._Projector_Tier_III_Render.png',
  'Spirit_Box_Tier_I_Render.png',
  'Spirit_Box_Tier_II_Render.png',
  'Spirit_Box_Tier_III_Render.png',
  'UV_Light_Tier_I_Render.png',
  'UV_Light_Tier_II_Render.png',
  'UV_Light_Tier_III_Render.png',
  'EMF_Reader_Tier_I_Render.png',
  'EMF_Reader_Tier_II_Render.png',
  'EMF_Reader_Tier_III_Render.png',
  'Ghost_Writing_Book_Tier_I_Render.png',
  'Ghost_Writing_Book_Tier_II_Render.png',
  'Ghost_Writing_Book_Tier_III_Render.png',
  'Thermometer_Tier_I_Render.png',
  'Thermometer_Tier_II_Render.png',
  'Thermometer_Tier_III_Render.png',
  'Video_Camera_Tier_I_Render.png',
  'Video_Camera_Tier_II_Render.png',
  'Video_Camera_Tier_III_Render.png',
  'Flashlight_Tier_I_Render.png',
  'Flashlight_Tier_II_Render.png',
  'Flashlight_Tier_III_Render.png',
  'Crucifix_Tier_I_Render.png',
  'Crucifix_Tier_II_Render.png',
  'Crucifix_Tier_III_Render.png',
  'Head_Gear_Tier_I_Render.png',
  'Head_Gear_Tier_II_Render.png',
  'Head_Gear_Tier_III_Render.png',
  'Incense_Tier_I_Render.png',
  'Incense_Tier_II_Render.png',
  'Incense_Tier_III_Render.png',
  'Parabolic_Microphone_Tier_I_Render.png',
  'Parabolic_Microphone_Tier_II_Render.png',
  'Parabolic_Microphone_Tier_III_Render.png',
  'Salt_Tier_I_Render.png',
  'Salt_Tier_II_Render.png',
  'Salt_Tier_III_Render.png',
  'Sound_Sensor_Tier_I_Render.png',
  'Sound_Sensor_Tier_II_Render.png',
  'Sound_Sensor_Tier_III_Render.png',
  'Tripod_Tier_I_Render.png',
  'Tripod_Tier_II_Render.png',
  'Tripod_Tier_III_Render.png',
  'Firelight_Tier_I_Render.png',
  'Firelight_Tier_II_Render.png',
  'Firelight_Tier_III_Render.png',
  'Igniter_Tier_I_Render.png',
  'Igniter_Tier_II_Render.png',
  'Igniter_Tier_III_Render.png',
  'Motion_Sensor_Tier_I_Render.png',
  'Motion_Sensor_Tier_II_Render.png',
  'Motion_Sensor_Tier_III_Render.png',
  'Photo_Camera_Tier_I_Render.png',
  'Photo_Camera_Tier_II_Render.png',
  'Photo_Camera_Tier_III_Render.png',
  'Sanity_Medication_Tier_I_Render.png',
  'Sanity_Medication_Tier_II_Render.png',
  'Sanity_Medication_Tier_III_Render.png'
];

async function run() {
  const map = {};
  for(let title of titlesToFetch) {
    try {
      const res = await fetch(`https://phasmophobia.fandom.com/api.php?action=query&prop=imageinfo&titles=File:${encodeURIComponent(title)}&iiprop=url&format=json`);
      const data = await res.json();
      const pageId = Object.keys(data.query.pages)[0];
      if (pageId !== '-1') {
        const url = data.query.pages[pageId].imageinfo[0].url;
        map[title] = url.split('/revision/')[0]; // static CDN
        console.log(\`Found \${title} => \${map[title]}\`);
      }
    } catch(e) {}
  }
  fs.writeFileSync('cdnUrls.json', JSON.stringify(map, null, 2));
}
run();
