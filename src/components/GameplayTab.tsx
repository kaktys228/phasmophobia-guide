import { startTransition, useDeferredValue, useMemo, useState } from 'react';
import { ArrowLeft, ChevronRight, Gamepad2, Search } from 'lucide-react';
import { GAMEPLAY_ARTICLES, GAMEPLAY_HOME_CARDS } from '../data/gameplay';
import { RichArticleContent } from './RichArticleContent';

type SectionId = 'home' | string;

export function GameplayTab() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const allCards = useMemo(
    () => [
      ...GAMEPLAY_HOME_CARDS,
      ...Object.values(GAMEPLAY_ARTICLES).flatMap((article) => article.children ?? []),
    ],
    []
  );

  const cardById = useMemo(() => {
    return new Map(allCards.map((card) => [card.id, card]));
  }, [allCards]);

  const filteredCards = useMemo(() => {
    const normalizedQuery = deferredSearchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return GAMEPLAY_HOME_CARDS;
    }

    return GAMEPLAY_HOME_CARDS.filter((card) => card.title.toLowerCase().includes(normalizedQuery));
  }, [deferredSearchQuery]);

  const activeArticle = activeSection !== 'home' ? GAMEPLAY_ARTICLES[activeSection] : null;
  const parentArticle = activeArticle?.parentId ? GAMEPLAY_ARTICLES[activeArticle.parentId] : null;
  const heroImage = activeArticle ? activeArticle.image || cardById.get(activeSection)?.image || '' : '';
  const breadcrumbs =
    activeSection === 'home'
      ? ['База знаний', 'Механики и геймплей']
      : parentArticle
        ? ['База знаний', 'Механики и геймплей', parentArticle.title, activeArticle?.title ?? '']
        : ['База знаний', 'Механики и геймплей', activeArticle?.title ?? ''];

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

  const renderCardGrid = (cards: typeof GAMEPLAY_HOME_CARDS) => (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <button
          key={card.id}
          onClick={() => startTransition(() => setActiveSection(card.id))}
          className="group relative aspect-[1.56/1] overflow-hidden rounded-[28px] border border-white/10 bg-black text-left transition-all duration-500 hover:-translate-y-1 hover:border-[#b9a3ff]/45"
        >
          <img
            src={card.image}
            alt={card.alt}
            className="absolute inset-0 h-full w-full object-cover brightness-[0.82] transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent opacity-90" />
          <div className="relative z-10 flex h-full items-end justify-between gap-4 p-6">
            <div>
              <div className="mb-2 text-xs uppercase tracking-[0.25em] text-white/45">Раздел</div>
              <div className="text-3xl font-journal text-white">{card.title}</div>
            </div>

            <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 md:flex">
              <Gamepad2 className="h-6 w-6 text-[#b9a3ff]" />
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  if (activeArticle) {
    return (
      <div className="mx-auto max-w-[1460px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        {renderBreadcrumbs()}

        <button
          onClick={() => startTransition(() => setActiveSection(activeArticle.parentId ?? 'home'))}
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {activeArticle.parentId ? 'Назад к разделу' : 'Назад к разделам'}
        </button>

        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(20,20,20,0.68)] backdrop-blur-md shadow-2xl">
          <div className="relative h-[300px] border-b border-white/10">
            {heroImage ? (
              <img src={heroImage} alt={activeArticle.title} className="h-full w-full object-cover opacity-80" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-black/40">
                <Gamepad2 className="h-10 w-10 text-white/15" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/55 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <h2 className="text-5xl font-journal text-white">{activeArticle.title}</h2>
              {activeArticle.description && (
                <p className="mt-3 max-w-3xl text-base leading-7 text-white/65">{activeArticle.description}</p>
              )}
            </div>
          </div>

          <div className="space-y-8 p-8">
            {activeArticle.articleHtml ? (
              <RichArticleContent html={activeArticle.articleHtml} />
            ) : activeArticle.children?.length ? (
              <div className="space-y-6">
                <div className="max-w-3xl text-base leading-7 text-white/70">
                  Внутри этого раздела есть отдельные страницы по каждому блоку. Откройте нужную карточку,
                  чтобы посмотреть точную механику и подробное описание.
                </div>
                {renderCardGrid(activeArticle.children)}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center text-white/55">
                Для этого раздела сайт сейчас не отдает подробный текстовый блок.
              </div>
            )}

            <div className="border-t border-white/10 pt-4">
              <a
                href={activeArticle.source}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-[#b9a3ff] transition-colors hover:text-white"
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
    <div className="mx-auto max-w-[1460px] animate-in fade-in slide-in-from-bottom-4 duration-700">
      {renderBreadcrumbs()}

      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-5xl font-journal text-white">Механики и геймплей</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/55">
            Внутриигровые правила, поведение призрака, работа фургона, медиа, погодных условий
            и остальные ключевые механики расследования.
          </p>
        </div>

        <div className="w-full max-w-sm">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Поиск по разделам"
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-white/20"
            />
          </div>
        </div>
      </div>

      {filteredCards.length > 0 ? (
        renderCardGrid(filteredCards)
      ) : (
        <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-8 py-20 text-center">
          <Gamepad2 className="mx-auto mb-4 h-10 w-10 text-white/15" />
          <h3 className="text-3xl font-journal text-white">Раздел не найден</h3>
          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-white/55">
            Попробуйте сократить запрос или ввести другое название механики.
          </p>
        </div>
      )}
    </div>
  );
}
