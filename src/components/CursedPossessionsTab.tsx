import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, ExternalLink, Eye, Flame, Skull, Sparkles } from 'lucide-react';
import { CURSED_ARTICLES } from '../data/cursedArticles';
import { CURSED_POSSESSIONS, CursedPossession } from '../data/cursedPossessions';
import { proxyWikiaImage } from '../utils/imageUtils';
import { RichArticleContent } from './RichArticleContent';

export function CursedPossessionsTab() {
  const [selectedItem, setSelectedItem] = useState<CursedPossession>(CURSED_POSSESSIONS[0]);
  const [imageError, setImageError] = useState(false);
  const article = CURSED_ARTICLES[selectedItem.id];

  useEffect(() => {
    setImageError(false);
  }, [selectedItem.id]);

  const selectedIndex = CURSED_POSSESSIONS.findIndex((item) => item.id === selectedItem.id);
  const usageHighlights = useMemo(() => (selectedItem.usage ?? []).slice(0, 3), [selectedItem.usage]);
  const heroImage = article?.image ?? selectedItem.image;

  const overviewCards = [
    {
      label: 'Объектов в базе',
      value: CURSED_POSSESSIONS.length,
      hint: 'все проклятые предметы',
      icon: Skull,
      tone: 'text-rose-200/80',
    },
    {
      label: 'Опасные пункты',
      value: selectedItem.usage?.length ?? 0,
      hint: 'ключевые последствия',
      icon: Flame,
      tone: 'text-amber-200/80',
    },
    {
      label: 'Выбранный предмет',
      value: `${selectedIndex + 1}/${CURSED_POSSESSIONS.length}`,
      hint: 'текущая карточка',
      icon: Eye,
      tone: 'text-white/75',
    },
  ];

  return (
    <div className="mx-auto max-w-[1450px] animate-in fade-in duration-500">
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0d0d10]/95 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(171,46,74,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(255,166,94,0.10),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]" />

        <div className="relative border-b border-white/8 px-6 py-7 sm:px-8 lg:px-10">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,420px)] xl:items-end">
            <div className="space-y-4 text-left">
              <span className="inline-flex items-center rounded-full border border-[#b54b5d]/20 bg-[#b54b5d]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e8a7b4]">
                Оккультный архив
              </span>

              <div className="space-y-3">
                <h2 className="text-3xl font-journal uppercase tracking-[0.12em] text-white sm:text-4xl">
                  Проклятые предметы
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-white/60 sm:text-[15px]">
                  Страница собрана как отдельный тревожный раздел журнала: слева быстрый выбор объекта, справа крупный фокус, краткая сводка и полная механика без лишнего визуального шума.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                  Один выбор за контракт
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                  Высокий риск для рассудка
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                  Подробные механики и последствия
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {overviewCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.label}
                    className="rounded-[22px] border border-white/8 bg-white/[0.04] px-4 py-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.24em] text-white/35">
                        {card.label}
                      </span>
                      <Icon className={`h-4 w-4 ${card.tone}`} />
                    </div>
                    <div className="text-2xl font-semibold text-white">{card.value}</div>
                    <div className="mt-1 text-xs text-white/45">{card.hint}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-start lg:p-10">
          <aside className="w-full shrink-0 lg:w-[390px]">
            <div className="overflow-hidden rounded-[28px] border border-white/8 bg-[#121215]/95">
              <div className="border-b border-white/8 bg-[linear-gradient(180deg,rgba(181,75,93,0.12),rgba(255,255,255,0.03))] px-5 py-5 text-left">
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d39aa5]">
                  Навигатор объектов
                </div>
                <h3 className="mt-2 text-xl font-semibold text-white">Список проклятых предметов</h3>
                <p className="mt-2 text-sm leading-6 text-white/50">
                  Выбери объект слева, чтобы сразу открыть его основную механику, риски и подробное описание.
                </p>
              </div>

              <div className="space-y-2 p-3">
                {CURSED_POSSESSIONS.map((item, index) => {
                  const isSelected = selectedItem.id === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`group flex w-full items-center gap-4 rounded-2xl border p-3 pr-4 text-left transition-all duration-300 ${
                        isSelected
                          ? 'border-[#b54b5d]/45 bg-[linear-gradient(135deg,rgba(117,25,46,0.32),rgba(32,16,20,0.95))] shadow-[0_0_30px_rgba(181,75,93,0.10)]'
                          : 'border-transparent bg-transparent hover:border-white/8 hover:bg-white/[0.035]'
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-white/45">
                        {String(index + 1).padStart(2, '0')}
                      </div>

                      <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/6 bg-black/50">
                        <img
                          src={proxyWikiaImage(item.image)}
                          alt={item.name}
                          className="h-full w-full object-contain opacity-90 transition-all duration-300 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                          onError={(event) => {
                            const target = event.target as HTMLImageElement;
                            if (target.parentElement) {
                              target.parentElement.classList.add('bg-white/5');
                              target.parentElement.innerHTML = '<div class="text-xs text-white/10">✦</div>';
                            }
                          }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className={`truncate text-[15px] font-semibold ${isSelected ? 'text-[#f2c7cf]' : 'text-white/78'}`}>
                          {item.name}
                        </div>
                        <div className="mt-1 text-[11px] uppercase tracking-[0.22em] text-white/32">
                          {item.usage?.length ?? 0} пунктов механики
                        </div>
                      </div>

                      <ChevronRight
                        className={`h-4 w-4 transition-all duration-300 ${
                          isSelected ? 'text-[#d98a9a]' : 'text-white/20 group-hover:translate-x-0.5 group-hover:text-white/50'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <section className="min-w-0 flex-1 space-y-6 text-left">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.12fr)_320px]">
              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black/60 shadow-2xl">
                {!imageError ? (
                  <img
                    src={proxyWikiaImage(heroImage)}
                    alt={selectedItem.name}
                    className="h-full min-h-[360px] w-full object-cover object-center opacity-90"
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex min-h-[360px] w-full items-center justify-center bg-white/5">
                    <Sparkles className="h-20 w-20 text-white/5" />
                  </div>
                )}

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.05),rgba(9,9,11,0.2)_34%,rgba(9,9,11,0.92)_100%)]" />
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#6e1e2c]/18 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-8">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-[#b54b5d]/25 bg-[#b54b5d]/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#efbcc5]">
                      Объект {selectedIndex + 1}
                    </span>
                    <span className="rounded-full border border-white/12 bg-black/25 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/60">
                      1 из {CURSED_POSSESSIONS.length} в базе
                    </span>
                  </div>

                  <h2 className="max-w-4xl text-4xl font-journal tracking-[0.12em] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.8)] sm:text-5xl">
                    {selectedItem.name}
                  </h2>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/8 bg-[#121215]/95 p-5 sm:p-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d39aa5]">
                  Краткая сводка
                </div>

                <div className="mt-4 border-b border-white/8 pb-5">
                  <p className="leading-7 text-white/78">{selectedItem.description}</p>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.035] px-4 py-3">
                    <span className="text-sm text-white/55">Критических пунктов</span>
                    <span className="text-sm font-semibold text-white">{selectedItem.usage?.length ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.035] px-4 py-3">
                    <span className="text-sm text-white/55">Источник статьи</span>
                    <span className="text-sm font-semibold text-white">{article ? 'Подключен' : 'Локально'}</span>
                  </div>
                </div>

                {article?.source && (
                  <a
                    href={article.source}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition-colors hover:border-white/20 hover:text-white"
                  >
                    Источник
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <div className="min-w-0 rounded-[30px] border border-white/8 bg-[#111114]/95 p-6 sm:p-8">
                {article?.articleHtml ? (
                  <RichArticleContent html={article.articleHtml} />
                ) : (
                  <div className="space-y-6">
                    <div className="border-b border-white/10 pb-6 text-lg font-medium leading-relaxed text-white/80">
                      <p>
                        <strong className="text-white">{selectedItem.name}</strong> - {selectedItem.description}
                      </p>
                    </div>

                    {selectedItem.usage && selectedItem.usage.length > 0 && (
                      <div className="space-y-4 text-[15px] leading-relaxed text-white/78">
                        {selectedItem.usage.map((paragraph, index) => (
                          <p key={index} className="border-l-2 border-white/5 pl-4">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="min-w-0 rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(112,26,43,0.16),rgba(17,17,20,0.96))] p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#b54b5d]/20 bg-[#b54b5d]/10">
                    <Flame className="h-4 w-4 text-[#f1b17e]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#d39aa5]">
                      Опасные моменты
                    </div>
                    <div className="mt-1 text-lg font-semibold text-white">Что помнить в первую очередь</div>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 lg:grid-cols-3">
                  {usageHighlights.length > 0 ? (
                    usageHighlights.map((paragraph, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4 text-sm leading-7 text-white/76"
                      >
                        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35">
                          Пункт {String(index + 1).padStart(2, '0')}
                        </div>
                        {paragraph}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4 text-sm text-white/55 lg:col-span-3">
                      Для этого предмета пока нет короткой локальной сводки.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
