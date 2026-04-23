import { useState } from 'react';
import { EQUIPMENT, EquipmentItem } from '../data/equipment';
import { EQUIPMENT_ARTICLES } from '../data/equipmentArticles';
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Boxes,
  ChevronLeft,
  Diamond,
  Layers3,
  Minus,
  NotebookPen,
  Plus,
  ShoppingBag,
  Target,
} from 'lucide-react';
import { RichArticleContent } from './RichArticleContent';
import { proxyWikiaImage } from '../utils/imageUtils';

export function EquipmentTab() {
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);
  const [activeTab, setActiveTab] = useState<'desc' | 1 | 2 | 3>('desc');

  if (selectedItem) {
    const article = EQUIPMENT_ARTICLES[selectedItem.id];
    const selectedTier = activeTab !== 'desc' ? selectedItem.tiers?.find((tier) => tier.level === activeTab) : null;
    const previewImage =
      selectedTier?.image ??
      selectedItem.tiers?.find((tier) => tier.level === 2)?.image ??
      selectedItem.tiers?.[0]?.image ??
      selectedItem.icon;
    const descriptionParagraphs =
      selectedItem.fullDescription && selectedItem.fullDescription.length > 0
        ? selectedItem.fullDescription
        : selectedItem.description
          ? [selectedItem.description]
          : ['Описание для этого предмета пока не заполнено.'];

    return (
      <div className="mx-auto max-w-[1200px] animate-in fade-in slide-in-from-right-4 duration-500">
        <button
          onClick={() => {
            setSelectedItem(null);
            setActiveTab('desc');
          }}
          className="mb-6 flex items-center gap-2 text-muted-foreground transition-colors hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="text-sm font-medium uppercase tracking-wider">К списку снаряжения</span>
        </button>

        <div className="overflow-hidden rounded-xl border border-white/5 bg-[#151515] shadow-2xl">
          <div className="flex flex-col items-start justify-between border-b border-white/5 bg-white/[0.02] p-6 md:flex-row md:items-center">
            <h2 className="mb-4 text-3xl font-journal uppercase tracking-widest text-white md:mb-0">
              {selectedItem.name}
            </h2>

            <div className="flex rounded-lg bg-[#2a2a2f] p-1">
              <button
                onClick={() => setActiveTab('desc')}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-all ${
                  activeTab === 'desc'
                    ? 'bg-[#3b3b44] text-white shadow-sm'
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                <NotebookPen className="h-4 w-4" />
                Описание
              </button>
              {selectedItem.tiers?.map((tier) => (
                <button
                  key={tier.level}
                  onClick={() => setActiveTab(tier.level as 1 | 2 | 3)}
                  className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-all ${
                    activeTab === tier.level
                      ? 'bg-[#3b3b44] text-white shadow-sm'
                      : 'text-white/50 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Diamond className={`h-3 w-3 ${activeTab === tier.level ? 'fill-current' : ''}`} />
                  Тир {tier.level}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[400px] p-6 md:p-8">
            {activeTab === 'desc' && (
              <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[320px,1fr]">
                <div className="flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a1a] p-8">
                  <img
                    src={proxyWikiaImage(previewImage)}
                    alt={selectedItem.name}
                    className="max-h-[260px] object-contain drop-shadow-2xl"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      if (target.parentElement) {
                        target.parentElement.classList.add('bg-white/5');
                        target.parentElement.innerHTML = '<div class="p-6 text-center text-sm text-white/20">Изображение недоступно</div>';
                      }
                    }}
                  />
                </div>

                <div className="space-y-5">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="border border-white/10 bg-white/5 uppercase tracking-wider text-white/80">
                      {selectedItem.category === 'basic' ? 'Basic' : 'Shop'}
                    </Badge>
                    {selectedItem.tiers?.map((tier) => (
                      <Badge
                        key={tier.level}
                        variant="secondary"
                        className="border border-white/10 bg-[#26262d] uppercase tracking-wider text-white/80"
                      >
                        Тир {tier.level}
                      </Badge>
                    ))}
                  </div>

                  {article?.articleHtml ? (
                    <div className="space-y-6">
                      <RichArticleContent html={article.articleHtml} />
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-white/40">
                        <span>Последняя редакция: {article.updatedAt}</span>
                        <a
                          href={article.source}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#b9a3ff] transition-colors hover:text-white"
                        >
                          Источник
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-4xl space-y-4 leading-relaxed text-white/80">
                      {descriptionParagraphs.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab !== 'desc' && selectedTier && (
              <div className="animate-in space-y-8 fade-in duration-300">
                <p className="leading-relaxed text-white/80">{selectedTier.desc}</p>

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-white/90">Характеристики Тир {selectedTier.level}</h3>

                    <div className="space-y-2">
                      {selectedTier.characteristics ? (
                        selectedTier.characteristics.map((char, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-lg border border-white/5 bg-[#222] px-4 py-3"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-5 w-5 items-center justify-center rounded-full ${
                                  char.type === 'positive'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : char.type === 'neutral'
                                      ? 'bg-amber-500/20 text-amber-300'
                                      : 'bg-red-500/20 text-red-400'
                                }`}
                              >
                                {char.type === 'positive' ? (
                                  <Plus className="h-3 w-3" />
                                ) : char.type === 'neutral' ? (
                                  <Target className="h-3 w-3" />
                                ) : (
                                  <Minus className="h-3 w-3" />
                                )}
                              </div>
                              <span className="text-sm text-white/90">{char.label}</span>
                            </div>
                            {char.value && (
                              <span className="text-sm font-semibold text-[#a991e8]">{char.value}</span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-sm italic text-white/30">Нет характеристик</div>
                      )}
                    </div>
                  </div>

                  <div className="flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a1a] p-8">
                    <img
                      src={proxyWikiaImage(selectedTier.image)}
                      alt={`Tier ${selectedTier.level}`}
                      className="max-h-[400px] object-contain drop-shadow-2xl"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.classList.add('bg-white/5');
                          target.parentElement.innerHTML = '<div class="p-10 text-center text-xs text-white/10">Изображение недоступно</div>';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const basicItems = EQUIPMENT.filter((item) => item.category === 'basic');
  const shopItems = EQUIPMENT.filter((item) => item.category === 'shop');
  const totalTierCount = EQUIPMENT.reduce((sum, item) => sum + Math.max(item.tiers?.length ?? 0, 1), 0);

  const overviewCards = [
    {
      label: 'Всего предметов',
      value: EQUIPMENT.length,
      hint: 'Полный каталог',
      icon: Layers3,
    },
    {
      label: 'Стартовый набор',
      value: basicItems.length,
      hint: 'Сразу в фургоне',
      icon: Boxes,
    },
    {
      label: 'Магазин',
      value: shopItems.length,
      hint: `${totalTierCount} уровней экипировки`,
      icon: ShoppingBag,
    },
  ];

  const equipmentSections = [
    {
      key: 'basic' as const,
      label: 'Basic',
      title: 'Стартовый комплект',
      description:
        'Базовые приборы, которые помогают быстро локализовать комнату, собрать первые данные и закрепить улики.',
      items: basicItems,
      icon: Boxes,
      glow: 'from-emerald-400/18 via-emerald-200/6 to-transparent',
    },
    {
      key: 'shop' as const,
      label: 'Shop',
      title: 'Покупаемое снаряжение',
      description:
        'Расходники, тактические инструменты и вспомогательная техника для охоты, страховки и проверки гипотез.',
      items: shopItems,
      icon: ShoppingBag,
      glow: 'from-amber-300/18 via-orange-200/8 to-transparent',
    },
  ];

  const renderGrid = (items: EquipmentItem[], category: EquipmentItem['category']) => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setSelectedItem(item)}
          className="group relative overflow-hidden rounded-[26px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-[#202025]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/6 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative flex items-center justify-between gap-3">
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                category === 'basic'
                  ? 'border-emerald-400/15 bg-emerald-400/8 text-emerald-100/80'
                  : 'border-amber-300/15 bg-amber-300/8 text-amber-100/80'
              }`}
            >
              {category === 'basic' ? 'Старт' : 'Shop'}
            </span>
            <ArrowRight className="h-4 w-4 text-white/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white/70" />
          </div>

          <div className="relative mt-4 flex h-24 items-center justify-center rounded-2xl border border-white/6 bg-[#101114]/90 p-4">
            <img
              src={proxyWikiaImage(item.icon)}
              alt={item.name}
              className="max-h-full object-contain opacity-75 drop-shadow-[0_12px_22px_rgba(0,0,0,0.45)] transition-all duration-300 group-hover:scale-110 group-hover:opacity-100"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="flex h-full w-full items-center justify-center rounded-lg bg-white/5"><div class="h-8 w-8 text-white/10">📦</div></div>';
              }}
            />
          </div>

          <div className="relative mt-4 space-y-2">
            <div className="text-sm font-semibold leading-tight text-white">{item.name}</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/35">
              {item.tiers?.length ? `Тиры ${item.tiers.map((tier) => tier.level).join(' / ')}` : 'Описание и применение'}
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1320px] animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#121214]/90 shadow-[0_32px_90px_rgba(0,0,0,0.48)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,178,92,0.14),transparent_34%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.08),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]" />

        <div className="relative border-b border-white/8 px-6 py-7 sm:px-8 lg:px-10">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,420px)] xl:items-end">
            <div className="space-y-4 text-left">
              <span className="inline-flex items-center rounded-full border border-[#f0b46c]/20 bg-[#f0b46c]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f5c88f]">
                Экспедиционный каталог
              </span>

              <div className="space-y-3">
                <h2 className="text-3xl font-journal uppercase tracking-[0.12em] text-white sm:text-4xl">
                  Склады снаряжения
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-white/60 sm:text-[15px]">
                  Быстрый доступ к стартовым приборам и покупаемому снаряжению. Страница стала плотнее и читабельнее: сверху обзор, ниже секции по назначению и удобные плитки для перехода к подробностям.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                  База: {basicItems.length}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                  Магазин: {shopItems.length}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                  Уровней экипировки: {totalTierCount}
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
                      <Icon className="h-4 w-4 text-white/35" />
                    </div>
                    <div className="text-2xl font-semibold text-white">{card.value}</div>
                    <div className="mt-1 text-xs text-white/45">{card.hint}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative space-y-8 p-6 sm:p-8 lg:p-10">
          {equipmentSections.map((section) => {
            const Icon = section.icon;
            const sectionTierCount = section.items.reduce((sum, item) => sum + Math.max(item.tiers?.length ?? 0, 1), 0);

            return (
              <section
                key={section.key}
                className="relative overflow-hidden rounded-[28px] border border-white/8 bg-[#161619]/95 p-5 sm:p-6 lg:p-7"
              >
                <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${section.glow}`} />

                <div className="relative flex flex-col gap-4 border-b border-white/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex items-start gap-4 text-left">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                      <Icon className="h-5 w-5 text-white/70" />
                    </div>

                    <div className="space-y-2">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/35">
                        {section.label}
                      </div>
                      <h3 className="text-2xl font-semibold text-white">{section.title}</h3>
                      <p className="max-w-3xl text-sm leading-7 text-white/55">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/65">
                      {section.items.length} предметов
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/65">
                      {sectionTierCount} уровней
                    </span>
                  </div>
                </div>

                <div className="relative pt-6">{renderGrid(section.items, section.key)}</div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
