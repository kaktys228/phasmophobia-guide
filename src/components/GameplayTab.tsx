import { startTransition, useDeferredValue, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  CloudMoon,
  Compass,
  Crosshair,
  Flame,
  Gamepad2,
  Layers3,
  Link2,
  MonitorPlay,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tv2,
  type LucideIcon,
} from 'lucide-react';
import { GAMEPLAY_ARTICLES, GAMEPLAY_HOME_CARDS, type GameplayCard } from '../data/gameplay';
import { RichArticleContent } from './RichArticleContent';

type SectionId = 'home' | string;

type GameplaySectionMeta = {
  icon: LucideIcon;
  eyebrow: string;
  summary: string;
  glow: string;
  accent: string;
};

const GAMEPLAY_META: Record<string, GameplaySectionMeta> = {
  van: {
    icon: MonitorPlay,
    eyebrow: 'Оперативный узел',
    summary: 'Мониторы, таймеры и вся логика фургона как командного центра расследования.',
    glow: 'from-cyan-300/16 via-slate-300/12 to-transparent',
    accent: 'text-cyan-100/85',
  },
  hunts: {
    icon: Crosshair,
    eyebrow: 'Критическая фаза',
    summary: 'Старт охоты, правила выживания, прятки, спринты и поведение сущности под давлением.',
    glow: 'from-amber-300/16 via-rose-400/12 to-transparent',
    accent: 'text-amber-100/85',
  },
  'ghost-events': {
    icon: Flame,
    eyebrow: 'Паранормальная активность',
    summary: 'Как читать события, отличать их от охоты и извлекать полезную информацию из каждого явления.',
    glow: 'from-rose-400/16 via-orange-300/10 to-transparent',
    accent: 'text-rose-100/85',
  },
  media: {
    icon: Tv2,
    eyebrow: 'Фиксация улик',
    summary: 'Камеры, запись улик и работа с медиа-механиками без лишнего хаоса на контракте.',
    glow: 'from-violet-400/16 via-cyan-300/10 to-transparent',
    accent: 'text-violet-100/85',
  },
  weather: {
    icon: CloudMoon,
    eyebrow: 'Условия контракта',
    summary: 'Погода, кровавая луна и внешние модификаторы, которые меняют ритм всей вылазки.',
    glow: 'from-red-500/14 via-orange-300/10 to-transparent',
    accent: 'text-orange-100/85',
  },
  difficulties: {
    icon: SlidersHorizontal,
    eyebrow: 'Правила сложности',
    summary: 'Стандартные режимы, кастомные множители и тонкая настройка контракта под фарм или челлендж.',
    glow: 'from-zinc-300/12 via-violet-300/12 to-transparent',
    accent: 'text-white/82',
  },
  'common-misconceptions': {
    icon: BookOpen,
    eyebrow: 'Разбор мифов',
    summary: 'Частые ошибки и неверные представления, которые ломают логику определения призрака.',
    glow: 'from-sky-400/12 via-white/6 to-transparent',
    accent: 'text-sky-100/85',
  },
  'easter-eggs': {
    icon: Sparkles,
    eyebrow: 'Скрытые детали',
    summary: 'Пасхалки, секреты карт и мелочи, которые делают Phasmophobia живой и любопытной.',
    glow: 'from-fuchsia-400/14 via-violet-300/10 to-transparent',
    accent: 'text-fuchsia-100/85',
  },
};

const FALLBACK_META: GameplaySectionMeta = {
  icon: Gamepad2,
  eyebrow: 'Полевой раздел',
  summary: 'Подробный разбор игровой механики с быстрым переходом к связанным материалам.',
  glow: 'from-white/10 via-white/5 to-transparent',
  accent: 'text-white/82',
};

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

export function GameplayTab() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const childParentMap = useMemo(() => {
    const entries = Object.entries(GAMEPLAY_ARTICLES).flatMap(([articleId, article]) =>
      (article.children ?? []).map((child) => [child.id, articleId] as const)
    );
    return new Map(entries);
  }, []);

  const allCards = useMemo(
    () => [
      ...GAMEPLAY_HOME_CARDS,
      ...Object.values(GAMEPLAY_ARTICLES).flatMap((article) => article.children ?? []),
    ],
    []
  );

  const visibleCards = useMemo(() => {
    const normalizedQuery = deferredSearchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return GAMEPLAY_HOME_CARDS;
    }

    return allCards.filter((card) => {
      const article = GAMEPLAY_ARTICLES[card.id];
      const parentId = childParentMap.get(card.id);
      const parentTitle = parentId ? GAMEPLAY_ARTICLES[parentId]?.title ?? '' : '';
      const description = article?.description ? stripHtml(article.description) : '';

      return [card.title, article?.title ?? '', description, parentTitle].join(' ').toLowerCase().includes(normalizedQuery);
    });
  }, [allCards, childParentMap, deferredSearchQuery]);

  const quickAccessCards = useMemo(() => {
    const pool =
      deferredSearchQuery.trim().length > 0
        ? visibleCards
        : allCards.filter((card) => childParentMap.has(card.id));

    return pool.slice(0, 6);
  }, [allCards, childParentMap, deferredSearchQuery, visibleCards]);

  const featuredCard = visibleCards[0] ?? GAMEPLAY_HOME_CARDS[0];
  const featuredArticle = featuredCard ? GAMEPLAY_ARTICLES[featuredCard.id] : null;
  const featuredParentId = featuredCard ? childParentMap.get(featuredCard.id) : undefined;
  const featuredParentTitle = featuredParentId ? GAMEPLAY_ARTICLES[featuredParentId]?.title ?? '' : '';
  const totalNestedArticles = allCards.length - GAMEPLAY_HOME_CARDS.length;

  const activeArticle = activeSection !== 'home' ? GAMEPLAY_ARTICLES[activeSection] : null;
  const parentArticle = activeArticle?.parentId ? GAMEPLAY_ARTICLES[activeArticle.parentId] : null;
  const activeChildren = activeArticle?.children ?? [];
  const activeHeadings = activeArticle?.articleHtml ? extractHeadings(activeArticle.articleHtml) : [];

  const breadcrumbs =
    activeSection === 'home'
      ? ['База знаний', 'Механики и геймплей']
      : parentArticle
        ? ['База знаний', 'Механики и геймплей', parentArticle.title, activeArticle?.title ?? '']
        : ['База знаний', 'Механики и геймплей', activeArticle?.title ?? ''];

  const resolveMeta = (cardId: string) => {
    const parentId = childParentMap.get(cardId);
    return GAMEPLAY_META[cardId] ?? (parentId ? GAMEPLAY_META[parentId] : undefined) ?? FALLBACK_META;
  };

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

  const renderCardGrid = (cards: GameplayCard[], compact = false) => (
    <div className={`grid gap-5 ${compact ? 'md:grid-cols-2 2xl:grid-cols-2' : 'md:grid-cols-2 2xl:grid-cols-3'}`}>
      {cards.map((card) => {
        const article = GAMEPLAY_ARTICLES[card.id];
        const parentId = childParentMap.get(card.id);
        const parentTitle = parentId ? GAMEPLAY_ARTICLES[parentId]?.title ?? '' : '';
        const meta = resolveMeta(card.id);
        const Icon = meta.icon;
        const chapterCount = article?.children?.length ?? 0;
        const teaser = article?.description ? stripHtml(article.description).slice(0, compact ? 116 : 138) : meta.summary;

        return (
          <button
            key={card.id}
            onClick={() => startTransition(() => setActiveSection(card.id))}
            className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111114]/90 text-left shadow-[0_24px_60px_rgba(0,0,0,0.32)] transition-all duration-500 hover:-translate-y-1 hover:border-[#b9a3ff]/35 hover:bg-[#16161a]"
          >
            <div className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-br ${meta.glow}`} />
            <img
              src={card.image}
              alt={card.alt}
              className={`absolute inset-0 h-full w-full object-cover opacity-[0.72] transition-transform duration-700 group-hover:scale-[1.04] ${compact ? 'brightness-[0.82]' : 'brightness-[0.8]'}`}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,7,10,0.12),rgba(6,7,10,0.3)_42%,rgba(6,7,10,0.95)_100%)]" />

            <div className={`relative z-10 flex h-full flex-col justify-between ${compact ? 'min-h-[290px] p-5' : 'min-h-[340px] p-6'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${meta.accent}`}>{meta.eyebrow}</div>
                  {parentTitle ? (
                    <div className="inline-flex rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-white/48">
                      {parentTitle}
                    </div>
                  ) : null}
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm">
                  <Icon className="h-5 w-5 text-white/76" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className={`${compact ? 'text-[1.95rem]' : 'text-[2.2rem]'} font-journal leading-[1.02] text-white`}>{card.title}</h3>
                  <p className={`mt-3 max-w-xl text-sm leading-6 text-white/58 ${compact ? 'line-clamp-3' : 'line-clamp-3'}`}>{teaser}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/44">
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">
                    {chapterCount > 0 ? `${chapterCount} вложенных страницы` : 'Отдельный материал'}
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">
                    {parentTitle ? 'Точечный разбор' : 'Главный раздел'}
                  </span>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );

  if (activeArticle) {
    const activeMeta = resolveMeta(activeSection);
    const ActiveIcon = activeMeta.icon;
    const heroImage = activeArticle.image || featuredCard?.image || '';
    const articleMode = activeArticle.parentId
      ? 'дочерняя страница'
      : activeChildren.length > 0
        ? 'раздел-узел'
        : 'самостоятельная статья';

    return (
      <div className="mx-auto max-w-[1580px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        {renderBreadcrumbs()}

        <button
          onClick={() => startTransition(() => setActiveSection(activeArticle.parentId ?? 'home'))}
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {activeArticle.parentId ? 'Назад к разделу' : 'Назад к механикам'}
        </button>

        <div className="grid gap-6 xl:grid-cols-[330px_minmax(0,1fr)] xl:items-start">
          <aside className="space-y-5 xl:sticky xl:top-24">
            <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(17,17,20,0.94)] shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
              <div className={`border-b border-white/10 bg-gradient-to-br ${activeMeta.glow} px-5 py-5`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${activeMeta.accent}`}>{activeMeta.eyebrow}</div>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{activeArticle.title}</h3>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
                    <ActiveIcon className="h-5 w-5 text-white/78" />
                  </div>
                </div>
                {activeArticle.description ? (
                  <p className="mt-4 text-sm leading-7 text-white/58">{activeArticle.description}</p>
                ) : null}
              </div>

              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-sm text-white/50">Тип материала</span>
                  <span className="text-sm font-semibold capitalize text-white">{articleMode}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-sm text-white/50">Вложенных страниц</span>
                  <span className="text-sm font-semibold text-white">{activeChildren.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-sm text-white/50">Якорей в статье</span>
                  <span className="text-sm font-semibold text-white">{activeHeadings.length}</span>
                </div>
                <a
                  href={activeArticle.source}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/72 transition-colors hover:border-white/20 hover:text-white"
                >
                  <span>Открыть источник</span>
                  <Link2 className="h-4 w-4" />
                </a>
              </div>
            </div>

            {activeChildren.length > 0 ? (
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(17,17,20,0.92)] shadow-[0_20px_55px_rgba(0,0,0,0.3)]">
                <div className="border-b border-white/10 px-5 py-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/36">Навигатор раздела</div>
                  <div className="mt-2 text-lg font-semibold text-white">Что открыть дальше</div>
                </div>
                <div className="space-y-2 p-3">
                  {activeChildren.map((child, index) => (
                    <button
                      key={child.id}
                      onClick={() => startTransition(() => setActiveSection(child.id))}
                      className="group flex w-full items-center gap-3 rounded-2xl border border-transparent bg-white/[0.02] px-3 py-3 text-left transition-all hover:border-white/10 hover:bg-white/[0.05]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-white/45">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-white/82">{child.title}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/24 transition-all group-hover:translate-x-0.5 group-hover:text-white/55" />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {activeHeadings.length > 0 ? (
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(17,17,20,0.92)] shadow-[0_20px_55px_rgba(0,0,0,0.3)]">
                <div className="border-b border-white/10 px-5 py-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/36">Быстрый переход</div>
                  <div className="mt-2 text-lg font-semibold text-white">Оглавление статьи</div>
                </div>
                <div className="space-y-1.5 p-3">
                  {activeHeadings.slice(0, 10).map((heading) => (
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
              {heroImage ? (
                <img src={heroImage} alt={activeArticle.title} className="h-[360px] w-full object-cover object-center opacity-[0.78]" />
              ) : (
                <div className="flex h-[360px] w-full items-center justify-center bg-black/40">
                  <ActiveIcon className="h-12 w-12 text-white/18" />
                </div>
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,12,0.06),rgba(8,8,12,0.22)_38%,rgba(8,8,12,0.95)_100%)]" />
              <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-br ${activeMeta.glow}`} />

              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-8">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${activeMeta.accent}`}>
                    <ActiveIcon className="h-3.5 w-3.5" />
                    {activeMeta.eyebrow}
                  </span>
                  {parentArticle ? (
                    <span className="rounded-full border border-white/12 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/58">
                      {parentArticle.title}
                    </span>
                  ) : null}
                </div>

                <h2 className="max-w-4xl text-4xl font-journal text-white sm:text-5xl">{activeArticle.title}</h2>
                {activeArticle.description ? (
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-white/64 sm:text-base">{activeArticle.description}</p>
                ) : null}
              </div>
            </div>

            {activeChildren.length > 0 ? (
              <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(17,17,20,0.92)] shadow-[0_22px_60px_rgba(0,0,0,0.34)]">
                <div className="border-b border-white/10 px-6 py-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/36">Внутренние страницы</div>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <div className="text-2xl font-semibold text-white">Навигация по разделу</div>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/50">
                      {activeChildren.length} маршрутов внутри
                    </span>
                  </div>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-white/55">
                    Здесь собраны отдельные страницы с точечными механиками. Открывай нужный блок сразу, без прокрутки через общий текст.
                  </p>
                </div>
                <div className="p-6">{renderCardGrid(activeChildren, true)}</div>
              </div>
            ) : null}

            {activeArticle.articleHtml ? (
              <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(17,17,20,0.92)] shadow-[0_22px_60px_rgba(0,0,0,0.34)]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/36">Полный разбор</div>
                    <div className="mt-1 text-lg font-semibold text-white">Основная механика без сокращений</div>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/52">
                    {activeHeadings.length > 0 ? `${activeHeadings.length} секций` : 'цельная статья'}
                  </span>
                </div>
                <div className="overflow-x-auto p-6 lg:p-7">
                  <RichArticleContent html={activeArticle.articleHtml} />
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1580px] animate-in fade-in slide-in-from-bottom-4 duration-700">
      {renderBreadcrumbs()}

      <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#101013]/94 shadow-[0_32px_95px_rgba(0,0,0,0.5)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(100,179,255,0.10),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]" />

        <div className="relative border-b border-white/8 px-6 py-7 sm:px-8 lg:px-10">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,420px)] xl:items-end">
            <div className="space-y-4 text-left">
              <span className="inline-flex items-center rounded-full border border-[#b9a3ff]/20 bg-[#b9a3ff]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d8c8ff]">
                Полевой архив
              </span>

              <div className="space-y-3">
                <h2 className="text-4xl font-journal text-white sm:text-5xl">Механики и геймплей</h2>
                <p className="max-w-3xl text-sm leading-7 text-white/60 sm:text-base">
                  Внутриигровые правила, логика охоты, фургон, медиа, погода и все тонкие места,
                  которые реально влияют на расследование. Раздел собран как оперативный справочник:
                  сначала быстро находишь нужное направление, потом открываешь точечную страницу без лишнего шума.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/68">
                  Главных разделов: {GAMEPLAY_HOME_CARDS.length}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/68">
                  Вложенных страниц: {totalNestedArticles}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/68">
                  Поиск работает и по внутренним материалам
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Разделов', value: GAMEPLAY_HOME_CARDS.length, hint: 'основной каталог' },
                { label: 'Глубина', value: totalNestedArticles, hint: 'вложенные статьи' },
                { label: 'Найдено', value: visibleCards.length, hint: deferredSearchQuery.trim() ? 'по текущему запросу' : 'без фильтра' },
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
                <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/35">Реестр механик</div>
                <div className="mt-2 text-2xl font-semibold text-white">
                  {deferredSearchQuery.trim() ? 'Результаты поиска' : 'Ключевые игровые разделы'}
                </div>
              </div>

              <div className="w-full max-w-md">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Поиск по разделам и вложенным страницам"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/20"
                  />
                </div>
              </div>
            </div>

            {visibleCards.length > 0 ? (
              renderCardGrid(visibleCards)
            ) : (
              <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-8 py-20 text-center">
                <Compass className="mx-auto mb-4 h-10 w-10 text-white/15" />
                <h3 className="text-3xl font-journal text-white">Ничего не найдено</h3>
                <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-white/55">
                  Попробуй сократить запрос или искать по ключевому слову вроде «охота», «фургон», «погода»,
                  «сложности» или по названию вложенной страницы.
                </p>
              </div>
            )}
          </section>

          <aside className="space-y-5 xl:sticky xl:top-24">
            {featuredCard ? (
              <button
                onClick={() => startTransition(() => setActiveSection(featuredCard.id))}
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
                  {featuredParentTitle ? (
                    <div className="mt-3 inline-flex rounded-full border border-white/12 bg-black/25 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/52">
                      {featuredParentTitle}
                    </div>
                  ) : null}
                </div>
              </button>
            ) : null}

            <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(17,17,20,0.92)] shadow-[0_22px_60px_rgba(0,0,0,0.34)]">
              <div className="border-b border-white/10 px-5 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/36">Быстрый доступ</div>
                <div className="mt-2 text-xl font-semibold text-white">Точечные страницы внутри механик</div>
              </div>
              <div className="space-y-2 p-3">
                {quickAccessCards.map((card, index) => {
                  const parentId = childParentMap.get(card.id);
                  const parentTitle = parentId ? GAMEPLAY_ARTICLES[parentId]?.title ?? '' : '';

                  return (
                    <button
                      key={card.id}
                      onClick={() => startTransition(() => setActiveSection(card.id))}
                      className="group flex w-full items-center gap-3 rounded-2xl border border-transparent bg-white/[0.03] px-3 py-3 text-left transition-all hover:border-white/10 hover:bg-white/[0.05]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-white/45">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-white/82">{card.title}</div>
                        <div className="truncate text-xs text-white/38">{parentTitle || 'Главный раздел'}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/24 transition-all group-hover:translate-x-0.5 group-hover:text-white/55" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[rgba(17,17,20,0.92)] px-5 py-5 shadow-[0_20px_55px_rgba(0,0,0,0.3)]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/36">Как пользоваться</div>
              <div className="mt-2 text-xl font-semibold text-white">Схема навигации по разделу</div>
              <div className="mt-4 space-y-3">
                {[
                  'Сначала выбери главный раздел, если нужен общий контекст и обзор всей механики.',
                  'Если точно знаешь, что ищешь, используй поиск: он находит и вложенные страницы внутри разделов.',
                  'На длинных статьях справа есть оглавление, а у сложных разделов отдельно вынесен навигатор по дочерним материалам.',
                ].map((tip, index) => (
                  <div key={tip} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-white/68">
                    <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-white/34">Шаг {String(index + 1).padStart(2, '0')}</div>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
