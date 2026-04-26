import { useEffect, useMemo, useState } from 'react';
import { GHOSTS } from './data/ghosts';
import {
  Evidence,
  EvidenceSelectionState,
  EvidenceStateMap,
  GhostManualState,
  GhostSpeed,
  HuntThreshold,
  InvestigationDifficulty,
} from './types';
import { EvidenceFilter } from './components/EvidenceFilter';
import { SmudgeTimer } from './components/SmudgeTimer';
import { BlinkVisualizer } from './components/BlinkVisualizer';
import { SpeedMetronome } from './components/SpeedMetronome';
import { TapSpeedCalculator } from './components/TapSpeedCalculator';
import { InvestigationTracker } from './components/InvestigationTracker';
import { SanityTracker } from './components/SanityTracker';
import { ScrollToTop } from './components/ScrollToTop';
import { EquipmentTab } from './components/EquipmentTab';
import { CursedPossessionsTab } from './components/CursedPossessionsTab';
import { EvidenceInfoTab } from './components/EvidenceInfoTab';
import { GameplayTab } from './components/GameplayTab';
import { ProgressionTab } from './components/ProgressionTab';
import { ExperienceCalculatorTab } from './components/ExperienceCalculatorTab';
import { GhostListPanel } from './components/GhostListPanel';
import { GhostInfoDialog } from './components/GhostInfoDialog';
import { AuthButton } from './components/AuthButton';
import { AuthPage } from './components/AuthPage';
import { AuthProvider } from './components/AuthProvider';
import { AnimatePresence, motion } from 'motion/react';
import { Skull, Ghost as GhostIcon, Info, Sparkles, Loader2, Mic, Flashlight, Flame, BookOpen, Trophy, Gamepad2, Calculator as CalculatorIcon, Zap } from 'lucide-react';
import { identifyGhost } from './services/aiClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { evidenceTranslations } from './utils/translations';
import { EvidenceIcon } from './components/EvidenceIcon';
import {
  createDefaultEvidenceStateMap,
  getConfirmedEvidence,
  getDifficultyMeta,
  getRuledOutEvidence,
  ghostMatchesEvidenceFilters,
  ghostMatchesHuntThresholdFilters,
  ghostMatchesMeasuredSpeed,
  ghostMatchesSpeedFilters,
  matchesGhostSearch,
} from './utils/journalFilters';

function AppContent() {
  const [difficulty, setDifficulty] = useState<InvestigationDifficulty>('Professional');
  const [evidenceStates, setEvidenceStates] = useState<EvidenceStateMap>(() => createDefaultEvidenceStateMap());
  const [selectedSpeeds, setSelectedSpeeds] = useState<GhostSpeed[]>([]);
  const [selectedHuntThresholds, setSelectedHuntThresholds] = useState<HuntThreshold[]>([]);
  const [measuredSpeedFilter, setMeasuredSpeedFilter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGhost, setSelectedGhost] = useState<(typeof GHOSTS)[number] | null>(null);
  const [ghostMarks, setGhostMarks] = useState<Record<string, GhostManualState>>({});
  
  // AI Search states
  const [aiDescription, setAiDescription] = useState('');
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiIdentify = async () => {
    if (!aiDescription.trim()) return;
    setIsAiLoading(true);
    setAiResult(null);
    try {
      const result = await identifyGhost(aiDescription);
      setAiResult(result);
    } catch (error) {
      setAiResult("Ошибка при идентификации. Попробуйте еще раз.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const setEvidenceState = (evidence: Evidence, state: EvidenceSelectionState) => {
    setEvidenceStates((prev) => {
      if (prev[evidence] === state) {
        return {
          ...prev,
          [evidence]: 'neutral',
        };
      }

      return {
        ...prev,
        [evidence]: state,
      };
    });
  };

  const toggleSpeed = (speed: GhostSpeed) => {
    setSelectedSpeeds(prev => 
      prev.includes(speed) 
        ? prev.filter(s => s !== speed) 
        : [...prev, speed]
    );
  };

  const toggleHuntThreshold = (threshold: HuntThreshold) => {
    setSelectedHuntThresholds(prev => 
      prev.includes(threshold) 
        ? prev.filter(t => t !== threshold) 
        : [...prev, threshold]
    );
  };

  const setGhostManualState = (ghostId: string, state: GhostManualState) => {
    setGhostMarks((currentMarks) => {
      const nextMarks = { ...currentMarks };

      if (state === 'neutral') {
        delete nextMarks[ghostId];
      } else {
        nextMarks[ghostId] = state;
      }

      return nextMarks;
    });
  };

  const resetFilters = () => {
    setDifficulty('Professional');
    setEvidenceStates(createDefaultEvidenceStateMap());
    setSelectedSpeeds([]);
    setSelectedHuntThresholds([]);
    setMeasuredSpeedFilter(null);
    setSearchQuery('');
    setGhostMarks({});
  };

  const confirmedEvidence = useMemo(() => getConfirmedEvidence(evidenceStates), [evidenceStates]);
  const ruledOutEvidence = useMemo(() => getRuledOutEvidence(evidenceStates), [evidenceStates]);
  const difficultyMeta = useMemo(() => getDifficultyMeta(difficulty), [difficulty]);

  const filteredGhosts = useMemo(() => {
    return GHOSTS.filter(ghost => {
      const matchesSearch = matchesGhostSearch(ghost, searchQuery);
      const matchesEvidence = ghostMatchesEvidenceFilters(ghost, evidenceStates, difficulty);
      const matchesSpeed = ghostMatchesSpeedFilters(ghost, selectedSpeeds);
      const matchesMeasuredSpeed = ghostMatchesMeasuredSpeed(ghost, measuredSpeedFilter);
      const matchesHunt = ghostMatchesHuntThresholdFilters(ghost, selectedHuntThresholds);
      
      return matchesSearch && matchesEvidence && matchesSpeed && matchesMeasuredSpeed && matchesHunt;
    });
  }, [difficulty, evidenceStates, measuredSpeedFilter, searchQuery, selectedHuntThresholds, selectedSpeeds]);

  const matchingGhostIds = useMemo(
    () => new Set(filteredGhosts.map((ghost) => ghost.id)),
    [filteredGhosts],
  );

  return (
    <div className="min-h-screen w-full flex flex-col journal-paper selection:bg-white/20 selection:text-white">
      <Tabs defaultValue="journal" className="w-full flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 bg-[#0a0a0c]/95 backdrop-blur-md border-b border-white/5 py-3 px-4 md:px-8 xl:px-12 flex flex-col xl:flex-row items-center justify-between gap-4 shadow-2xl">
          <div className="flex flex-col items-center xl:flex-row xl:items-center gap-4 shrink-0">
            <div className="hidden xl:inline-flex items-center justify-center p-2 bg-white/5 rounded-lg border border-white/10">
              <Skull className="h-5 w-5 text-white/90" />
            </div>
            <div className="text-center xl:text-left flex flex-col justify-center">
              <h1 className="font-journal text-2xl tracking-[0.1em] text-white spooky-text leading-[0.9]">
                PHASMOPHOBIA
              </h1>
              <p className="text-[8px] uppercase tracking-[0.3em] text-white/40 font-mono mt-0.5 hidden md:block">
                Справочник Исследователя
              </p>
            </div>
          </div>
          
          <div className="flex justify-center overflow-x-auto pb-1 xl:pb-0 hide-scrollbar w-full xl:w-auto">
            <TabsList className="bg-black/80 border border-white/10 p-1 rounded-full flex-nowrap shrink-0 shadow-lg w-auto">
              <TabsTrigger 
                value="journal" 
                className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-full px-4 md:px-6 py-2 transition-all whitespace-nowrap"
              >
                <span className="flex items-center gap-2">
                  <GhostIcon className="h-4 w-4" /> Журнал
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="ai" 
                className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-full px-4 md:px-6 py-2 transition-all whitespace-nowrap"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500/70" /> AI Поиск
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="equipment" 
                className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-full px-4 md:px-6 py-2 transition-all whitespace-nowrap"
              >
                <span className="flex items-center gap-2">
                  <Flashlight className="h-4 w-4" /> Предметы
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="cursed" 
                className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-full px-4 md:px-6 py-2 transition-all whitespace-nowrap"
              >
                <span className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-red-500/70" /> Проклятые
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="evidence" 
                className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-full px-4 md:px-6 py-2 transition-all whitespace-nowrap"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> Улики
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="gameplay" 
                className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-full px-4 md:px-6 py-2 transition-all whitespace-nowrap"
              >
                <span className="flex items-center gap-2">
                  <Gamepad2 className="h-4 w-4 text-[#b9a3ff]" /> {'\u041c\u0435\u0445\u0430\u043d\u0438\u043a\u0438'}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="progress" 
                className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-full px-4 md:px-6 py-2 transition-all whitespace-nowrap"
              >
                <span className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-[#b9a3ff]" /> {'\u041f\u0440\u043e\u0433\u0440\u0435\u0441\u0441'}
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="calculator" 
                className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-full px-4 md:px-6 py-2 transition-all whitespace-nowrap"
              >
                <span className="flex items-center gap-2">
                  <CalculatorIcon className="h-4 w-4 text-[#b9a3ff]" /> {'\u041a\u0430\u043b\u044c\u043a\u0443\u043b\u044f\u0442\u043e\u0440'}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="shrink-0">
            <AuthButton />
          </div>
        </header>

        <main className="w-full max-w-none px-4 md:px-8 xl:px-12 py-6 xl:py-10 mx-auto flex-1">
          <TabsContent value="journal" className="mt-0 outline-none max-w-[2000px] mx-auto flex flex-col lg:flex-row gap-8 items-start">
              {/* Sidebar */}
              <aside className="w-full lg:w-[350px] xl:w-[368px] shrink-0 pb-12 lg:self-start">
                <div className="lg:pr-1">
                  <div className="space-y-4">
                    <div className="hidden mb-3 rounded-[24px] border border-white/8 bg-[linear-gradient(135deg,rgba(249,115,22,0.10),rgba(255,255,255,0.03))] px-4 py-3">
                      <div className="text-[10px] uppercase tracking-[0.28em] text-orange-400/80">
                        Полевой Комплект
                      </div>
                      <div className="mt-1 font-journal text-lg uppercase tracking-[0.12em] text-white/90">
                        Левая Панель Журнала
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-white/45">
                        Фильтры, таймеры и быстрые инструменты собраны в одну удобную вертикальную
                        панель с отдельной прокруткой.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <EvidenceFilter
                        difficulty={difficulty}
                        onDifficultyChange={setDifficulty}
                        evidenceStates={evidenceStates}
                        onSetEvidenceState={setEvidenceState}
                        selectedSpeeds={selectedSpeeds}
                        onToggleSpeed={toggleSpeed}
                        selectedHuntThresholds={selectedHuntThresholds}
                        onToggleHuntThreshold={toggleHuntThreshold}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onReset={resetFilters}
                        hasMeasuredSpeedFilter={measuredSpeedFilter !== null}
                        hasGhostMarkFilters={Object.keys(ghostMarks).length > 0}
                      />

                      <div className="hidden items-center gap-3 px-1 py-1">
                        <div className="h-px flex-1 bg-white/8" />
                        <span className="text-[10px] uppercase tracking-[0.28em] text-white/32">
                          Инструменты Расследования
                        </span>
                        <div className="h-px flex-1 bg-white/8" />
                      </div>

                      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] p-4 shadow-[0_18px_54px_rgba(0,0,0,0.32)]">
                        <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <div className="mb-4 space-y-1">
                          <div className="text-[10px] uppercase tracking-[0.28em] text-white/38">
                            Инструменты
                          </div>
                          <div className="font-journal text-lg uppercase tracking-[0.12em] text-white/86">
                            Расследование
                          </div>
                          <p className="text-[11px] leading-5 text-white/42">
                            Таймеры, скорость, рассудок и заметки собраны в один блок без отдельной прокрутки.
                          </p>
                        </div>
                        <div className="space-y-3">
                          <SmudgeTimer />
                      <BlinkVisualizer />
                      <SpeedMetronome />
                      <TapSpeedCalculator
                        measuredSpeed={measuredSpeedFilter}
                        matchedGhostCount={filteredGhosts.length}
                        onMeasuredSpeedChange={setMeasuredSpeedFilter}
                      />
                      <SanityTracker />
                          <InvestigationTracker />
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1 min-w-0 space-y-8 pb-20 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl shadow-inner backdrop-blur-sm">
                  <div className="space-y-1">
                    <h2 className="text-[10px] font-mono text-orange-500/80 uppercase tracking-widest font-bold">
                      База Данных Сущностей
                    </h2>
                    <p className="text-xl font-journal text-white/90">
                      Обнаружено: {filteredGhosts.length} / {GHOSTS.length}
                    </p>
                    <p className="text-xs text-white/45">
                      {difficultyMeta.note}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <span className="text-[10px] bg-white/6 border border-white/10 text-white/65 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {difficultyMeta.shortLabel}
                    </span>
                    {confirmedEvidence.map((evidence) => (
                      <span
                        key={`confirmed-${evidence}`}
                        className="inline-flex items-center gap-1.5 text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-100/75 px-2.5 py-1 rounded-md uppercase tracking-wider"
                      >
                        <EvidenceIcon evidence={evidence} className="h-3 w-3" />
                        <span>{evidenceTranslations[evidence]}</span>
                      </span>
                    ))}
                    {ruledOutEvidence.map((evidence) => (
                      <span
                        key={`ruled-out-${evidence}`}
                        className="inline-flex items-center gap-1.5 text-[10px] bg-red-500/10 border border-red-500/20 text-red-100/70 px-2.5 py-1 rounded-md uppercase tracking-wider line-through decoration-red-300/70"
                      >
                        <EvidenceIcon evidence={evidence} className="h-3 w-3" />
                        <span>{evidenceTranslations[evidence]}</span>
                      </span>
                    ))}
                    {measuredSpeedFilter ? (
                      <button
                        type="button"
                        onClick={() => setMeasuredSpeedFilter(null)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-amber-100/80 transition-colors hover:border-amber-300/35 hover:bg-amber-300/15"
                      >
                        <Zap className="h-3 w-3" />
                        {measuredSpeedFilter.toFixed(2)} м/с
                      </button>
                    ) : null}
                  </div>
                </div>

                {filteredGhosts.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-8 text-left"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                        <GhostIcon className="h-6 w-6 text-white/24" />
                      </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-journal text-xl text-white/60">Ничего не найдено</h3>
                      <p className="max-w-2xl text-sm leading-7 text-white/46">
                        Попробуйте изменить улики или поисковый запрос
                      </p>
                    </div>
                    </div>
                  </motion.div>
                )}

                <GhostListPanel
                  ghosts={GHOSTS}
                  matchingGhostIds={matchingGhostIds}
                  ghostMarks={ghostMarks}
                  selectedGhostId={selectedGhost?.id ?? null}
                  onSelectGhost={(ghostId) =>
                    setSelectedGhost(GHOSTS.find((ghost) => ghost.id === ghostId) ?? null)
                  }
                  onSetGhostMark={setGhostManualState}
                />
              </div>
              <GhostInfoDialog ghost={selectedGhost} onClose={() => setSelectedGhost(null)} />
          </TabsContent>

          <TabsContent value="ai" className="mt-0 outline-none">
            <div className="max-w-3xl mx-auto py-12">
              <div className="p-8 bg-card/30 border border-white/10 rounded-xl space-y-6">
                <div className="text-center space-y-2 mb-8">
                  <div className="inline-flex p-3 bg-white/5 rounded-full border border-white/10 mb-2">
                    <Sparkles className="h-8 w-8 text-yellow-500" />
                  </div>
                  <h2 className="text-2xl font-journal uppercase tracking-widest text-white/90">
                    AI Идентификатор Призраков
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
                    Опишите поведение призрака, странные события или улики, которые вы заметили. Лучше всего работают описания без воды: скорость на охоте, реакция на соль, свет, электронику, благовония, огонь, двери, цель охоты и изменения со временем.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Textarea 
                      placeholder="Например: очень быстрый в начале, но с каждой охотой слабее; или: не ходит по соли, телепортируется; или: рядом с игроком почти ползет, но вдали очень быстрый"
                      className="bg-white/5 border-white/10 text-sm min-h-[120px] focus-visible:ring-white/20 p-4 pr-12 resize-none"
                      value={aiDescription}
                      onChange={(e) => setAiDescription(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                          alert('Голосовой ввод не поддерживается в вашем браузере.');
                          return;
                        }
                        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                        const recognition = new SpeechRecognition();
                        recognition.lang = 'ru-RU';
                        recognition.interimResults = false;
                        recognition.maxAlternatives = 1;

                        const btn = document.getElementById('ai-mic-btn');
                        if (btn) btn.classList.add('text-red-500', 'animate-pulse');

                        recognition.onresult = (event: any) => {
                          const speechResult = event.results[0][0].transcript;
                          setAiDescription((prev) => prev ? prev + ' ' + speechResult : speechResult);
                          if (btn) btn.classList.remove('text-red-500', 'animate-pulse');
                        };

                        recognition.onerror = () => {
                          if (btn) btn.classList.remove('text-red-500', 'animate-pulse');
                        };
                        
                        recognition.onend = () => {
                          if (btn) btn.classList.remove('text-red-500', 'animate-pulse');
                        };

                        recognition.start();
                      }}
                      id="ai-mic-btn"
                      className="absolute right-4 top-4 h-6 w-6 text-muted-foreground hover:text-white transition-colors"
                      title="Голосовой ввод"
                    >
                      <Mic className="h-5 w-5" />
                    </button>
                  </div>
                  <Button 
                    onClick={handleAiIdentify} 
                    disabled={isAiLoading || !aiDescription.trim()}
                    className="w-full bg-white text-black hover:bg-white/90 text-sm h-12 font-medium tracking-wide uppercase"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Анализ данных...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Определить призрака
                      </>
                    )}
                  </Button>
                </div>
                
                <AnimatePresence>
                  {aiResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="mt-8 p-6 bg-white/5 border border-dashed border-white/20 rounded-xl"
                    >
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Info className="h-3 w-3" /> Результат анализа
                      </h3>
                      <div className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                        {aiResult}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="mt-0 outline-none">
            <EquipmentTab />
          </TabsContent>

          <TabsContent value="cursed" className="mt-0 outline-none">
            <CursedPossessionsTab />
          </TabsContent>

          <TabsContent value="evidence" className="mt-0 outline-none">
            <EvidenceInfoTab />
          </TabsContent>

          <TabsContent value="gameplay" className="mt-0 outline-none">
            <GameplayTab />
          </TabsContent>

          <TabsContent value="progress" className="mt-0 outline-none">
            <ProgressionTab />
          </TabsContent>

          <TabsContent value="calculator" className="mt-0 outline-none">
            <ExperienceCalculatorTab />
          </TabsContent>
        </main>
      </Tabs>

      {/* Footer */}

      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-[1600px] mx-auto px-4 text-center space-y-4">
          <p className="font-journal text-white/40 text-sm tracking-widest uppercase">
            Удачи в расследовании, охотник.
          </p>
          <div className="flex justify-center gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">
            <span>v0.11.0.0 Stable</span>
            <span>•</span>
            <span>Справочник Исследователя</span>
          </div>
        </div>
      </footer>
      <ScrollToTop />
    </div>
  );
}

function getCurrentRoute() {
  const hashRoute = window.location.hash.replace(/^#\/?/, '');
  if (hashRoute) {
    return hashRoute;
  }

  return window.location.pathname.replace(/^\/+/, '') || 'home';
}

function AppRouter() {
  const [route, setRoute] = useState(() => getCurrentRoute());

  useEffect(() => {
    const syncRoute = () => setRoute(getCurrentRoute());

    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);

    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  if (route === 'auth') {
    return <AuthPage />;
  }

  return <AppContent />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

