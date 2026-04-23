type EquipmentCharacteristicPatch = {
  type: 'positive' | 'negative' | 'neutral';
  label: string;
  value?: string;
};

type EquipmentTierPatch = {
  level: number;
  desc: string;
  image: string;
  characteristics?: EquipmentCharacteristicPatch[];
};

type EquipmentPatch = {
  icon?: string;
  description?: string;
  fullDescription?: string[];
  tiers?: EquipmentTierPatch[];
};

const EQUIPMENT_IMAGE_TITLE_OVERRIDES: Record<string, string> = {
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

export const localizeEquipmentImage = (url: string | undefined): string => {
  if (!url) {
    return '';
  }

  if (url.startsWith('/images/phasmo/')) {
    return url;
  }

  const marker = 'Special:FilePath/';
  const markerIndex = url.indexOf(marker);

  if (markerIndex === -1) {
    return url;
  }

  const title = decodeURIComponent(url.slice(markerIndex + marker.length).split('?')[0]);
  const actualTitle = EQUIPMENT_IMAGE_TITLE_OVERRIDES[title] ?? title;
  return `/images/phasmo/equipment/${actualTitle}`;
};

export const EQUIPMENT_PATCHES: Record<string, EquipmentPatch> = {
  flashlight: {
    fullDescription: [
      'Фонарик — базовый переносной источник света и один из самых безопасных способов ориентироваться в тёмных комнатах.',
      'Его можно держать в руке или носить на плече, переключившись на другой предмет. Во время охоты мигающий фонарь также помогает понять, насколько близко находится призрак.',
      'Как и другая активная электроника, включённый фонарик может выдать игрока во время охоты, поэтому его важно вовремя выключать в укрытии.',
    ],
  },
  crucifix: {
    fullDescription: [
      'Распятие предотвращает начало охоты, если призрак пытается стартовать её в радиусе действия предмета.',
      'Оно работает как в руках, так и после размещения на полу. При броске зона защиты отображается заранее, что помогает точно перекрывать комнату призрака.',
      'Чем выше тир, тем больше радиус и число зарядов. Тир 3 дополнительно способен остановить одну проклятую охоту, потратив сразу оба заряда.',
    ],
  },
  headgear: {
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Head_Gear_Tier_II_Render.png',
    description: 'Освобождает руки, позволяя носить камеру или фонарик на голове.',
    fullDescription: [
      'Головное крепление заменяет потребность держать некоторые предметы руками.',
      'На Т1 это просто камера, на Т2 — фонарик, а на Т3 — ПНВ (Прибор Ночного Видения).',
    ],
    tiers: [
      {
        level: 1,
        desc: 'Наголовная экшн-камера. Передает видео в фургон, как обычная видеокамера, но не требует слота в руках.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Head_Gear_Tier_I_Render.png',
        characteristics: [
          { type: 'positive', label: 'Не занимает руки' },
          { type: 'positive', label: 'Видеокамера ПНВ' },
          { type: 'negative', label: 'Электроника' },
        ],
      },
      {
        level: 2,
        desc: 'Наголовный фонарик. Светит ярче Т1 фонарика и освобождает слот инвентаря.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Head_Gear_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Не занимает руки' },
          { type: 'positive', label: 'Фонарик' },
          { type: 'negative', label: 'Электроника' },
        ],
      },
      {
        level: 3,
        desc: 'ПНВ (Прибор ночного видения). Позволяет идеально видеть в темноте без фонарика, делая игрока практически незаметным для некоторых призраков.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Head_Gear_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Не занимает руки' },
          { type: 'positive', label: 'Прибор Ночного Видения' },
          { type: 'negative', label: 'Электроника' },
        ],
      },
    ],
  },
  smudge: {
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Incense_Tier_II_Render.png',
    description: 'Ослепляет призрака во время охоты на короткое время, сбивая его с толку.',
    fullDescription: [
      'Благовоние способно дезориентировать призрака во время охоты, давая пару секунд, чтобы убежать и спрятаться.',
      'Также при использовании в комнате призрака вне охоты временно предотвращает начало охоты: обычно на 90 секунд, у Демона на 60 секунд, у Духа на 180 секунд.',
    ],
    tiers: [
      {
        level: 1,
        desc: 'Связка трав. Работает только в радиусе 3 метров. Ослепляет призрака на 5 секунд или предотвращает охоту.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Incense_Tier_I_Render.png',
        characteristics: [
          { type: 'positive', label: 'Радиус (м)', value: '3' },
          { type: 'positive', label: 'Длительность (с)', value: '5' },
        ],
      },
      {
        level: 2,
        desc: 'Белый шалфей. Радиус увеличен до 4 метров, а также замедляет призрака во время ослепления.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Incense_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Радиус (м)', value: '4' },
          { type: 'positive', label: 'Длительность (с)', value: '6' },
          { type: 'positive', label: 'Замедляет призрака во время дезориентации' },
        ],
      },
      {
        level: 3,
        desc: 'Священный ладан в кадиле. Охватывает 5 метров, длится 7 секунд и полностью останавливает призрака на время ослепления.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Incense_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Радиус (м)', value: '5' },
          { type: 'positive', label: 'Длительность (с)', value: '7' },
          { type: 'positive', label: 'Останавливает призрака на всё время действия' },
        ],
      },
    ],
  },
  paramic: {
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Parabolic_Microphone_Tier_II_Render.png',
    description: 'Улавливает звуки сквозь стены на больших расстояниях. Незаменим на больших картах.',
    fullDescription: [
      'Направленный микрофон может улавливать паранормальные звуки: шаги, броски предметов или шёпот.',
      'Только через направленный микрофон можно услышать уникальный звук Банши и дыхание Милинга, когда он не охотится.',
    ],
    tiers: [
      {
        level: 1,
        desc: 'Простой усилитель звука без дисплея. Шумит и имеет небольшой радиус.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Parabolic_Microphone_Tier_I_Render.png',
        characteristics: [
          { type: 'positive', label: 'Радиус (м)', value: '20' },
          { type: 'negative', label: 'Нет дисплея' },
          { type: 'negative', label: 'Электроника' },
        ],
      },
      {
        level: 2,
        desc: 'Стандартный направленный микрофон с дисплеем, показывающим уровень децибел.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Parabolic_Microphone_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Радиус (м)', value: '30' },
          { type: 'positive', label: 'Отображает уровень децибел' },
          { type: 'negative', label: 'Электроника' },
        ],
      },
      {
        level: 3,
        desc: 'Профессиональный направленный микрофон. Показывает децибелы и точное направление источника звука.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Parabolic_Microphone_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Радиус (м)', value: '30' },
          { type: 'positive', label: 'Радар с направлением звука' },
          { type: 'negative', label: 'Электроника' },
        ],
      },
    ],
  },
  salt: {
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Salt_Tier_II_Render.png',
    description: 'Оставляет кучки соли, чтобы увидеть отпечатки ног призрака и ограничить его маршрут.',
    fullDescription: [
      'Соль рассыпается на пол. Когда призрак наступает в неё, кучка деформируется.',
      'Если у призрака есть улика «Ультрафиолет», из соли будут вести зеленые отпечатки ног.',
      'Мираж никогда не наступает в соль, что делает предмет полезным и для проверки типа призрака.',
    ],
    tiers: [
      {
        level: 1,
        desc: 'Обычная столовая соль. Две порции в банке и точечное покрытие.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Salt_Tier_I_Render.png',
        characteristics: [
          { type: 'positive', label: 'Использований', value: '2' },
          { type: 'neutral', label: 'Покрытие', value: 'Точечное' },
        ],
      },
      {
        level: 2,
        desc: 'Розовая гималайская соль. Три использования и длинная линия покрытия.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Salt_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Использований', value: '3' },
          { type: 'positive', label: 'Покрытие', value: 'Линия' },
        ],
      },
      {
        level: 3,
        desc: 'Освященная черная соль. Замедляет призрака при наступлении даже во время охоты.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Salt_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Использований', value: '3' },
          { type: 'positive', label: 'Покрытие', value: 'Широкая линия' },
          { type: 'positive', label: 'Замедляет призрака' },
        ],
      },
    ],
  },
  sound: {
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/SoundRecorder_T2.png',
    description: 'Записывает паранормальные звуки и даёт дополнительную награду за удачные аудиоулики.',
    fullDescription: [
      'Звуковой рекордер нужен для фиксации голосов через радиоприёмник, ЭМП-событий, шагов, бросков предметов и других паранормальных звуков.',
      'За контракт можно сохранить до трёх удачных записей. Чем выше тир, тем легче держать источник звука в нужной зоне и получать качественный сигнал.',
      'Рекордер не заменяет обычные улики, но помогает добирать деньги и быстрее понимать, где именно происходит активность.',
    ],
    tiers: [
      {
        level: 1,
        desc: 'Кассетный рекордер с коротким радиусом записи. Работает только почти вплотную к источнику звука.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/SoundRecorder_T1.png',
        characteristics: [
          { type: 'negative', label: 'Радиус записи', value: '3 м' },
          { type: 'negative', label: 'Точность наведения', value: 'Низкая' },
          { type: 'negative', label: 'Электроника' },
        ],
      },
      {
        level: 2,
        desc: 'Цифровой рекордер с экраном. Пишет звук с большего расстояния и понятнее показывает силу сигнала.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/SoundRecorder_T2.png',
        characteristics: [
          { type: 'positive', label: 'Радиус записи', value: '5 м' },
          { type: 'neutral', label: 'Индикация сигнала', value: 'Экран уровня' },
          { type: 'negative', label: 'Электроника' },
        ],
      },
      {
        level: 3,
        desc: 'Профессиональный рекордер с улучшенной индикацией. Удобнее удерживать источник звука и быстро собирать записи в активной комнате.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/SoundRecorder_T3.png',
        characteristics: [
          { type: 'positive', label: 'Радиус записи', value: '5 м' },
          { type: 'positive', label: 'Индикация сигнала', value: 'Точная' },
          { type: 'positive', label: 'Поиск источника', value: 'Быстрее и стабильнее' },
          { type: 'negative', label: 'Электроника' },
        ],
      },
    ],
  },
  tripod: {
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Tripod_Tier_II_Render.png',
    description: 'Позволяет устойчиво установить видеокамеру или лазерный проектор в нужной точке.',
    tiers: [
      {
        level: 1,
        desc: 'Хлипкий пластиковый штатив. Призрак может легко его опрокинуть.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Tripod_Tier_I_Render.png',
        characteristics: [
          { type: 'negative', label: 'Поворот камеры из фургона', value: 'Нет' },
          { type: 'neutral', label: 'Устойчивость', value: 'Средняя' },
        ],
      },
      {
        level: 2,
        desc: 'Моторизированный штатив. С камерой 2/3 тира позволяет вращать обзор из фургона.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Tripod_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Поворот камеры из фургона', value: 'Да' },
          { type: 'neutral', label: 'Устойчивость', value: 'Высокая' },
        ],
      },
      {
        level: 3,
        desc: 'Тяжёлый металлический штатив. Не опрокидывается призраком и надёжно держит технику.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Tripod_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Поворот камеры из фургона', value: 'Да' },
          { type: 'positive', label: 'Не опрокидывается призраком' },
        ],
      },
    ],
  },
  firelight: {
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Firelight_Tier_II_Render.png',
    description: 'Освещает комнату и замедляет потерю рассудка в темноте.',
    fullDescription: [
      'Горящая свеча или лампада освещает небольшое пространство вокруг, но главное её свойство — замедление потери рассудка.',
      'Светильник особенно полезен при длительном нахождении в тёмной комнате и против Онрё, который взаимодействует с огнём особым образом.',
    ],
    tiers: [
      {
        level: 1,
        desc: 'Короткая свеча. Горит недолго и уменьшает падение рассудка на треть.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Firelight_Tier_I_Render.png',
        characteristics: [
          { type: 'neutral', label: 'Защита рассудка', value: '33%' },
          { type: 'negative', label: 'Время горения', value: '3 мин' },
          { type: 'positive', label: 'Не электроника' },
        ],
      },
      {
        level: 2,
        desc: 'Высокая свеча. Горит заметно дольше и защищает рассудок лучше.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Firelight_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Защита рассудка', value: '66%' },
          { type: 'neutral', label: 'Время горения', value: '5 мин' },
          { type: 'positive', label: 'Не электроника' },
        ],
      },
      {
        level: 3,
        desc: 'Керосиновая лампада. Полностью защищает от потери рассудка в темноте и лучше выдерживает непогоду.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Firelight_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Защита рассудка', value: '100%' },
          { type: 'positive', label: 'Устойчива к ветру и дождю' },
          { type: 'negative', label: 'Требует зажигалку' },
        ],
      },
    ],
  },
  igniter: {
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Igniter_Tier_II_Render.png',
    description: 'Нужен для поджигания свечей, лампад и благовоний.',
    tiers: [
      {
        level: 1,
        desc: 'Коробок спичек. Одноразовые короткие источники пламени.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Igniter_Tier_I_Render.png',
        characteristics: [
          { type: 'negative', label: 'Использований', value: '10' },
          { type: 'positive', label: 'Не электроника' },
        ],
      },
      {
        level: 2,
        desc: 'Классическая газовая зажигалка. Горит дольше и освещает путь вблизи.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Igniter_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Длительность', value: '5 мин' },
          { type: 'positive', label: 'Не электроника' },
        ],
      },
      {
        level: 3,
        desc: 'Штормовая зажигалка. Работает дольше, не тухнет под дождём и удобнее для уличных карт.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Igniter_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Длительность', value: '10 мин' },
          { type: 'positive', label: 'Водонепроницаемость' },
          { type: 'positive', label: 'Не электроника' },
        ],
      },
    ],
  },
  motion: {
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Motion_Sensor_Tier_II_Render.png',
    description: 'Срабатывает, когда через зону датчика проходит призрак или игрок.',
    fullDescription: [
      'Датчик движения помогает быстро понять, через какие проходы ходит призрак.',
      'Срабатывания видны и на месте, и в фургоне, поэтому предмет удобен для контроля больших комнат и выполнения дополнительных заданий.',
    ],
    tiers: [
      {
        level: 1,
        desc: 'Линейный датчик. Светит полосой вперёд и даёт звук при срабатывании.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Motion_Sensor_Tier_I_Render.png',
        characteristics: [
          { type: 'neutral', label: 'Форма зоны', value: 'Линия' },
          { type: 'negative', label: 'Электроника' },
        ],
      },
      {
        level: 2,
        desc: 'Инфракрасный датчик с широкой конусной зоной обнаружения.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Motion_Sensor_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Форма зоны', value: 'Конус' },
          { type: 'negative', label: 'Электроника' },
        ],
      },
      {
        level: 3,
        desc: 'Сферический датчик. Контролирует всё вокруг себя в объёмной зоне.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Motion_Sensor_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Форма зоны', value: 'Сфера' },
          { type: 'negative', label: 'Электроника' },
        ],
      },
    ],
  },
  photo: {
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Photo_Camera_Tier_II_Render.png',
    description: 'Фотографирует улики, призраков, кости, взаимодействия и проклятые предметы.',
    fullDescription: [
      'Каждая камера вмещает ограниченное число фотографий.',
      'В журнал помещается до 10 фото. Чем ближе объект и чем качественнее кадр, тем выше награда по итогам контракта.',
    ],
    tiers: [
      {
        level: 1,
        desc: 'Старый «Полароид». Долго проявляет снимок и медленно готов к следующему кадру.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Photo_Camera_Tier_I_Render.png',
        characteristics: [
          { type: 'neutral', label: 'Вместимость', value: '5 фото' },
          { type: 'negative', label: 'Задержка между фото', value: '3 сек' },
          { type: 'negative', label: 'Электроника' },
        ],
      },
      {
        level: 2,
        desc: 'Современная компактная камера с экраном. Делает снимки заметно быстрее.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Photo_Camera_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Вместимость', value: '5 фото' },
          { type: 'neutral', label: 'Задержка между фото', value: '1.5 сек' },
          { type: 'positive', label: 'Экран видоискателя' },
          { type: 'negative', label: 'Электроника' },
        ],
      },
      {
        level: 3,
        desc: 'Цифровая камера с мощной вспышкой. Позволяет быстро делать серию чётких снимков.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Photo_Camera_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Вместимость', value: '5 фото' },
          { type: 'positive', label: 'Задержка между фото', value: 'Почти нет' },
          { type: 'positive', label: 'Экран видоискателя' },
          { type: 'negative', label: 'Электроника' },
        ],
      },
    ],
  },
  sanity: {
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Sanity_Medication_Tier_II_Render.png',
    description: 'Восстанавливает рассудок и помогает удерживать команду выше порога охоты.',
    tiers: [
      {
        level: 1,
        desc: 'Обычные таблетки. Восстанавливают рассудок постепенно и медленно.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Sanity_Medication_Tier_I_Render.png',
        characteristics: [
          { type: 'neutral', label: 'Восстановление', value: '30%' },
          { type: 'negative', label: 'Скорость', value: '30 сек' },
        ],
      },
      {
        level: 2,
        desc: 'Медицинский сироп. Восстанавливает больше и делает это заметно быстрее.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Sanity_Medication_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Восстановление', value: '40%' },
          { type: 'neutral', label: 'Скорость', value: '10 сек' },
        ],
      },
      {
        level: 3,
        desc: 'Инъектор или спрей. Мгновенно поднимает рассудок и временно стабилизирует игрока.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Sanity_Medication_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Восстановление', value: '50%' },
          { type: 'positive', label: 'Скорость', value: 'Мгновенно' },
          { type: 'positive', label: 'Краткая стабилизация рассудка' },
        ],
      },
    ],
  },
  sound2: {
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Sound_Sensor_Tier_II_Render.png',
    description: 'Улавливает звуки в комнате и передаёт их на монитор в фургоне.',
    tiers: [
      {
        level: 1,
        desc: 'Небольшой сенсор с шаровой зоной обнаружения радиусом 5 метров.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Sound_Sensor_Tier_I_Render.png',
        characteristics: [
          { type: 'neutral', label: 'Форма детекции', value: 'Сфера 5 м' },
          { type: 'negative', label: 'Электроника' },
        ],
      },
      {
        level: 2,
        desc: 'Настенный сенсор направленного типа. Хорошо перекрывает дверные проёмы и коридоры.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Sound_Sensor_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Форма детекции', value: 'Конус 10 м' },
          { type: 'negative', label: 'Электроника' },
        ],
      },
      {
        level: 3,
        desc: 'Умный датчик с регулируемым размером зоны и обзором на 360 градусов.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Sound_Sensor_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Форма детекции', value: 'Сфера 360°' },
          { type: 'positive', label: 'Размер зоны', value: '5-15 м' },
          { type: 'negative', label: 'Электроника' },
        ],
      },
    ],
  },
};
