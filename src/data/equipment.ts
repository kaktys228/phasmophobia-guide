import { EQUIPMENT_PATCHES, localizeEquipmentImage } from './equipmentSupplement';

export interface EquipmentTierCharacteristic {
  type: 'positive' | 'negative' | 'neutral';
  label: string;
  value?: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: 'basic' | 'shop';
  icon: string;
  description?: string;
  fullDescription?: string[];
  tiers?: { 
    level: number; 
    desc: string; 
    image: string;
    characteristics?: EquipmentTierCharacteristic[];
  }[];
}

const BASE_EQUIPMENT: EquipmentItem[] = [
  // --- BASIC ---
  {
    id: 'dots',
    name: 'Лазерный проектор',
    category: 'basic',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/D.O.T.S._Projector_Tier_II_Render.png',
    description: 'Матрица лазерных точек, позволяющая увидеть силуэт призрака, когда он пробегает через освещенную зону.',
    fullDescription: [
      'Лазерный проектор (англ. D.O.T.S. Projector) — это стартовое снаряжение, доступное с начала игры, а также своего рода улика, которая используется для выявления движения призрака.',
      'Лазерный проектор можно разместить на стене или полу F (по умолч.). Он излучает матрицу ярко-зелёных лазерных точек на небольшой площади от проектора.',
      'Призраки с доказательством Лазерный проекции иногда переходят в «состояние проекции». При этом слабый силуэт призрака может быть виден до 6 секунд и только при включённом лазерном проекторе. Призрак также будет идти к игроку, если оба находятся в одной комнате, или к случайной точке маршрута в пределах любимой комнаты, если поблизости нет игроков. Хотя эти силуэты видны невооруженным глазом (если призрак не Горё), видеокамера с ночным видением может обеспечить лучшую видимость. Это означает, что лазерную проекцию можно отслеживать одновременно с призрачным огоньком.',
      'Все установленные проекторы можно включать и выключать нажатием ЛКМ.',
      'Вращение лазерного проектора Т3 можно приостанавливать с помощью ЛКМ без прекращения работы.',
      'Силуэт призрака на лазерном проекторе можно сфотографировать и он будет подписан в журнале как Призрак. Данная фотография засчитывается в задание «Сфотографировать призрака» без необходимости ждать паранормальное явление.'
    ],
    tiers: [
      { 
        level: 1, 
        desc: 'Лазерный проектор Т1 дополнительно можно удерживать и переключать ПКМ (по умолч.), чтобы создать конус лазерного излучения в том месте, куда он направлен. Лазерный проектор является электронным оборудованием, но только проектор Т1, если его активировать и удерживать, привлечёт призрака к игроку во время охоты, а в остальном его можно безопасно держать.', 
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/D.O.T.S._Projector_Tier_I_Render.png',
        characteristics: [
          { type: 'positive', label: 'Направленный свет', value: 'Узкий' },
          { type: 'positive', label: 'Радиус (м)', value: '5' },
          { type: 'positive', label: 'Ручной' },
          { type: 'positive', label: 'Можно разместить' },
          { type: 'negative', label: 'Электроника' }
        ]
      },
      { 
        level: 2, 
        desc: 'Инфракрасный проектор с датчиком движения. Охватывает среднюю зону конусом, устанавливается на пол.', 
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/D.O.T.S._Projector_Tier_II_Render.png',
        characteristics: [
          { type: 'positive', label: 'Направленный свет', value: 'Средний' },
          { type: 'positive', label: 'Радиус (м)', value: '2.5' },
          { type: 'positive', label: 'Можно разместить' },
          { type: 'negative', label: 'Электроника' }
        ]
      },
      { 
        level: 3, 
        desc: 'Моторизированный прожектор D.O.T.S. Сканирует комнату на 360 градусов, покрывая огромную площадь лучами.', 
        image: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/D.O.T.S._Projector_Tier_III_Render.png',
        characteristics: [
          { type: 'positive', label: 'Освещение', value: 'Широкое' },
          { type: 'positive', label: 'Радиус (м)', value: '7' },
          { type: 'positive', label: 'Можно разместить' },
          { type: 'positive', label: 'Моторизированный' },
          { type: 'negative', label: 'Электроника' }
        ]
      }
    ]
  },
  {
    id: 'spirit_box',
    name: 'Радиоприёмник',
    category: 'basic',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Spirit_Box_Tier_II_Render.png',
    description: 'Используется для связи с призраком. Позволяет задавать вопросы, если вы находитесь в темноте и рядом с ним.',
    tiers: [
      {
            "level": 1,
            "desc": "Радиоприемник Т1 — это старое радио AM/FM частоты. Оно имеет низкое качество звука, и поэтому сообщения от призрака трудно разобрать. Для получения ответа игрок должен находиться на расстоянии 3 метров от призрака. Когда вопрос успешно распознан и соблюдены все условия, светодиод с призраком станет белым. Это укажет на получение улики. Если светодиод горит красным — условие не выполнено или улики нет.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/Spirit_Box_Tier_I_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Радиус (м)",
                        "value": "3"
                  },
                  {
                        "type": "negative",
                        "label": "Качество звука",
                        "value": "Низко"
                  },
                  {
                        "type": "negative",
                        "label": "Отклик",
                        "value": "Низко"
                  },
                  {
                        "type": "negative",
                        "label": "Электроника"
                  }
            ]
      },
      {
            "level": 2,
            "desc": "Радиоприемник Т2 — это знаменитый сканер частот P-SB7. Качество звука заметно улучшено по сравнению с Т1, и сообщения от призраков становятся четкими. Для получения ответа игрок должен находиться на расстоянии 4 метров от призрака. На дисплее отображается значок призрака, который загорается при получении ответа, а Х загорается, когда вопрос распознан, но ответа нет.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/Spirit_Box_Tier_II_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Радиус (м)",
                        "value": "4"
                  },
                  {
                        "type": "neutral",
                        "label": "Качество звука",
                        "value": "Средне"
                  },
                  {
                        "type": "neutral",
                        "label": "Отклик",
                        "value": "Средне"
                  },
                  {
                        "type": "negative",
                        "label": "Электроника"
                  }
            ]
      },
      {
            "level": 3,
            "desc": "Радиоприемник Т3 — модель SB-11-ANC, в которой используется шумоподавление. Игрок должен находиться в радиусе 5 метров от призрака. При получении ответа загорается индикатор на самом устройстве. Как и в других моделях, он загорается белым, когда получен успешный ответ, и красным, когда ответа нет.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/Spirit_Box_Tier_III_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Радиус (м)",
                        "value": "5"
                  },
                  {
                        "type": "positive",
                        "label": "Качество звука",
                        "value": "Высоко"
                  },
                  {
                        "type": "positive",
                        "label": "Отклик",
                        "value": "Высоко"
                  },
                  {
                        "type": "negative",
                        "label": "Электроника"
                  }
            ]
      }
]
  },
  {
    id: 'uv',
    name: 'Неоновая палочка / УФ',
    category: 'basic',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/UV_Light_Tier_II_Render.png',
    description: 'Обнаруживает отпечатки пальцев на поверхностях и следы от ног призрака.',
    tiers: [
      {
            "level": 1,
            "desc": "УФ-фонарик Т1 (неоновая палочка) — это небольшая светящаяся палочка. При активации она ярко светится в течение 1 минуты, затем тускнеет и светит наполовину в течение следующих 10 секунд. После затухания ее можно встряхнуть (ПКМ), чтобы восстановить свет.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/UV_Light_Tier_I_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Длительность (сек.)",
                        "value": "60"
                  },
                  {
                        "type": "positive",
                        "label": "Время зарядки",
                        "value": "10"
                  },
                  {
                        "type": "positive",
                        "label": "Рассеянный свет",
                        "value": "3"
                  }
            ]
      },
      {
            "level": 2,
            "desc": "УФ-фонарик Т2 обладает более узким пучком света, чем неоновая палочка, и используется как обычный фонарик. Отпечатки заряжаются в два раза быстрее, чем при использовании Т1.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/UV_Light_Tier_II_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Время зарядки",
                        "value": "5"
                  },
                  {
                        "type": "positive",
                        "label": "Направленный свет",
                        "value": "Узкий"
                  },
                  {
                        "type": "negative",
                        "label": "Электроника"
                  }
            ]
      },
      {
            "level": 3,
            "desc": "УФ-фонарик Т3 (УФ-прожектор) светит ярким, толстым пучком. Благодаря ширине светового пучка легко находить следы или отпечатки в больших комнатах. У него самое быстрое время зарядки.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/UV_Light_Tier_III_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Время зарядки",
                        "value": "1.5"
                  },
                  {
                        "type": "positive",
                        "label": "Направленный свет",
                        "value": "Широкий"
                  },
                  {
                        "type": "negative",
                        "label": "Электроника"
                  }
            ]
      }
]
  },
  {
    id: 'emf',
    name: 'Детектор ЭМП',
    category: 'basic',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/EMF_Reader_Tier_II_Render.png',
    description: 'Обнаруживает всплески электромагнитного поля.',
    tiers: [
      {
            "level": 1,
            "desc": "Детектор ЭМП Т1 — это старый измеритель призрачного поля. Напоминает старый счётчик Гейгера и имеет диапазон измерения 1,7 метра. При обнаружении ЭМП стрелка начнёт дёргаться. При обнаружении ЭМП (ур. 5) стрелка сдвигается вправо до упора (выше 5).",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/EMF_Reader_Tier_I_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Радиус (м)",
                        "value": "1.7"
                  },
                  {
                        "type": "negative",
                        "label": "Точность",
                        "value": "Низко"
                  },
                  {
                        "type": "negative",
                        "label": "Электроника"
                  }
            ]
      },
      {
            "level": 2,
            "desc": "Детектор ЭМП Т2 — это знаменитый измеритель K2. Прибор легко читаем и издает чёткий звуковой сигнал. ЭМП (ур. 5) фиксируется, когда загораются все 5 светодиодов, вплоть до красного.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/EMF_Reader_Tier_II_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Радиус (м)",
                        "value": "1.7"
                  },
                  {
                        "type": "neutral",
                        "label": "Точность",
                        "value": "Высоко"
                  },
                  {
                        "type": "negative",
                        "label": "Электроника"
                  }
            ]
      },
      {
            "level": 3,
            "desc": "Детектор ЭМП Т3 — это устройство, способное одновременно показывать направление до 3 источника ЭМП и их мощность. Точное расстояние до источников на нём не отображается. Цифра \"5\" укажет на обнаружение улики.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/EMF_Reader_Tier_III_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Радиус (м)",
                        "value": "3.5"
                  },
                  {
                        "type": "positive",
                        "label": "Точность",
                        "value": "Высоко"
                  },
                  {
                        "type": "positive",
                        "label": "Индикатор направления"
                  },
                  {
                        "type": "negative",
                        "label": "Электроника"
                  }
            ]
      }
]
  },
  {
    id: 'writing',
    name: 'Блокнот',
    category: 'basic',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Ghost_Writing_Book_Tier_II_Render.png',
    description: 'Призрак может оставить запись или рисунок.',
    tiers: [
      {
            "level": 1,
            "desc": "Блокнот Т1 — обычная старая записная книжка. Призрак взаимодействует с ней неохотно (низкий шанс), и для этого необходимо находиться на расстоянии менее 3 метров.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/Ghost_Writing_Book_Tier_I_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Радиус (м)",
                        "value": "3"
                  },
                  {
                        "type": "negative",
                        "label": "Скорость взаимодействия",
                        "value": "Низко"
                  }
            ]
      },
      {
            "level": 2,
            "desc": "Блокнот Т2 — более современный журнал с кожаной обложкой. Он имеет лучшую дальность (4 метра) и средний шанс взаимодействия.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/Ghost_Writing_Book_Tier_II_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Радиус (м)",
                        "value": "4"
                  },
                  {
                        "type": "positive",
                        "label": "Скорость взаимодействия",
                        "value": "Средне"
                  }
            ]
      },
      {
            "level": 3,
            "desc": "Блокнот Т3 — современная электронная книжка (планшет) большой дальности. Радиус обнаружения 5 метров, шанс взаимодействия очень высокий.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/Ghost_Writing_Book_Tier_III_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Радиус (м)",
                        "value": "5"
                  },
                  {
                        "type": "positive",
                        "label": "Скорость взаимодействия",
                        "value": "Высоко"
                  }
            ]
      }
]
  },
  {
    id: 'thermometer',
    name: 'Термометр',
    category: 'basic',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Thermometer_Tier_II_Render.png',
    description: 'Позволяет найти любимую комнату призрака.',
    tiers: [
      {
            "level": 1,
            "desc": "Термометр Т1 — это старый аналоговый настенный термометр со спиртовой или ртутной шкалой. На измерение комнатной температуры уходит какое-то время, скорость его обновления низка, а точность зависит от того, насколько игрок может визуально распознать уровень жидкости на границе шкалы.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/Thermometer_Tier_I_Render.png",
            "characteristics": [
                  {
                        "type": "negative",
                        "label": "Точность",
                        "value": "Низко"
                  },
                  {
                        "type": "negative",
                        "label": "Скорость",
                        "value": "Низко"
                  },
                  {
                        "type": "positive",
                        "label": "Не потребляется"
                  },
                  {
                        "type": "positive",
                        "label": "Не электроника"
                  }
            ]
      },
      {
            "level": 2,
            "desc": "Термометр Т2 — стандартный цифровой термометр в виде пистолета. Он позволяет навести его на объект и получить мгновенные цифровые показания; для стабилизации он обновляется каждые 3 секунды с колебанием в два-три градуса от реальной температуры. В отличие от Т1, он воспринимается призраком как электроника.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/Thermometer_Tier_II_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Точность",
                        "value": "Средне"
                  },
                  {
                        "type": "neutral",
                        "label": "Скорость обновления (с)",
                        "value": "3"
                  },
                  {
                        "type": "negative",
                        "label": "Электроника"
                  }
            ]
      },
      {
            "level": 3,
            "desc": "Термометр Т3 — это продвинутый цифровой инфракрасный датчик. Он обновляется в два раза быстрее, чем Т2, каждые 1,5 секунды. И отображает более точное значение температуры.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/Thermometer_Tier_III_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Точность",
                        "value": "Высоко"
                  },
                  {
                        "type": "positive",
                        "label": "Скорость обновления (с)",
                        "value": "1.5"
                  },
                  {
                        "type": "negative",
                        "label": "Электроника"
                  }
            ]
      }
]
  },
  {
    id: 'camera',
    name: 'Видеокамера',
    category: 'basic',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Video_Camera_Tier_II_Render.png',
    description: 'Используется для наблюдения за призрачными огоньками и лазерным проектором.',
    tiers: [
      {
            "level": 1,
            "desc": "Видеокамера Т1 — старая аналоговая камкордер-камера с низким качеством изображения и высоким уровнем помех при паранормальной активности.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/Video_Camera_Tier_I_Render.png",
            "characteristics": [
                  {
                        "type": "neutral",
                        "label": "Качество изображения",
                        "value": "Низко"
                  },
                  {
                        "type": "negative",
                        "label": "Искажения",
                        "value": "Высоко"
                  },
                  {
                        "type": "negative",
                        "label": "Шанс опрокидывания",
                        "value": "Высоко"
                  },
                  {
                        "type": "negative",
                        "label": "Электроника"
                  }
            ]
      },
      {
            "level": 2,
            "desc": "Видеокамера Т2 — современная Sony Handycam. Разрешение лучше, экран больше. Качество ночного видения улучшено. Искажения присутствуют, но они не такие серьезные.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/Video_Camera_Tier_II_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Качество изображения",
                        "value": "Средне"
                  },
                  {
                        "type": "negative",
                        "label": "Искажения",
                        "value": "Средне"
                  },
                  {
                        "type": "negative",
                        "label": "Шанс опрокидывания",
                        "value": "Высоко"
                  },
                  {
                        "type": "negative",
                        "label": "Электроника"
                  }
            ]
      },
      {
            "level": 3,
            "desc": "Видеокамера Т3 — профессиональная кинокамера. Высочайшее качество ночного видения без сильных помех. Угол обзора широкий.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/Video_Camera_Tier_III_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Качество изображения",
                        "value": "Высоко"
                  },
                  {
                        "type": "positive",
                        "label": "Искажения",
                        "value": "Низко"
                  },
                  {
                        "type": "negative",
                        "label": "Шанс опрокидывания",
                        "value": "Высоко"
                  },
                  {
                        "type": "negative",
                        "label": "Электроника"
                  }
            ]
      }
]
  },
  
  // --- SHOP ---
  {
    id: 'flashlight',
    name: 'Фонарик',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Flashlight_Tier_II_Render.png',
    description: 'Главный источник света.',
    tiers: [
      {
            "level": 1,
            "desc": "Фонарик Т1 — старый классический фонарь. Имеет узкий луч и низкую яркость.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/Flashlight_Tier_I_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Направленный свет",
                        "value": "Узкий"
                  },
                  {
                        "type": "negative",
                        "label": "Интенсивность",
                        "value": "Низко"
                  },
                  {
                        "type": "negative",
                        "label": "Электроника"
                  }
            ]
      },
      {
            "level": 2,
            "desc": "Фонарик Т2 — современный светодиодный фонарик. Обеспечивает хороший конус света.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/Flashlight_Tier_II_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Направленный свет",
                        "value": "Средний"
                  },
                  {
                        "type": "neutral",
                        "label": "Интенсивность",
                        "value": "Средне"
                  },
                  {
                        "type": "negative",
                        "label": "Электроника"
                  }
            ]
      },
      {
            "level": 3,
            "desc": "Фонарик Т3 (Мощный фонарик) — лучший источник мобильного света. Покрывает большую часть поля зрения игрока.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/Flashlight_Tier_III_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Направленный свет",
                        "value": "Широкий"
                  },
                  {
                        "type": "positive",
                        "label": "Интенсивность",
                        "value": "Высоко"
                  },
                  {
                        "type": "negative",
                        "label": "Электроника"
                  }
            ]
      }
]
  },
  {
    id: 'crucifix',
    name: 'Распятие',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Crucifix_Tier_II_Render.png',
    description: 'Останавливает призрака от начала охоты (если он спавнится рядом с распятием).',
    fullDescription: ["Термометр (англ. Thermometer) — это стартовое снаряжение, доступное с начала игры. Используется для измерения температуры окружающей среды и основной инструмент для определения минусовой температуры.","Показания температуры ниже 5°C (41°F) обычно указывают на то, что призрак находится в комнате (или недавно находился в ней). Этот маркер менее полезен в неясную погоду на Maple Lodge Campsite или когда источник электропитания был выключен достаточно долго и температура не повысилась.","При использовании термометров, брошенных на пол, выключение и повторное включение их или перемещение между комнатами перед попыткой измерения температуры может помочь снизить риск ошибок.","Показания термометра Т2 будет отличаться от фактического значения максимум на +3 градуса по Цельсию, в то время как показания термометра Т1 и Т3 будут колебаться максимум на +2 градуса по Цельсию."],
    tiers: [
      {
            "level": 1,
            "desc": "Распятие Т1 — это старое деревянное распятие. Оно защищает небольшую область радиусом 3 метра и сгорает после одной остановленной охоты.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/Crucifix_Tier_I_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Радиус (м)",
                        "value": "3"
                  },
                  {
                        "type": "positive",
                        "label": "Использований",
                        "value": "1"
                  },
                  {
                        "type": "positive",
                        "label": "Можно разместить"
                  },
                  {
                        "type": "negative",
                        "label": "Защита от проклятой охоты"
                  },
                  {
                        "type": "negative",
                        "label": "Одноразовое"
                  }
            ]
      },
      {
            "level": 2,
            "desc": "Распятие Т2 — классическое чугунное распятие, останавливает охоту в радиусе 4 метров и выдерживает до двух использований перед сгоранием.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/Crucifix_Tier_II_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Радиус (м)",
                        "value": "4"
                  },
                  {
                        "type": "positive",
                        "label": "Использований",
                        "value": "2"
                  },
                  {
                        "type": "positive",
                        "label": "Можно разместить"
                  },
                  {
                        "type": "negative",
                        "label": "Защита от проклятой охоты"
                  },
                  {
                        "type": "negative",
                        "label": "Одноразовое"
                  }
            ]
      },
      {
            "level": 3,
            "desc": "Распятие Т3 — серебряное святое распятие, которое имеет огромный радиус действия в 5 метров и также имеет 2 заряда. Самое главное — оно способно предотвратить блокировку Проклятой Охоты ценой двух зарядов сразу.",
            "image": "https://phasmophobia.fandom.com/wiki/Special:FilePath/Crucifix_Tier_III_Render.png",
            "characteristics": [
                  {
                        "type": "positive",
                        "label": "Защита от проклятой охоты"
                  },
                  {
                        "type": "positive",
                        "label": "Радиус (м)",
                        "value": "5"
                  },
                  {
                        "type": "positive",
                        "label": "Использований",
                        "value": "2"
                  },
                  {
                        "type": "positive",
                        "label": "Можно разместить"
                  },
                  {
                        "type": "negative",
                        "label": "Одноразовое"
                  }
            ]
      }
]
  },
  {
    id: 'headgear',
    name: 'Крепление на голову',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Head_Gear_Tier_II_Render.png',
  },
  {
    id: 'smudge',
    name: 'Благовоние',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Incense_Tier_II_Render.png',
    description: 'Защищает при охоте (ослепляет призрака) и повышает активность вне охоты.',
  },
  {
    id: 'paramic',
    name: 'Направленный микрофон',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Parabolic_Microphone_Tier_II_Render.png',
  },
  {
    id: 'salt',
    name: 'Соль',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Salt_Tier_II_Render.png',
  },
  {
    id: 'sound',
    name: 'Звуковой рекордер',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Sound_Sensor_Tier_II_Render.png',
  },
  {
    id: 'tripod',
    name: 'Штатив',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Tripod_Tier_II_Render.png',
  },
  {
    id: 'firelight',
    name: 'Светильник',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Firelight_Tier_II_Render.png',
  },
  {
    id: 'igniter',
    name: 'Зажигалка',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Igniter_Tier_II_Render.png',
  },
  {
    id: 'motion',
    name: 'Датчик движения',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Motion_Sensor_Tier_II_Render.png',
  },
  {
    id: 'photo',
    name: 'Фотокамера',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Photo_Camera_Tier_II_Render.png',
  },
  {
    id: 'sanity',
    name: 'Успокоительное',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Sanity_Medication_Tier_II_Render.png',
  },
  {
    id: 'sound2',
    name: 'Датчик звука',
    category: 'shop',
    icon: 'https://phasmophobia.fandom.com/wiki/Special:FilePath/Sound_Sensor_Tier_II_Render.png',
  }
];

export const EQUIPMENT: EquipmentItem[] = BASE_EQUIPMENT.map((item) => {
  const patch = EQUIPMENT_PATCHES[item.id] ?? {};
  const mergedTiers = patch.tiers ?? item.tiers;

  return {
    ...item,
    ...patch,
    icon: localizeEquipmentImage(patch.icon ?? item.icon),
    fullDescription: patch.fullDescription ?? item.fullDescription,
    tiers: mergedTiers?.map((tier) => ({
      ...tier,
      image: localizeEquipmentImage(tier.image),
    })),
  };
});
