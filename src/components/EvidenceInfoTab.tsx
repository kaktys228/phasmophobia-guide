import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { ChevronRight, ExternalLink, ListChecks, Quote, Search, Sparkles } from 'lucide-react';
import { EVIDENCE_ARTICLES, EVIDENCE_ITEMS } from '../data/evidence';
import { EVIDENCE_INFO } from '../data/evidenceInfo';
import { Evidence } from '../types';
import { EvidenceIcon } from './EvidenceIcon';
import { RichArticleContent } from './RichArticleContent';

const defaultEvidenceId = EVIDENCE_ITEMS[0]?.id ?? null;
const EVIDENCE_ID_MAP: Partial<Record<string, Evidence>> = {
  emf: 'EMF Level 5',
  spirit_box: 'Spirit Box',
  freezing: 'Freezing Temperatures',
  fingerprints: 'Fingerprints',
  ghost_orb: 'Ghost Orb',
  ghost_writing: 'Ghost Writing',
  dots: 'D.O.T.S. Projector',
};

const EVIDENCE_INFO_MAP = new Map(EVIDENCE_INFO.map((item) => [item.id, item]));

export function EvidenceInfoTab() {
  const [selectedId, setSelectedId] = useState<string | null>(defaultEvidenceId);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const filteredItems = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return EVIDENCE_ITEMS;
    }

    return EVIDENCE_ITEMS.filter((item) => item.title.toLowerCase().includes(normalizedQuery));
  }, [deferredQuery]);

  useEffect(() => {
    if (!filteredItems.length) {
      setSelectedId(null);
      return;
    }

    if (!selectedId || !filteredItems.some((item) => item.id === selectedId)) {
      setSelectedId(filteredItems[0].id);
    }
  }, [filteredItems, selectedId]);

  const selectedItem =
    filteredItems.find((item) => item.id === selectedId) ??
    EVIDENCE_ITEMS.find((item) => item.id === selectedId) ??
    null;
  const article = selectedItem ? EVIDENCE_ARTICLES[selectedItem.id] : null;
  const selectedInfo = selectedItem ? EVIDENCE_INFO_MAP.get(selectedItem.id) ?? null : null;

  const quickSummary = selectedInfo?.shortDesc ?? article?.description ?? '';
  const quickNotes = selectedInfo?.conditions ?? [];
  const primaryTip = useMemo(() => {
    const source = selectedInfo?.useful ?? selectedInfo?.mechanics ?? '';
    return source
      .split('\n')
      .map((entry) => entry.trim())
      .filter(Boolean)[0] ?? '';
  }, [selectedInfo]);

  return (
    <div className="mx-auto max-w-[1680px] animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-end">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-white/50">
            <span>База знаний</span>
            <ChevronRight className="h-4 w-4 text-white/25" />
            <span className="text-white/80">Улики</span>
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full border border-[#7adfff]/20 bg-[#7adfff]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#bcefff]">
              Полевой справочник
            </span>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Улики
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-white/50">
              Слева быстрый список улик, справа сфокусированная карточка выбранного доказательства с краткой сводкой, заметками и полной механикой.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/68">
              Всего улик: {EVIDENCE_ITEMS.length}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/68">
              Поиск по названиям
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/68">
              Быстрый доступ к механикам
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск улики..."
              className="h-13 w-full rounded-[22px] border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#7adfff]/30 focus:bg-white/[0.06]"
            />
          </div>

          <div className="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/62">
            <span>Результаты поиска</span>
            <span className="font-semibold text-white">{filteredItems.length}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
        <aside className="overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(17,17,20,0.92)] shadow-[0_22px_60px_rgba(0,0,0,0.38)]">
          <div className="border-b border-white/10 bg-[linear-gradient(180deg,rgba(122,223,255,0.10),rgba(255,255,255,0.02))] px-5 py-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#bcefff]/75">
              Навигация
            </div>
            <div className="mt-2 text-xl font-semibold text-white">Список улик</div>
            <div className="mt-1 text-sm leading-6 text-white/48">
              Выберите нужную улику, чтобы сразу открыть её подробную механику и полезные заметки.
            </div>
          </div>

          <div className="p-3">
            <div className="space-y-2.5">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => {
                  const isSelected = item.id === selectedId;
                  const evidenceType = EVIDENCE_ID_MAP[item.id];

                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`group w-full rounded-[24px] border p-3 text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-[#7adfff]/45 bg-[linear-gradient(135deg,rgba(36,75,96,0.34),rgba(18,24,31,0.94))] shadow-[0_0_0_1px_rgba(122,223,255,0.08)]'
                          : 'border-white/8 bg-white/[0.02] hover:border-white/14 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-white/40">
                          {String(index + 1).padStart(2, '0')}
                        </div>

                        <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          {evidenceType ? (
                            <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/36">
                              <EvidenceIcon evidence={evidenceType} className="h-3 w-3" />
                              <span>Улика</span>
                            </div>
                          ) : null}
                          <div
                            className={`text-[14px] font-medium leading-5 ${
                              isSelected ? 'text-[#d9f7ff]' : 'text-white/82'
                            }`}
                          >
                            {item.title}
                          </div>
                        </div>

                        <ChevronRight
                          className={`h-4 w-4 shrink-0 transition-all duration-200 ${
                            isSelected
                              ? 'text-[#7adfff] opacity-100'
                              : 'text-white/20 opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] px-4 py-10 text-center">
                  <Sparkles className="mx-auto h-6 w-6 text-white/15" />
                  <div className="mt-3 text-sm text-white/48">
                    Ничего не найдено. Попробуйте другой запрос.
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        <section className="min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(17,17,20,0.92)] shadow-[0_22px_60px_rgba(0,0,0,0.38)]">
          {article && selectedItem ? (
            <div>
              <div className="p-4 lg:p-5">
                <div className="space-y-5">
                  <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_340px]">
                    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/25">
                      <img
                        src={article.image || selectedItem.image}
                        alt={article.title}
                        className="max-h-[420px] min-h-[320px] w-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,14,0.05),rgba(8,10,14,0.22)_38%,rgba(8,10,14,0.92)_100%)]" />
                      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#7adfff]/10 to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                          {EVIDENCE_ID_MAP[selectedItem.id] ? (
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#7adfff]/20 bg-[#7adfff]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9f6ff]">
                              <EvidenceIcon evidence={EVIDENCE_ID_MAP[selectedItem.id]!} className="h-3.5 w-3.5" />
                              Доказательство
                            </span>
                          ) : null}
                          <span className="rounded-full border border-white/12 bg-black/25 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/58">
                            Полный разбор
                          </span>
                        </div>

                        <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.8)] sm:text-[2.6rem]">
                          {article.title}
                        </h1>
                      </div>
                    </div>

                    <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(122,223,255,0.08),rgba(255,255,255,0.02))] p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#bcefff]/70">
                            Краткая сводка
                          </div>
                          <div className="mt-1 text-lg font-semibold text-white">Что важно понять сразу</div>
                        </div>
                        <a
                          href={article.source}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white/72 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                        >
                          Источник
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>

                      <div className="mt-5 border-b border-white/8 pb-5">
                        <p className="leading-7 text-white/78">{quickSummary}</p>
                      </div>

                      {selectedInfo?.quote ? (
                        <div className="mt-5 rounded-[22px] border border-white/8 bg-black/18 p-4">
                          <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#bcefff]/70">
                            <Quote className="h-3.5 w-3.5" />
                            Полевая заметка
                          </div>
                          <p className="text-sm italic leading-7 text-white/68">{selectedInfo.quote}</p>
                        </div>
                      ) : null}

                      <div className="mt-5 rounded-[22px] border border-white/8 bg-black/18 p-4">
                        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#bcefff]/70">
                          <ListChecks className="h-3.5 w-3.5" />
                          На что смотреть
                        </div>

                        {quickNotes.length > 0 ? (
                          <ul className="space-y-3 text-sm leading-7 text-white/72">
                            {quickNotes.slice(0, 3).map((condition, index) => (
                              <li key={index} className="border-l border-white/10 pl-3">
                                {condition}
                              </li>
                            ))}
                          </ul>
                        ) : primaryTip ? (
                          <p className="text-sm leading-7 text-white/72">{primaryTip}</p>
                        ) : (
                          <p className="text-sm leading-7 text-white/45">Дополнительных заметок для этой улики пока нет.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-[28px] border border-white/8 bg-white/[0.02]">
                    <div className="border-b border-white/8 px-5 py-4">
                      <div className="text-[10px] uppercase tracking-[0.24em] text-white/36">
                        Полное описание
                      </div>
                    </div>

                    <div className="p-5 lg:p-6">
                      <RichArticleContent html={article.articleHtml} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[420px] items-center justify-center px-8 text-center text-white/50">
              Выберите улику из списка слева.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
