import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const baseUrl = 'https://phasmophobia.su';

const equipmentPages = [
  ['dots', 'dots-projector'],
  ['spirit_box', 'spirit-box'],
  ['uv', 'uv-light'],
  ['emf', 'emf-reader'],
  ['writing', 'ghost-writing-book'],
  ['thermometer', 'thermometer'],
  ['camera', 'video-camera'],
  ['flashlight', 'flashlight'],
  ['crucifix', 'crucifix'],
  ['headgear', 'head-gear'],
  ['smudge', 'incense'],
  ['paramic', 'parabolic-microphone'],
  ['salt', 'salt'],
  ['sound', 'sound-recorder'],
  ['tripod', 'tripod'],
  ['firelight', 'firelight'],
  ['igniter', 'igniter'],
  ['motion', 'motion-sensor'],
  ['photo', 'photo-camera'],
  ['sanity', 'sanity-medication'],
  ['sound2', 'sound-sensor'],
];

const cursedObjectPages = [
  ['ouija', 'ouija-board'],
  ['tarot', 'tarot-cards'],
  ['mirror', 'haunted-mirror'],
  ['musicbox', 'music-box'],
  ['circle', 'summoning-circle'],
  ['voodoo', 'voodoo-doll'],
  ['paw', 'monkey-paw'],
];

const evidencePages = [
  ['emf', 'emf-5'],
  ['spirit_box', 'spirit-box'],
  ['freezing', 'freezing-temperatures'],
  ['fingerprints', 'ultraviolet'],
  ['ghost_orb', 'ghost-orb'],
  ['ghost_writing', 'ghost-writing'],
  ['dots', 'dots-projector'],
];

const progressionPages = [
  ['apocalypse', 'apocalypse'],
  ['prestiges', 'prestiges'],
  ['lvl-grind', 'lvl-grind'],
  ['winters-jest', 'winters-jest'],
];

const gameplayPages = [
  ['van', 'van'],
  ['hunts', 'hunts'],
  ['ghost-events', 'ghost-events'],
  ['media', 'media'],
  ['weather', 'weather'],
  ['difficulties', 'difficulties'],
  ['common-misconceptions', 'common-misconceptions'],
  ['easter-eggs', 'easter-eggs'],
];

const achievementCategories = [
  {
    id: 'special',
    title: 'Особые',
    slugs: [
      'escape-artist',
      'they-re-here',
      'the-bait',
      'doom-slayed',
      'flawless-execution',
      'director',
      'no-more-training-wheels',
    ],
  },
  {
    id: 'tasks-contracts',
    title: 'Задания и контракты',
    slugs: [
      'extra-mile',
      'devoted',
      'dedicated',
      'challenger-approaching',
      'rise-to-the-challenge',
      'taking-all-challenges',
      'bronze-hunter',
      'silver-hunter',
      'gold-hunter',
      'chump-change',
    ],
  },
  {
    id: 'progression',
    title: 'Прогрессия',
    slugs: [
      'rookie',
      'professional',
      'boss',
      'work-experience',
      'fat-stack',
      'cash-cow',
      'break-the-bank',
      'i',
      'ii',
      'iii',
      'bare-essentials',
      'tools-of-the-trade',
      'fully-loaded',
    ],
  },
  {
    id: 'ghosts',
    title: 'Призраки',
    slugs: [
      'spirit-discovered',
      'wraith-discovered',
      'phantom-discovered',
      'poltergeist-discovered',
      'banshee-discovered',
      'jinn-discovered',
      'mare-discovered',
      'revenant-discovered',
      'shade-discovered',
      'demon-discovered',
      'yurei-discovered',
      'oni-discovered',
      'yokai-discovered',
      'hantu-discovered',
      'goryo-discovered',
      'myling-discovered',
      'onryo-discovered',
      'the-twins-discovered',
      'raiju-discovered',
      'obake-discovered',
      'the-mimic-discovered',
      'moroi-discovered',
      'deogen-discovered',
      'thaye-discovered',
    ],
  },
];

const decodeText = (value) =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<!-- -->/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const sanitizeHtml = (value) =>
  value
    .replace(/<!-- -->/g, '')
    .replace(/<span class="icon icon-link">#<\/span>/g, '')
    .replace(/<a([^>]*?)href="\//g, `<a$1href="${baseUrl}/`)
    .replace(/<a(?![^>]*target=)/g, '<a target="_blank" rel="noreferrer"')
    .replace(/\s+class="[^"]*"/g, '')
    .trim();

const toLiteral = (value) => JSON.stringify(value, null, 2);

async function fetchHtml(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

function extractMeta(html, name, property = false) {
  const attr = property ? 'property' : 'name';
  const match = html.match(new RegExp(`<meta ${attr}="${name}" content="([^"]+)"`, 'i'));
  return match?.[1] ?? '';
}

function extractEquipmentArticle(html) {
  const title = decodeText(html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1] ?? '');
  const articleHtml = sanitizeHtml(
    html.match(/<div class="knowledge"><div>([\s\S]*?)<\/div><\/div><\/div><\/div><div class="mt-auto/s)?.[1] ?? ''
  );
  const updatedAt = decodeText(html.match(/Последняя редакция:\s*(?:<!-- -->)?([^<]+)/)?.[1] ?? '');
  const image = extractMeta(html, 'og:image', true);

  return { title, articleHtml, updatedAt, image, source: '' };
}

function extractAchievementArticle(html) {
  const title = decodeText(html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1] ?? '');
  const summary = decodeText(html.match(/<\/h1><p[^>]*>(.*?)<\/p>/)?.[1] ?? '');
  const detailHtml = sanitizeHtml(
    html.match(/<div class="markdown overflow-y-auto px-6 py-5">([\s\S]*?)<\/div><\/article>/)?.[1] ?? ''
  );
  const image = html.match(/<\/div><img src="([^"]+)"/)?.[1] ?? extractMeta(html, 'og:image', true);

  return { title, summary, detailHtml, image, source: '' };
}

function extractCursedArticle(html) {
  const title = decodeText(html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1] ?? '');
  const articleHtml = sanitizeHtml(
    html.match(/<div class="knowledge">([\s\S]*?)<\/div><\/div><\/div><\/article>/s)?.[1] ?? ''
  );
  const image = extractMeta(html, 'og:image', true);

  return { title, articleHtml, image, source: '' };
}

function extractEvidenceItems(html) {
  const items = [...html.matchAll(/<a[^>]*href="(\/knowledge-base\/evidence\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map((match) => {
    const chunk = match[2];
    const title = decodeText(chunk.match(/<span[^>]*>(.*?)<\/span>/)?.[1] ?? chunk.match(/alt="([^"]+)"/)?.[1] ?? '');
    const image = chunk.match(/<img src="([^"]+)"/)?.[1] ?? '';

    return {
      href: match[1],
      title,
      image,
    };
  });

  return items.filter((item) => item.href.startsWith('/knowledge-base/evidence/'));
}

function extractEvidenceArticle(html) {
  const title = decodeText(html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1] ?? '');
  const articleHtml = sanitizeHtml(
    html.match(/<div class="knowledge">([\s\S]*?)<\/div><\/div><\/div><\/article>/s)?.[1] ?? ''
  );
  const description = extractMeta(html, 'description');
  const image = extractMeta(html, 'og:image', true);

  return { title, articleHtml, description, image, source: '' };
}

function extractProgressArticle(html, titleFallback) {
  const title = decodeText(html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1] ?? titleFallback);
  const articleHtml = sanitizeHtml(
    html.match(/<div class="markdown(?: overflow-y-auto px-6 py-5)?">([\s\S]*?)<\/div><\/(?:div><\/article|article)>/s)?.[1] ?? ''
  );
  const description = extractMeta(html, 'description');
  const image = extractMeta(html, 'og:image', true);

  return { title, articleHtml, description, image, source: '' };
}

function extractProgressCards(html) {
  return [...html.matchAll(/<a class="group[^"]*" href="([^"]+)"><img src="([^"]+)" alt="([^"]+)"[\s\S]*?<h2[^>]*>(.*?)<\/h2><\/div><\/a>/g)].map(
    (match) => ({
      href: match[1],
      image: match[2],
      alt: decodeText(match[3]),
      title: decodeText(match[4]),
    })
  );
}

function gameplayIdFromHref(href) {
  return href.split('/').filter(Boolean).slice(2).join('-');
}

function extractPrestigeEntries(html) {
  return [...html.matchAll(/<tr><td>(.*?)<\/td><td><img src="([^"]+)" alt="([^"]*)"\/><\/td><td>(.*?)<\/td><\/tr>/g)].map(
    (match, index) => ({
      id: index,
      title: decodeText(match[1]),
      image: match[2],
      alt: decodeText(match[3]),
      prestigeLabel: decodeText(match[4]),
    })
  );
}

async function generateEquipmentArticles() {
  const articles = {};

  for (const [id, slug] of equipmentPages) {
    const url = `${baseUrl}/knowledge-base/equipment/${slug}`;
    const html = await fetchHtml(url);
    articles[id] = {
      ...extractEquipmentArticle(html),
      source: url,
    };
  }

  const target = path.join(projectRoot, 'src/data/equipmentArticles.ts');
  const fileContent = `export interface EquipmentArticle {\n  title: string;\n  articleHtml: string;\n  updatedAt: string;\n  image: string;\n  source: string;\n}\n\nexport const EQUIPMENT_ARTICLES: Record<string, EquipmentArticle> = ${toLiteral(articles)};\n`;
  await writeFile(target, fileContent);
}

async function generateCursedArticles() {
  const articles = {};

  for (const [id, slug] of cursedObjectPages) {
    const url = `${baseUrl}/knowledge-base/cursed-objects/${slug}`;
    const html = await fetchHtml(url);
    articles[id] = {
      ...extractCursedArticle(html),
      source: url,
    };
  }

  const target = path.join(projectRoot, 'src/data/cursedArticles.ts');
  const fileContent = `export interface CursedArticle {\n  title: string;\n  articleHtml: string;\n  image: string;\n  source: string;\n}\n\nexport const CURSED_ARTICLES: Record<string, CursedArticle> = ${toLiteral(articles)};\n`;
  await writeFile(target, fileContent);
}

async function generateEvidenceData() {
  const homeHtml = await fetchHtml(`${baseUrl}/knowledge-base/evidence`);
  const homeItems = extractEvidenceItems(homeHtml);
  const items = evidencePages.map(([id, slug]) => {
    const href = `/knowledge-base/evidence/${slug}`;
    const homeItem = homeItems.find((item) => item.href === href);

    return {
      id,
      href,
      title: homeItem?.title ?? slug,
      image: homeItem?.image ?? '',
    };
  });

  const articles = {};

  for (const [id, slug] of evidencePages) {
    const url = `${baseUrl}/knowledge-base/evidence/${slug}`;
    const html = await fetchHtml(url);
    articles[id] = {
      ...extractEvidenceArticle(html),
      source: url,
    };
  }

  const target = path.join(projectRoot, 'src/data/evidence.ts');
  const fileContent = `export interface EvidenceListItem {\n  id: string;\n  href: string;\n  title: string;\n  image: string;\n}\n\nexport interface EvidenceArticle {\n  title: string;\n  articleHtml: string;\n  description: string;\n  image: string;\n  source: string;\n}\n\nexport const EVIDENCE_ITEMS: EvidenceListItem[] = ${toLiteral(items)};\n\nexport const EVIDENCE_ARTICLES: Record<string, EvidenceArticle> = ${toLiteral(articles)};\n`;
  await writeFile(target, fileContent);
}

async function generateProgressionData() {
  const homeHtml = await fetchHtml(`${baseUrl}/knowledge-base/progression`);
  const homeCards = extractProgressCards(homeHtml)
    .filter((card) => !card.href.includes('/knowledge-base/progression/winters-jest'))
    .map((card) => ({
      ...card,
      id: card.href.split('/').filter(Boolean).pop(),
    }));

  const articles = {};

  for (const [id, slug] of progressionPages.filter(([id]) => id !== 'winters-jest')) {
    const url = `${baseUrl}/knowledge-base/progression/${slug}`;
    const html = await fetchHtml(url);
    articles[id] = {
      ...extractProgressArticle(html, id),
      source: url,
    };

    if (id === 'prestiges') {
      articles[id].entries = extractPrestigeEntries(html);
    }
  }

  const achievements = {};
  const allAchievementSlugs = achievementCategories.flatMap((category) => category.slugs);

  for (const slug of allAchievementSlugs) {
    const url = `${baseUrl}/knowledge-base/progression/achievements/${slug}`;
    const html = await fetchHtml(url);
    achievements[slug] = {
      ...extractAchievementArticle(html),
      slug,
      source: url,
    };
  }

  const target = path.join(projectRoot, 'src/data/progression.ts');
  const fileContent = `export interface ProgressCard {\n  id: string;\n  href: string;\n  image: string;\n  alt: string;\n  title: string;\n}\n\nexport interface ProgressArticle {\n  title: string;\n  articleHtml: string;\n  description: string;\n  image: string;\n  source: string;\n  entries?: {\n    id: number;\n    title: string;\n    image: string;\n    alt: string;\n    prestigeLabel: string;\n  }[];\n}\n\nexport interface AchievementItem {\n  slug: string;\n  title: string;\n  summary: string;\n  detailHtml: string;\n  image: string;\n  source: string;\n}\n\nexport const PROGRESS_HOME_CARDS: ProgressCard[] = ${toLiteral(homeCards)};\n\nexport const PROGRESS_ARTICLES: Record<string, ProgressArticle> = ${toLiteral(articles)};\n\nexport const ACHIEVEMENT_CATEGORIES = ${toLiteral(achievementCategories)};\n\nexport const ACHIEVEMENTS: Record<string, AchievementItem> = ${toLiteral(achievements)};\n`;
  await writeFile(target, fileContent);
}

async function generateGameplayData() {
  const homeHtml = await fetchHtml(`${baseUrl}/knowledge-base/gameplay`);
  const homeCards = extractProgressCards(homeHtml)
    .filter((card) => card.href.includes('/knowledge-base/gameplay/'))
    .map((card) => ({
      ...card,
      id: gameplayIdFromHref(card.href),
    }));

  const articles = {};

  for (const [id, slug] of gameplayPages) {
    const url = `${baseUrl}/knowledge-base/gameplay/${slug}`;
    const html = await fetchHtml(url);
    const homeCard = homeCards.find((card) => card.id === id);
    const childCards = extractProgressCards(html)
      .filter((card) => card.href.startsWith(`/knowledge-base/gameplay/${slug}/`))
      .map((card) => ({
        ...card,
        id: gameplayIdFromHref(card.href),
      }));
    const article = extractProgressArticle(html, id);

    articles[id] = {
      ...article,
      image: article.image || homeCard?.image || '',
      source: url,
      children: childCards,
    };

    for (const childCard of childCards) {
      const childUrl = `${baseUrl}${childCard.href}`;
      const childHtml = await fetchHtml(childUrl);
      const childArticle = extractProgressArticle(childHtml, childCard.title);

      articles[childCard.id] = {
        ...childArticle,
        image: childArticle.image || childCard.image,
        source: childUrl,
        parentId: id,
      };
    }
  }

  const target = path.join(projectRoot, 'src/data/gameplay.ts');
  const fileContent = `export interface GameplayCard {\n  id: string;\n  href: string;\n  image: string;\n  alt: string;\n  title: string;\n}\n\nexport interface GameplayArticle {\n  title: string;\n  articleHtml: string;\n  description: string;\n  image: string;\n  source: string;\n  parentId?: string;\n  children?: GameplayCard[];\n}\n\nexport const GAMEPLAY_HOME_CARDS: GameplayCard[] = ${toLiteral(homeCards)};\n\nexport const GAMEPLAY_ARTICLES: Record<string, GameplayArticle> = ${toLiteral(articles)};\n`;
  await writeFile(target, fileContent);
}

await generateEquipmentArticles();
await generateCursedArticles();
await generateEvidenceData();
await generateProgressionData();
await generateGameplayData();

console.log('Generated knowledge base data files.');
