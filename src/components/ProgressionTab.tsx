import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Award,
  ChevronDown,
  ChevronRight,
  Flame,
  Link2,
  Search,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES, PROGRESS_ARTICLES, PROGRESS_HOME_CARDS } from '../data/progression';
import { RichArticleContent } from './RichArticleContent';

type SectionId = 'home' | 'achievements' | keyof typeof PROGRESS_ARTICLES;

type ProgressMeta = {
  icon: LucideIcon;
  eyebrow: string;
  summary: string;
  glow: string;
  accent: string;
  badge: string;
};

const PROGRESS_META: Record<string, ProgressMeta> = {
  achievements: {
    icon: Trophy,
    eyebrow: 'Steam архив',
    summary: 'Полный каталог достижений с быстрым поиском, категориями и подсказками по получению.',
    glow: 'from-[#b9a3ff]/20 via-[#7c5cff]/12 to-transparent',
    accent: 'text-[#d8c8ff]',
    badge: 'Steam',
  },
  apocalypse: {
    icon: ShieldAlert,
    eyebrow: 'Высшая сложность',
    summary: 'Требования к челленджу «Апокалипсис», множители, трофеи и практический маршрут к выполнению.',
    glow: 'from-amber-300/16 via-red-400/14 to-transparent',
    accent: 'text-amber-100/85',
    badge: '15x',
  },
  prestiges: {
    icon: Award,
    eyebrow: 'Лестница престижа',
    summary: 'Как работает престиж, что сбрасывается, какие бейджи выдаются и как выглядит вся прогрессия.',
    glow: 'from-cyan-300/16 via-violet-300/12 to-transparent',
    accent: 'text-cyan-100/85',
    badge: '0-20',
  },
  'lvl-grind': {
    icon: TrendingUp,
    eyebrow: 'Фарм и рост',
    summary: 'Практичные маршруты для быстрого набора опыта, денег и стабильного разгона аккаунта.',
    glow: 'from-emerald-300/14 via-lime-300/10 to-transparent',
    accent: 'text-emerald-100/85',
    badge: 'XP',
  },
};

const FALLBACK_META: ProgressMeta = {
  icon: Sparkles,
  eyebrow: 'Раздел прогресса',
  summary: 'Отдельный справочник по развитию аккаунта, достижениям и долгосрочным задачам.',
  glow: 'from-white/10 via-white/5 to-transparent',
  accent: 'text-white/82',
  badge: 'Guide',
};

const defaultAchievementSlug = ACHIEVEMENT_CATEGORIES[0]?.slugs[0] ?? null;

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractHeadings(html: string) {
  return [...html.matchAll(/<h([23])[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g)].map((match) => ({
    level: Number(match[1]) as 2 | 3,
    id: match[2],
    label: stripHtml(match[3]),
  }));
}

export function ProgressionTab() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [homeQuery, setHomeQuery] = useState('');
  const [achievementQuery, setAchievementQuery] = useState('');
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(defaultAchievementSlug);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(ACHIEVEMENT_CATEGORIES.map((category) => [category.id, true]))
  );

  const deferredHomeQuery = useDeferredValue(homeQuery);
  const deferredAchievementQuery = useDeferredValue(achievementQuery);

  const filteredHomeCards = useMemo(() => {
    const normalizedQuery = deferredHomeQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return PROGRESS_HOME_CARDS;
    }

    return PROGRESS_HOME_CARDS.filter((card) => {
      const article = PROGRESS_ARTICLES[card.id];
      return [card.title, article?.description ?? '', article?.title ?? ''].join(' ').toLowerCase().includes(normalizedQuery);
    });
  }, [deferredHomeQuery]);

  const filteredCategories = useMemo(() => {
    const query = deferredAchievementQuery.trim().toLowerCase();

    return ACHIEVEMENT_CATEGORIES.map((category) => {
      const items = category.slugs
        .map((slug) => ACHIEVEMENTS[slug])
        .filter(Boolean)
        .filter((achievement) => {
          if (!query) {
            return true;
          }

          return [achievement.title, achievement.summary, stripHtml(achievement.detailHtml)]
            .join(' ')
            .toLowerCase()
            .includes(query);
        });

      return { ...category, items };
    }).filter((category) => category.items.length > 0);
  }, [deferredAchievementQuery]);

  const visibleAchievementSlugs = filteredCategories.flatMap((category) => category.items.map((item) => item.slug));
  const selectedAchievementItem =
    (selectedAchievement && ACHIEVEMENTS[selectedAchievement]) ||
    (visibleAchievementSlugs[0] ? ACHIEVEMENTS[visibleAchievementSlugs[0]] : null);

  const selectedAchievementCategory =
    filteredCategories.find((category) => category.items.some((item) => item.slug === selectedAchievementItem?.slug)) ??
    ACHIEVEMENT_CATEGORIES.find((category) => category.slugs.includes(selectedAchievementItem?.slug ?? '')) ??
    null;

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

  const resolveMeta = (sectionId: string) => PROGRESS_META[sectionId] ?? FALLBACK_META;

  const renderBreadcrumbs = () => (
    <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/45">
      {breadcrumbs.map((label, index) => (
        <div key={`${label}-${index}`} className="flex items-center gap-2">
          <span className={index === breadcrumbs.length - 1 ? 'text-[#b9a3ff]' : ''}>{label}</span>
          {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4 text-white/25" />}
        </div>
      ))}
    </div>
  );

  if (activeSection === 'achievements') {
    const meta = resolveMeta('achievements');
    const MetaIcon = meta.icon;

    return (
      <div className="mx-auto max-w-[1580px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        {renderBreadcrumbs()}

        <button
          onClick={() => startTransition(() => setActiveSection('home'))}
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад к разделам
        </button>

        <div className="grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)] xl:items-start">
          <aside className="space-y-5 xl:sticky xl:top-24">
            <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(17,17,20,0.94)] shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
              <div className={`border-b border-white/10 bg-gradient-to-br ${meta.glow} px-5 py-5`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${meta.accent}`}>{meta.eyebrow}</div>
                    <h3 className="mt-2 text-2xl font-semibold text-white">Каталог достижений</h3>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
                    <MetaIcon className="h-5 w-5 text-white/78" />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-white/58">
                  Ищи по названию, разворачивай категории и держи справа фокус на одном достижении,
                  чтобы быстро понять, что именно нужно сделать в игре.
                </p>
              </div>

              <div className="grid gap-3 p-5 sm:grid-cols-3 xl:grid-cols-1">
                {[
                  { label: 'Категорий', value: ACHIEVEMENT_CATEGORIES.length, hint: 'группы достижений' },
                  { label: 'Виден сейчас', value: visibleAchievementSlugs.length, hint: 'после поиска' },
                  {
                    label: 'Выбрано',
                    value: selectedAchievementCategory?.title ?? '—',
                    hint: 'текущая категория',
                  },
                ].map((card) => (
                  <div key={card.label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                    <div className="text-[10px] uppercase tracking-[0.24em] text-white/35">{card.label}</div>
                    <div className="mt-3 text-lg font-semibold text-white">{card.value}</div>
                    <div className="mt-1 text-xs text-white/45">{card.hint}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(17,17,20,0.92)] shadow-[0_22px_60px_rgba(0,0,0,0.34)]">
              <div className="border-b border-white/10 px-5 py-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                  <input
                    type="text"
                    value={achievementQuery}
                    onChange={(event) => setAchievementQuery(event.target.value)}
                    placeholder="Поиск по достижениям"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/20"
                  />
                </div>
              </div>

              <div className="space-y-4 p-4">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => {
                    const isOpen = openCategories[category.id] ?? true;

                    return (
                      <div key={category.id} className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03]">
                        <button
                          onClick={() =>
                            setOpenCategories((current) => ({
                              ...current,
                              [category.id]: !isOpen,
                            }))
                          }
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
                        >
                          <div>
                            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-white/82">{category.title}</div>
                            <div className="mt-1 text-sm text-white/45">{category.items.length} достижений</div>
                          </div>
                          <ChevronDown className={`h-5 w-5 text-white/45 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isOpen ? (
                          <div className="space-y-2 border-t border-white/10 bg-black/10 p-3">
                            {category.items.map((achievement) => (
                              <button
                                key={achievement.slug}
                                onClick={() => setSelectedAchievement(achievement.slug)}
                                className={`w-full rounded-[22px] border px-4 py-4 text-left transition-all ${
                                  selectedAchievementItem?.slug === achievement.slug
                                    ? 'border-[#b9a3ff]/55 bg-[#b9a3ff]/10 shadow-[0_0_0_1px_rgba(185,163,255,0.2)]'
                                    : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="min-w-0">
                                    <div className="line-clamp-2 text-base font-semibold text-white/92">{achievement.title}</div>
                                    <div className="mt-1 line-clamp-2 text-sm leading-6 text-white/55">{achievement.summary}</div>
                                  </div>
                                  <img
                                    src={achievement.image}
                                    alt={achievement.title}
                                    className="h-14 w-14 shrink-0 rounded-xl border border-white/10 object-cover bg-white/5"
                                    loading="lazy"
                                  />
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] px-5 py-12 text-center">
                    <Target className="mx-auto mb-3 h-8 w-8 text-white/20" />
                    <div className="text-xl font-semibold text-white">Совпадений нет</div>
                    <p className="mt-2 text-sm leading-7 text-white/52">
                      Попробуй сократить запрос или искать по английскому названию достижения.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          <section className="space-y-5">
            {selectedAchievementItem ? (
              <>
                <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#111114]/90 shadow-[0_24px_70px_rgba(0,0,0,0.4)]">
                  <div className="grid gap-0 lg:grid-cols-[260px_minmax(0,1fr)]">
                    <div className="relative min-h-[240px] overflow-hidden border-b border-white/10 lg:border-b-0 lg:border-r">
                      <img
                        src={selectedAchievementItem.image}
                        alt={selectedAchievementItem.title}
                        className="absolute inset-0 h-full w-full object-cover opacity-[0.78]"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,12,0.1),rgba(8,8,12,0.4)_52%,rgba(8,8,12,0.94)_100%)]" />
                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <div className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${meta.accent}`}>
                          <MetaIcon className="h-3.5 w-3.5" />
                          {meta.badge}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5 p-6 lg:p-7">
                      <div className="space-y-3">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/36">Выбранное достижение</div>
                        <h2 className="text-4xl font-journal text-white sm:text-5xl">{selectedAchievementItem.title}</h2>
                        <p className="max-w-3xl text-sm leading-7 text-white/62 sm:text-base">{selectedAchievementItem.summary}</p>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                          <div className="text-[10px] uppercase tracking-[0.24em] text-white/35">Категория</div>
                          <div className="mt-3 text-lg font-semibold text-white">{selectedAchievementCategory?.title ?? '—'}</div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
                          <div className="text-[10px] uppercase tracking-[0.24em] text-white/35">Результатов</div>
                          <div className="mt-3 text-lg font-semibold text-white">{visibleAchievementSlugs.length}</div>
                        </div>
                        <a
                          href={selectedAchievementItem.source}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-white/75 transition-colors hover:border-white/20 hover:text-white"
                        >
                          <div>
                            <div className="text-[10px] uppercase tracking-[0.24em] text-white/35">Источник</div>
                            <div className="mt-3 text-lg font-semibold text-white">Открыть</div>
                          </div>
                          <Link2 className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(17,17,20,0.92)] shadow-[0_22px_60px_rgba(0,0,0,0.34)]">
                  <div className="border-b border-white/10 px-6 py-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/36">Как получить</div>
                    <div className="mt-1 text-lg font-semibold text-white">Разбор условий и подсказок</div>
                  </div>
                  <div className="p-6 lg:p-7">
                    <RichArticleContent html={selectedAchievementItem.detailHtml} />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-[720px] flex-col items-start justify-center rounded-[32px] border border-dashed border-white/10 bg-white/[0.02] px-8">
                <h2 className="text-4xl font-journal text-white">Достижения Steam</h2>
                <p className="mt-3 max-w-md text-lg leading-8 text-white/60">
                  Выбери достижение слева, чтобы сразу увидеть краткую сводку и способ получения.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }

  if (activeSection !== 'home') {
    const article = PROGRESS_ARTICLES[activeSection];
    const meta = resolveMeta(activeSection);
    const MetaIcon = meta.icon;
    const articleHtml = activeSection === 'prestiges' ? article.articleHtml.replace(/<table>[\s\S]*?<\/table>/i, '') : article.articleHtml;
    const prestigeEntries = activeSection === 'prestiges' ? article.entries ?? [] : [];
    const headings = articleHtml ? extractHeadings(articleHtml) : [];

    return (
      <div className="mx-auto max-w-[1580px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        {renderBreadcrumbs()}

        <button
          onClick={() => startTransition(() => setActiveSection('home'))}
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад к разделам
        </button>

        <div className="grid gap-6 xl:grid-cols-[330px_minmax(0,1fr)] xl:items-start">
          <aside className="space-y-5 xl:sticky xl:top-24">
            <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(17,17,20,0.94)] shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
              <div className={`border-b border-white/10 bg-gradient-to-br ${meta.glow} px-5 py-5`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${meta.accent}`}>{meta.eyebrow}</div>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{article.title}</h3>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
                    <MetaIcon className="h-5 w-5 text-white/78" />
                  </div>
                </div>
                {article.description ? (
                  <p className="mt-4 text-sm leading-7 text-white/58">{stripHtml(article.description).slice(0, 220)}</p>
                ) : null}
              </div>

              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-sm text-white/50">Якорей в статье</span>
                  <span className="text-sm font-semibold text-white">{headings.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-sm text-white/50">Карточек внутри</span>
                  <span className="text-sm font-semibold text-white">{prestigeEntries.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-sm text-white/50">Тип раздела</span>
                  <span className="text-sm font-semibold text-white">{meta.badge}</span>
                </div>
                <a
                  href={article.source}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/72 transition-colors hover:border-white/20 hover:text-white"
                >
                  <span>Открыть источник</span>
                  <Link2 className="h-4 w-4" />
                </a>
              </div>
            </div>

            {headings.length > 0 ? (
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(17,17,20,0.92)] shadow-[0_20px_55px_rgba(0,0,0,0.3)]">
                <div className="border-b border-white/10 px-5 py-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/36">Быстрый переход</div>
                  <div className="mt-2 text-lg font-semibold text-white">Оглавление статьи</div>
                </div>
                <div className="space-y-1.5 p-3">
                  {headings.slice(0, 12).map((heading) => (
                    <a
                      key={`${heading.id}-${heading.label}`}
                      href={`#${heading.id}`}
                      className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-white/62 transition-colors hover:bg-white/[0.05] hover:text-white ${heading.level === 3 ? 'pl-6' : ''}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                      <span className="line-clamp-2">{heading.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>

          <section className="space-y-5">
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#111114]/90 shadow-[0_24px_70px_rgba(0,0,0,0.4)]">
              <img src={article.image} alt={article.title} className="h-[360px] w-full object-cover opacity-[0.76]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,12,0.08),rgba(8,8,12,0.22)_38%,rgba(8,8,12,0.95)_100%)]" />
              <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-br ${meta.glow}`} />

              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-8">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${meta.accent}`}>
                    <MetaIcon className="h-3.5 w-3.5" />
                    {meta.eyebrow}
                  </span>
                  <span className="rounded-full border border-white/12 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/58">
                    {meta.badge}
                  </span>
                </div>

                <h2 className="max-w-4xl text-4xl font-journal text-white sm:text-5xl">{article.title}</h2>
                {article.description ? (
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-white/64 sm:text-base">{stripHtml(article.description).slice(0, 230)}</p>
                ) : null}
              </div>
            </div>

            {prestigeEntries.length > 0 ? (
              <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(17,17,20,0.92)] shadow-[0_22px_60px_rgba(0,0,0,0.34)]">
                <div className="border-b border-white/10 px-6 py-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/36">Карточки престижа</div>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <div className="text-2xl font-semibold text-white">Вся лестница бейджей</div>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/52">
                      {prestigeEntries.length} ступеней
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
                  {prestigeEntries.map((entry) => (
                    <article
                      key={entry.id}
                      className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                    >
                      <div className="aspect-[1.78/1] overflow-hidden rounded-[20px] border border-white/10 bg-black/30 p-3">
                        <img src={entry.image} alt={entry.alt} className="h-full w-full object-contain" loading="lazy" />
                      </div>
                      <div className="mt-4 space-y-1">
                        <div className="text-lg font-semibold text-white/92">{entry.title}</div>
                        <div className="text-sm text-white/50">{entry.prestigeLabel}</div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}

            {articleHtml ? (
              <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(17,17,20,0.92)] shadow-[0_22px_60px_rgba(0,0,0,0.34)]">
                <div className="border-b border-white/10 px-6 py-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/36">Полный разбор</div>
                  <div className="mt-1 text-lg font-semibold text-white">Материал целиком</div>
                </div>
                <div className="overflow-x-auto p-6 lg:p-7">
                  <RichArticleContent html={articleHtml} />
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    );
  }

  const featuredCard = filteredHomeCards[0] ?? PROGRESS_HOME_CARDS[0];
  const featuredArticle = featuredCard ? PROGRESS_ARTICLES[featuredCard.id] : null;

  return (
    <div className="mx-auto max-w-[1580px] animate-in fade-in slide-in-from-bottom-4 duration-700">
      {renderBreadcrumbs()}

      <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#101013]/94 shadow-[0_32px_95px_rgba(0,0,0,0.5)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(185,163,255,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(122,200,255,0.09),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]" />

        <div className="relative border-b border-white/8 px-6 py-7 sm:px-8 lg:px-10">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,420px)] xl:items-end">
            <div className="space-y-4 text-left">
              <span className="inline-flex items-center rounded-full border border-[#b9a3ff]/20 bg-[#b9a3ff]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d8c8ff]">
                Архив развития
              </span>

              <div className="space-y-3">
                <h2 className="text-4xl font-journal text-white sm:text-5xl">Прогресс и достижения</h2>
                <p className="max-w-3xl text-sm leading-7 text-white/60 sm:text-base">
                  Отдельная база по достижениям Steam, челленджу «Апокалипсис», престижу и
                  стратегиям быстрого роста уровня. Здесь удобно быстро выбрать нужное направление,
                  а потом погрузиться в детальный материал без ощущения случайного набора страниц.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/68">
                  Направлений: {PROGRESS_HOME_CARDS.length}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/68">
                  Достижений: {Object.keys(ACHIEVEMENTS).length}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/68">
                  Престижей в базе: {PROGRESS_ARTICLES.prestiges.entries?.length ?? 0}
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Категорий', value: ACHIEVEMENT_CATEGORIES.length, hint: 'по достижениям' },
                { label: 'Виден сейчас', value: filteredHomeCards.length, hint: deferredHomeQuery.trim() ? 'после поиска' : 'без фильтра' },
                { label: 'Этапов', value: 3, hint: 'бронза, серебро, золото' },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-[22px] border border-white/8 bg-white/[0.04] px-4 py-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                >
                  <div className="text-[10px] uppercase tracking-[0.24em] text-white/35">{card.label}</div>
                  <div className="mt-4 text-2xl font-semibold text-white">{card.value}</div>
                  <div className="mt-1 text-xs text-white/45">{card.hint}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative grid gap-6 p-6 sm:p-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
          <section className="space-y-5">
            <div className="flex flex-col gap-4 rounded-[28px] border border-white/8 bg-[rgba(17,17,20,0.9)] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/35">Реестр прогресса</div>
                <div className="mt-2 text-2xl font-semibold text-white">
                  {deferredHomeQuery.trim() ? 'Результаты поиска' : 'Маршруты развития аккаунта'}
                </div>
              </div>

              <div className="w-full max-w-md">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                  <input
                    type="text"
                    value={homeQuery}
                    onChange={(event) => setHomeQuery(event.target.value)}
                    placeholder="Поиск по разделам прогресса"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/20"
                  />
                </div>
              </div>
            </div>

            {filteredHomeCards.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2">
                {filteredHomeCards.map((card) => {
                  const article = PROGRESS_ARTICLES[card.id];
                  const meta = resolveMeta(card.id);
                  const MetaIcon = meta.icon;
                  const sectionCount =
                    card.id === 'achievements'
                      ? Object.keys(ACHIEVEMENTS).length
                      : card.id === 'prestiges'
                        ? article?.entries?.length ?? 0
                        : card.id === 'apocalypse'
                          ? 3
                          : 1;

                  return (
                    <button
                      key={card.id}
                      onClick={() => startTransition(() => setActiveSection(card.id as SectionId))}
                      className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-[#111114]/90 text-left shadow-[0_24px_60px_rgba(0,0,0,0.32)] transition-all duration-500 hover:-translate-y-1 hover:border-[#b9a3ff]/35 hover:bg-[#16161a]"
                    >
                      <div className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-br ${meta.glow}`} />
                      <img
                        src={card.image}
                        alt={card.alt}
                        className="absolute inset-0 h-full w-full object-cover opacity-[0.72] transition-transform duration-700 group-hover:scale-[1.04] brightness-[0.78]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,7,10,0.12),rgba(6,7,10,0.28)_42%,rgba(6,7,10,0.95)_100%)]" />

                      <div className="relative z-10 flex min-h-[320px] flex-col justify-between p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2">
                            <div className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${meta.accent}`}>{meta.eyebrow}</div>
                            <div className="inline-flex rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-white/48">
                              {meta.badge}
                            </div>
                          </div>

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm">
                            <MetaIcon className="h-5 w-5 text-white/76" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h3 className="text-[2.15rem] font-journal leading-[1.02] text-white">{card.title}</h3>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-white/58">
                              {article?.description ? stripHtml(article.description).slice(0, 148) : meta.summary}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/44">
                            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">
                              {sectionCount} ключевых блоков
                            </span>
                            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">Открыть раздел</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-8 py-20 text-center">
                <Trophy className="mx-auto mb-4 h-10 w-10 text-white/15" />
                <h3 className="text-3xl font-journal text-white">Ничего не найдено</h3>
                <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-white/55">
                  Попробуй сократить запрос или искать по словам «апокалипсис», «достижения», «престиж» или «фарм».
                </p>
              </div>
            )}
          </section>

          <aside className="space-y-5 xl:sticky xl:top-24">
            {featuredCard ? (
              <button
                onClick={() => startTransition(() => setActiveSection(featuredCard.id as SectionId))}
                className="group relative block overflow-hidden rounded-[30px] border border-white/10 bg-[#111114] text-left shadow-[0_24px_60px_rgba(0,0,0,0.34)] transition-all hover:border-[#b9a3ff]/35"
              >
                <img
                  src={featuredCard.image}
                  alt={featuredCard.alt}
                  className="h-[220px] w-full object-cover opacity-[0.78] transition-transform duration-700 group-hover:scale-[1.04]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,12,0.08),rgba(8,8,12,0.22)_35%,rgba(8,8,12,0.95)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#d8c8ff]">Выделенный маршрут</div>
                  <div className="mt-2 text-2xl font-semibold text-white">{featuredCard.title}</div>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    {featuredArticle?.description ? stripHtml(featuredArticle.description).slice(0, 132) : FALLBACK_META.summary}
                  </p>
                </div>
              </button>
            ) : null}

            <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(17,17,20,0.92)] shadow-[0_22px_60px_rgba(0,0,0,0.34)]">
              <div className="border-b border-white/10 px-5 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/36">Как пользоваться</div>
                <div className="mt-2 text-xl font-semibold text-white">Порядок движения по разделу</div>
              </div>
              <div className="space-y-3 p-5">
                {[
                  'Сначала открывай крупный раздел, если нужен общий контекст: что это дает, как устроено и зачем это важно.',
                  'Для достижений переходи сразу в каталог: там можно искать по названию и фильтровать по категориям без лишнего скролла.',
                  'Для престижа и апокалипсиса сначала читай краткую сводку слева, а потом уже углубляйся в полную статью и таблицы наград.',
                ].map((tip, index) => (
                  <div key={tip} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-white/68">
                    <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-white/34">Шаг {String(index + 1).padStart(2, '0')}</div>
                    {tip}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[rgba(17,17,20,0.92)] px-5 py-5 shadow-[0_20px_55px_rgba(0,0,0,0.3)]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/36">Быстрые переходы</div>
              <div className="mt-2 text-xl font-semibold text-white">Открыть нужное сразу</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {PROGRESS_HOME_CARDS.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => startTransition(() => setActiveSection(card.id as SectionId))}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/72 transition-colors hover:border-white/20 hover:text-white"
                  >
                    {card.title}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
