import { useEffect, useMemo, useState } from 'react';
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES, PROGRESS_ARTICLES, PROGRESS_HOME_CARDS } from '../data/progression';
import { RichArticleContent } from './RichArticleContent';
import { ArrowLeft, ChevronDown, ChevronRight, Search, Trophy } from 'lucide-react';

type SectionId = 'home' | 'achievements' | keyof typeof PROGRESS_ARTICLES;

const defaultAchievementSlug = ACHIEVEMENT_CATEGORIES[0]?.slugs[0] ?? null;

export function ProgressionTab() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [achievementQuery, setAchievementQuery] = useState('');
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(defaultAchievementSlug);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(ACHIEVEMENT_CATEGORIES.map((category) => [category.id, true]))
  );

  const filteredCategories = useMemo(() => {
    const query = achievementQuery.trim().toLowerCase();

    return ACHIEVEMENT_CATEGORIES.map((category) => {
      const items = category.slugs
        .map((slug) => ACHIEVEMENTS[slug])
        .filter(Boolean)
        .filter((achievement) => {
          if (!query) {
            return true;
          }

          return (
            achievement.title.toLowerCase().includes(query) ||
            achievement.summary.toLowerCase().includes(query)
          );
        });

      return {
        ...category,
        items,
      };
    }).filter((category) => category.items.length > 0);
  }, [achievementQuery]);

  const visibleAchievementSlugs = filteredCategories.flatMap((category) => category.items.map((item) => item.slug));
  const selectedAchievementItem =
    (selectedAchievement && ACHIEVEMENTS[selectedAchievement]) ||
    (visibleAchievementSlugs[0] ? ACHIEVEMENTS[visibleAchievementSlugs[0]] : null);

  useEffect(() => {
    if (!selectedAchievementItem && visibleAchievementSlugs[0]) {
      setSelectedAchievement(visibleAchievementSlugs[0]);
      return;
    }

    if (selectedAchievement && !visibleAchievementSlugs.includes(selectedAchievement) && visibleAchievementSlugs[0]) {
      setSelectedAchievement(visibleAchievementSlugs[0]);
    }
  }, [selectedAchievement, selectedAchievementItem, visibleAchievementSlugs]);

  const breadcrumbs =
    activeSection === 'home'
      ? ['База знаний', 'Прогресс и достижения']
      : activeSection === 'achievements'
        ? ['База знаний', 'Прогресс и достижения', 'Достижения']
        : ['База знаний', 'Прогресс и достижения', PROGRESS_ARTICLES[activeSection].title];

  const renderBreadcrumbs = () => (
    <div className="flex flex-wrap items-center gap-2 text-sm text-white/45 mb-8">
      {breadcrumbs.map((label, index) => (
        <div key={label} className="flex items-center gap-2">
          <span className={index === breadcrumbs.length - 1 ? 'text-[#b9a3ff]' : ''}>{label}</span>
          {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4 text-white/25" />}
        </div>
      ))}
    </div>
  );

  if (activeSection === 'achievements') {
    return (
      <div className="max-w-[1500px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        {renderBreadcrumbs()}
        <button
          onClick={() => setActiveSection('home')}
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад к разделам
        </button>

        <div className="grid grid-cols-1 xl:grid-cols-[560px,1fr] gap-6 items-start">
          <div className="rounded-[28px] border border-white/10 bg-[rgba(20,20,20,0.65)] backdrop-blur-md shadow-2xl p-5">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-5 space-y-5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                <input
                  type="text"
                  value={achievementQuery}
                  onChange={(event) => setAchievementQuery(event.target.value)}
                  placeholder="Поиск по достижениям"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/20"
                />
              </div>

              <div className="text-sm text-white/45">
                Найдено: {visibleAchievementSlugs.length} из {Object.keys(ACHIEVEMENTS).length}
              </div>

              <div className="space-y-4">
                {filteredCategories.map((category) => {
                  const isOpen = openCategories[category.id] ?? true;

                  return (
                    <div key={category.id} className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">
                      <button
                        onClick={() =>
                          setOpenCategories((current) => ({
                            ...current,
                            [category.id]: !isOpen,
                          }))
                        }
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
                      >
                        <div>
                          <div className="text-sm font-semibold uppercase tracking-wide text-white/85">{category.title}</div>
                          <div className="mt-1 text-sm text-white/45">{category.items.length} достижений</div>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-white/45 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="space-y-3 border-t border-white/10 bg-black/10 p-3">
                          {category.items.map((achievement) => (
                            <button
                              key={achievement.slug}
                              onClick={() => setSelectedAchievement(achievement.slug)}
                              className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                selectedAchievementItem?.slug === achievement.slug
                                  ? 'border-[#b9a3ff]/60 bg-[#b9a3ff]/10 shadow-[0_0_0_1px_rgba(185,163,255,0.25)]'
                                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                  <div className="text-lg font-semibold text-white/92">{achievement.title}</div>
                                  <div className="mt-1 text-sm text-white/55">{achievement.summary}</div>
                                </div>
                                <img
                                  src={achievement.image}
                                  alt={achievement.title}
                                  className="h-14 w-14 shrink-0 rounded-lg border border-white/10 object-cover bg-white/5"
                                  loading="lazy"
                                />
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[rgba(20,20,20,0.65)] backdrop-blur-md shadow-2xl overflow-hidden min-h-[720px]">
            {selectedAchievementItem ? (
              <>
                <div className="flex items-start justify-between gap-6 border-b border-white/10 p-6 bg-white/[0.02]">
                  <div className="space-y-2">
                    <h2 className="text-5xl font-journal text-white">{selectedAchievementItem.title}</h2>
                    <p className="text-xl text-white/65">{selectedAchievementItem.summary}</p>
                  </div>
                  <img
                    src={selectedAchievementItem.image}
                    alt={selectedAchievementItem.title}
                    className="h-24 w-24 shrink-0 rounded-xl border border-white/10 object-cover bg-white/5"
                  />
                </div>

                <div className="p-6">
                  <RichArticleContent html={selectedAchievementItem.detailHtml} />
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <a
                      href={selectedAchievementItem.source}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-[#b9a3ff] hover:text-white transition-colors"
                    >
                      Открыть источник
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full min-h-[720px] flex-col items-start justify-center px-8">
                <h2 className="text-4xl font-journal text-white mb-3">Достижения Steam</h2>
                <p className="max-w-md text-lg text-white/60">
                  Выберите достижение в списке слева, чтобы увидеть иконку и подробный способ получения.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeSection !== 'home') {
    const article = PROGRESS_ARTICLES[activeSection];
    const articleHtml = activeSection === 'prestiges'
      ? article.articleHtml.replace(/<table>[\s\S]*<\/table>/, '')
      : article.articleHtml;
    const prestigeEntries = activeSection === 'prestiges' ? article.entries ?? [] : [];

    return (
      <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        {renderBreadcrumbs()}

        <button
          onClick={() => setActiveSection('home')}
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад к разделам
        </button>

        <div className="rounded-[32px] border border-white/10 bg-[rgba(20,20,20,0.68)] backdrop-blur-md shadow-2xl overflow-hidden">
          <div className="relative h-[260px] border-b border-white/10">
            <img src={article.image} alt={article.title} className="h-full w-full object-cover opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/55 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <h2 className="text-5xl font-journal text-white">{article.title}</h2>
              {article.description && (
                <p className="mt-3 max-w-3xl text-base text-white/65">
                  {article.description}
                </p>
              )}
            </div>
          </div>

          <div className="p-8 space-y-8">
            <RichArticleContent html={articleHtml} />

            {prestigeEntries.length > 0 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-2xl font-journal text-white">Карточки престижа</h3>
                  <span className="text-sm text-white/45">Все бейджи в одном размере</span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {prestigeEntries.map((entry) => (
                    <article
                      key={entry.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-inner"
                    >
                      <div className="aspect-[1.78/1] rounded-xl border border-white/10 bg-black/30 p-3 flex items-center justify-center overflow-hidden">
                        <img
                          src={entry.image}
                          alt={entry.alt}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="mt-4 space-y-1">
                        <div className="text-lg font-semibold text-white/92">{entry.title}</div>
                        <div className="text-sm text-white/50">{entry.prestigeLabel}</div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 border-t border-white/10 pt-4">
              <a
                href={article.source}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[#b9a3ff] hover:text-white transition-colors"
              >
                Открыть источник
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {renderBreadcrumbs()}

      <div className="flex items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-5xl font-journal text-white">Прогресс и достижения</h2>
          <p className="mt-3 max-w-2xl text-base text-white/55">
            Отдельная база по достижениям Steam, челленджу «Апокалипсис», престижу и стратегии быстрого роста уровней.
          </p>
        </div>
        <div className="hidden lg:flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
          <Trophy className="h-8 w-8 text-[#b9a3ff]" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {PROGRESS_HOME_CARDS.map((card) => (
          <button
            key={card.id}
            onClick={() => setActiveSection(card.id as SectionId)}
            className="group relative aspect-video overflow-hidden rounded-[24px] border border-white/10 bg-black text-left transition-all duration-500 hover:border-[#b9a3ff]/45 hover:-translate-y-1"
          >
            <img
              src={card.image}
              alt={card.alt}
              className="absolute inset-0 h-full w-full object-cover brightness-[0.78] transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-90" />
            <div className="relative z-10 flex h-full items-end p-6">
              <div>
                <div className="mb-2 text-xs uppercase tracking-[0.25em] text-white/45">Раздел</div>
                <div className="text-3xl font-journal text-white">{card.title}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
