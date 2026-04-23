import { GoogleGenAI } from '@google/genai';
import { GHOSTS } from '../data/ghosts';
import type { Evidence, Ghost } from '../types';

const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
const DEFAULT_GEMINI_FALLBACK_MODELS = ['gemini-2.5-flash-lite', 'gemini-2.0-flash'];
const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-20b';
const DEFAULT_PROXYAPI_OPENAI_MODEL = 'gpt-5-nano';
const DEFAULT_PROXYAPI_OPENAI_BASE_URL = 'https://api.proxyapi.ru/openai/v1';
const GROQ_CHAT_COMPLETIONS_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const SINGLE_RESULT_CONFIDENCE_THRESHOLD = 75;
const DEOGEN_NEAR_PLAYER_SPEED_THRESHOLD = 0.9;

type ProviderErrorKind =
  | 'missing_config'
  | 'invalid_key'
  | 'quota'
  | 'permission'
  | 'network'
  | 'unknown';

type CloudAnalysis = {
  primaryGhostId: string;
  confidence: number;
  reasoning: string[];
  checks: string[];
  alternatives?: Array<{
    ghostId: string;
    reason: string;
  }>;
};

type RankedGhost = {
  ghost: Ghost;
  score: number;
  reasons: string[];
};

type LocalAnalysis = {
  confidence: number;
  ambiguous: boolean;
  best: RankedGhost;
  alternatives: RankedGhost[];
  ranked: RankedGhost[];
  checks: string[];
  recognized: string[];
};

type GeminiConfig = {
  apiKey: string;
  model: string;
  fallbackModels: string[];
};

type ProxyOpenAIConfig = {
  apiKey: string;
  model: string;
  baseUrl: string;
};

type GroqConfig = {
  apiKey: string;
  model: string;
};

type GeminiAnalysisAttempt = {
  enableSearch: boolean;
  maxOutputTokens: number;
};

type SignalKey =
  | 'fast'
  | 'slow'
  | 'very_slow'
  | 'cold'
  | 'breaker_off'
  | 'breaker_on'
  | 'electronics'
  | 'salt'
  | 'salt_ignored'
  | 'no_footsteps'
  | 'dots_camera'
  | 'photo_disappear'
  | 'heavy_breath'
  | 'early_hunt'
  | 'dark'
  | 'many_objects'
  | 'double_interaction'
  | 'single_target'
  | 'talking'
  | 'flame'
  | 'smudge_180'
  | 'distance'
  | 'close_range'
  | 'line_of_sight'
  | 'no_line_of_sight'
  | 'changing_speed';

type Observations = {
  raw: string;
  normalized: string;
  tokens: string[];
  evidence: Evidence[];
  flags: Set<SignalKey>;
  numericSpeed: number | null;
  meaningfulTokenCount: number;
};

const EVIDENCE_PATTERNS: Array<{ evidence: Evidence; patterns: string[] }> = [
  {
    evidence: 'EMF Level 5',
    patterns: ['эмп', 'эмф', 'emf', 'level 5', 'ур 5', '5 уровень'],
  },
  {
    evidence: 'Fingerprints',
    patterns: ['отпечат', 'ультрафиолет', 'ув', 'уф', 'uv', 'fingerprint'],
  },
  {
    evidence: 'Ghost Writing',
    patterns: ['записи', 'запись', 'блокнот', 'написал', 'письмо', 'writing'],
  },
  {
    evidence: 'Freezing Temperatures',
    patterns: ['минус', 'мороз', 'холод', 'замерз', 'freezing'],
  },
  {
    evidence: 'Ghost Orb',
    patterns: ['огонек', 'огонёк', 'орб', 'орбы', 'ghost orb'],
  },
  {
    evidence: 'Spirit Box',
    patterns: ['радио', 'радиоприемник', 'радиоприёмник', 'spirit box'],
  },
  {
    evidence: 'D.O.T.S. Projector',
    patterns: ['dots', 'd.o.t.s', 'дотс', 'лазер', 'проектор'],
  },
];

const EVIDENCE_VALUES: Evidence[] = [
  'EMF Level 5',
  'Fingerprints',
  'Ghost Writing',
  'Freezing Temperatures',
  'Ghost Orb',
  'Spirit Box',
  'D.O.T.S. Projector',
];

const SIGNAL_PATTERNS: Array<{ key: SignalKey; patterns: string[] }> = [
  { key: 'fast', patterns: ['быстр', 'ускор', 'разогнал', 'скорост'] },
  { key: 'slow', patterns: ['медлен', 'тормоз', 'полз', 'замедл'] },
  {
    key: 'very_slow',
    patterns: ['очень медлен', 'слишком медлен', 'еле идет', 'еле идёт', 'почти стоит', 'почти полз'],
  },
  { key: 'cold', patterns: ['холод', 'мороз', 'минус', 'ледян'] },
  {
    key: 'breaker_off',
    patterns: ['щиток выключ', 'щиток выруб', 'без электрич', 'света нет', 'щиток офф'],
  },
  {
    key: 'breaker_on',
    patterns: ['щиток включ', 'электричество есть', 'свет включен', 'свет включён'],
  },
  {
    key: 'electronics',
    patterns: ['электрон', 'фонар', 'камера', 'видеокамер', 'прибор', 'электроник'],
  },
  { key: 'salt', patterns: ['соль', 'соли', 'солян'] },
  {
    key: 'salt_ignored',
    patterns: [
      'не ходит по соли',
      'не идет по соли',
      'не наступает в соль',
      'не наступает на соль',
      'обходит соль',
      'игнорирует соль',
      'соль не сработала',
      'соль не срабатывает',
      'соль осталась целой',
      'не трогает соль',
    ],
  },
  {
    key: 'no_footsteps',
    patterns: [
      'следов нет',
      'без следов',
      'не оставил след',
      'не оставляет следов',
      'нет следов в соли',
      'следов в соли нет',
      'не видно следов в соли',
      'соль сработала без следов',
    ],
  },
  {
    key: 'dots_camera',
    patterns: ['через камеру dots', 'dots через камеру', 'дотс через камеру', 'dots на камере'],
  },
  { key: 'photo_disappear', patterns: ['исчез на фото', 'нет на фото', 'пропал на фото'] },
  { key: 'heavy_breath', patterns: ['тяжелое дыхание', 'тяжёлое дыхание'] },
  {
    key: 'early_hunt',
    patterns: ['ранняя охота', 'рано начал охоту', 'охота на высоком рассудке', 'очень рано'],
  },
  { key: 'dark', patterns: ['темно', 'темнота', 'выключает свет'] },
  { key: 'many_objects', patterns: ['много предмет', 'кидает предмет', 'бросает предмет'] },
  { key: 'double_interaction', patterns: ['два взаимодейств', 'двойное взаимодейств', 'две комнаты'] },
  { key: 'single_target', patterns: ['одна цель', 'игнорирует других', 'только одного'] },
  { key: 'talking', patterns: ['голос', 'говорил', 'разговор', 'болтал'] },
  { key: 'flame', patterns: ['свеч', 'пламя', 'зажигал', 'огонь'] },
  { key: 'smudge_180', patterns: ['180 секунд', '180 сек', 'три минуты'] },
  { key: 'distance', patterns: ['далеко', 'на расстоянии', 'издалека'] },
  {
    key: 'close_range',
    patterns: ['вблизи', 'близко', 'рядом с игрок', 'игрок рядом', 'когда игрок близко', 'при приближении', 'в упор', 'вплотную'],
  },
  { key: 'line_of_sight', patterns: ['увидел', 'видит', 'прямая видимость', 'в поле зрения'] },
  { key: 'no_line_of_sight', patterns: ['не видит', 'без линии видимости', 'за стеной'] },
  { key: 'changing_speed', patterns: ['меняет скорость', 'то быстрый то медленный', 'скорость меняется'] },
];

const OBSERVATION_LABELS: Record<SignalKey, string> = {
  fast: 'скорость выше базовой 1.7 м/с',
  slow: 'скорость ниже базовой 1.7 м/с',
  very_slow: 'скорость около ползущей / сильно ниже обычной',
  cold: 'холод / мороз',
  breaker_off: 'выключенный щиток',
  breaker_on: 'включенный щиток',
  electronics: 'рядом электроника',
  salt: 'использована соль',
  salt_ignored: 'игнорирует соль / не наступает в неё',
  no_footsteps: 'нет следов в соли',
  dots_camera: 'D.O.T.S. видно через камеру',
  photo_disappear: 'исчезает на фото',
  heavy_breath: 'тяжелое дыхание',
  early_hunt: 'ранняя охота',
  dark: 'поведение в темноте',
  many_objects: 'много взаимодействий с предметами',
  double_interaction: 'двойные взаимодействия',
  single_target: 'одна цель',
  talking: 'реакция на разговоры',
  flame: 'свечи / огонь',
  smudge_180: 'пауза 180 секунд после благовония',
  distance: 'ускорение на расстоянии',
  close_range: 'замедляется при сближении с игроком',
  line_of_sight: 'ускорение при прямой видимости',
  no_line_of_sight: 'поведение без прямой видимости',
  changing_speed: 'заметно меняет скорость',
};

const CLOUD_HINTS: Partial<Record<string, string[]>> = {
  spirit: ['нет уникальной скорости', 'благовоние задерживает охоту на 180 секунд'],
  wraith: ['не оставляет следы в соли', 'может телепортироваться к игроку'],
  phantom: ['исчезает на фото', 'редко мерцает во время охоты'],
  poltergeist: ['массово кидает предметы', 'полтер-взрыв из кучи предметов'],
  banshee: ['выбирает одну цель', 'может кричать в направленный микрофон'],
  jinn: ['ускоряется вдали при включенном щитке', 'не выключает щиток сам'],
  mare: ['сильнее в темноте', 'часто выключает свет'],
  revenant: ['очень медленный без цели', 'очень быстрый после визуального контакта'],
  shade: ['пассивен рядом с игроками', 'редко активничает в комнате с людьми'],
  demon: ['очень ранняя охота', 'большой радиус распятия'],
  yurei: ['особая работа с дверью', 'благовоние может запереть его в комнате'],
  oni: ['много видимых явлений', 'не делает airball'],
  yokai: ['любит разговоры', 'плохо слышит далеко во время охоты'],
  hantu: ['ускоряется в холоде', 'морозное дыхание при охоте с выключенным щитком'],
  goryo: ['D.O.T.S. чаще видно через камеру', 'редко меняет комнату'],
  myling: ['тихие шаги', 'громкие паранормальные звуки'],
  onryo: ['охота вокруг потухшего огня', 'свечи и пламя очень важны'],
  twins: ['двойные взаимодействия', 'две разных скорости'],
  raiju: ['ускоряется рядом с электроникой', 'сильно глушит приборы'],
  obake: ['6 пальцев и другие уникальные отпечатки', 'может менять модель во время мерцания'],
  mimic: ['копирует других', 'скрытая четвертая улика — огонек'],
  moroi: ['ускоряется при низком рассудке', 'проклинает через радио или микрофон'],
  deogen: ['всегда знает где игрок', 'далеко быстрый, рядом очень медленный, иногда около 0.4-0.9 м/с'],
  thaye: ['очень быстрый в начале', 'стареет и замедляется'],
  daian: ['быстрее когда рядом двигаются игроки', 'медленнее когда рядом стоят'],
  gallu: ['состояния зависят от защитных предметов', 'соль может разозлить'],
  obambo: ['чередует спокойную и агрессивную фазы', 'скорость циклически меняется'],
};

const GHOST_BEHAVIOR_ALIASES: Partial<Record<string, string[]>> = {
  spirit: ['180 секунд после благовония', '3 минуты после благовония', 'долго не охотится после благовония'],
  wraith: ['не ходит по соли', 'соль без следов', 'игнорирует соль', 'телепортируется к игроку'],
  phantom: ['исчез на фото', 'нет на фото', 'редко мигает', 'долго невидим во время охоты'],
  poltergeist: ['полтер взрыв', 'кидает много предметов', 'швыряет предметы постоянно'],
  banshee: ['охотится за одной целью', 'игнорирует других игроков', 'поет', 'кричит в микрофон'],
  jinn: ['не выключает щиток', 'быстрый при включенном щитке', 'ускоряется вдали с щитком'],
  mare: ['боится света', 'сразу выключает свет', 'никогда не включает свет', 'охотится в темноте'],
  revenant: ['очень медленный без цели', 'очень быстрый когда видит', 'ускоряется при прямой видимости'],
  shade: ['пассивный рядом с игроками', 'не активничает при людях', 'тихий когда мы рядом'],
  demon: ['очень ранняя охота', 'охота при высоком рассудке', 'частые охоты', 'большое распятие'],
  yurei: ['полностью закрывает дверь', 'щелкнула дверь', 'не выходит из комнаты после благовония'],
  oni: ['много явлений', 'часто проявляется', 'не делает airball', 'очень заметный во время охоты'],
  yokai: ['агрится на разговоры', 'говорим и он охотится', 'плохо слышит далеко'],
  hantu: ['морозное дыхание во время охоты', 'быстрый в холоде', 'медленный в тепле', 'быстрый при выключенном щитке'],
  goryo: ['dots только на камере', 'не меняет комнату', 'видно только через камеру'],
  myling: ['тихие шаги', 'тихий во время охоты', 'громкий на параболе'],
  onryo: ['тушит свечи и охотится', 'боится огня', 'охота после потухшей свечи'],
  twins: ['двойное взаимодействие', 'две активности сразу', 'две разных скорости'],
  raiju: ['быстрый рядом с электроникой', 'глушит приборы', 'ускоряется от электроники'],
  obake: ['6 пальцев', 'шестипалый отпечаток', 'меняет модель при мерцании', 'отпечатки быстро исчезают'],
  mimic: ['копирует других', 'ведет себя как разные призраки', 'есть огоньки при странном поведении'],
  moroi: ['быстрее при низком рассудке', 'проклял через радио', 'благовоние действует дольше'],
  deogen: ['не получается спрятаться', 'всегда знает где игрок', 'тяжелое дыхание', 'быстрый вдали но медленный рядом'],
  thaye: ['со временем замедляется', 'стареет', 'в начале очень быстрый', 'не ускоряется по линии видимости'],
  daian: ['если идти рядом он быстрее', 'если стоять рядом он медленнее', 'реагирует на движение игрока'],
  gallu: ['ярость от соли', 'реагирует на защитные предметы', 'после соли становится злее', 'меняет состояние от благовония'],
  obambo: ['циклически меняет скорость', 'то спокойный то агрессивный', 'фазы скорости', 'ритм активности меняется'],
};

const EN_STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'from',
  'that',
  'this',
  'ghost',
  'player',
  'players',
  'hunt',
  'room',
]);

const FAST_PATH_ORDER = ['revenant', 'hantu', 'raiju', 'jinn', 'moroi', 'thaye', 'deogen'];

const FAST_PATH_NOTES: Partial<Record<string, string>> = {
  revenant: 'если без цели очень медленный, а после визуального контакта резко ускоряется',
  hantu: 'если быстро именно в холоде; при выключенном щитке видно морозное дыхание',
  raiju: 'если быстро рядом с включенной электроникой',
  jinn: 'если щиток включен и призрак быстро бежит на расстоянии',
  moroi: 'если скорость растет вместе с падением рассудка',
  thaye: 'если в начале контракта очень быстрый, а потом заметно стареет и слабеет',
  deogen: 'если очень быстрый вдали, но почти ползет рядом с игроком, иногда около 0.6 м/с',
};

const SLOW_PATH_ORDER = ['deogen', 'revenant', 'thaye', 'daian', 'gallu', 'obambo'];

const STOP_WORDS = new Set([
  'и',
  'в',
  'на',
  'с',
  'по',
  'но',
  'а',
  'он',
  'она',
  'они',
  'это',
  'очень',
  'призрак',
  'был',
  'была',
  'были',
  'есть',
  'как',
  'или',
  'то',
  'же',
]);

const CLOUD_ANALYSIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    primaryGhostId: {
      type: 'string',
      description: 'ID of the most likely ghost from the candidate list.',
    },
    confidence: {
      type: 'number',
      description: 'Confidence from 0 to 100.',
    },
    reasoning: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Short reasons in Russian.',
    },
    checks: {
      type: 'array',
      items: {
        type: 'string',
      },
      description: 'Follow-up checks in Russian.',
    },
    alternatives: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          ghostId: {
            type: 'string',
          },
          reason: {
            type: 'string',
          },
        },
        required: ['ghostId', 'reason'],
      },
    },
  },
  required: ['primaryGhostId', 'confidence', 'reasoning', 'checks', 'alternatives'],
} as const;

let geminiClientCache: {
  apiKey: string;
  client: GoogleGenAI;
} | null = null;

const ghostBehaviorTextCache = new Map<string, string[]>();
const ghostBehaviorTokenCache = new Map<string, Set<string>>();
const ghostReferenceTermCache = new Map<string, string[]>();

function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9.,%/+\s-]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenizeMeaningfulText(input: string): string[] {
  return normalizeText(input)
    .split(' ')
    .map((token) => token.trim())
    .filter(
      (token) =>
        token.length > 2 &&
        !STOP_WORDS.has(token) &&
        !EN_STOP_WORDS.has(token) &&
        !/^\d+$/.test(token),
    );
}

function getGhostBehaviorTexts(ghost: Ghost): string[] {
  const cached = ghostBehaviorTextCache.get(ghost.id);
  if (cached) {
    return cached;
  }

  const texts = [
    ghost.description,
    ghost.strength,
    ghost.weakness,
    ...(ghost.behaviorFacts ?? []),
    ...ghost.abilities,
    ...(ghost.hiddenFacts ?? []),
    ...(ghost.strategies ?? []),
    ...(GHOST_BEHAVIOR_ALIASES[ghost.id] ?? []),
    ...(ghost.speedStates?.map((state) => `${state.label} ${state.speed} м/с`) ?? []),
    ghost.speedRange ?? '',
    ghost.huntThresholdValue ?? '',
  ].filter(Boolean);

  ghostBehaviorTextCache.set(ghost.id, texts);
  return texts;
}

function getGhostBehaviorTokens(ghost: Ghost): Set<string> {
  const cached = ghostBehaviorTokenCache.get(ghost.id);
  if (cached) {
    return cached;
  }

  const tokens = new Set<string>();
  for (const text of getGhostBehaviorTexts(ghost)) {
    tokenizeMeaningfulText(text).forEach((token) => tokens.add(token));
  }

  ghostBehaviorTokenCache.set(ghost.id, tokens);
  return tokens;
}

function getGhostReferenceTerms(ghost: Ghost): string[] {
  const cached = ghostReferenceTermCache.get(ghost.id);
  if (cached) {
    return cached;
  }

  const terms = Array.from(
    new Set([
      ghost.id,
      ...tokenizeMeaningfulText(ghost.name).filter((token) => !['ghost', 'the'].includes(token)),
    ]),
  );

  ghostReferenceTermCache.set(ghost.id, terms);
  return terms;
}

function getEnvValue(name: string, viteName?: string): string {
  const processValue =
    typeof process !== 'undefined' &&
    process.env &&
    typeof process.env[name] === 'string'
      ? process.env[name]
      : '';

  if (processValue.trim()) {
    return processValue.trim();
  }

  const env =
    typeof import.meta !== 'undefined' &&
    (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env
      ? (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env
      : undefined;

  return (env?.[viteName ?? `VITE_${name}`] ?? env?.[name] ?? '').trim();
}

function parseCsvEnvValue(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getGeminiConfig(): GeminiConfig | null {
  const apiKey = getEnvValue('GEMINI_API_KEY') || getEnvValue('GOOGLE_API_KEY');

  if (!apiKey) {
    return null;
  }

  const fallbackModels = parseCsvEnvValue(getEnvValue('GEMINI_FALLBACK_MODELS'));

  return {
    apiKey,
    model: getEnvValue('GEMINI_MODEL') || DEFAULT_GEMINI_MODEL,
    fallbackModels:
      fallbackModels.length > 0 ? fallbackModels : [...DEFAULT_GEMINI_FALLBACK_MODELS],
  };
}

function getProxyOpenAIConfig(): ProxyOpenAIConfig | null {
  const apiKey =
    getEnvValue('PROXYAPI_OPENAI_API_KEY') ||
    getEnvValue('PROXYAPI_API_KEY') ||
    getEnvValue('OPENAI_PROXYAPI_API_KEY');

  if (!apiKey) {
    return null;
  }

  return {
    apiKey,
    model: getEnvValue('PROXYAPI_OPENAI_MODEL') || DEFAULT_PROXYAPI_OPENAI_MODEL,
    baseUrl:
      (getEnvValue('PROXYAPI_OPENAI_BASE_URL') || DEFAULT_PROXYAPI_OPENAI_BASE_URL).replace(
        /\/$/,
        '',
      ),
  };
}

function getGroqConfig(): GroqConfig | null {
  const apiKey = getEnvValue('GROQ_API_KEY');

  if (!apiKey) {
    return null;
  }

  return {
    apiKey,
    model: getEnvValue('GROQ_MODEL') || DEFAULT_GROQ_MODEL,
  };
}

function getGeminiClient(apiKey: string): GoogleGenAI {
  if (geminiClientCache?.apiKey === apiKey) {
    return geminiClientCache.client;
  }

  const client = new GoogleGenAI({ apiKey });
  geminiClientCache = {
    apiKey,
    client,
  };

  return client;
}

function classifyProviderError(error: unknown): ProviderErrorKind {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  if (
    message.includes('api key not valid') ||
    message.includes('invalid api key') ||
    message.includes('unknown api key') ||
    message.includes('unauthorized') ||
    message.includes('unauthenticated')
  ) {
    return 'invalid_key';
  }

  if (
    message.includes('permission denied') ||
    message.includes('forbidden') ||
    message.includes('403') ||
    message.includes('unsupported country') ||
    message.includes('user location is not supported')
  ) {
    return 'permission';
  }

  if (
    message.includes('quota') ||
    message.includes('429') ||
    message.includes('resource_exhausted') ||
    message.includes('rate limit') ||
    message.includes('payment required') ||
    message.includes('insufficient balance') ||
    message.includes('billing')
  ) {
    return 'quota';
  }

  if (
    message.includes('fetch failed') ||
    message.includes('network') ||
    message.includes('503') ||
    message.includes('deadline exceeded')
  ) {
    return 'network';
  }

  return 'unknown';
}

function extractJsonPayload(rawText: string): string {
  const fenced = rawText.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const objectStart = rawText.indexOf('{');
  const objectEnd = rawText.lastIndexOf('}');
  if (objectStart !== -1 && objectEnd !== -1 && objectEnd > objectStart) {
    return rawText.slice(objectStart, objectEnd + 1);
  }

  return rawText.trim();
}

function extractMessageText(content: unknown): string {
  if (typeof content === 'string') {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') {
          return part;
        }

        if (
          part &&
          typeof part === 'object' &&
          typeof (part as { text?: unknown }).text === 'string'
        ) {
          return (part as { text: string }).text;
        }

        return '';
      })
      .join('')
      .trim();
  }

  return '';
}

function getProviderSwitchNotice(
  kind: ProviderErrorKind,
  fromLabel: string,
  toLabel: string,
): string {
  if (kind === 'quota') {
    return `Лимит ${fromLabel} исчерпан. Переключился на ${toLabel}.`;
  }

  if (kind === 'missing_config') {
    return `${fromLabel} не настроен. Используется ${toLabel}.`;
  }

  return `${fromLabel} сейчас недоступен. Переключился на ${toLabel}.`;
}

function prependProviderSwitchNotice(
  result: string,
  switchState: { kind: ProviderErrorKind; fromLabel: string } | null,
  toLabel: string,
): string {
  if (!switchState) {
    return result;
  }

  return `${getProviderSwitchNotice(switchState.kind, switchState.fromLabel, toLabel)}\n\n${result}`;
}

function getProviderLocalFallbackReason(kind: ProviderErrorKind, label: string): string {
  switch (kind) {
    case 'missing_config':
      return `${label} не настроен. Использован локальный анализ без облачного запроса.`;
    case 'invalid_key':
      return `Ключ ${label} отклонён. Использован локальный анализ без облачного запроса.`;
    case 'quota':
      return `Лимит ${label} исчерпан. Использован локальный анализ без облачного запроса.`;
    case 'permission':
      return `У ${label} нет доступа к модели или запрос запрещён. Использован локальный анализ без облачного запроса.`;
    case 'network':
      return `Не удалось связаться с ${label}. Использован локальный анализ без облачного запроса.`;
    default:
      return `${label} временно недоступен. Использован локальный анализ без облачного запроса.`;
  }
}

function getCombinedProviderFallbackReason(
  primaryKind: ProviderErrorKind,
  primaryLabel: string,
  reserveKind: ProviderErrorKind,
  reserveLabel: string,
): string {
  const primaryLead =
    primaryKind === 'quota'
      ? `Лимит ${primaryLabel} исчерпан.`
      : primaryKind === 'missing_config'
        ? `${primaryLabel} не настроен.`
        : `${primaryLabel} сейчас недоступен.`;

  const reserveLead =
    reserveKind === 'quota'
      ? `${reserveLabel} тоже упёрся в лимиты.`
      : reserveKind === 'invalid_key'
        ? `Ключ ${reserveLabel} отклонён.`
        : `${reserveLabel} тоже недоступен.`;

  return `${primaryLead} ${reserveLead} Использован локальный анализ без облачного запроса.`;
}

function getCloudFallbackReason(kind: ProviderErrorKind, hasConfig: boolean): string {
  if (!hasConfig) {
    return 'Gemini API не настроен. Использован локальный анализ без облачного запроса.';
  }

  switch (kind) {
    case 'missing_config':
      return 'Не хватает конфигурации Gemini API. Использован локальный анализ без облачного запроса.';
    case 'invalid_key':
      return 'Ключ Gemini API отклонён. Использован локальный анализ без облачного запроса.';
    case 'quota':
      return 'Лимит Gemini API исчерпан. Для free tier это обычно значит, что сработал минутный или дневной лимит. Подождите около минуты и повторите запрос. Использован локальный анализ без облачного запроса.';
    case 'permission':
      return 'У проекта нет доступа к Gemini API, Google Search grounding или запрос идёт из неподдерживаемой страны/IP. Использован локальный анализ без облачного запроса.';
    case 'network':
      return 'Не удалось связаться с Gemini API. Использован локальный анализ без облачного запроса.';
    default:
      return 'Gemini API временно недоступен. Использован локальный анализ без облачного запроса.';
  }
}

function getGeminiFallbackSwitchNotice(fromModel: string, toModel: string): string {
  return `Лимит модели Gemini \`${fromModel}\` исчерпан. Переключился на резервную модель \`${toModel}\`.`;
}

function getGroqSwitchNotice(reason: ProviderErrorKind, model: string): string {
  if (reason === 'quota') {
    return `Лимит Gemini API исчерпан. Переключился на резервную модель Groq \`${model}\`.`;
  }

  if (reason === 'missing_config') {
    return `Gemini API не настроен. Используется резервная модель Groq \`${model}\`.`;
  }

  return `Gemini API сейчас недоступен. Переключился на резервную модель Groq \`${model}\`.`;
}

function getCombinedCloudFallbackReason(
  geminiKind: ProviderErrorKind,
  groqKind: ProviderErrorKind,
  groqModel: string,
): string {
  const geminiLead =
    geminiKind === 'quota'
      ? 'Лимит Gemini API исчерпан.'
      : geminiKind === 'missing_config'
        ? 'Gemini API не настроен.'
        : 'Gemini API сейчас недоступен.';

  const groqLead =
    groqKind === 'quota'
      ? `Резервная модель Groq \`${groqModel}\` тоже упёрлась в лимиты.`
      : groqKind === 'invalid_key'
        ? `Ключ Groq для резервной модели \`${groqModel}\` отклонён.`
        : `Резервная модель Groq \`${groqModel}\` тоже недоступна.`;

  return `${geminiLead} ${groqLead} Использован локальный анализ без облачного запроса.`;
}

function getGeminiFinishReason(response: unknown): string {
  const finishReason =
    response &&
    typeof response === 'object' &&
    Array.isArray((response as { candidates?: unknown[] }).candidates) &&
    (response as { candidates: Array<{ finishReason?: unknown }> }).candidates[0]
      ? (response as { candidates: Array<{ finishReason?: unknown }> }).candidates[0]
          .finishReason
      : undefined;

  return typeof finishReason === 'string' ? finishReason : 'UNKNOWN';
}

function getGeminiResponseText(response: unknown): string {
  if (
    response &&
    typeof response === 'object' &&
    'text' in response &&
    typeof (response as { text?: unknown }).text === 'string'
  ) {
    const text = (response as { text: string }).text.trim();
    if (text) {
      return text;
    }
  }

  if (
    response &&
    typeof response === 'object' &&
    Array.isArray((response as { candidates?: unknown[] }).candidates)
  ) {
    const candidate = (response as {
      candidates: Array<{ content?: { parts?: Array<{ text?: unknown }> } }>;
    }).candidates[0];
    const parts = candidate?.content?.parts ?? [];
    const text = parts
      .map((part) => (typeof part?.text === 'string' ? part.text : ''))
      .join('')
      .trim();

    if (text) {
      return text;
    }
  }

  return '';
}

function shouldRetryGeminiWithoutSearch(error: unknown): boolean {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  return (
    message.includes('too_many_tool_calls') ||
    message.includes('returned empty response') ||
    message.includes('truncated json') ||
    message.includes('unexpected end of json input')
  );
}

function extractNumericSpeed(normalized: string): number | null {
  const match = normalized.match(/(?:^|\s)(\d(?:[.,]\d+)?)\s*(?:м\/с|мс|m\/s)?(?:\s|$)/i);
  if (!match?.[1]) {
    return null;
  }

  const value = Number(match[1].replace(',', '.'));
  return Number.isFinite(value) ? value : null;
}

function detectEvidence(normalized: string): Evidence[] {
  return EVIDENCE_PATTERNS.filter((item) =>
    item.patterns.some((pattern) => normalized.includes(pattern)),
  ).map((item) => item.evidence);
}

function includesAnyPattern(normalized: string, patterns: string[]): boolean {
  return patterns.some((pattern) => normalized.includes(pattern));
}

function normalizedIncludesAll(normalized: string, patterns: string[]): boolean {
  return patterns.every((pattern) => normalized.includes(pattern));
}

function applyDerivedSignalHeuristics(normalized: string, flags: Set<SignalKey>) {
  if (flags.has('fast') && flags.has('slow')) {
    flags.add('changing_speed');
  }

  if (flags.has('close_range') && flags.has('slow')) {
    flags.add('changing_speed');
  }

  const mentionsSalt =
    flags.has('salt') ||
    includesAnyPattern(normalized, ['соль', 'соли', 'солян']);

  if (!mentionsSalt) {
    return;
  }

  if (
    includesAnyPattern(normalized, [
      'не ходит по соли',
      'не идет по соли',
      'не наступает в соль',
      'не наступает на соль',
      'обходит соль',
      'игнорирует соль',
      'соль не сработала',
      'соль не срабатывает',
      'соль осталась целой',
      'не трогает соль',
    ])
  ) {
    flags.add('salt');
    flags.add('salt_ignored');
  }

  if (
    includesAnyPattern(normalized, [
      'нет следов в соли',
      'следов в соли нет',
      'не видно следов в соли',
      'соль сработала без следов',
      'не оставляет следов в соли',
    ])
  ) {
    flags.add('salt');
    flags.add('no_footsteps');
  }
}

function detectFlags(normalized: string, numericSpeed: number | null): Set<SignalKey> {
  const flags = new Set<SignalKey>();

  for (const item of SIGNAL_PATTERNS) {
    if (item.patterns.some((pattern) => normalized.includes(pattern))) {
      flags.add(item.key);
    }
  }

  if (numericSpeed !== null) {
    if (numericSpeed > 1.71) {
      flags.add('fast');
    }
    if (numericSpeed < 1.69) {
      flags.add('slow');
    }
    if (numericSpeed <= DEOGEN_NEAR_PLAYER_SPEED_THRESHOLD) {
      flags.add('very_slow');
    }
  }

  applyDerivedSignalHeuristics(normalized, flags);
  return flags;
}

function getMeaningfulTokenCount(tokens: string[]): number {
  return tokens.filter((token) => token.length > 2 && !STOP_WORDS.has(token)).length;
}

function parseObservations(raw: string): Observations {
  const normalized = normalizeText(raw);
  const numericSpeed = extractNumericSpeed(normalized);
  const tokens = normalized.split(' ').filter(Boolean);
  const evidence = detectEvidence(normalized);
  const flags = detectFlags(normalized, numericSpeed);

  return {
    raw,
    normalized,
    tokens,
    evidence,
    flags,
    numericSpeed,
    meaningfulTokenCount: getMeaningfulTokenCount(tokens),
  };
}

function getMaxGhostSpeed(ghost: Ghost): number {
  const stateMax = ghost.speedStates?.length
    ? Math.max(...ghost.speedStates.map((item) => item.speed))
    : 0;

  if (stateMax > 0) {
    return stateMax;
  }

  if (ghost.speed.includes('Fast')) {
    return 2.5;
  }

  if (ghost.speed.includes('Normal')) {
    return 1.7;
  }

  return 1.0;
}

function getMinGhostSpeed(ghost: Ghost): number {
  const stateMin = ghost.speedStates?.length
    ? Math.min(...ghost.speedStates.map((item) => item.speed))
    : Number.POSITIVE_INFINITY;

  if (Number.isFinite(stateMin)) {
    return stateMin;
  }

  if (ghost.speed.includes('Slow')) {
    return 1.0;
  }

  if (ghost.speed.includes('Normal')) {
    return 1.7;
  }

  return 1.0;
}

function isFastGhost(ghost: Ghost): boolean {
  return getMaxGhostSpeed(ghost) > 1.71 || ghost.speed.includes('Fast');
}

function isSlowGhost(ghost: Ghost): boolean {
  return getMinGhostSpeed(ghost) < 1.69 || ghost.speed.includes('Slow');
}

function hasFlag(observations: Observations, key: SignalKey): boolean {
  return observations.flags.has(key);
}

function addReason(reasons: string[], reason: string) {
  if (!reasons.includes(reason)) {
    reasons.push(reason);
  }
}

function getObservationBehaviorTokens(observations: Observations): string[] {
  return observations.tokens.filter(
    (token) =>
      token.length > 2 &&
      !STOP_WORDS.has(token) &&
      !EN_STOP_WORDS.has(token) &&
      !/^\d+$/.test(token),
  );
}

function getBehaviorMatch(
  ghost: Ghost,
  observations: Observations,
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  const normalized = observations.normalized;
  const observationTokens = getObservationBehaviorTokens(observations);

  if (observationTokens.length === 0) {
    return { score: 0, reasons };
  }

  let score = 0;
  const aliasMatches = (GHOST_BEHAVIOR_ALIASES[ghost.id] ?? []).filter((alias) =>
    normalized.includes(normalizeText(alias)),
  );

  if (aliasMatches.length > 0) {
    score += Math.min(12, aliasMatches.length * 4);
    aliasMatches.slice(0, 2).forEach((alias) => {
      addReason(reasons, `совпадает уникальный поведенческий паттерн: ${alias}`);
    });
  }

  const ghostTokens = getGhostBehaviorTokens(ghost);
  const sharedTokens = observationTokens.filter((token) => ghostTokens.has(token));
  const uniqueSharedTokens = Array.from(new Set(sharedTokens));

  if (uniqueSharedTokens.length >= 2) {
    score += Math.min(8, uniqueSharedTokens.length * 2);
  } else if (uniqueSharedTokens.length === 1) {
    score += 1;
  }

  const bestTextMatch = getGhostBehaviorTexts(ghost)
    .map((text) => {
      const textTokens = new Set(tokenizeMeaningfulText(text));
      const matched = observationTokens.filter((token) => textTokens.has(token));
      return {
        text,
        matched: Array.from(new Set(matched)),
      };
    })
    .sort((left, right) => right.matched.length - left.matched.length)[0];

  if (bestTextMatch && bestTextMatch.matched.length >= 2) {
    score += Math.min(6, bestTextMatch.matched.length * 2);
    addReason(reasons, `по поведению ближе всего: ${bestTextMatch.text}`);
  }

  if (observations.evidence.length === 0 && score > 0) {
    score += 2;
  }

  return { score, reasons };
}

function hasStrongDeogenPattern(observations: Observations): boolean {
  const slowsNearPlayer =
    hasFlag(observations, 'slow') &&
    (hasFlag(observations, 'close_range') || hasFlag(observations, 'line_of_sight'));

  const speedShift =
    hasFlag(observations, 'fast') ||
    hasFlag(observations, 'distance') ||
    hasFlag(observations, 'changing_speed');

  const crawlLikeSpeed =
    hasFlag(observations, 'very_slow') ||
    (observations.numericSpeed !== null &&
      observations.numericSpeed <= DEOGEN_NEAR_PLAYER_SPEED_THRESHOLD);

  return slowsNearPlayer && (speedShift || crawlLikeSpeed);
}

function scoreGhost(ghost: Ghost, observations: Observations): RankedGhost {
  const reasons: string[] = [];
  let score = 0;
  const strongDeogenPattern = hasStrongDeogenPattern(observations);
  const behaviorMatch = getBehaviorMatch(ghost, observations);

  for (const evidence of observations.evidence) {
    if (ghost.evidence.includes(evidence)) {
      score += 3;
      addReason(reasons, `совпадает улика: ${evidence}`);
    } else {
      score -= 2;
    }
  }

  score += behaviorMatch.score;
  behaviorMatch.reasons.forEach((reason) => addReason(reasons, reason));

  if (hasFlag(observations, 'fast')) {
    if (isFastGhost(ghost)) {
      score += 3;
      addReason(reasons, 'может разгоняться выше базовой скорости 1.7 м/с');
    } else {
      score -= 3;
    }
  }

  if (hasFlag(observations, 'slow')) {
    if (isSlowGhost(ghost)) {
      score += 3;
      addReason(reasons, 'может быть заметно медленнее базовой скорости 1.7 м/с');
    } else {
      score -= 3;
    }
  }

  if (hasFlag(observations, 'close_range') && ghost.id === 'deogen') {
    score += 5;
    addReason(reasons, 'ключевая особенность проявляется именно при сближении с игроком');
  }

  if (hasFlag(observations, 'very_slow') && ghost.id === 'deogen') {
    score += 4;
    addReason(reasons, 'может почти ползти рядом с игроком');
  }

  if (hasFlag(observations, 'cold')) {
    if (ghost.id === 'hantu') {
      score += 7;
      addReason(reasons, 'ускоряется именно в холоде');
    } else if (ghost.evidence.includes('Freezing Temperatures')) {
      score += 1;
    }
  }

  if (hasFlag(observations, 'breaker_off')) {
    if (ghost.id === 'hantu') {
      score += 4;
      addReason(reasons, 'его сильная сторона проявляется при выключенном щитке');
    }
    if (ghost.id === 'jinn') {
      score -= 4;
    }
  }

  if (hasFlag(observations, 'breaker_on') && hasFlag(observations, 'distance') && ghost.id === 'jinn') {
    score += 8;
    addReason(reasons, 'быстро бежит на расстоянии при включенном щитке');
  }

  if (hasFlag(observations, 'electronics') && ghost.id === 'raiju') {
    score += 8;
    addReason(reasons, 'ускоряется рядом с электроникой');
  }

  if (hasFlag(observations, 'salt_ignored')) {
    if (ghost.id === 'wraith') {
      score += 14;
      addReason(reasons, 'игнорирует соль и не наступает в неё');
    }

    if (ghost.id === 'gallu') {
      score += 4;
      addReason(reasons, 'может игнорировать соль в яростном состоянии, но это менее стабильно');
    }
  }

  if (hasFlag(observations, 'salt') && hasFlag(observations, 'no_footsteps') && ghost.id === 'wraith') {
    score += 10;
    addReason(reasons, 'реагирует на соль без следов ног');
  }

  if (hasFlag(observations, 'dots_camera') && ghost.id === 'goryo') {
    score += 10;
    addReason(reasons, 'D.O.T.S. видно через камеру, а не глазами');
  }

  if (hasFlag(observations, 'heavy_breath') && ghost.id === 'deogen') {
    score += 10;
    addReason(reasons, 'тяжелое дыхание у радиоприемника — уникальный признак');
  }

  if (hasFlag(observations, 'photo_disappear') && ghost.id === 'phantom') {
    score += 8;
    addReason(reasons, 'исчезает на фотографии');
  }

  if (hasFlag(observations, 'many_objects') && ghost.id === 'poltergeist') {
    score += 8;
    addReason(reasons, 'очень активно работает с предметами');
  }

  if (hasFlag(observations, 'double_interaction') && ghost.id === 'twins') {
    score += 8;
    addReason(reasons, 'двойные взаимодействия характерны для Близнецов');
  }

  if (hasFlag(observations, 'single_target') && ghost.id === 'banshee') {
    score += 8;
    addReason(reasons, 'похоже на охоту только по одной цели');
  }

  if (hasFlag(observations, 'talking') && ghost.id === 'yokai') {
    score += 5;
    addReason(reasons, 'сильно реагирует на разговоры игроков');
  }

  if (hasFlag(observations, 'dark') && ghost.id === 'mare') {
    score += 6;
    addReason(reasons, 'в темноте становится опаснее');
  }

  if (hasFlag(observations, 'flame') && ghost.id === 'onryo') {
    score += 7;
    addReason(reasons, 'свечи и пламя важны именно для Онрё');
  }

  if (hasFlag(observations, 'smudge_180') && ghost.id === 'spirit') {
    score += 9;
    addReason(reasons, 'благовоние с паузой 180 секунд указывает на Духа');
  }

  if (hasFlag(observations, 'early_hunt')) {
    if (ghost.id === 'demon') {
      score += 8;
      addReason(reasons, 'очень ранняя охота хорошо совпадает с Демоном');
    }
    if (ghost.id === 'thaye') {
      score += 5;
      addReason(reasons, 'в начале контракта очень агрессивен');
    }
  }

  if (hasFlag(observations, 'line_of_sight') && hasFlag(observations, 'fast') && ghost.id === 'revenant') {
    score += 7;
    addReason(reasons, 'резко ускоряется после того, как увидит игрока');
  }

  if (hasFlag(observations, 'no_line_of_sight') && hasFlag(observations, 'slow') && ghost.id === 'revenant') {
    score += 8;
    addReason(reasons, 'без прямой видимости становится очень медленным');
  }

  if (hasFlag(observations, 'changing_speed')) {
    if (ghost.id === 'thaye') {
      score += 5;
      addReason(reasons, 'со временем заметно стареет и меняет скорость');
    }
    if (ghost.id === 'obambo') {
      score += 5;
      addReason(reasons, 'его скорость циклически меняется по фазам');
    }
  }

  if (
    observations.evidence.length === 0 &&
    normalizedIncludesAll(observations.normalized, ['со временем', 'замедл']) &&
    ghost.id === 'thaye'
  ) {
    score += 10;
    addReason(reasons, 'формулировка “замедляется со временем” почти напрямую указывает на Тайэ');
  }

  if (
    observations.evidence.length === 0 &&
    normalizedIncludesAll(observations.normalized, ['в начале', 'быстр']) &&
    ghost.id === 'thaye'
  ) {
    score += 8;
    addReason(reasons, 'очень быстрый именно в начале контракта — сильный признак молодого Тайэ');
  }

  if (
    hasFlag(observations, 'fast') &&
    hasFlag(observations, 'cold') &&
    hasFlag(observations, 'breaker_off') &&
    ghost.id === 'hantu'
  ) {
    score += 12;
    addReason(reasons, 'комбинация “быстрый + холод + выключенный щиток” почти точно указывает на Ханту');
  }

  if (
    hasFlag(observations, 'fast') &&
    hasFlag(observations, 'electronics') &&
    ghost.id === 'raiju'
  ) {
    score += 10;
    addReason(reasons, 'быстрая охота рядом с электроникой — сильный признак Райдзю');
  }

  if (
    hasFlag(observations, 'fast') &&
    hasFlag(observations, 'distance') &&
    hasFlag(observations, 'breaker_on') &&
    ghost.id === 'jinn'
  ) {
    score += 10;
    addReason(reasons, 'ускорение на расстоянии при включенном щитке указывает на Джинна');
  }

  if (
    hasFlag(observations, 'slow') &&
    (hasFlag(observations, 'line_of_sight') || hasFlag(observations, 'close_range')) &&
    ghost.id === 'deogen'
  ) {
    score += 8;
    addReason(reasons, 'рядом с игроком Деоген резко замедляется');
  }

  if (strongDeogenPattern) {
    if (ghost.id === 'deogen') {
      score += 16;
      addReason(reasons, 'связка “быстрый вдали, но почти останавливается рядом с игроком” почти напрямую указывает на Деогена');
    }

    if (ghost.id === 'revenant') {
      score -= 8;
    }

    if (['hantu', 'jinn', 'raiju', 'moroi'].includes(ghost.id)) {
      score -= 4;
    }
  }

  if (
    observations.numericSpeed !== null &&
    observations.numericSpeed <= DEOGEN_NEAR_PLAYER_SPEED_THRESHOLD &&
    hasFlag(observations, 'close_range') &&
    ghost.id === 'deogen'
  ) {
    score += 10;
    addReason(
      reasons,
      `скорость около ${observations.numericSpeed.toFixed(1)} м/с рядом с игроком почти напрямую указывает на Деогена`,
    );
  }

  if (
    observations.numericSpeed !== null &&
    observations.numericSpeed > 2.6 &&
    ['revenant', 'hantu', 'thaye', 'deogen'].includes(ghost.id)
  ) {
    score += 3;
    addReason(reasons, `отмечена высокая скорость около ${observations.numericSpeed.toFixed(1)} м/с`);
  }

  return { ghost, score, reasons };
}

function buildBehaviorOnlyChecks(ghost: Ghost): string[] {
  const map: Partial<Record<string, string[]>> = {
    spirit: [
      'Сожгите благовоние рядом с призраком и засеките точную паузу до новой охоты.',
      'Если после благовония охоты нет около 180 секунд, это сильный аргумент в пользу Духа.',
    ],
    wraith: [
      'Насыпьте соль в узком проходе и проверьте, наступает ли призрак в неё вообще.',
      'Если соль срабатывает без следов или стабильно игнорируется, это сильный признак Миража.',
    ],
    phantom: [
      'Сфотографируйте призрака во время явления и посмотрите, исчезает ли модель на фото.',
      'Во время охоты сравните частоту мерцания: у Фантома он заметно реже виден.',
    ],
    poltergeist: [
      'Сложите много предметов в одну точку и посмотрите, устроит ли призрак полтер-взрыв.',
      'Во время охоты следите, бросает ли он предметы почти непрерывно.',
    ],
    banshee: [
      'Сравните, преследует ли он стабильно одного и того же игрока, игнорируя остальных.',
      'Проверьте направленный микрофон на характерный крик Банши.',
    ],
    jinn: [
      'Сравните охоту при включенном и выключенном щитке.',
      'Если при включенном щитке он заметно быстрее именно на дистанции, это сильный признак Джинна.',
    ],
    mare: [
      'Оставьте свет включенным и проверьте, не выключает ли призрак его почти сразу.',
      'Если в темноте охоты начинаются заметно раньше, а свет он не включает никогда, это ближе к Маре.',
    ],
    revenant: [
      'Сравните скорость без прямой видимости и после того, как призрак увидит игрока.',
      'Если без цели он почти ползет, а при визуальном контакте резко срывается, это Ревенант.',
    ],
    shade: [
      'Сравните активность, когда игроки в комнате, и когда комната пустая.',
      'Если при игроках призрак становится заметно тише и пассивнее, это сильный аргумент в пользу Тени.',
    ],
    demon: [
      'Смотрите, не начинается ли охота слишком рано, когда рассудок еще высокий.',
      'Проверьте радиус распятия: у Демона оно работает дальше обычного.',
    ],
    yurei: [
      'Следите за полным закрытием двери с характерным щелчком без других причин.',
      'После благовония проверьте, выходит ли призрак из своей комнаты в течение 90 секунд.',
    ],
    oni: [
      'Посчитайте, насколько часто происходят явления: у Они их обычно больше.',
      'Если вообще не было airball-событий, это сильный довод в пользу Они.',
    ],
    yokai: [
      'Поговорите рядом с призраком и проверьте, растет ли шанс ранней охоты.',
      'Во время охоты проверьте, слышит ли он голос и технику только на близкой дистанции.',
    ],
    hantu: [
      'Сравните скорость в холодных и теплых зонах карты.',
      'При выключенном щитке проверьте морозное дыхание во время охоты.',
    ],
    goryo: [
      'Смотрите D.O.T.S. через видеокамеру, а не только глазами.',
      'Если призрак почти не меняет комнату и D.O.T.S. виден только на камере, это Горё.',
    ],
    myling: [
      'Сравните дальность слышимости шагов и дальность сбоев электроники во время охоты.',
      'Если шаги слышны поздно, а паранормальные звуки в целом частые, это ближе к Майлингу.',
    ],
    onryo: [
      'Поставьте свечи и посмотрите, не начинается ли охота после нескольких тушений.',
      'Если огонь сильно влияет на поведение призрака, это сильный довод в пользу Онрё.',
    ],
    twins: [
      'Ищите двойные взаимодействия в разных местах почти одновременно.',
      'Сравните несколько охот: у Близнецов часто ощущаются две разные базовые скорости.',
    ],
    raiju: [
      'Уберите или включите электронику и сравните скорость рядом с приборами и без них.',
      'Если рядом с техникой он резко быстрее и сильнее глушит устройства, это Райдзю.',
    ],
    obake: [
      'Ищите шестипалые отпечатки и нестандартные следы на взаимодействиях.',
      'Во время охоты следите, меняется ли модель призрака в одном цикле мерцания.',
    ],
    mimic: [
      'Проверьте, не меняется ли поведение между охотами слишком резко, будто копируются разные типы.',
      'Если при no-evidence всё равно стабильно видны огоньки, это очень сильный признак Мимика.',
    ],
    moroi: [
      'Сравните скорость при высоком и низком рассудке команды.',
      'Если после ответа через радио рассудок начинает падать заметно быстрее, это похоже на Мороя.',
    ],
    deogen: [
      'Не прячьтесь: пройдите мимо него в открытом коридоре и сравните скорость вдали и рядом.',
      'Если при сближении он падает примерно до 0.4-0.9 м/с и всё равно знает, где вы, это почти прямой признак Деогена.',
    ],
    thaye: [
      'Сравните первые охоты и поздние: у Тайэ скорость и агрессия должны заметно падать со временем.',
      'Проверьте, разгоняется ли он по прямой видимости: у Тайэ такого обычного LOS-ускорения нет.',
    ],
    daian: [
      'Во время охоты сравните скорость, когда игрок рядом двигается, и когда рядом стоит на месте.',
      'Если движение игрока рядом ускоряет призрака, а неподвижность замедляет, это Дайан.',
    ],
    gallu: [
      'Проверьте реакцию на соль, благовония и другое защитное снаряжение.',
      'Если после соли или защиты призрак явно меняет состояние и становится агрессивнее, это ближе к Галлу.',
    ],
    obambo: [
      'Сравните охоты в разное время матча: не уходит ли призрак в циклы спокойной и агрессивной фаз.',
      'Если скорость и активность меняются фазами, а не из-за расстояния, это сильнее похоже на Обамбо.',
    ],
  };

  const custom = map[ghost.id];
  if (custom) {
    return custom;
  }

  return [
    ...(ghost.behaviorFacts ?? []).slice(0, 2).map((fact) => `Проверьте, повторяется ли это поведение: ${fact}`),
    ...(ghost.strategies ?? []).slice(0, 2),
  ].slice(0, 4);
}

function buildGhostChecks(ghost: Ghost, options?: { behaviorOnly?: boolean }): string[] {
  if (options?.behaviorOnly) {
    return buildBehaviorOnlyChecks(ghost);
  }

  const map: Partial<Record<string, string[]>> = {
    hantu: [
      'Проверьте, быстрее ли он именно в холодных комнатах.',
      'Посмотрите, видно ли морозное дыхание во время охоты при выключенном щитке.',
      'Сверьте улики: отпечатки, огонек, минусовая температура.',
    ],
    jinn: [
      'Сравните скорость при включенном и выключенном щитке.',
      'Проверьте, разгоняется ли он именно на расстоянии.',
      'Сверьте улики: ЭМП 5, отпечатки, минусовая температура.',
    ],
    raiju: [
      'Уберите электронику и сравните скорость рядом с приборами и без них.',
      'Проверьте, усиливаются ли помехи рядом с устройствами.',
      'Сверьте улики: ЭМП 5, огонек, D.O.T.S.',
    ],
    revenant: [
      'Сравните скорость без прямой видимости и после того, как призрак увидит игрока.',
      'Если без цели он почти ползет, а потом резко ускоряется, это сильный признак Ревенанта.',
      'Сверьте улики: огонек, записи в блокноте, минусовая температура.',
    ],
    deogen: [
      'Не пытайтесь прятаться: Деоген знает, где игрок, и лучше всего проверяется в открытом проходе.',
      'Если вдали он быстрый, а вблизи игрока падает примерно до 0.4-0.9 м/с и почти ползет, это почти прямой признак Деогена.',
      'Проверьте радиоприемник вплотную на тяжелое дыхание и сравните скорость вдали и рядом.',
    ],
    wraith: [
      'Рассыпьте соль в узком проходе и проверьте, наступает ли призрак в неё вообще.',
      'Если соль стабильно игнорируется или срабатывает без следов, это сильный аргумент в пользу Миража.',
      'Если сомневаетесь между Миражом и Галлу, перепроверьте, не было ли у Галлу яростного состояния.',
      'Сверьте улики: ЭМП 5, радиоприемник, D.O.T.S.',
    ],
    goryo: [
      'Смотрите D.O.T.S. через камеру, а не только глазами.',
      'Если силуэт виден только на камере, это сильный аргумент в пользу Горё.',
      'Сверьте улики: ЭМП 5, отпечатки, D.O.T.S.',
    ],
    spirit: [
      'Сожгите благовоние рядом с призраком и засеките паузу до новой охоты.',
      'Если пауза около 180 секунд, это сильный аргумент в пользу Духа.',
      'Сверьте улики: ЭМП 5, радиоприемник, записи в блокноте.',
    ],
  };

  return (
    map[ghost.id] ?? [
      `Проверьте улики: ${ghost.evidence.join(', ')}.`,
      `Сверьте сильную сторону: ${ghost.strength}`,
      `Сверьте слабость: ${ghost.weakness}`,
    ]
  );
}

function analyzeLocally(observations: Observations): LocalAnalysis {
  const behaviorOnly = observations.evidence.length === 0;
  const ranked = GHOSTS.map((ghost) => scoreGhost(ghost, observations)).sort(
    (left, right) => right.score - left.score,
  );

  const best = ranked[0];
  const alternatives = ranked.slice(1).filter((item) => item.score > 0).slice(0, 4);
  const gap = best.score - (ranked[1]?.score ?? 0);
  const signalStrength =
    observations.evidence.length + Array.from(observations.flags).filter((item) => item !== 'fast' && item !== 'slow').length;

  let confidence = Math.round(34 + best.score * 5 + gap * 4 + signalStrength * 3);
  if (best.score >= 12 && gap >= 4) {
    confidence = 94 + Math.min(gap, 4);
  }
  if (behaviorOnly && best.score >= 10 && gap >= 3) {
    confidence = Math.max(confidence, 88 + Math.min(gap, 6));
  }
  if (best.ghost.id === 'deogen' && hasStrongDeogenPattern(observations)) {
    confidence = Math.max(confidence, 96);
  }
  confidence = Math.max(28, Math.min(97, confidence));

  const recognized = [
    ...observations.evidence,
    ...Array.from(observations.flags).map((flag) => OBSERVATION_LABELS[flag]),
  ].slice(0, 6);

  return {
    confidence,
    ambiguous: confidence < SINGLE_RESULT_CONFIDENCE_THRESHOLD,
    best,
    alternatives,
    ranked,
    checks: buildGhostChecks(best.ghost, { behaviorOnly }),
    recognized,
  };
}

function isFastOnlyQuery(observations: Observations): boolean {
  return (
    hasFlag(observations, 'fast') &&
    observations.evidence.length === 0 &&
    Array.from(observations.flags).every((flag) => flag === 'fast') &&
    observations.meaningfulTokenCount <= 2
  );
}

function isSlowOnlyQuery(observations: Observations): boolean {
  return (
    hasFlag(observations, 'slow') &&
    observations.evidence.length === 0 &&
    Array.from(observations.flags).every((flag) => flag === 'slow') &&
    observations.meaningfulTokenCount <= 2
  );
}

function isSingleEvidenceQuery(observations: Observations): boolean {
  return observations.evidence.length === 1 && observations.flags.size === 0 && observations.meaningfulTokenCount <= 3;
}

function formatFastOnlyAnalysis(): string {
  const candidates = FAST_PATH_ORDER.map((id) => GHOSTS.find((ghost) => ghost.id === id)).filter(
    (ghost): ghost is Ghost => Boolean(ghost),
  );

  return [
    'Локальный быстрый анализ без обращения к облачной модели.',
    '',
    'Одного признака недостаточно для точного вывода.',
    '`Быстрый` в Phasmophobia обычно значит скорость выше 1.7 м/с во время охоты.',
    '',
    'Под это чаще всего подходят:',
    ...candidates.map((ghost) => `- ${ghost.name}: ${FAST_PATH_NOTES[ghost.id]}.`),
    '',
    'Что уточнить дальше:',
    '1. Быстрый всегда или только в холоде / рядом с электроникой / при прямой видимости.',
    '2. Был ли включен или выключен щиток.',
    '3. Видно ли морозное дыхание, меняется ли скорость со временем, есть ли электроника рядом.',
  ].join('\n');
}

function formatSlowOnlyAnalysis(): string {
  const candidates = SLOW_PATH_ORDER.map((id) => GHOSTS.find((ghost) => ghost.id === id)).filter(
    (ghost): ghost is Ghost => Boolean(ghost),
  );

  return [
    'Локальный быстрый анализ без обращения к облачной модели.',
    '',
    'Одного признака недостаточно для точного вывода.',
    '`Медленный` в Phasmophobia обычно значит скорость ниже базовой 1.7 м/с хотя бы в одной фазе охоты.',
    '',
    'Под это чаще всего подходят:',
    ...candidates.map((ghost) => `- ${ghost.name}: ${buildGhostChecks(ghost)[0]}`),
    '',
    'Что уточнить дальше:',
    '1. Медленный всегда или только рядом с игроком / без прямой видимости / со временем.',
    '2. Меняется ли скорость после контакта глазами.',
    '3. Есть ли дополнительные признаки: холод, электроника, тяжелое дыхание, старение.',
  ].join('\n');
}

function formatSingleEvidenceAnalysis(evidence: Evidence): string {
  const candidates = GHOSTS.filter((ghost) => ghost.evidence.includes(evidence)).slice(0, 8);

  return [
    'Локальный быстрый анализ без обращения к облачной модели.',
    '',
    `Сейчас указана только одна улика: ${evidence}. Этого недостаточно для точного вывода.`,
    '',
    'Подходящие призраки:',
    ...candidates.map((ghost) => `- ${ghost.name}`),
    '',
    'Что уточнить дальше:',
    '1. Добавьте еще одну улику или особый поведенческий признак.',
    '2. Уточните скорость во время охоты, работу со светом, электроникой или солью.',
  ].join('\n');
}

function formatLocalAnalysis(
  analysis: LocalAnalysis,
  options?: {
    fallbackReason?: string;
    localOnly?: boolean;
  },
): string {
  const lines: string[] = [];

  if (options?.fallbackReason) {
    lines.push(options.fallbackReason);
    lines.push('');
  } else if (options?.localOnly) {
    lines.push('Локальный анализ без обращения к облачной модели.');
    lines.push('');
  }

  if (analysis.ambiguous) {
    lines.push('Уверенности недостаточно для одного точного вывода.');
    lines.push(`Текущая уверенность: ${analysis.confidence}%`);
    lines.push('');

    if (analysis.recognized.length > 0) {
      lines.push('Что распознано в описании:');
      for (const item of analysis.recognized) {
        lines.push(`- ${item}`);
      }
      lines.push('');
    }

    lines.push('Вероятные варианты:');
    lines.push(`- ${analysis.best.ghost.name}: ${analysis.best.reasons[0] ?? 'совпадает лучше остальных'}.`);
    for (const alternative of analysis.alternatives) {
      lines.push(`- ${alternative.ghost.name}: ${alternative.reasons[0] ?? 'частично совпадает по поведению'}.`);
    }
    lines.push('');
    lines.push('Что уточнить дальше:');
    analysis.checks.slice(0, 4).forEach((check, index) => {
      lines.push(`${index + 1}. ${check}`);
    });

    return lines.join('\n');
  }

  lines.push(`Основной вариант: ${analysis.best.ghost.name}`);
  lines.push(`Уверенность: ${analysis.confidence}%`);
  lines.push('');
  lines.push('Почему:');
  analysis.best.reasons.slice(0, 4).forEach((reason) => {
    lines.push(`- ${reason}`);
  });
  lines.push('');
  lines.push('Что проверить дальше:');
  analysis.checks.slice(0, 4).forEach((check, index) => {
    lines.push(`${index + 1}. ${check}`);
  });

  if (analysis.alternatives.length > 0) {
    lines.push('');
    lines.push('Альтернативы:');
    analysis.alternatives.slice(0, 3).forEach((alternative) => {
      lines.push(`- ${alternative.ghost.name}: ${alternative.reasons[0] ?? 'частично совпадает'}.`);
    });
  }

  return lines.join('\n');
}

function formatCloudAnalysis(result: CloudAnalysis): string {
  const primaryGhost =
    GHOSTS.find((ghost) => ghost.id === result.primaryGhostId) ??
    (result.alternatives
      ? GHOSTS.find((ghost) =>
          result.alternatives?.some((alternative) => alternative.ghostId === ghost.id),
        )
      : undefined);

  if (!primaryGhost) {
    throw new Error(`Unknown ghost id: ${result.primaryGhostId}`);
  }

  const confidence = Math.max(0, Math.min(100, Math.round(result.confidence)));
  const alternatives = (result.alternatives ?? [])
    .map((item) => {
      const ghost = GHOSTS.find((candidate) => candidate.id === item.ghostId);
      return ghost ? `${ghost.name}: ${item.reason}` : null;
    })
    .filter((item): item is string => Boolean(item))
    .slice(0, 3);

  if (confidence < SINGLE_RESULT_CONFIDENCE_THRESHOLD) {
    return [
      'Уверенности недостаточно для одного точного вывода.',
      `Текущая уверенность: ${confidence}%`,
      '',
      'Вероятные варианты:',
      `- ${primaryGhost.name}: ${result.reasoning[0] ?? 'лучше всего совпадает по наблюдениям'}.`,
      ...alternatives.map((item) => `- ${item}`),
      '',
      'Что уточнить дальше:',
      ...result.checks.slice(0, 4).map((item, index) => `${index + 1}. ${item}`),
    ].join('\n');
  }

  return [
    `Основной вариант: ${primaryGhost.name}`,
    `Уверенность: ${confidence}%`,
    '',
    'Почему:',
    ...result.reasoning.slice(0, 4).map((item) => `- ${item}`),
    '',
    'Что проверить дальше:',
    ...result.checks.slice(0, 4).map((item, index) => `${index + 1}. ${item}`),
    ...(alternatives.length ? ['', 'Альтернативы:', ...alternatives.map((item) => `- ${item}`)] : []),
  ].join('\n');
}

function shouldUseCloud(observations: Observations, analysis: LocalAnalysis): boolean {
  if (isFastOnlyQuery(observations) || isSlowOnlyQuery(observations) || isSingleEvidenceQuery(observations)) {
    return false;
  }

  const strongSignals =
    observations.evidence.length +
    Array.from(observations.flags).filter((flag) => flag !== 'fast' && flag !== 'slow').length;

  return observations.meaningfulTokenCount >= 3 || strongSignals >= 2;
}

function getCloudCandidates(analysis: LocalAnalysis): Ghost[] {
  const preferred = analysis.ranked
    .filter((item) => item.score > -4)
    .slice(0, 8)
    .map((item) => item.ghost);

  if (preferred.length >= 4) {
    return preferred;
  }

  return analysis.ranked.slice(0, 8).map((item) => item.ghost);
}

function buildFallbackAlternatives(
  analysis: LocalAnalysis,
  primaryGhostId: string,
): Array<{ ghostId: string; reason: string }> {
  return analysis.ranked
    .filter((item) => item.ghost.id !== primaryGhostId)
    .slice(0, 3)
    .map((item) => ({
      ghostId: item.ghost.id,
      reason: item.reasons[0] ?? 'частично совпадает по наблюдаемому поведению',
    }));
}

function reconcileCloudPrimaryGhostId(
  primaryGhostId: string,
  analysis: LocalAnalysis,
  candidates: Ghost[],
  reasoning: string[],
  checks: string[],
): string {
  const text = normalizeText([...reasoning, ...checks].join(' '));
  if (!text) {
    return primaryGhostId;
  }

  const mentionScores = candidates
    .map((ghost) => ({
      ghostId: ghost.id,
      score: getGhostReferenceTerms(ghost).reduce(
        (sum, term) => sum + (text.includes(term) ? 1 : 0),
        0,
      ),
    }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score);

  if (mentionScores.length === 0) {
    return primaryGhostId;
  }

  const primaryMentionScore =
    mentionScores.find((item) => item.ghostId === primaryGhostId)?.score ?? 0;
  const topMention = mentionScores[0];

  if (
    topMention.ghostId !== primaryGhostId &&
    topMention.score >= Math.max(2, primaryMentionScore + 1)
  ) {
    return topMention.ghostId;
  }

  const localBestTerms = getGhostReferenceTerms(analysis.best.ghost);
  const localBestMentionScore = localBestTerms.reduce(
    (sum, term) => sum + (text.includes(term) ? 1 : 0),
    0,
  );

  if (
    analysis.best.ghost.id !== primaryGhostId &&
    localBestMentionScore >= Math.max(2, primaryMentionScore + 1)
  ) {
    return analysis.best.ghost.id;
  }

  return primaryGhostId;
}

function normalizeCloudAnalysis(
  payload: unknown,
  analysis: LocalAnalysis,
  candidates: Ghost[],
): CloudAnalysis {
  const allowedIds = new Set(candidates.map((ghost) => ghost.id));
  const raw =
    payload && typeof payload === 'object'
      ? (payload as Record<string, unknown>)
      : {};

  let primaryGhostId =
    typeof raw.primaryGhostId === 'string' && allowedIds.has(raw.primaryGhostId)
      ? raw.primaryGhostId
      : analysis.best.ghost.id;

  let confidence =
    typeof raw.confidence === 'number' && Number.isFinite(raw.confidence)
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round(raw.confidence <= 1 ? raw.confidence * 100 : raw.confidence),
          ),
        )
      : analysis.confidence;

  if (primaryGhostId === analysis.best.ghost.id) {
    confidence = Math.max(confidence, analysis.confidence);
  }

  const reasoning = Array.isArray(raw.reasoning)
    ? raw.reasoning.filter((item): item is string => typeof item === 'string').slice(0, 4)
    : [];

  const checks = Array.isArray(raw.checks)
    ? raw.checks.filter((item): item is string => typeof item === 'string').slice(0, 4)
    : [];

  const alternatives = Array.isArray(raw.alternatives)
    ? raw.alternatives
        .map((item) => {
          if (!item || typeof item !== 'object') {
            return null;
          }

          const ghostId =
            typeof (item as { ghostId?: unknown }).ghostId === 'string'
              ? (item as { ghostId: string }).ghostId
              : '';
          const reason =
            typeof (item as { reason?: unknown }).reason === 'string'
              ? (item as { reason: string }).reason.trim()
              : '';

          if (!ghostId || !reason || !allowedIds.has(ghostId) || ghostId === primaryGhostId) {
            return null;
          }

          return { ghostId, reason };
        })
        .filter((item): item is { ghostId: string; reason: string } => Boolean(item))
        .slice(0, 3)
    : [];

  primaryGhostId = reconcileCloudPrimaryGhostId(
    primaryGhostId,
    analysis,
    candidates,
    reasoning,
    checks,
  );

  if (primaryGhostId === analysis.best.ghost.id) {
    confidence = Math.max(confidence, analysis.confidence);
  }

  const behaviorOnly = analysis.recognized.every(
    (item) => !EVIDENCE_VALUES.includes(item as Evidence),
  );
  const resolvedPrimaryGhost =
    GHOSTS.find((ghost) => ghost.id === primaryGhostId) ?? analysis.best.ghost;
  const normalizedAlternatives = alternatives
    .filter((item) => item.ghostId !== primaryGhostId)
    .slice(0, 3);
  const normalizedChecks = behaviorOnly
    ? buildGhostChecks(resolvedPrimaryGhost, { behaviorOnly: true }).slice(0, 4)
    : checks.length > 0
      ? checks
      : buildGhostChecks(resolvedPrimaryGhost).slice(0, 4);

  return {
    primaryGhostId,
    confidence,
    reasoning:
      reasoning.length > 0
        ? reasoning
        : [analysis.best.reasons[0] ?? 'лучше всего совпадает по доступным признакам'],
    checks: normalizedChecks,
    alternatives:
      normalizedAlternatives.length > 0
        ? normalizedAlternatives
        : confidence < SINGLE_RESULT_CONFIDENCE_THRESHOLD
          ? buildFallbackAlternatives(analysis, primaryGhostId)
          : undefined,
  };
}

function buildCloudPrompt(
  observations: Observations,
  analysis: LocalAnalysis,
  candidates: Ghost[],
): string {
  const recognized = [
    ...observations.evidence,
    ...Array.from(observations.flags).map((flag) => OBSERVATION_LABELS[flag]),
  ];

  const summarizedCandidates = candidates.map((ghost) => ({
    id: ghost.id,
    name: ghost.name,
    evidence: ghost.evidence,
    speed: {
      min: getMinGhostSpeed(ghost),
      max: getMaxGhostSpeed(ghost),
    },
    huntThreshold: ghost.huntThresholdValue ?? ghost.huntThreshold,
    hints: CLOUD_HINTS[ghost.id] ?? [],
    strength: ghost.strength,
    weakness: ghost.weakness,
    behaviorFacts: (ghost.behaviorFacts ?? []).slice(0, 3),
    abilities: ghost.abilities.slice(0, 3),
    hiddenFacts: (ghost.hiddenFacts ?? []).slice(0, 2),
    strategies: (ghost.strategies ?? []).slice(0, 2),
    behaviorAliases: (GHOST_BEHAVIOR_ALIASES[ghost.id] ?? []).slice(0, 4),
  }));

  const localRanking = analysis.ranked.slice(0, 5).map((item) => ({
    id: item.ghost.id,
    name: item.ghost.name,
    score: item.score,
    reasons: item.reasons.slice(0, 2),
  }));

  return [
    `Описание игрока: ${observations.raw}`,
    `Распознанные признаки: ${recognized.join(', ') || 'нет явных признаков'}`,
    `Режим расследования: ${observations.evidence.length === 0 ? 'без улик, приоритет уникальному поведению' : 'можно учитывать и поведение, и улики'}`,
    `Локальная уверенность: ${analysis.confidence}%`,
    `Локальный лидер: ${analysis.best.ghost.name}`,
    `Локальный рейтинг: ${JSON.stringify(localRanking)}`,
    `Кандидаты: ${JSON.stringify(summarizedCandidates)}`,
    'Правила ответа:',
    '- Используй только кандидатов из списка.',
    '- Не придумывай новых призраков и не выбирай ghostId вне списка.',
    `- Если уверенность ниже ${SINGLE_RESULT_CONFIDENCE_THRESHOLD}, обязательно верни 2-3 альтернативы.`,
    '- В reasoning и checks пиши кратко и по-русски.',
    '- Если игрок описывает только поведение, делай упор на уникальные механики охоты, охотничьи пороги, скорость, реакцию на свет, соль, электронику, благовония, огонь, двери и взаимодействия.',
    '- Не подменяй поведенческий вывод советами по уликам, если описание уже содержит сильный уникальный паттерн.',
    '- Если в данных не хватает точности, упор делай на practical checks без улик.',
    '- Если описание говорит, что призрак быстрый вдали, но при сближении с игроком резко замедляется почти до 0.4-0.9 м/с, это очень сильный признак deogen.',
    '- Если описание говорит, что призрак очень быстрый в начале, но именно со временем стареет, слабеет и перестает разгоняться по линии видимости, это сильный признак thaye.',
    '- Можно использовать Google Search, чтобы сверить актуальные факты по Phasmophobia, но нестандартных кандидатов оценивай только по переданным подсказкам.',
  ].join('\n');
}

async function identifyWithGemini(
  observations: Observations,
  analysis: LocalAnalysis,
  config: GeminiConfig,
): Promise<string> {
  const candidates = getCloudCandidates(analysis);
  const client = getGeminiClient(config.apiKey);
  const response = await client.models.generateContent({
    model: config.model,
    contents: buildCloudPrompt(observations, analysis, candidates),
    config: {
      systemInstruction: [
        'Ты определяешь призрака Phasmophobia по описанию игрока.',
        'Твоя задача: выбрать наиболее вероятного призрака только среди переданных кандидатов.',
        'Если данных недостаточно, не выдумывай точный ответ и обязательно оставляй альтернативы.',
        'Используй Google Search, когда это помогает уточнить игровые механики или проверить сомнительный факт.',
        'Ответ должен быть строго одним JSON-объектом без markdown, комментариев и дополнительного текста.',
        'Формат JSON: {"primaryGhostId":"id","confidence":0,"reasoning":["..."],"checks":["..."],"alternatives":[{"ghostId":"id","reason":"..."}]}',
      ].join('\n'),
      tools: [{ googleSearch: {} }],
      temperature: 0,
      thinkingConfig: { thinkingBudget: 0 },
      maxOutputTokens: 512,
    },
  });

  const rawText = response.text?.trim();
  if (!rawText) {
    throw new Error('Gemini returned an empty response');
  }

  const parsed = normalizeCloudAnalysis(
    JSON.parse(extractJsonPayload(rawText)),
    analysis,
    candidates,
  );
  return formatCloudAnalysis(parsed);
}

async function identifyWithGeminiRobust(
  observations: Observations,
  analysis: LocalAnalysis,
  config: GeminiConfig,
  model = config.model,
): Promise<string> {
  const candidates = getCloudCandidates(analysis);
  const client = getGeminiClient(config.apiKey);
  const attempts: GeminiAnalysisAttempt[] = [
    { enableSearch: true, maxOutputTokens: 1024 },
    { enableSearch: false, maxOutputTokens: 1024 },
  ];

  let lastError: unknown = null;

  for (let index = 0; index < attempts.length; index += 1) {
    const attempt = attempts[index];

    if (index > 0 && !shouldRetryGeminiWithoutSearch(lastError)) {
      break;
    }

    try {
      const response = await client.models.generateContent({
        model,
        contents: buildCloudPrompt(observations, analysis, candidates),
        config: {
          systemInstruction: [
            'Ты определяешь призрака Phasmophobia по описанию игрока.',
            'Твоя задача: выбрать наиболее вероятного призрака только среди переданных кандидатов.',
            'Если данных недостаточно, не выдумывай точный ответ и обязательно оставляй альтернативы.',
            'Используй Google Search только если это действительно повышает точность. Не делай много повторных поисков.',
            'Ответ должен быть строго одним JSON-объектом без markdown, комментариев и дополнительного текста.',
            'Формат JSON: {"primaryGhostId":"id","confidence":0,"reasoning":["..."],"checks":["..."],"alternatives":[{"ghostId":"id","reason":"..."}]}',
          ].join('\n'),
          ...(attempt.enableSearch ? { tools: [{ googleSearch: {} }] } : {}),
          temperature: 0,
          thinkingConfig: { thinkingBudget: 0 },
          maxOutputTokens: attempt.maxOutputTokens,
        },
      });

      const finishReason = getGeminiFinishReason(response);
      const rawText = getGeminiResponseText(response);
      if (!rawText) {
        throw new Error(`Gemini returned empty response (${finishReason})`);
      }

      const payload = extractJsonPayload(rawText);
      if (!payload.endsWith('}')) {
        throw new Error(`Gemini returned truncated JSON (${finishReason})`);
      }

      const parsed = normalizeCloudAnalysis(JSON.parse(payload), analysis, candidates);
      return formatCloudAnalysis(parsed);
    } catch (error) {
      lastError = error;
    }
  }

  throw (lastError instanceof Error ? lastError : new Error(String(lastError)));
}

async function identifyWithProxyOpenAI(
  observations: Observations,
  analysis: LocalAnalysis,
  config: ProxyOpenAIConfig,
): Promise<string> {
  const candidates = getCloudCandidates(analysis);
  const prompt = buildCloudPrompt(observations, analysis, candidates);
  const endpoint = `${config.baseUrl}/chat/completions`;
  const attempts: Array<{
    responseFormat?: Record<string, unknown>;
    maxCompletionTokens: number;
  }> = [
    {
      maxCompletionTokens: 1024,
      responseFormat: {
        type: 'json_schema',
        json_schema: {
          name: 'ghost_analysis',
          strict: true,
          schema: CLOUD_ANALYSIS_SCHEMA,
        },
      },
    },
    {
      maxCompletionTokens: 1024,
      responseFormat: {
        type: 'json_object',
      },
    },
    {
      maxCompletionTokens: 1024,
    },
  ];

  let lastError: unknown = null;

  for (let index = 0; index < attempts.length; index += 1) {
    const attempt = attempts[index];
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: [
              'Ты определяешь призрака Phasmophobia по описанию игрока.',
              'Выбирай только среди переданных кандидатов.',
              'Если данных недостаточно, не выдумывай точный ответ и оставляй альтернативы.',
              'Верни ровно один JSON-объект без markdown и без пояснений вне JSON.',
              'JSON должен содержать поля primaryGhostId, confidence, reasoning, checks, alternatives.',
              'Если альтернатив нет, верни пустой массив alternatives: [].',
              'reasoning и checks пиши кратко и по-русски.',
            ].join('\n'),
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        reasoning_effort: 'minimal',
        max_completion_tokens: attempt.maxCompletionTokens,
        ...(attempt.responseFormat ? { response_format: attempt.responseFormat } : {}),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      lastError = new Error(`HTTP ${response.status}: ${errorText}`);

      const retryable =
        index < attempts.length - 1 &&
        /json_validate_failed|failed to generate json|unsupported parameter|max completion tokens reached|invalid schema/i.test(
          errorText,
        );

      if (retryable) {
        continue;
      }

      throw (lastError instanceof Error ? lastError : new Error(String(lastError)));
    }

    const data = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: unknown;
        };
      }>;
    };

    const rawText = extractMessageText(data.choices?.[0]?.message?.content);
    if (!rawText) {
      lastError = new Error('ProxyAPI/OpenAI returned an empty response');
      continue;
    }

    try {
      const parsed = normalizeCloudAnalysis(
        JSON.parse(extractJsonPayload(rawText)),
        analysis,
        candidates,
      );
      return formatCloudAnalysis(parsed);
    } catch (error) {
      lastError = error;
    }
  }

  throw (lastError instanceof Error ? lastError : new Error(String(lastError)));
}

async function identifyWithGroq(
  observations: Observations,
  analysis: LocalAnalysis,
  config: GroqConfig,
): Promise<string> {
  const candidates = getCloudCandidates(analysis);
  const prompt = buildCloudPrompt(observations, analysis, candidates);
  const attempts: Array<{
    maxTokens: number;
    responseFormat: Record<string, unknown>;
    systemLines: string[];
  }> = [
    {
      maxTokens: 1024,
      responseFormat: {
        type: 'json_schema',
        json_schema: {
          name: 'ghost_analysis',
          strict: true,
          schema: CLOUD_ANALYSIS_SCHEMA,
        },
      },
      systemLines: [
        'Ты определяешь призрака Phasmophobia по описанию игрока.',
        'Выбирай только среди переданных кандидатов.',
        'Если данных недостаточно, не выдумывай точный ответ и оставляй альтернативы.',
        'Отвечай только валидным JSON по заданной схеме.',
        'reasoning и checks пиши кратко и по-русски.',
      ],
    },
    {
      maxTokens: 1024,
      responseFormat: {
        type: 'json_object',
      },
      systemLines: [
        'Ты определяешь призрака Phasmophobia по описанию игрока.',
        'Выбирай только среди переданных кандидатов.',
        'Если данных недостаточно, не выдумывай точный ответ и оставляй альтернативы.',
        'Верни ровно один JSON-объект без markdown и без пояснений вне JSON.',
        'JSON должен содержать поля primaryGhostId, confidence, reasoning, checks, alternatives.',
        'Если альтернатив нет, верни пустой массив alternatives: [].',
        'reasoning и checks пиши кратко и по-русски.',
      ],
    },
  ];

  let lastError: unknown = null;

  for (let index = 0; index < attempts.length; index += 1) {
    const attempt = attempts[index];
    const response = await fetch(GROQ_CHAT_COMPLETIONS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: attempt.systemLines.join('\n'),
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0,
        max_tokens: attempt.maxTokens,
        response_format: attempt.responseFormat,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      lastError = new Error(`HTTP ${response.status}: ${errorText}`);

      const retryable =
        index < attempts.length - 1 &&
        /json_validate_failed|failed to generate json|max completion tokens reached/i.test(
          errorText,
        );

      if (retryable) {
        continue;
      }

      throw (lastError instanceof Error ? lastError : new Error(String(lastError)));
    }

    const data = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: unknown;
        };
      }>;
    };

    const rawText = extractMessageText(data.choices?.[0]?.message?.content);
    if (!rawText) {
      lastError = new Error('Groq returned an empty response');
      continue;
    }

    try {
      const parsed = normalizeCloudAnalysis(
        JSON.parse(extractJsonPayload(rawText)),
        analysis,
        candidates,
      );
      return formatCloudAnalysis(parsed);
    } catch (error) {
      lastError = error;
    }
  }

  throw (lastError instanceof Error ? lastError : new Error(String(lastError)));
}

export async function identifyGhost(description: string): Promise<string | null> {
  const trimmed = description.trim();
  if (!trimmed) {
    return null;
  }

  const observations = parseObservations(trimmed);

  if (isFastOnlyQuery(observations)) {
    return formatFastOnlyAnalysis();
  }

  if (isSlowOnlyQuery(observations)) {
    return formatSlowOnlyAnalysis();
  }

  if (isSingleEvidenceQuery(observations)) {
    return formatSingleEvidenceAnalysis(observations.evidence[0]);
  }

  const local = analyzeLocally(observations);
  const proxyConfig = getProxyOpenAIConfig();
  const geminiConfig = getGeminiConfig();
  const groqConfig = getGroqConfig();
  let switchState: { kind: ProviderErrorKind; fromLabel: string } | null = null;

  if (!proxyConfig && !geminiConfig && !groqConfig) {
    return formatLocalAnalysis(local, {
      fallbackReason: 'Облачные модели не настроены. Использован локальный анализ без облачного запроса.',
    });
  }

  if (!shouldUseCloud(observations, local)) {
    return formatLocalAnalysis(local, { localOnly: true });
  }

  if (proxyConfig) {
    const proxyLabel = `ProxyAPI/OpenAI \`${proxyConfig.model}\``;

    try {
      return await identifyWithProxyOpenAI(observations, local, proxyConfig);
    } catch (error) {
      const kind = classifyProviderError(error);
      switchState = {
        kind,
        fromLabel: proxyLabel,
      };
      console.error(
        `[ai-identify] ProxyAPI/OpenAI request failed (${proxyConfig.model}):`,
        error instanceof Error ? error.message : error,
      );

      if (!geminiConfig && !groqConfig) {
        return formatLocalAnalysis(local, {
          fallbackReason: getProviderLocalFallbackReason(kind, proxyLabel),
        });
      }
    }
  }

  if (geminiConfig) {
    const geminiModels = [geminiConfig.model, ...geminiConfig.fallbackModels].filter(
      (model, index, array) => Boolean(model) && array.indexOf(model) === index,
    );
    let lastGeminiKind: ProviderErrorKind = 'unknown';

    for (let index = 0; index < geminiModels.length; index += 1) {
      const model = geminiModels[index];

      try {
        const result = await identifyWithGeminiRobust(
          observations,
          local,
          geminiConfig,
          model,
        );

        if (index === 0) {
          return prependProviderSwitchNotice(
            result,
            switchState,
            `Gemini \`${model}\``,
          );
        }

        return prependProviderSwitchNotice(
          `${getGeminiFallbackSwitchNotice(geminiModels[0], model)}\n\n${result}`,
          switchState,
          `Gemini \`${model}\``,
        );
      } catch (error) {
        const kind = classifyProviderError(error);
        lastGeminiKind = kind;
        console.error(
          `[ai-identify] Gemini request failed (${model}):`,
          error instanceof Error ? error.message : error,
        );

        const hasNextGeminiModel = index < geminiModels.length - 1;
        if (kind === 'quota' && hasNextGeminiModel) {
          continue;
        }

        if (groqConfig) {
          try {
            const reserveResult = await identifyWithGroq(observations, local, groqConfig);
            return prependProviderSwitchNotice(
              `${getGroqSwitchNotice(kind, groqConfig.model)}\n\n${reserveResult}`,
              switchState,
              `Groq \`${groqConfig.model}\``,
            );
          } catch (groqError) {
            const groqKind = classifyProviderError(groqError);
            console.error(
              '[ai-identify] Groq request failed:',
              groqError instanceof Error ? groqError.message : groqError,
            );
            return prependProviderSwitchNotice(
              formatLocalAnalysis(local, {
                fallbackReason: getCombinedCloudFallbackReason(
                  kind,
                  groqKind,
                  groqConfig.model,
                ),
              }),
              switchState,
              `Groq \`${groqConfig.model}\``,
            );
          }
        }

        return prependProviderSwitchNotice(
          formatLocalAnalysis(local, {
            fallbackReason: getCloudFallbackReason(kind, true),
          }),
          switchState,
          `Gemini \`${geminiModels[0]}\``,
        );
      }
    }

    return prependProviderSwitchNotice(
      formatLocalAnalysis(local, {
        fallbackReason: getCloudFallbackReason(lastGeminiKind, true),
      }),
      switchState,
      `Gemini \`${geminiModels[0]}\``,
    );
  }

  if (groqConfig) {
    try {
      const reserveResult = await identifyWithGroq(observations, local, groqConfig);
      return prependProviderSwitchNotice(
        reserveResult,
        switchState,
        `Groq \`${groqConfig.model}\``,
      );
    } catch (error) {
      const kind = classifyProviderError(error);
      console.error(
        '[ai-identify] Groq request failed:',
        error instanceof Error ? error.message : error,
      );
      return prependProviderSwitchNotice(
        formatLocalAnalysis(local, {
          fallbackReason: switchState
            ? getCombinedProviderFallbackReason(
                switchState.kind,
                switchState.fromLabel,
                kind,
                `Groq \`${groqConfig.model}\``,
              )
            : getCombinedCloudFallbackReason('missing_config', kind, groqConfig.model),
        }),
        switchState,
        `Groq \`${groqConfig.model}\``,
      );
    }
  }

  return formatLocalAnalysis(local, {
    fallbackReason: switchState
      ? getProviderLocalFallbackReason(switchState.kind, switchState.fromLabel)
      : getCloudFallbackReason('missing_config', false),
  });
}
