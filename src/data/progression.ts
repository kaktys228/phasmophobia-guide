export interface ProgressCard {
  id: string;
  href: string;
  image: string;
  alt: string;
  title: string;
}

export interface ProgressArticle {
  title: string;
  articleHtml: string;
  description: string;
  image: string;
  source: string;
  entries?: {
    id: number;
    title: string;
    image: string;
    alt: string;
    prestigeLabel: string;
  }[];
}

export interface AchievementItem {
  slug: string;
  title: string;
  summary: string;
  detailHtml: string;
  image: string;
  source: string;
}

export const PROGRESS_HOME_CARDS: ProgressCard[] = [
  {
    "href": "/knowledge-base/progression/achievements",
    "image": "https://s3.phasmophobia.su/knowledge-base/achievements.webp?v=290326",
    "alt": "Достижения",
    "title": "Достижения",
    "id": "achievements"
  },
  {
    "href": "/knowledge-base/progression/apocalypse",
    "image": "https://s3.phasmophobia.su/knowledge-base/trophy.webp?v=290326",
    "alt": "Челлендж «Апокалипсис»",
    "title": "Челлендж «Апокалипсис»",
    "id": "apocalypse"
  },
  {
    "href": "/knowledge-base/progression/prestiges",
    "image": "https://s3.phasmophobia.su/knowledge-base/prestiges.webp?v=290326",
    "alt": "Престиж",
    "title": "Престиж",
    "id": "prestiges"
  },
  {
    "href": "/knowledge-base/progression/lvl-grind",
    "image": "https://s3.phasmophobia.su/knowledge-base/lvl-grind.webp?v=290326",
    "alt": "Стратегия фарма уровней",
    "title": "Стратегия фарма уровней",
    "id": "lvl-grind"
  }
];

export const PROGRESS_ARTICLES: Record<string, ProgressArticle> = {
  "apocalypse": {
    "title": "Челлендж «Апокалипсис»",
    "articleHtml": "<h2 id=\"основная-информация\"><a target=\"_blank\" rel=\"noreferrer\" aria-hidden=\"true\" tabindex=\"-1\" href=\"#основная-информация\">Основная информация</a></h2>\n<h3 id=\"требования-к-заданию-следующие\"><a target=\"_blank\" rel=\"noreferrer\" aria-hidden=\"true\" tabindex=\"-1\" href=\"#требования-к-заданию-следующие\">Требования к заданию следующие:</a></h3>\n<ul>\n<li>Создайте кастомную сложность <em>(см. ниже)</em></li>\n<li>Играйте в одиночном режиме на карте <a target=\"_blank\" rel=\"noreferrer\" href=\"https://maps.phasmophobia.su/ru/sunny-meadows\">Sunny Meadows Mental Institution</a></li>\n<li>Выполните все 3 задачи</li>\n<li>Сделайте фотографию призрака</li>\n<li>Правильно определите тип призрака</li>\n<li>Необходимо уехать живым</li>\n</ul>\n<h3 id=\"награды-будут-вручаться-в-зависимости-от-установленной-кастомной-сложности\"><a target=\"_blank\" rel=\"noreferrer\" aria-hidden=\"true\" tabindex=\"-1\" href=\"#награды-будут-вручаться-в-зависимости-от-установленной-кастомной-сложности\">Награды будут вручаться в зависимости от установленной кастомной сложности:</a></h3>\n<ul>\n<li>Множитель 6x или выше: Бронзовый трофей, бейдж &quot;Адепт Апокалипсиса&quot;</li>\n<li>Множитель 10x или выше: Серебрянный трофей, бейдж &quot;Мастер Апокалипсиса&quot;</li>\n<li>Множитель 15x: Золотой трофей, бейдж &quot;Легенда Апокалипсиса&quot;</li>\n</ul>\n<p>Завершение контракта с более высоким множителем автоматически наградит трофеями и значками из более низких множителей; все три трофея и значка можно получить в рамках одного контракта с множителем 15x.</p>\n<p>После выполнения всех условий игрок автоматически получит трофей(и) и значок(и) в конце контракта; дополнительных действий не требуется. Полученные трофеи будут отображаться в лобби.</p>\n<p>Челлендж является постоянным и будет существовать в игре на неопределённый срок.</p>",
    "description": "Основная информация Требования к заданию следующие: Создайте кастомную сложность (см. ниже) Играйте в одиночном режиме на карте [Sunny Meadows Mental Institution](http...",
    "image": "https://s3.phasmophobia.su/knowledge-base/trophy.webp",
    "source": "https://phasmophobia.su/knowledge-base/progression/apocalypse"
  },
  "prestiges": {
    "title": "Престиж",
    "articleHtml": "<h2 id=\"общее-описание\"><a target=\"_blank\" rel=\"noreferrer\" aria-hidden=\"true\" tabindex=\"-1\" href=\"#общее-описание\">Общее описание</a></h2>\n<p>Престиж — это игровая механика, обнуляющая текущий уровень, опыт, количество денег, уровень снаряжения и его количества, но позволяющая получить за это особые награды.</p>\n<p>Каждый игрок начинает с 1 уровня с 0 XP и зарабатывает XP за выполнение контрактов. Опыт, необходимый для повышения уровня, постепенно увеличивается. Максимально можно получить 9999 уровень.</p>\n<p>При достижении 100-го уровня игрок получает возможность повысить Престиж, который обнулит уровень, деньги и снаряжение. Максимально можно достичь 20-го Престижа.</p>\n<h2 id=\"список-престижей\"><a target=\"_blank\" rel=\"noreferrer\" aria-hidden=\"true\" tabindex=\"-1\" href=\"#список-престижей\">Список престижей</a></h2>\n<p>За каждый Престиж игрок получает новый бейдж (для ID-карты и на плечо персонажа), новое оформление ID-карты и дополнительные шаблоны для снаряжения в магазине (максимум 10 шаблонов).</p>\n<p>Уровень Престижа игрока будет отображаться в виде римских цифр перед его уровнем (например, IV-007). Престижи 1-10 имеют белый фон и бейдж со статичным изображением, а престижи 11-20 с чёрным фоном и анимированным бейджем.</p>\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<table><thead><tr><th>Название</th><th>Изображение</th><th>Престиж</th></tr></thead><tbody><tr><td>Новичок (Internt)</td><td><img src=\"https://s3.phasmophobia.su/knowledge-base/prestiges/prestige0.webp\" alt=\"Бейджик для престиж 0\"/></td><td>Без престижа</td></tr><tr><td>Recruit</td><td><img src=\"https://s3.phasmophobia.su/knowledge-base/prestiges/prestige1.webp\" alt=\"Бейджик для престиж 1\"/></td><td>Престиж 1 (I)</td></tr><tr><td>Investigator</td><td><img src=\"https://s3.phasmophobia.su/knowledge-base/prestiges/prestige2.webp\" alt=\"Бейджик для престиж 2\"/></td><td>Престиж 2 (II)</td></tr><tr><td>Pvt. Investigator</td><td><img src=\"https://s3.phasmophobia.su/knowledge-base/prestiges/prestige3.webp\" alt=\"Бейджик для престиж 3\"/></td><td>Престиж 3 (III)</td></tr><tr><td>Detective</td><td><img src=\"https://s3.phasmophobia.su/knowledge-base/prestiges/prestige4.webp\" alt=\"Бейджик для престиж 4\"/></td><td>Престиж 4 (IV)</td></tr><tr><td>Technician</td><td><img src=\"https://s3.phasmophobia.su/knowledge-base/prestiges/prestige5.webp\" alt=\"Бейджик для престиж 5\"/></td><td>Престиж 5 (V)</td></tr><tr><td>Specialist</td><td><img src=\"https://s3.phasmophobia.su/knowledge-base/prestiges/prestige6.webp\" alt=\"Бейджик для престиж 6\"/></td><td>Престиж 6 (VI)</td></tr><tr><td>Analyst</td><td><img src=\"https://s3.phasmophobia.su/knowledge-base/prestiges/prestige7.webp\" alt=\"Бейджик для престиж 7\"/></td><td>Престиж 7 (VII)</td></tr><tr><td>Agent</td><td><img src=\"https://s3.phasmophobia.su/knowledge-base/prestiges/prestige8.webp\" alt=\"Бейджик для престиж 8\"/></td><td>Престиж 8 (VIII)</td></tr><tr><td>Operator</td><td><img src=\"https://s3.phasmophobia.su/knowledge-base/prestiges/prestige9.webp\" alt=\"Бейджик для престиж 9\"/></td><td>Престиж 9 (IX)</td></tr><tr><td>Commissioner</td><td><img src=\"https://s3.phasmophobia.su/knowledge-base/prestiges/prestige10.webp\" alt=\"Бейджик для престиж 10\"/></td><td>Престиж 10 (X)</td></tr><tr><td>Commissioner</td><td><img src=\"https://s3.phasmophobia.su/knowledge-base/prestiges/prestige11.webp\" alt=\"Бейджик для престиж 11\"/></td><td>Престиж 11 (XI)</td></tr><tr><td>Commissioner</td><td><img src=\"https://s3.phasmophobia.su/knowledge-base/prestiges/prestige12.webp\" alt=\"Бейджик для престиж 12\"/></td><td>Престиж 12 (XII)</td></tr><tr><td>Commissioner</td><td><img src=\"https://s3.phasmophobia.su/knowledge-base/prestiges/prestige13.webp\" alt=\"Бейджик для престиж 13\"/></td><td>Престиж 13 (XIII)</td></tr><tr><td>Commissioner</td><td><img src=\"https://s3.phasmophobia.su/knowledge-base/prestiges/prestige14.webp\" alt=\"Бейджик для престиж 14\"/></td><td>Престиж 14 (XIV)</td></tr><tr><td>Commissioner</td><td><img src=\"https://s3.phasmophobia.su/knowledge-base/prestiges/prestige15.webp\" alt=\"Бейджик для престиж 15\"/></td><td>Престиж 15 (XV)</td></tr><tr><td>Commissioner</td><td><img src=\"https://s3.phasmophobia.su/knowledge-base/prestiges/prestige16.webp\" alt=\"Бейджик для престиж 16\"/></td><td>Престиж 16 (XVI)</td></tr><tr><td>Commissioner</td><td><img src=\"https://s3.phasmophobia.su/knowledge-base/prestiges/prestige17.webp\" alt=\"Бейджик для престиж 17\"/></td><td>Престиж 17 (XVII)</td></tr><tr><td>Commissioner</td><td><img src=\"https://s3.phasmophobia.su/knowledge-base/prestiges/prestige18.webp\" alt=\"Бейджик для престиж 18\"/></td><td>Престиж 18 (XVIII)</td></tr><tr><td>Commissioner</td><td><img src=\"https://s3.phasmophobia.su/knowledge-base/prestiges/prestige19.webp\" alt=\"Бейджик для престиж 19\"/></td><td>Престиж 19 (XIX)</td></tr><tr><td>Commissioner</td><td><img src=\"https://s3.phasmophobia.su/knowledge-base/prestiges/prestige20.webp\" alt=\"Бейджик для престиж 20\"/></td><td>Престиж 20 (XX)</td></tr></tbody></table>",
    "description": "Общее описаниеПрестиж — это игровая механика, обнуляющая текущий уровень, опыт, количество денег, уровень снаряжения и его количества, но позволяющая получить за это о...",
    "image": "https://s3.phasmophobia.su/knowledge-base/prestiges.webp",
    "source": "https://phasmophobia.su/knowledge-base/progression/prestiges",
    "entries": [
      {
        "id": 0,
        "title": "Новичок (Internt)",
        "image": "https://s3.phasmophobia.su/knowledge-base/prestiges/prestige0.webp",
        "alt": "Бейджик для престиж 0",
        "prestigeLabel": "Без престижа"
      },
      {
        "id": 1,
        "title": "Recruit",
        "image": "https://s3.phasmophobia.su/knowledge-base/prestiges/prestige1.webp",
        "alt": "Бейджик для престиж 1",
        "prestigeLabel": "Престиж 1 (I)"
      },
      {
        "id": 2,
        "title": "Investigator",
        "image": "https://s3.phasmophobia.su/knowledge-base/prestiges/prestige2.webp",
        "alt": "Бейджик для престиж 2",
        "prestigeLabel": "Престиж 2 (II)"
      },
      {
        "id": 3,
        "title": "Pvt. Investigator",
        "image": "https://s3.phasmophobia.su/knowledge-base/prestiges/prestige3.webp",
        "alt": "Бейджик для престиж 3",
        "prestigeLabel": "Престиж 3 (III)"
      },
      {
        "id": 4,
        "title": "Detective",
        "image": "https://s3.phasmophobia.su/knowledge-base/prestiges/prestige4.webp",
        "alt": "Бейджик для престиж 4",
        "prestigeLabel": "Престиж 4 (IV)"
      },
      {
        "id": 5,
        "title": "Technician",
        "image": "https://s3.phasmophobia.su/knowledge-base/prestiges/prestige5.webp",
        "alt": "Бейджик для престиж 5",
        "prestigeLabel": "Престиж 5 (V)"
      },
      {
        "id": 6,
        "title": "Specialist",
        "image": "https://s3.phasmophobia.su/knowledge-base/prestiges/prestige6.webp",
        "alt": "Бейджик для престиж 6",
        "prestigeLabel": "Престиж 6 (VI)"
      },
      {
        "id": 7,
        "title": "Analyst",
        "image": "https://s3.phasmophobia.su/knowledge-base/prestiges/prestige7.webp",
        "alt": "Бейджик для престиж 7",
        "prestigeLabel": "Престиж 7 (VII)"
      },
      {
        "id": 8,
        "title": "Agent",
        "image": "https://s3.phasmophobia.su/knowledge-base/prestiges/prestige8.webp",
        "alt": "Бейджик для престиж 8",
        "prestigeLabel": "Престиж 8 (VIII)"
      },
      {
        "id": 9,
        "title": "Operator",
        "image": "https://s3.phasmophobia.su/knowledge-base/prestiges/prestige9.webp",
        "alt": "Бейджик для престиж 9",
        "prestigeLabel": "Престиж 9 (IX)"
      },
      {
        "id": 10,
        "title": "Commissioner",
        "image": "https://s3.phasmophobia.su/knowledge-base/prestiges/prestige10.webp",
        "alt": "Бейджик для престиж 10",
        "prestigeLabel": "Престиж 10 (X)"
      },
      {
        "id": 11,
        "title": "Commissioner",
        "image": "https://s3.phasmophobia.su/knowledge-base/prestiges/prestige11.webp",
        "alt": "Бейджик для престиж 11",
        "prestigeLabel": "Престиж 11 (XI)"
      },
      {
        "id": 12,
        "title": "Commissioner",
        "image": "https://s3.phasmophobia.su/knowledge-base/prestiges/prestige12.webp",
        "alt": "Бейджик для престиж 12",
        "prestigeLabel": "Престиж 12 (XII)"
      },
      {
        "id": 13,
        "title": "Commissioner",
        "image": "https://s3.phasmophobia.su/knowledge-base/prestiges/prestige13.webp",
        "alt": "Бейджик для престиж 13",
        "prestigeLabel": "Престиж 13 (XIII)"
      },
      {
        "id": 14,
        "title": "Commissioner",
        "image": "https://s3.phasmophobia.su/knowledge-base/prestiges/prestige14.webp",
        "alt": "Бейджик для престиж 14",
        "prestigeLabel": "Престиж 14 (XIV)"
      },
      {
        "id": 15,
        "title": "Commissioner",
        "image": "https://s3.phasmophobia.su/knowledge-base/prestiges/prestige15.webp",
        "alt": "Бейджик для престиж 15",
        "prestigeLabel": "Престиж 15 (XV)"
      },
      {
        "id": 16,
        "title": "Commissioner",
        "image": "https://s3.phasmophobia.su/knowledge-base/prestiges/prestige16.webp",
        "alt": "Бейджик для престиж 16",
        "prestigeLabel": "Престиж 16 (XVI)"
      },
      {
        "id": 17,
        "title": "Commissioner",
        "image": "https://s3.phasmophobia.su/knowledge-base/prestiges/prestige17.webp",
        "alt": "Бейджик для престиж 17",
        "prestigeLabel": "Престиж 17 (XVII)"
      },
      {
        "id": 18,
        "title": "Commissioner",
        "image": "https://s3.phasmophobia.su/knowledge-base/prestiges/prestige18.webp",
        "alt": "Бейджик для престиж 18",
        "prestigeLabel": "Престиж 18 (XVIII)"
      },
      {
        "id": 19,
        "title": "Commissioner",
        "image": "https://s3.phasmophobia.su/knowledge-base/prestiges/prestige19.webp",
        "alt": "Бейджик для престиж 19",
        "prestigeLabel": "Престиж 19 (XIX)"
      },
      {
        "id": 20,
        "title": "Commissioner",
        "image": "https://s3.phasmophobia.su/knowledge-base/prestiges/prestige20.webp",
        "alt": "Бейджик для престиж 20",
        "prestigeLabel": "Престиж 20 (XX)"
      }
    ]
  },
  "lvl-grind": {
    "title": "Стратегия фарма уровней",
    "articleHtml": "<h2 id=\"стратегия-1297x-woodwind\"><a target=\"_blank\" rel=\"noreferrer\" aria-hidden=\"true\" tabindex=\"-1\" href=\"#стратегия-1297x-woodwind\">Стратегия: 12.97x WoodWind</a></h2>\n<h3 id=\"описание-стратегии\"><a target=\"_blank\" rel=\"noreferrer\" aria-hidden=\"true\" tabindex=\"-1\" href=\"#описание-стратегии\">Описание стратегии:</a></h3>\n<p>Цель данной стратегии — оставаться в игре достаточно долго, чтобы пережить одну охоту (можно и две, если вы предпочитаете аккуратность большему количеству попыток), а затем уехать. Стратегия требует хорошего понимания поведения призраков во время охоты и способности мансить их. Стратегия лучше всего работает в компании из двух и более игроков, но возможна и в одиночной игре.</p>\n<p>Для начала вам нужно подготовить необходимое снаряжение, которое должно включать: благовония (желательно Т1, чтобы призрак сохранял скорость и не задерживался на месте), зажигалки, соль (лучше Т2 или Т3) и устройство, которое можно оставить включённым для проверки на Райдзю (предпочительно использовать датчик ЭМП или другое устройство, которое поможет выполнить задание, например, направленный микрофон).</p>\n<h4 id=\"в-одиночной-игре\"><a target=\"_blank\" rel=\"noreferrer\" aria-hidden=\"true\" tabindex=\"-1\" href=\"#в-одиночной-игре\">В одиночной игре</a></h4>\n<p>Для начала возьмите электронное устройство, включите его и положите прямо за воротами (это будет использоваться для проверки на Райдзю). Затем возьмите соль, зажигалку и благовония.</p>\n<h4 id=\"в-мультиплеере\"><a target=\"_blank\" rel=\"noreferrer\" aria-hidden=\"true\" tabindex=\"-1\" href=\"#в-мультиплеере\">В мультиплеере</a></h4>\n<p>Один игрок берёт зажигалку и два благовония, а другой — соль, электронное устройство (для проверки на Райдзю и/или выполнения заданий) и любое другое оборудование, которое может пригодиться.</p>\n<h4 id=\"процесс-игры\"><a target=\"_blank\" rel=\"noreferrer\" aria-hidden=\"true\" tabindex=\"-1\" href=\"#процесс-игры\">Процесс игры</a></h4>\n<p>Следуйте к столам для пикника, расположенным сразу за воротами, или к костру. Рассыпьте соль на земле в месте, где, вероятно, пройдет призрак (например, на пути к кругу у костра или между столами для пикника). Затем ждите, пока призрак начнёт охоту.</p>\n<p>Когда охота начнётся, пытайтесь определить, с каким призраком имеете дело, исходя из его поведения (скорость передвижения, частота мерцания, ускорение возле электроники, пар при дыхании и т. д.). Продолжайте мансить вокруг костра или столов для пикника и используйте благовония по мере необходимости.</p>\n<p><em>Обратите внимание: начиная с версии 0.9.2.0, костёр больше не блокирует вашу видимость от призрака.</em></p>\n<p>После завершения охоты вы можете использовать таймер, чтобы определить, является ли призрак духом или демоном по времени перезарядки благовоний (это занимает довольно много времени, но позволяет выполнить больше заданий), или вы можете просто угадать, с каким призраком столкнулись, и уйти. Весь этот процесс можно завершить менее чем за 2 минуты, если оптимизировать действия, и он приносит от 2000 до 5000 очков опыта за правильного призрака и выполненные задания.</p>\n<h3 id=\"настройки-сложности\"><a target=\"_blank\" rel=\"noreferrer\" aria-hidden=\"true\" tabindex=\"-1\" href=\"#настройки-сложности\">Настройки сложности:</a></h3>\n<p>Эти настройки позволят вам получить множитель 12.57x, но вы сможете легко увеличить его до 12.97x, когда обретете больше уверенности, или даже до 13.97x, если будете действительно хороши в игре.</p>\n<h4 id=\"игрок\"><a target=\"_blank\" rel=\"noreferrer\" aria-hidden=\"true\" tabindex=\"-1\" href=\"#игрок\">Игрок</a></h4>\n<ul>\n<li>Начальный уровень рассудка: 0</li>\n<li>Эффективность успокоительного: 0</li>\n<li>Скорость снижения рассудка: 200%</li>\n<li>Бег: Выключен</li>\n<li>Скорость игрока: 100%</li>\n<li>Фонарики: Выкл</li>\n<li>Потеря предметов инвентаря в случае смерти: Вкл</li>\n</ul>\n<h4 id=\"призрак\"><a target=\"_blank\" rel=\"noreferrer\" aria-hidden=\"true\" tabindex=\"-1\" href=\"#призрак\">Призрак</a></h4>\n<ul>\n<li>Скорость призрака: 100%</li>\n<li>Частота перемещений: Высоко</li>\n<li>Смена любимой комнаты: Высоко</li>\n<li>Уровень активности: Низкое</li>\n<li>Частота событий: Низкая</li>\n<li>Дружелюбный призрак: Выкл</li>\n<li>Безопасный период: 0</li>\n<li>Длительность охоты: Низкая</li>\n<li>Убийства увеличивают охоту: Выкл</li>\n<li>Кол-во предоставленных доказательств: 0</li>\n</ul>\n<h4 id=\"контракт\"><a target=\"_blank\" rel=\"noreferrer\" aria-hidden=\"true\" tabindex=\"-1\" href=\"#контракт\">Контракт</a></h4>\n<ul>\n<li>Время на расстановку оборудования: 0</li>\n<li>Погода: Туман</li>\n<li>Двери открыты: Высоко</li>\n<li>Кол-во укрытий: Нет</li>\n<li>Монитор рассудка: Выкл</li>\n<li>Монитор активности: Выкл</li>\n<li>Щиток доступен с начала игры: Сломано</li>\n<li>Кол-во проклятых предметов: 0</li>\n</ul>\n<p>Используя эти настройки, вы получите множитель 12.57x. Погода установлена на &quot;Туман&quot;, потому что это облегчает обнаружение призрака и немного повышает яркость.</p>\n<h4 id=\"для-увеличения-множителя-измените\"><a target=\"_blank\" rel=\"noreferrer\" aria-hidden=\"true\" tabindex=\"-1\" href=\"#для-увеличения-множителя-измените\">Для увеличения множителя измените:</a></h4>\n<ul>\n<li>Длительность охоты на среднюю 12.97x <em>(небольшое повышение сложности)</em>. Увеличение до высокой сложности добавляет всего 0.10x, поэтому не рекомендуется.</li>\n<li>Скорость призрака на 125% (13.47x), 150% (13.97x) <em>(значительное повышение сложности)</em>.</li>\n<li>Скорость игрока на 75% (14.47x), 50% (14.97x) <em>(значительное повышение сложности)</em>.</li>\n<li>Изменение погоды на &quot;Ливень&quot; максимизирует множитель до 15.00x.</li>\n</ul>",
    "description": "Стратегия: 12.97x WoodWind Описание стратегии:Цель данной стратегии — оставаться в игре достаточно долго, чтобы пережить одну охоту (можно и две, если вы предпочитаете...",
    "image": "https://s3.phasmophobia.su/knowledge-base/lvl-grind.webp",
    "source": "https://phasmophobia.su/knowledge-base/progression/lvl-grind"
  }
};

export const ACHIEVEMENT_CATEGORIES = [
  {
    "id": "special",
    "title": "Особые",
    "slugs": [
      "escape-artist",
      "they-re-here",
      "the-bait",
      "doom-slayed",
      "flawless-execution",
      "director",
      "no-more-training-wheels"
    ]
  },
  {
    "id": "tasks-contracts",
    "title": "Задания и контракты",
    "slugs": [
      "extra-mile",
      "devoted",
      "dedicated",
      "challenger-approaching",
      "rise-to-the-challenge",
      "taking-all-challenges",
      "bronze-hunter",
      "silver-hunter",
      "gold-hunter",
      "chump-change"
    ]
  },
  {
    "id": "progression",
    "title": "Прогрессия",
    "slugs": [
      "rookie",
      "professional",
      "boss",
      "work-experience",
      "fat-stack",
      "cash-cow",
      "break-the-bank",
      "i",
      "ii",
      "iii",
      "bare-essentials",
      "tools-of-the-trade",
      "fully-loaded"
    ]
  },
  {
    "id": "ghosts",
    "title": "Призраки",
    "slugs": [
      "spirit-discovered",
      "wraith-discovered",
      "phantom-discovered",
      "poltergeist-discovered",
      "banshee-discovered",
      "jinn-discovered",
      "mare-discovered",
      "revenant-discovered",
      "shade-discovered",
      "demon-discovered",
      "yurei-discovered",
      "oni-discovered",
      "yokai-discovered",
      "hantu-discovered",
      "goryo-discovered",
      "myling-discovered",
      "onryo-discovered",
      "the-twins-discovered",
      "raiju-discovered",
      "obake-discovered",
      "the-mimic-discovered",
      "moroi-discovered",
      "deogen-discovered",
      "thaye-discovered"
    ]
  }
];

export const ACHIEVEMENTS: Record<string, AchievementItem> = {
  "escape-artist": {
    "title": "Escape Artist",
    "summary": "Сбегите от Ревенанта",
    "detailHtml": "<h2>Как получить</h2><div><p>Чтобы получить достижение, Ревенанту нужно увидеть игрока, а игроку — завершить контракт живым. Даже если игрок умрёт, но будет возрождён, достижение всё равно засчитается.\nЕсли Мимик копирует Ревенанта, достижение будет засчитано при тех же условиях.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/escape-artist",
    "slug": "escape-artist"
  },
  "they-re-here": {
    "title": "They're here",
    "summary": "Станьте свидетелем способности Полтергейста",
    "detailHtml": "<h2>Как получить</h2><div><p>Для получения достижения Полтергейст должен снизить рассудок игрока своей способностью. В зоне действия призрака должен находиться хотя бы один предмет, а живой или недавно умерший игрок — в той же комнате, где используется способность.\nЕсли Мимик копирует Полтергейста, достижение будет засчитано при тех же условиях.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/they-re-here",
    "slug": "they-re-here"
  },
  "the-bait": {
    "title": "The Bait",
    "summary": "Будьте убиты Банши в многопользовательской игре",
    "detailHtml": "<h2>Как получить</h2><div><p>Достижение можно получить только если в игре участвуют 2 или более игроков. Любой игрок, независимо от того, является он жертвой или нет, должен умереть любым способом: охота, карта таро «The Hanged Man» или следствие от желания обезьяньей лапы на воскрешение другого игрока. Если Мимик копирует Банши, достижение будет засчитано при тех же условиях. Если игрок после смерти от Банши или Мимика, копирующего этот тип призрака, был возрождён - достижение всё равно будет засчитано.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/the-bait",
    "slug": "the-bait"
  },
  "doom-slayed": {
    "title": "Doom Slayed",
    "summary": "Будьте убиты способностью Демона в течение первой минуты игры",
    "detailHtml": "<h2>Как получить</h2><div><p>Время начинает идти с момента первого открытия входной двери в зону расследования за контракт. Чтобы увеличить шансы на использование способности и быстрее умереть от призрака, важно использовать следующие настройки, а так же желательно играть в соло-режиме и избегать паранормальных явлений:</p>\n<h4 id=\"игрок\">Игрок</h4>\n<ul>\n<li>Начальный уровень рассудка - 75%</li>\n<li>Скорость снижения рассудка - 100%, если соло или 50%, если мультиплеер</li>\n<li>Бег - Бесконечно</li>\n<li>Скорость игрока - 150%</li>\n</ul>\n<h4 id=\"призрак\">Призрак</h4>\n<ul>\n<li>Скорость призрака - 150%</li>\n<li>Частота перемещений - Низко</li>\n<li>Уровень активности - Высоко</li>\n<li>Частота событий - Низко</li>\n<li>Дружелюбное приведение - Выкл</li>\n<li>Безопасный период - 0</li>\n</ul>\n<h4 id=\"контракт\">Контракт</h4>\n<ul>\n<li>Время на расстановку оборудования - 0</li>\n<li>Проклятые предметы - Обезьянья лапа</li>\n</ul>\n<h4 id=\"предпочитаемая-карта-camp-woodwind-или-tanglewood-drive\">Предпочитаемая карта: Camp Woodwind или Tanglewood Drive</h4>\n<p>После входа в зону расследования следует сразу же подбирать обезьянью лапу и использовать желание \"Хочу активность\". Если минута прошла, а призрак не начал охоту - можно выходить из контракта прямиком через меню и запускаться снова, пока не повезёт с призраком и использованием способности. Данное достижение будет засчитано, даже если игрок был возрождён. Так же, это достижение не может быть выполнено с призраком Мимик.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/doom-slayed",
    "slug": "doom-slayed"
  },
  "flawless-execution": {
    "title": "Flawless Execution",
    "summary": "Завершите идеальное расследование",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака, выполнить все 3 задания, заполнить все \"Медиа\" без дубликатов и найти кость. Выживание для получение данного достижения необязательно.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/flawless-execution",
    "slug": "flawless-execution"
  },
  "director": {
    "title": "Director",
    "summary": "Создайте специальную сложность",
    "detailHtml": "<h2>Как получить</h2><div><p>Настройка специальной сложности откроется лишь на 50 уровне, если игрок не имеет престижа; если игрок имеет 1 престиж или выше, настройка специальной сложности доступна всегда.\nНастроить специальную сложность можно на главной доске. Необходимо выбрать режим игры и создать своё лобби. Затем нажать на \"карандаш\" в строке \"Сложность\" и пролистать в любую сторону, пока не будет видно специальную сложность. Достижение будет выдано, как только игрок поставит в лобби Специальную сложность.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/director",
    "slug": "director"
  },
  "no-more-training-wheels": {
    "title": "No More Training Wheels",
    "summary": "Завершите обучение",
    "detailHtml": "<h2>Как получить</h2><div><p>На доске, при выборе режима, игры выберете \"Обучение\" и пройдите его до конца.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/no-more-training-wheels",
    "slug": "no-more-training-wheels"
  },
  "extra-mile": {
    "title": "Extra Mile",
    "summary": "Завершите 50 доп. заданий",
    "detailHtml": "<h2>Как получить</h2><div><p>Выполните дополнительные задания в общей сумме 50 раз. Данные задания можно найти в журнале, либо на <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/van/objective-board\">\"Доске списка задач\"</a>.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/extra-mile",
    "slug": "extra-mile"
  },
  "devoted": {
    "title": "Devoted",
    "summary": "Завершите 10 еженедельных заданий",
    "detailHtml": "<h2>Как получить</h2><div><p>В общей сумме завершите 10 еженедельных заданий. С заданиями, доступными на неделю, можно ознакомиться на доске выбора режима игры или на планшетке для документов, находящейся на столе под доской событий или, если игрок уже запустился в контракт, в фургоне между <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/van/sanity-monitor\">\"Монитором\"</a> и <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/van/objective-board\">\"Списком задач\"</a>.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/devoted",
    "slug": "devoted"
  },
  "dedicated": {
    "title": "Dedicated",
    "summary": "Завершите 30 ежедневных заданий",
    "detailHtml": "<h2>Как получить</h2><div><p>В общей сумме завершите 30 ежедневных заданий. С заданиями, доступными на день, можно ознакомиться на доске выбора режима игры или на планшетке для документов, находящейся на столе под доской событий или, если игрок уже запустился в контракт, в фургоне между <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/van/sanity-monitor\">\"Монитором\"</a> и <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/van/objective-board\">\"Списком задач\"</a>.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/dedicated",
    "slug": "dedicated"
  },
  "challenger-approaching": {
    "title": "Challenger Approaching",
    "summary": "Пройдите еженедельный особый режим",
    "detailHtml": "<h2>Как получить</h2><div><p>Пройдите еженедельный особый режим, котором нужно 3 раза определить призрака (выживать необязательно). Данный режим обновляется каждый понедельник в 03:00 по Московскому времени.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/challenger-approaching",
    "slug": "challenger-approaching"
  },
  "rise-to-the-challenge": {
    "title": "Rise to the Challenge",
    "summary": "Пройдите еженедельный особый режим 5 раз",
    "detailHtml": "<h2>Как получить</h2><div><p>Пройдите еженедельный особый режим 5 раз, котором нужно 3 раза определить призрака (выживать необязательно). Данный режим обновляется каждый понедельник в 03:00 по Московскому времени.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/rise-to-the-challenge",
    "slug": "rise-to-the-challenge"
  },
  "taking-all-challenges": {
    "title": "Taking All Challenges",
    "summary": "Пройдите еженедельный особый режим 10 раз",
    "detailHtml": "<h2>Как получить</h2><div><p>Пройдите еженедельный особый режим 10 раз, котором нужно 3 раза определить призрака (выживать необязательно). Данный режим обновляется каждый понедельник в 03:00 по Московскому времени.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/taking-all-challenges",
    "slug": "taking-all-challenges"
  },
  "bronze-hunter": {
    "title": "Bronze Hunter",
    "summary": "Получите бронзовый трофей Апокалипсиса",
    "detailHtml": "<h2>Как получить</h2><div><p>Информацию об условиях получения трофея можно найти на странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/progression/apocalypse\">\"Челлендж \"Apocalypse\"\"</a>.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/bronze-hunter",
    "slug": "bronze-hunter"
  },
  "silver-hunter": {
    "title": "Silver Hunter",
    "summary": "Получите серебряный трофей Апокалипсиса",
    "detailHtml": "<h2>Как получить</h2><div><p>Информацию об условиях получения трофея можно найти на странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/progression/apocalypse\">\"Челлендж \"Apocalypse\"\"</a>.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/silver-hunter",
    "slug": "silver-hunter"
  },
  "gold-hunter": {
    "title": "Gold Hunter",
    "summary": "Получите золотой трофей Апокалипсиса",
    "detailHtml": "<h2>Как получить</h2><div><p>Информацию об условиях получения трофея можно найти на странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/progression/apocalypse\">\"Челлендж \"Apocalypse\"\"</a>.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/gold-hunter",
    "slug": "gold-hunter"
  },
  "chump-change": {
    "title": "Chump Change",
    "summary": "Потратьте $1",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо потратить в магазине единицу игровой валюты.\r\nДоступ к магазину можно получить через монитор, находящийся справа от главной доски с настройками контракта.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/chump-change",
    "slug": "chump-change"
  },
  "rookie": {
    "title": "Rookie",
    "summary": "Завершите 10 контрактов",
    "detailHtml": "<h2>Как получить</h2><div><p>Завершите 10 контрактов, правильно определив призрака. Выживать необязательно.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/rookie",
    "slug": "rookie"
  },
  "professional": {
    "title": "Professional",
    "summary": "Завершите 50 контрактов",
    "detailHtml": "<h2>Как получить</h2><div><p>Завершите 50 контрактов, правильно определив призрака. Выживать необязательно.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/professional",
    "slug": "professional"
  },
  "boss": {
    "title": "Boss",
    "summary": "Завершите 100 контрактов",
    "detailHtml": "<h2>Как получить</h2><div><p>Завершите 100 контрактов, правильно определив призрака. Выживать необязательно.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/boss",
    "slug": "boss"
  },
  "work-experience": {
    "title": "Work Experience",
    "summary": "Выполните свой первый контракт",
    "detailHtml": "<h2>Как получить</h2><div><p>Завершите свой первый контракт. Выживать необязательно.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/work-experience",
    "slug": "work-experience"
  },
  "fat-stack": {
    "title": "Fat Stack",
    "summary": "Потратьте $10,000",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо потратить в магазине в общей сумме 10,000 игровой валюты.\nДоступ к магазину можно получить через монитор, находящийся справа от главной доски с настройками контракта.\nУзнать быстрый способ получения игровой валюты можно на странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/progression/lvl-grind\">\"Стратегия фарма уровней\"</a></p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/fat-stack",
    "slug": "fat-stack"
  },
  "cash-cow": {
    "title": "Cash Cow",
    "summary": "Потратьте $50,000",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо потратить в магазине в общей сумме 50,000 игровой валюты.\nДоступ к магазину можно получить через монитор, находящийся справа от главной доски с настройками контракта.\nУзнать быстрый способ получения игровой валюты можно на странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/progression/lvl-grind\">\"Стратегия фарма уровней\"</a></p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/cash-cow",
    "slug": "cash-cow"
  },
  "break-the-bank": {
    "title": "Break The Bank",
    "summary": "Потратьте $100,000",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо потратить в магазине в общей сумме 100,000 игровой валюты.\nДоступ к магазину можно получить через монитор, находящийся справа от главной доски с настройками контракта.\nУзнать быстрый способ получения игровой валюты можно на странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/progression/lvl-grind\">\"Стратегия фарма уровней\"</a></p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/break-the-bank",
    "slug": "break-the-bank"
  },
  "i": {
    "title": "I",
    "summary": "Достигните I престижа",
    "detailHtml": "<h2>Как получить</h2><div><p>По достижению 100 или более уровня получите престиж с помощью кнопки на главной доске, находящейся под карточкой игрока в верхнем правом углу.\nДля быстрого набора уровня стоит обратиться к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/progression/lvl-grind\">\"Стратегия фарма уровней\"</a>\nЕсли пользователь уже имел опыт игры до версии 0.9, то I престиж будет выдан автоматически, а прошлый уровень, набранный до версии 0.9, появится на табличке в лобби и на рукаве игрока.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/i",
    "slug": "i"
  },
  "ii": {
    "title": "II",
    "summary": "Достигните II престижа",
    "detailHtml": "<h2>Как получить</h2><div><p>По достижению 100 или более уровня получите престиж с помощью кнопки на главной доске, находящейся под карточкой игрока в верхнем правом углу.\nДля быстрого набора уровня стоит обратиться к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/progression/lvl-grind\">\"Стратегия фарма уровней\"</a></p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/ii",
    "slug": "ii"
  },
  "iii": {
    "title": "III",
    "summary": "Достигните III престижа",
    "detailHtml": "<h2>Как получить</h2><div><p>По достижению 100 или более уровня получите престиж с помощью кнопки на главной доске, находящейся под карточкой игрока в верхнем правом углу.\nДля быстрого набора уровня стоит обратиться к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/progression/lvl-grind\">\"Стратегия фарма уровней\"</a></p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/iii",
    "slug": "iii"
  },
  "bare-essentials": {
    "title": "Bare Essentials",
    "summary": "Разблокируйте всё снаряжение I класса",
    "detailHtml": "<h2>Как получить</h2><div><p>Узнать быстрый способ получения уровней и игровой валюты можно на странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/progression/lvl-grind\">\"Стратегия фарма уровней\"</a>, а для дополнительной информации о снаряжении зайти на страницу <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/equipment\">\"Снаряжение\"</a>.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/bare-essentials",
    "slug": "bare-essentials"
  },
  "tools-of-the-trade": {
    "title": "Tools of the Trade",
    "summary": "Разблокируйте всё снаряжение II класса",
    "detailHtml": "<h2>Как получить</h2><div><p>Узнать быстрый способ получения уровней и игровой валюты можно на странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/progression/lvl-grind\">\"Стратегия фарма уровней\"</a>, а для дополнительной информации о снаряжении зайти на страницу <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/equipment\">\"Снаряжение\"</a>.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/tools-of-the-trade",
    "slug": "tools-of-the-trade"
  },
  "fully-loaded": {
    "title": "Fully Loaded",
    "summary": "Разблокируйте всё снаряжение III класса",
    "detailHtml": "<h2>Как получить</h2><div><p>Узнать быстрый способ получения уровней и игровой валюты можно на странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/progression/lvl-grind\">\"Стратегия фарма уровней\"</a>, а для дополнительной информации о снаряжении зайти на страницу <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/equipment\">\"Снаряжение\"</a>.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/fully-loaded",
    "slug": "fully-loaded"
  },
  "spirit-discovered": {
    "title": "Spirit Discovered",
    "summary": "Успешно определите своего первого Духа и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/spirit\">\"Дух\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/spirit-discovered",
    "slug": "spirit-discovered"
  },
  "wraith-discovered": {
    "title": "Wraith Discovered",
    "summary": "Успешно определите своего первого Миража и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/wraith\">\"Мираж\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/wraith-discovered",
    "slug": "wraith-discovered"
  },
  "phantom-discovered": {
    "title": "Phantom Discovered",
    "summary": "Успешно определите своего первого Фантома и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/phantom\">\"Фантом\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/phantom-discovered",
    "slug": "phantom-discovered"
  },
  "poltergeist-discovered": {
    "title": "Poltergeist Discovered",
    "summary": "Успешно определите своего первого Полтергейста и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/poltergeist\">\"Полтергейст\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/poltergeist-discovered",
    "slug": "poltergeist-discovered"
  },
  "banshee-discovered": {
    "title": "Banshee Discovered",
    "summary": "Успешно определите свою первую Банши и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/banshee\">\"Банши\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/banshee-discovered",
    "slug": "banshee-discovered"
  },
  "jinn-discovered": {
    "title": "Jinn Discovered",
    "summary": "Успешно определите своего первого Джинна и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/jinn\">\"Джинн\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/jinn-discovered",
    "slug": "jinn-discovered"
  },
  "mare-discovered": {
    "title": "Mare Discovered",
    "summary": "Успешно определите свою первую Мару и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/mare\">\"Мара\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/mare-discovered",
    "slug": "mare-discovered"
  },
  "revenant-discovered": {
    "title": "Revenant Discovered",
    "summary": "Успешно определите своего первого Ревенанта и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/revenant\">\"Ревенант\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/revenant-discovered",
    "slug": "revenant-discovered"
  },
  "shade-discovered": {
    "title": "Shade Discovered",
    "summary": "Успешно определите свою первую Тень и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/shade\">\"Тень\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/shade-discovered",
    "slug": "shade-discovered"
  },
  "demon-discovered": {
    "title": "Demon Discovered",
    "summary": "Успешно определите своего первого Демона и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/demon\">\"Демон\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/demon-discovered",
    "slug": "demon-discovered"
  },
  "yurei-discovered": {
    "title": "Yurei Discovered",
    "summary": "Успешно определите своего первого Юрэя и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/yurei\">\"Юрэй\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/yurei-discovered",
    "slug": "yurei-discovered"
  },
  "oni-discovered": {
    "title": "Oni Discovered",
    "summary": "Успешно определите своего первого Они и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/oni\">\"Они\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/oni-discovered",
    "slug": "oni-discovered"
  },
  "yokai-discovered": {
    "title": "Yokai Discovered",
    "summary": "Успешно определите своего первого Ёкая и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/yokai\">\"Ёкай\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/yokai-discovered",
    "slug": "yokai-discovered"
  },
  "hantu-discovered": {
    "title": "Hantu Discovered",
    "summary": "Успешно определите своего первого Ханту и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/hantu\">\"Ханту\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/hantu-discovered",
    "slug": "hantu-discovered"
  },
  "goryo-discovered": {
    "title": "Goryo Discovered",
    "summary": "Успешно определите своего первого Горё и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/goryo\">\"Горё\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/goryo-discovered",
    "slug": "goryo-discovered"
  },
  "myling-discovered": {
    "title": "Myling Discovered",
    "summary": "Успешно определите своего первого Мюлинга и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/myling\">\"Мюлинг\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/myling-discovered",
    "slug": "myling-discovered"
  },
  "onryo-discovered": {
    "title": "Onryo Discovered",
    "summary": "Успешно определите своего первого Онрё и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/onryo\">\"Онрё\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/onryo-discovered",
    "slug": "onryo-discovered"
  },
  "the-twins-discovered": {
    "title": "The Twins Discovered",
    "summary": "Успешно определите своих первых Близнецов и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/twins\">\"Близнецы\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/the-twins-discovered",
    "slug": "the-twins-discovered"
  },
  "raiju-discovered": {
    "title": "Raiju Discovered",
    "summary": "Успешно определите своего первого Райдзю и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/raiju\">\"Райдзю\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/raiju-discovered",
    "slug": "raiju-discovered"
  },
  "obake-discovered": {
    "title": "Obake Discovered",
    "summary": "Успешно определите своего первого Обакэ и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/obake\">\"Обакэ\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/obake-discovered",
    "slug": "obake-discovered"
  },
  "the-mimic-discovered": {
    "title": "The Mimic Discovered",
    "summary": "Успешно определите своего первого Мимика и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/mimic\">\"Мимик\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/the-mimic-discovered",
    "slug": "the-mimic-discovered"
  },
  "moroi-discovered": {
    "title": "Moroi Discovered",
    "summary": "Успешно определите своего первого Мороя и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/moroi\">\"Морой\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/moroi-discovered",
    "slug": "moroi-discovered"
  },
  "deogen-discovered": {
    "title": "Deogen Discovered",
    "summary": "Успешно определите своего первого Деогена и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/deogen\">\"Деоген\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/deogen-discovered",
    "slug": "deogen-discovered"
  },
  "thaye-discovered": {
    "title": "Thaye Discovered",
    "summary": "Успешно определите своего первого Тайэ и выживите",
    "detailHtml": "<h2>Как получить</h2><div><p>Необходимо правильно определить призрака и уехать живым, для чего можно обратиться за помощью к странице <a target=\"_blank\" rel=\"noreferrer\" href=\"https://phasmophobia.su/knowledge-base/ghosts/thaye\">\"Тайэ\"</a> в Базе знаний.</p></div>",
    "image": "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/739630/905525e54d5e41dfcb58458aaa7161fd7efd3ec0.jpg?v=290326",
    "source": "https://phasmophobia.su/knowledge-base/progression/achievements/thaye-discovered",
    "slug": "thaye-discovered"
  }
};
