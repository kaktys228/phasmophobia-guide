import fs from 'fs';

const equipments = [
  {
    id: 'headgear',
    name: 'Крепление на голову',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Head_Gear_Tier_II_Render.png',
    description: 'Освобождает руки, позволяя носить камеру или фонарик на голове.',
    fullDescription: [
      'Головное крепление заменяет потребность держать некоторые предметы руками.',
      'На Т1 это просто камера, на Т2 — фонарик, а на Т3 — ПНВ (Прибор Ночного Видения).'
    ],
    tiers: [
      {
        level: 1,
        desc: 'Наголовная экшн-камера. Передает видео в фургон, как обычная видеокамера, но не требует слота в руках.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Head_Gear_Tier_I_Render.png',
        characteristics: [
          { type: 'positive', label: 'Не занимает руки' },
          { type: 'positive', label: 'Видеокамера ПНВ' },
          { type: 'negative', label: 'Электроника' }
        ]
      },
      {
        level: 2,
        desc: 'Наголовный фонарик. Светит ярче Т1 фонарика и освобождает слот инвентаря.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Head_Gear_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Не занимает руки' },
          { type: 'positive', label: 'Фонарик' },
          { type: 'negative', label: 'Электроника' }
        ]
      },
      {
        level: 3,
        desc: 'ПНВ (Прибор ночного видения). Позволяет идеально видеть в темноте без фонарика, делая игрока практически незаметным для некоторых призраков.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Head_Gear_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Не занимает руки' },
          { type: 'positive', label: 'Прибор Ночного Видения' },
          { type: 'negative', label: 'Электроника' }
        ]
      }
    ]
  },
  {
    id: 'smudge',
    name: 'Благовоние',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Incense_Tier_II_Render.png',
    description: 'Ослепляет призрака во время охоты на короткое время, сбивая его с толку.',
    fullDescription: [
      'Благовоние (ранее Smudge Sticks) способно дезориентировать призрака во время охоты, давая пару секунд, чтобы убежать и спрятаться.',
      'Также при использовании в комнате призрака вне охоты временно предотвращает начало охоты (Обычно 90 сек, Демон — 60 сек, Дух — 180 сек).'
    ],
    tiers: [
      {
        level: 1,
        desc: 'Связка трав. Работает только в радиусе 3 метров. Ослепляет призрака на 5 сек или предотвращает охоту.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Incense_Tier_I_Render.png',
        characteristics: [
          { type: 'positive', label: 'Радиус (м)', value: '3' },
          { type: 'positive', label: 'Длительность (с)', value: '5' }
        ]
      },
      {
        level: 2,
        desc: 'Белый шалфей. Радиус увеличен до 4 метров, а также замедляет призрака во время ослепления.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Incense_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Радиус (м)', value: '4' },
          { type: 'positive', label: 'Длительность (с)', value: '6' },
          { type: 'positive', label: 'Замедляет призрака во время дезориентации' }
        ]
      },
      {
        level: 3,
        desc: 'Священный ладан в кадиле. Охватывает 5 метров, длится 7 секунд и полностью останавливает призрака на время ослепления.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Incense_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Радиус (м)', value: '5' },
          { type: 'positive', label: 'Длительность (с)', value: '7' },
          { type: 'positive', label: 'Останавливает призрака на всё время действия' }
        ]
      }
    ]
  },
  {
    id: 'paramic',
    name: 'Направленный микрофон',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Parabolic_Microphone_Tier_II_Render.png',
    description: 'Улавливает звуки сквозь стены на больших расстояниях. Незаменим на больших картах.',
    fullDescription: [
      'Направленный микрофон может улавливать паранормальные звуки: шаги, броски предметов или шёпот.',
      'Только через направленный микрофон можно услышать уникальный звук Банши (пронзительный визг) и дыхание Милинга, когда он не охотится.'
    ],
    tiers: [
      {
        level: 1,
        desc: 'Простой усилитель звука без дисплея. Шумит и имеет небольшой радиус.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Parabolic_Microphone_Tier_I_Render.png',
        characteristics: [
          { type: 'positive', label: 'Радиус (м)', value: '20' },
          { type: 'negative', label: 'Нет дисплея' },
          { type: 'negative', label: 'Электроника' }
        ]
      },
      {
        level: 2,
        desc: 'Стандартный парамикрофон с дисплеем, показывающим уровень децибел от 0 до 30 метров.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Parabolic_Microphone_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Радиус (м)', value: '30' },
          { type: 'positive', label: 'Отображает значения децибел' },
          { type: 'negative', label: 'Электроника' }
        ]
      },
      {
        level: 3,
        desc: 'Профессиональный гидролокатор. Показывает не только децибелы, но и точное местоположение источника звука на радаре.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Parabolic_Microphone_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Радиус (м)', value: '30' },
          { type: 'positive', label: 'Радар-дисплей с точным позиционированием' },
          { type: 'negative', label: 'Электроника' }
        ]
      }
    ]
  },
  {
    id: 'salt',
    name: 'Соль',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Salt_Tier_II_Render.png',
    description: 'Оставляет кучки соли, чтобы увидеть отпечатки ног призрака (УФ).',
    fullDescription: [
      'Соль рассыпается на пол. Когда призрак наступает в соль, кучка деформируется.',
      'Если у призрака есть улика "Ультрафиолет", из соли будут вести зеленые отпечатки ног.',
      'Мираж (Wraith) никогда не наступает в соль.'
    ],
    tiers: [
      {
        level: 1,
        desc: 'Обычная столовая соль. 2 рассыпания в банке.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Salt_Tier_I_Render.png',
        characteristics: [
          { type: 'positive', label: 'Использований', value: '2' },
          { type: 'neutral', label: 'Покрытие', value: 'Точечное' }
        ]
      },
      {
        level: 2,
        desc: 'Розовая гималайская соль. 3 использования в тубусе. Покрывает большую площадь плоской линией.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Salt_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Использований', value: '3' },
          { type: 'positive', label: 'Покрытие', value: 'Линия' }
        ]
      },
      {
        level: 3,
        desc: 'Освященная черная соль. Замедляет призрака при наступлении (даже во время охоты) в дополнение к оставлению следов.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Salt_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Использований', value: '3' },
          { type: 'positive', label: 'Покрытие', value: 'Широкая линия' },
          { type: 'positive', label: 'Замедляет призрака' }
        ]
      }
    ]
  },
  {
    id: 'tripod',
    name: 'Штатив',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Tripod_Tier_II_Render.png',
    description: 'Позволяет удобно установить видеокамеру или лазерный проектор где угодно.',
    tiers: [
      {
        level: 1,
        desc: 'Хлипкий пластиковый штатив. Призрак может легко его опрокинуть.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Tripod_Tier_I_Render.png',
        characteristics: [
          { type: 'negative', label: 'Дополнительное вращение камеры', value: 'Нет' },
          { type: 'neutral', label: 'Вероятность опрокидывания призраком', value: 'Средняя' }
        ]
      },
      {
        level: 2,
        desc: 'Моторизированный штатив (когда установлена видеокамера 2/3 тира). Позволяет крутить камеру из фургона.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Tripod_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Дополнительное вращение камеры', value: 'Да' },
          { type: 'neutral', label: 'Вероятность опрокидывания призраком', value: 'Низкая' }
        ]
      },
      {
        level: 3,
        desc: 'Массивный металлический штатив с мотором. Призрак не может его опрокинуть.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Tripod_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Дополнительное вращение камеры', value: 'Да' },
          { type: 'positive', label: 'Не может быть опрокинут призраком' }
        ]
      }
    ]
  },
  {
    id: 'firelight',
    name: 'Светильник (Свечи/Лампада)',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Firelight_Tier_II_Render.png',
    description: 'Предотвращает или замедляет падение рассудка.',
    fullDescription: [
      'Горящая свеча или лампада освещает небольшое пространство вокруг, но главное её свойство — замедление истощения рассудка в темноте.',
      'Онрё начнет охоту, если потушит 3 свечи/лампады подряд в радиусе 4 метров.'
    ],
    tiers: [
      {
        level: 1,
        desc: 'Обычная короткая свеча. Горит недолго, защищает от потери рассудка на 33%.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Firelight_Tier_I_Render.png',
        characteristics: [
          { type: 'neutral', label: 'Снижение падения рассудка', value: '33%' },
          { type: 'negative', label: 'Время горения (м)', value: '3' },
          { type: 'positive', label: 'Не электроника' }
        ]
      },
      {
        level: 2,
        desc: 'Высокая толстая свеча. В 2 раза дольше горит, защищает рассудок на 66%.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Firelight_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Снижение падения рассудка', value: '66%' },
          { type: 'neutral', label: 'Время горения (м)', value: '5' },
          { type: 'positive', label: 'Не электроника' }
        ]
      },
      {
        level: 3,
        desc: 'Закрытая керосиновая лампада. Защищает рассудок на 100%, не задувается призраком при обычных блужданиях, и водонепроницаема!',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Firelight_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Снижение падения рассудка', value: '100%' },
          { type: 'positive', label: 'Не задувается ветром/дождем' },
          { type: 'negative', label: 'Не электроника, но требует зажигалки' }
        ]
      }
    ]
  },
  {
    id: 'igniter',
    name: 'Зажигалка (Запал)',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Igniter_Tier_II_Render.png',
    description: 'Обязательный предмет для поджигания свечей и благовоний.',
    tiers: [
      {
        level: 1,
        desc: 'Спички. Быстро гаснут, есть 10 штук в коробке.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Igniter_Tier_I_Render.png',
        characteristics: [
          { type: 'negative', label: 'Использований', value: '10' },
          { type: 'positive', label: 'Не электроника' }
        ]
      },
      {
        level: 2,
        desc: 'Классическая газовая зажигалка Zippo. Горит в течение 5 минут. Отлично освещает вблизи.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Igniter_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Длительность (м)', value: '5' },
          { type: 'positive', label: 'Не электроника' }
        ]
      },
      {
        level: 3,
        desc: 'Штормовая зажигалка. Длится 10 минут, не гаснет на улице под дождем и мощно освещает.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Igniter_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Длительность (м)', value: '10' },
          { type: 'positive', label: 'Водонепроницаемость' },
          { type: 'positive', label: 'Не электроника' }
        ]
      }
    ]
  },
  {
    id: 'motion',
    name: 'Датчик движения',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Motion_Sensor_Tier_II_Render.png',
    description: 'Устанавливается на стену/пол и срабатывает, когда мимо проходит призрак или игрок.',
    fullDescription: [
      'Отличный инструмент для контроля передвижений призрака. Сигнал отображается на карте в фургоне.',
      'Также полезен для заданий "Заставьте призрака пройти через датчик".'
    ],
    tiers: [
      {
        level: 1,
        desc: 'Линейный датчик. Светит лучом-полосой вперед. Издает звук при срабатывании.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Motion_Sensor_Tier_I_Render.png',
        characteristics: [
          { type: 'neutral', label: 'Форма зоны', value: 'Узкая линия' },
          { type: 'negative', label: 'Электроника' }
        ]
      },
      {
        level: 2,
        desc: 'Инфракрасный объемный датчик. Имеет широкую конусообразную форму детекции и световой/звуковой индикатор.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Motion_Sensor_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Форма зоны', value: 'Конус' },
          { type: 'negative', label: 'Электроника' }
        ]
      },
      {
        level: 3,
        desc: 'Сферический датчик. Улавливает всё в шарообразной области вокруг себя.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Motion_Sensor_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Форма зоны', value: 'Сфера' },
          { type: 'negative', label: 'Электроника' }
        ]
      }
    ]
  },
  {
    id: 'photo',
    name: 'Фотокамера',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Photo_Camera_Tier_II_Render.png',
    description: 'Используется для фотографирования улик, призраков, костей и проклятых предметов.',
    fullDescription: [
      'Каждая камера вмещает ограниченное число фотографий.',
      'В Журнал помещается до 10 фотографий. Фотографии с хорошим качеством (вблизи и в фокусе) приносят больше денег.'
    ],
    tiers: [
      {
        level: 1,
        desc: 'Старый "Полароид". Долгая перезарядка, долгое проявление фото (3с), средняя чёткость.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Photo_Camera_Tier_I_Render.png',
        characteristics: [
          { type: 'neutral', label: 'Вместимость', value: '5 фото' },
          { type: 'negative', label: 'Задержка между фото', value: '3 сек' },
          { type: 'negative', label: 'Электроника' }
        ]
      },
      {
        level: 2,
        desc: 'Современная "мыльница" с экраном. Делает фото мгновенно и имеет хорошую чёткость.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Photo_Camera_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Вместимость', value: '5 фото' },
          { type: 'neutral', label: 'Задержка между фото', value: '1.5 сек' },
          { type: 'positive', label: 'Экран видоискателя' },
          { type: 'negative', label: 'Электроника' }
        ]
      },
      {
        level: 3,
        desc: 'Зеркальный цифровой фотоаппарат с мощной вспышкой. Четкое изображение и минимальная задержка между снимками (вы можете быстро "спамить").',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Photo_Camera_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Вместимость', value: '5 фото' },
          { type: 'positive', label: 'Задержка между фото', value: 'Почти нет' },
          { type: 'positive', label: 'Экран видоискателя' },
          { type: 'negative', label: 'Электроника' }
        ]
      }
    ]
  },
  {
    id: 'sanity',
    name: 'Успокоительное',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Sanity_Medication_Tier_II_Render.png',
    description: 'Медикаменты для восстановления рассудка игрока и предотвращения атак призраков с высоким порогом.',
    tiers: [
      {
        level: 1,
        desc: 'Обычные таблетки (Антидепрессанты). Работают невероятно медленно: восстанавливают шкалу постепенно за 30 сек.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Sanity_Medication_Tier_I_Render.png',
        characteristics: [
          { type: 'neutral', label: 'Восстановление', value: '30%' },
          { type: 'negative', label: 'Скорость', value: 'Медленно (30 сек)' }
        ]
      },
      {
        level: 2,
        desc: 'Медицинский сироп в банке. Восстанавливает значительно быстрее (за 10 сек).',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Sanity_Medication_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Восстановление', value: '40%' },
          { type: 'neutral', label: 'Скорость', value: 'Средне (10 сек)' }
        ]
      },
      {
        level: 3,
        desc: 'Адреналиновый спрей / Шприц. Мгновенное восстановление рассудка и дает небольшой буст (предотвращает истощение).',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Sanity_Medication_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Восстановление', value: '50%' },
          { type: 'positive', label: 'Скорость', value: 'Мгновенно' },
          { type: 'positive', label: 'Адреналиновый бонус (остановка истощения)' }
        ]
      }
    ]
  },
  {
    id: 'sound2',
    name: 'Датчик звука',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Sound_Sensor_Tier_II_Render.png',
    description: 'Улавливает звуки в помещении и передает их на консоль в фургоне. Помогает найти комнату призрака из безопасной зоны.',
    tiers: [
      {
        level: 1,
        desc: 'Небольшой микрофон в поролоне. Покрывает малую площадь (5м) сферически.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Sound_Sensor_Tier_I_Render.png',
        characteristics: [
          { type: 'neutral', label: 'Форма детекции', value: 'Сфера 5м' },
          { type: 'negative', label: 'Электроника' }
        ]
      },
      {
        level: 2,
        desc: 'Настенный микрофон "пушка". Улавливает всё в огромном 10м полусфере/конусе. Удобно размещать в дверных проемах.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Sound_Sensor_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Форма детекции', value: 'Конус / полушарие 10м' },
          { type: 'negative', label: 'Электроника' }
        ]
      },
      {
        level: 3,
        desc: 'Умный датчик звука. Регулируемый радиус (5, 10 или 15м) и сфера 360 градусов.',
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Sound_Sensor_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Форма детекции', value: 'Сфера 360' },
          { type: 'positive', label: 'Регулируемый размер (5-15м)' },
          { type: 'negative', label: 'Электроника' }
        ]
      }
    ]
  }
];

let fileContent = fs.readFileSync('src/data/equipment.ts', 'utf8');

for (let e of equipments) {
  const matchRegExp = new RegExp(\`\\\\{\\\\s*id:\\s*'\${e.id}'.*?\\\\},\`, 's');
  // Only replace if it matches the general structure without tiers, but actually I will just do a complete generic replacement
  // However, I can just use a RegExp that handles the whole object up to the next item or end of array
  const regex = new RegExp(\`\\\\{\\\\s*id:\\s*'\${e.id}'.*?(?=\\\\{\\\\s*id:\\s*'|\\\\}\\\\s*\\\\];)\`, 's');
  
  const struct = \`{
    id: '\${e.id}',
    name: '\${e.name}',
    category: '\${e.category}',
    icon: '\${e.icon}',
    description: '\${e.description}',
    \${e.fullDescription ? \`fullDescription: \${JSON.stringify(e.fullDescription)},\` : ''}
    tiers: \${JSON.stringify(e.tiers, null, 6)}
  },
  \`;
  fileContent = fileContent.replace(regex, struct);
}

fs.writeFileSync('src/data/equipment.ts', fileContent);
console.log('Injected missing equipment components.');
