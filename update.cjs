const fs = require('fs');

const content = fs.readFileSync('src/data/ghosts.ts', 'utf8');

const speedStatesMap = {
  'spirit': [{ speed: 1.7, label: 'Базовая скорость' }],
  'wraith': [{ speed: 1.7, label: 'Базовая скорость' }],
  'phantom': [{ speed: 1.7, label: 'Базовая скорость' }],
  'poltergeist': [{ speed: 1.7, label: 'Базовая скорость' }],
  'banshee': [{ speed: 1.7, label: 'Базовая скорость' }],
  'jinn': [{ speed: 1.7, label: 'Базовая скорость без щитка' }, { speed: 2.5, label: 'Скорость с включенным щитком' }],
  'mare': [{ speed: 1.7, label: 'Базовая скорость' }],
  'revenant': [{ speed: 1.0, label: 'Не видит игрока' }, { speed: 3.0, label: 'Видит игрока' }],
  'shade': [{ speed: 1.7, label: 'Базовая скорость' }],
  'demon': [{ speed: 1.7, label: 'Базовая скорость' }],
  'yurei': [{ speed: 1.7, label: 'Базовая скорость' }],
  'oni': [{ speed: 1.7, label: 'Базовая скорость' }],
  'yokai': [{ speed: 1.7, label: 'Базовая скорость' }],
  'hantu': [
    { speed: 1.4, label: 'Теплая комната (>15°C)' },
    { speed: 1.75, label: 'Обычная комната (12-15°C)' },
    { speed: 2.1, label: 'Прохладная комната (9-12°C)' },
    { speed: 2.4, label: 'Холодная комната (6-9°C)' },
    { speed: 2.7, label: 'Морозная комната (<0°C)' }
  ],
  'goryo': [{ speed: 1.7, label: 'Базовая скорость' }],
  'myling': [{ speed: 1.7, label: 'Базовая скорость' }],
  'onryo': [{ speed: 1.7, label: 'Базовая скорость' }],
  'twins': [{ speed: 1.53, label: 'Настоящий близнец (медленный)' }, { speed: 1.87, label: 'Приманка (быстрый)' }],
  'raiju': [{ speed: 1.7, label: 'Нет электроники рядом' }, { speed: 2.5, label: 'Рядом с включенной электроникой' }],
  'obake': [{ speed: 1.7, label: 'Базовая скорость' }],
  'mimic': [{ speed: 1.7, label: 'Базовая скорость (зависит от копии)' }],
  'moroi': [
    { speed: 1.5, label: 'Рассудок > 45%' },
    { speed: 1.58, label: 'Рассудок 40-45%' },
    { speed: 1.66, label: 'Рассудок 35-40%' },
    { speed: 1.74, label: 'Рассудок 30-35%' },
    { speed: 1.81, label: 'Рассудок 25-30%' },
    { speed: 1.9, label: 'Рассудок 20-25%' },
    { speed: 1.97, label: 'Рассудок 15-20%' },
    { speed: 2.05, label: 'Рассудок 10-15%' },
    { speed: 2.13, label: 'Рассудок 5-10%' },
    { speed: 2.25, label: 'Рассудок < 5%' }
  ],
  'deogen': [{ speed: 3.0, label: 'Далеко от игрока (>6м)' }, { speed: 0.4, label: 'Рядом с игроком (<2.5м)' }],
  'thaye': [
    { speed: 2.75, label: 'Фаза старения 0' },
    { speed: 2.58, label: 'Фаза старения 1' },
    { speed: 2.4, label: 'Фаза старения 2' },
    { speed: 2.23, label: 'Фаза старения 3' },
    { speed: 2.05, label: 'Фаза старения 4' },
    { speed: 1.88, label: 'Фаза старения 5' },
    { speed: 1.7, label: 'Фаза старения 6' },
    { speed: 1.52, label: 'Фаза старения 7' },
    { speed: 1.35, label: 'Фаза старения 8' },
    { speed: 1.18, label: 'Фаза старения 9' },
    { speed: 1.0, label: 'Фаза старения 10' }
  ],
  'daian': [{ speed: 1.2, label: 'Далеко от игрока' }, { speed: 2.25, label: 'Рядом с игроком' }],
  'gallu': [{ speed: 1.36, label: 'Свет включен' }, { speed: 1.96, label: 'Свет выключен' }],
  'obambo': [{ speed: 1.45, label: 'Спокойное состояние' }, { speed: 1.96, label: 'Агрессивное состояние' }]
};

let newContent = content;

for (const [id, states] of Object.entries(speedStatesMap)) {
  const regex = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?speedRange:\\s*'.*?')`, 'g');
  newContent = newContent.replace(regex, `$1,\n    speedStates: ${JSON.stringify(states).replace(/"([^"]+)":/g, '$1:')}`);
}

fs.writeFileSync('src/data/ghosts.ts', newContent);
console.log('Done');
