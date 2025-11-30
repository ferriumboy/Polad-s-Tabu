

import React, { useState, useEffect, useRef } from 'react';
import { TabooCard, GamePhase, Team, GameSettings, Difficulty, Language, GameMode } from './types';
import { generateTabooCards } from './services/geminiService';
import { audioService } from './services/audioService';
import { speechService } from './services/speechService';
import { Button } from './components/Button';
import { GameCard } from './components/GameCard';
import { TRANSLATIONS } from './data/translations';
import { LucidePlay, LucideCheck, LucideX, LucideSkipForward, LucideTrophy, LucideTimer, LucideRotateCcw, LucideUsers, LucideSignal, LucideHeart, LucideLogOut, LucideGlobe, LucideInfo, LucideGamepad2, LucideTarget, LucideUserPlus, LucideChevronLeft, LucideArrowRight, LucideMic, LucideMicOff } from 'lucide-react';

const LANGUAGES: Language[] = ['AZ', 'EN', 'RU', 'ES', 'FR', 'PT', 'AR'];

const App: React.FC = () => {
  // State
  const [phase, setPhase] = useState<GamePhase>(GamePhase.MENU);
  const [language, setLanguage] = useState<Language>('AZ');
  const [cards, setCards] = useState<TabooCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  
  // Teams State - Initialized with defaults, but will be editable
  const [teams, setTeams] = useState<Team[]>([
    { id: 'A', name: 'Team A', score: 0, wins: 0, color: 'from-blue-500 to-cyan-500', players: ['Player 1', 'Player 2'], nextPlayerIndex: 0 },
    { id: 'B', name: 'Team B', score: 0, wins: 0, color: 'from-purple-500 to-pink-500', players: ['Player 3', 'Player 4'], nextPlayerIndex: 0 },
  ]);
  
  const [currentTeamId, setCurrentTeamId] = useState<'A' | 'B'>('A');
  const [settings, setSettings] = useState<GameSettings>({
    roundDuration: 60,
    difficulty: 'MEDIUM',
    passLimit: 3,
    mode: GameMode.CLASSIC,
    targetWins: 3,
    voiceDetection: false // Default off
  });
  const [timeLeft, setTimeLeft] = useState(0);
  const [passesUsed, setPassesUsed] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  
  // Voice Detection State
  const [isListening, setIsListening] = useState(false);
  const [tabooTriggered, setTabooTriggered] = useState(false);
  const [detectedTabooWord, setDetectedTabooWord] = useState<string | null>(null);
  
  // To track Team A's score during Race mode to compare with Team B
  const [teamARoundScore, setTeamARoundScore] = useState<number | null>(null);

  const t = TRANSLATIONS[language];

  // Refs for timer
  const timerRef = useRef<number | null>(null);

  // Initial Card Load
  const loadCards = async (lang: Language, difficulty: Difficulty, reset: boolean = false) => {
    setIsLoading(true);
    const newCards = await generateTabooCards(lang, difficulty, 15);
    if (reset) {
      setCards(newCards);
      setCurrentCardIndex(0);
    } else {
      setCards(prev => [...prev, ...newCards]);
    }
    setIsLoading(false);
  };

  // Timer Logic
  useEffect(() => {
    if (phase === GamePhase.PLAYING && timeLeft > 0 && !tabooTriggered) {
      timerRef.current = window.setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (phase === GamePhase.PLAYING && timeLeft === 0) {
      endRound();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, timeLeft, tabooTriggered]);

  // Background card fetching
  useEffect(() => {
    // If we are running low on cards, fetch more in background
    if (cards.length > 0 && cards.length - currentCardIndex < 5 && !isLoading) {
      loadCards(language, settings.difficulty);
    }
  }, [currentCardIndex, cards.length, settings.difficulty, language]);

  // Voice Detection Logic
  useEffect(() => {
    // Stop listening if phase not playing or detection off OR if we are currently penalizing a taboo
    if (phase !== GamePhase.PLAYING || !settings.voiceDetection || tabooTriggered) {
        speechService.stop();
        setIsListening(false);
        return;
    }

    if (phase === GamePhase.PLAYING && settings.voiceDetection && !tabooTriggered) {
        // Start listening
        speechService.start(
            language, 
            (transcript) => {
                const currentCard = cards[currentCardIndex];
                if (!currentCard) return;

                const normalize = (s: string) => s.toLocaleLowerCase(language === 'EN' ? 'en-US' : (language === 'AZ' ? 'az-AZ' : 'ru-RU')).trim();
                const spoken = normalize(transcript);
                
                // Words to check: Target word + Banned words
                const forbidden = [currentCard.word, ...currentCard.bannedWords].map(normalize);

                // Check if any forbidden word is inside the spoken text
                const hit = forbidden.find(badWord => spoken.includes(badWord));
                
                if (hit) {
                    console.log(`Taboo Detected! Spoken: "${spoken}" matched forbidden list.`);
                    
                    // Trigger Taboo Penalty Sequence
                    setDetectedTabooWord(hit.toUpperCase());
                    setTabooTriggered(true);
                    audioService.playSFX('TABOO');

                    // Wait 2 seconds before penalizing and moving on
                    setTimeout(() => {
                        handleTaboo(); // Deduct point and change card
                        setTabooTriggered(false);
                        setDetectedTabooWord(null);
                    }, 2000);
                }
            },
            (err) => {
                console.warn("Mic error:", err);
                setIsListening(false);
            }
        );
        setIsListening(true);
    }

    return () => {
        speechService.stop();
    };
  }, [phase, settings.voiceDetection, currentCardIndex, language, tabooTriggered]); 

  // --- Handlers ---

  const enterTeamSetup = () => {
    audioService.playSFX('CLICK');
    setPhase(GamePhase.TEAM_SETUP);
  };

  const finalizeSetupAndStart = async () => {
    audioService.playSFX('CLICK');
    setPhase(GamePhase.LOADING);
    await loadCards(language, settings.difficulty, true);
    
    // Reset Team Scores/Wins but keep names
    setTeams(prev => prev.map(t => ({ 
        ...t, 
        score: 0, 
        wins: 0,
        nextPlayerIndex: 0 
    })));
    
    setTeamARoundScore(null);
    setCurrentTeamId('A');
    setPhase(GamePhase.SETUP); 
  };

  const startRound = () => {
    audioService.playSFX('CLICK');
    setTimeLeft(settings.roundDuration);
    setPassesUsed(0);
    setRoundScore(0);
    setPhase(GamePhase.PLAYING);
  };

  const endRound = () => {
    audioService.playSFX('TIME_UP');
    setPhase(GamePhase.ROUND_OVER);
    
    // Update simple score
    setTeams(prev => prev.map(t => 
      t.id === currentTeamId ? { ...t, score: t.score + roundScore } : t
    ));

    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const nextTurn = () => {
    audioService.playSFX('CLICK');
    
    // Update player index for the team that just finished
    setTeams(prev => prev.map(t => {
      if (t.id === currentTeamId) {
        return {
          ...t,
          nextPlayerIndex: (t.nextPlayerIndex + 1) % t.players.length
        };
      }
      return t;
    }));

    // Handle Game Mode Logic on Turn Switch
    
    // If Team A just finished
    if (currentTeamId === 'A') {
      if (settings.mode === GameMode.RACE) {
        setTeamARoundScore(roundScore);
      }
      setCurrentTeamId('B');
      setPhase(GamePhase.SETUP);
      setCurrentCardIndex(prev => prev + 1);
      return;
    }

    // If Team B just finished (End of a full cycle)
    if (currentTeamId === 'B') {
      
      // ONE ROUND MODE
      if (settings.mode === GameMode.ONE_ROUND) {
        setPhase(GamePhase.GAME_OVER);
        return;
      }

      // RACE MODE
      if (settings.mode === GameMode.RACE) {
        // Compare Round Scores
        const scoreA = teamARoundScore || 0;
        const scoreB = roundScore;

        let winnerId: 'A' | 'B' | null = null;
        if (scoreA > scoreB) winnerId = 'A';
        else if (scoreB > scoreA) winnerId = 'B';
        
        let newTeams = [...teams];
        
        if (winnerId) {
          newTeams = newTeams.map(t => t.id === winnerId ? { ...t, wins: t.wins + 1 } : t);
          setTeams(newTeams);
        }
        
        // Reset per-round tracking
        setTeamARoundScore(null);

        // Check for Game Over condition
        const gameWinner = newTeams.find(t => t.wins >= settings.targetWins);
        if (gameWinner) {
          setPhase(GamePhase.GAME_OVER);
          return;
        }
      }

      // CLASSIC MODE (and continuing RACE)
      setCurrentTeamId('A');
      setPhase(GamePhase.SETUP);
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const handleCorrect = () => {
    if (tabooTriggered) return; // Lock controls
    audioService.playSFX('CORRECT');
    setRoundScore(prev => prev + 1);
    setCurrentCardIndex(prev => prev + 1);
  };

  const handleTaboo = () => {
    // If triggered manually by button, play sound immediately
    // If triggered by voice, sound is already played in useEffect
    if (!tabooTriggered) {
        audioService.playSFX('TABOO');
    }
    setRoundScore(prev => prev - 1);
    setCurrentCardIndex(prev => prev + 1);
  };

  const handlePass = () => {
    if (tabooTriggered) return; // Lock controls
    if (passesUsed < settings.passLimit) {
      audioService.playSFX('PASS');
      setPassesUsed(prev => prev + 1);
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const confirmExit = () => {
    audioService.playSFX('CLICK');
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowExitModal(false);
    setPhase(GamePhase.MENU);
  };

  // --- RENDER HELPERS ---

  const renderPoladSignature = () => (
    <div className="mt-8 text-center animate-pulse">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">{t.createdBy}</p>
        <div className="flex items-center justify-center gap-2 text-violet-400 font-bold">
            <LucideHeart size={14} fill="currentColor" />
            <span>POLAD</span>
            <LucideHeart size={14} fill="currentColor" />
        </div>
    </div>
  );

  const renderRulesModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center gap-2 text-violet-400 mb-2">
            <LucideInfo size={24} />
            <h3 className="text-xl font-bold text-white">{t.rulesTitle}</h3>
        </div>
        
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                <strong className="text-violet-300 block mb-1 uppercase tracking-wider">{t.modeClassic}</strong>
                {t.rulesClassic}
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                <strong className="text-blue-300 block mb-1 uppercase tracking-wider">{t.modeOneRound}</strong>
                {t.rulesOneRound}
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                <strong className="text-amber-300 block mb-1 uppercase tracking-wider">{t.modeRace}</strong>
                {t.rulesRace}
            </div>
        </div>

        <button 
          onClick={() => setShowRulesModal(false)}
          className="w-full py-3 rounded-xl font-bold bg-slate-700 text-white hover:bg-slate-600 transition-colors mt-4"
        >
          OK
        </button>
      </div>
    </div>
  );

  const renderExitConfirmModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl w-full max-w-sm shadow-2xl space-y-6 transform scale-100 animate-[scaleIn_0.2s_ease-out]">
        <div className="text-center space-y-2">
           <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
             <LucideLogOut size={24} />
           </div>
           <h3 className="text-xl font-bold text-white">{t.exitTitle}</h3>
           <p className="text-slate-400">{t.exitDesc}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setShowExitModal(false)}
            className="p-3 rounded-xl font-bold bg-slate-700 text-white hover:bg-slate-600 transition-colors"
          >
            {t.no}
          </button>
          <button 
            onClick={confirmExit}
            className="p-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
          >
            {t.yes}
          </button>
        </div>
      </div>
    </div>
  );

  const renderTeamSetup = () => {
    const handleTeamNameChange = (teamId: 'A' | 'B', val: string) => {
        setTeams(teams.map(t => t.id === teamId ? { ...t, name: val } : t));
    };

    const handlePlayerCountChange = (teamId: 'A' | 'B', count: number) => {
        const safeCount = Math.max(2, Math.min(10, count));
        setTeams(teams.map(t => {
            if (t.id !== teamId) return t;
            const newPlayers = [...t.players];
            if (safeCount > newPlayers.length) {
                for (let i = newPlayers.length; i < safeCount; i++) {
                    newPlayers.push(`Player ${i + 1}`);
                }
            } else {
                newPlayers.length = safeCount;
            }
            return { ...t, players: newPlayers };
        }));
    };

    const handlePlayerNameChange = (teamId: 'A' | 'B', idx: number, val: string) => {
        setTeams(teams.map(t => {
            if (t.id !== teamId) return t;
            const newPlayers = [...t.players];
            newPlayers[idx] = val;
            return { ...t, players: newPlayers };
        }));
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-6 pt-10 text-center animate-in fade-in">
             <div className="w-full max-w-4xl space-y-6">
                 {/* Header */}
                 <div className="flex items-center justify-between mb-8">
                     <button onClick={() => setPhase(GamePhase.MENU)} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 text-slate-400 font-bold text-sm">
                        <LucideChevronLeft size={18} /> {t.back}
                     </button>
                     <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 uppercase tracking-widest">
                        {t.setupTitle}
                     </h2>
                     <div className="w-[80px]"></div> 
                 </div>

                 {/* Grid for Teams */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {teams.map((team) => (
                        <div key={team.id} className="glass-panel p-6 rounded-3xl text-left space-y-4 border-t-4" style={{borderColor: team.id === 'A' ? '#3b82f6' : '#a855f7'}}>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">{t.teamName}</label>
                                <input 
                                    type="text" 
                                    value={team.name}
                                    onChange={(e) => handleTeamNameChange(team.id, e.target.value)}
                                    className="w-full bg-slate-800/50 border border-slate-700 focus:border-white outline-none text-white rounded-xl p-3 font-bold transition-all"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">{t.playerCount}</label>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => handlePlayerCountChange(team.id, team.players.length - 1)}
                                        className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white font-bold"
                                    >-</button>
                                    <span className="flex-1 text-center font-mono font-bold text-xl">{team.players.length}</span>
                                    <button 
                                        onClick={() => handlePlayerCountChange(team.id, team.players.length + 1)}
                                        className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white font-bold"
                                    >+</button>
                                </div>
                            </div>

                            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                    <LucideUsers size={12}/> {t.playerNames}
                                </label>
                                {team.players.map((player, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-slate-600 w-4">{idx + 1}.</span>
                                        <input 
                                            type="text" 
                                            value={player}
                                            onChange={(e) => handlePlayerNameChange(team.id, idx, e.target.value)}
                                            className="w-full bg-slate-900/50 border border-slate-700/50 focus:border-violet-500/50 outline-none text-sm text-slate-200 rounded-lg p-2 transition-all"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                 </div>

                 <Button onClick={finalizeSetupAndStart} size="lg" className="w-full shadow-2xl shadow-violet-500/20 py-5 text-xl">
                    {t.startMatch} <LucideArrowRight className="ml-2" />
                 </Button>
             </div>
        </div>
    );
  };

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-8">
      {/* Language Selector */}
      <div className="absolute top-6 left-6 flex flex-wrap gap-2 z-10 max-w-[300px]">
        {LANGUAGES.map(lang => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
              language === lang 
                ? 'bg-violet-600 border-violet-500 text-white' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      <div className="space-y-4 animate-[fadeIn_1s_ease-out]">
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 tracking-tighter drop-shadow-2xl">
          {t.title}
        </h1>
        <p className="text-xl text-slate-300 font-light max-w-md mx-auto">
          {t.subtitle}
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl w-full max-w-md space-y-6 shadow-2xl relative">
        
        {/* Mode Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-slate-400 ml-1">
             <div className="flex items-center gap-2">
                <LucideGamepad2 size={16} />
                <label className="text-xs font-bold uppercase tracking-wider">{t.modeLabel}</label>
             </div>
             <button onClick={() => setShowRulesModal(true)} className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 uppercase font-bold bg-violet-500/10 px-2 py-1 rounded-lg border border-violet-500/20">
                <LucideInfo size={12} />
                {t.rulesBtn}
             </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
             {(['CLASSIC', 'ONE_ROUND', 'RACE'] as const).map((mode) => (
                <button
                    key={mode}
                    onClick={() => {
                        audioService.playSFX('CLICK');
                        setSettings({ ...settings, mode: mode });
                    }}
                    className={`
                      p-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-200 border-2
                      ${settings.mode === mode 
                        ? 'border-violet-500 bg-violet-500/20 text-white shadow-lg shadow-violet-500/20' 
                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:border-slate-600'
                      }
                    `}
                >
                    {mode === 'CLASSIC' ? t.modeClassic : mode === 'ONE_ROUND' ? t.modeOneRound : t.modeRace}
                </button>
             ))}
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-400 ml-1">
             <LucideSignal size={16} />
             <label className="text-xs font-bold uppercase tracking-wider">{t.levelLabel}</label>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['EASY', 'MEDIUM', 'HARD'] as const).map((level) => (
              <button
                key={level}
                onClick={() => {
                    audioService.playSFX('CLICK');
                    setSettings({ ...settings, difficulty: level });
                }}
                className={`
                  relative overflow-hidden p-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-200
                  ${settings.difficulty === level 
                    ? 'text-white shadow-lg z-10' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }
                `}
              >
                {settings.difficulty === level && (
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-100 -z-10
                    ${level === 'EASY' ? 'from-emerald-500 to-teal-600' : 
                      level === 'MEDIUM' ? 'from-amber-400 to-orange-500' : 
                      'from-red-500 to-rose-600'}
                  `} />
                )}
                {level === 'EASY' ? t.easy : level === 'MEDIUM' ? t.medium : t.hard}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 italic h-3">
            {settings.difficulty === 'EASY' && t.easyDesc}
            {settings.difficulty === 'MEDIUM' && t.mediumDesc}
            {settings.difficulty === 'HARD' && t.hardDesc}
          </p>
        </div>

        {/* Voice Detection Toggle */}
        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${settings.voiceDetection ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                        {settings.voiceDetection ? <LucideMic size={16} /> : <LucideMicOff size={16} />}
                    </div>
                    <div className="text-left">
                        <label className="text-xs font-bold text-white block uppercase">{t.aiReferee}</label>
                        <span className="text-[9px] text-slate-400 block max-w-[180px] leading-tight">{t.aiRefereeDesc}</span>
                    </div>
                </div>
                <div 
                    onClick={() => {
                        audioService.playSFX('CLICK');
                        setSettings({...settings, voiceDetection: !settings.voiceDetection});
                    }}
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.voiceDetection ? 'bg-rose-500' : 'bg-slate-700'}`}
                >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${settings.voiceDetection ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
            </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
                <label className="block text-left text-[10px] font-bold text-slate-400 mb-2 uppercase">{t.timeLabel}</label>
                <input 
                type="number" 
                value={settings.roundDuration}
                onChange={(e) => setSettings({...settings, roundDuration: Number(e.target.value)})}
                className="w-full bg-slate-800 border border-slate-700 focus:border-violet-500 outline-none text-white rounded-xl p-3 text-center font-mono font-bold transition-all"
                />
            </div>
            
            {/* Show Target Rounds only for Race Mode */}
            {settings.mode === GameMode.RACE && (
                <div className="w-full animate-[fadeIn_0.3s_ease-out]">
                    <label className="block text-left text-[10px] font-bold text-slate-400 mb-2 uppercase">{t.targetWinsLabel}</label>
                    <div className="relative">
                        <LucideTarget size={14} className="absolute left-3 top-4 text-amber-500" />
                        <input 
                        type="number" 
                        min={1}
                        max={10}
                        value={settings.targetWins}
                        onChange={(e) => setSettings({...settings, targetWins: Math.max(1, Number(e.target.value))})}
                        className="w-full bg-slate-800 border border-slate-700 focus:border-amber-500 outline-none text-white rounded-xl p-3 pl-8 text-center font-mono font-bold transition-all"
                        />
                    </div>
                </div>
            )}
        </div>

        <Button onClick={enterTeamSetup} size="lg" className="w-full shadow-xl shadow-violet-500/20 mt-4">
          <LucidePlay size={24} fill="currentColor" />
          {t.startGame}
        </Button>
      </div>
      
      {renderPoladSignature()}
    </div>
  );

  const renderSetup = () => {
    const activeTeam = teams.find(t => t.id === currentTeamId);
    if (!activeTeam) return null;

    // Determine current Speaker and ONE Listener (Guesser)
    const speakerIndex = activeTeam.nextPlayerIndex;
    const speakerName = activeTeam.players[speakerIndex];
    
    // Select the NEXT person in the list as the guesser (cyclical)
    const listenerIndex = (speakerIndex + 1) % activeTeam.players.length;
    const listenerName = activeTeam.players[listenerIndex];
    
    // Display Wins Score for Race Mode
    const showSeriesScore = settings.mode === GameMode.RACE;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-8 animate-in slide-in-from-right-8">
        <div className="space-y-2">
          <h2 className="text-2xl text-slate-400 font-light">{t.turn}</h2>
          <div className={`text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r ${activeTeam?.color} drop-shadow-sm`}>
            {activeTeam?.name}
          </div>
          {showSeriesScore && (
             <div className="flex items-center justify-center gap-4 mt-2 bg-slate-800/50 p-2 rounded-lg inline-flex border border-white/5">
                <span className="text-blue-400 font-bold">{teams[0].name}: {teams[0].wins}</span>
                <span className="text-slate-500">|</span>
                <span className="text-purple-400 font-bold">{teams[1].name}: {teams[1].wins}</span>
             </div>
          )}
        </div>

        <div className="glass-panel p-8 rounded-3xl w-full max-w-sm flex flex-col items-center space-y-6 shadow-2xl relative border-t-4" style={{borderColor: activeTeam.id === 'A' ? '#3b82f6' : '#a855f7'}}>
           
           {/* Role Assignment Card */}
           <div className="w-full bg-slate-900/60 rounded-xl p-5 space-y-4 border border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-lg">
                        <span className="text-lg">🗣️</span>
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{t.speaker}</p>
                        <p className="text-xl font-bold text-white">{speakerName}</p>
                    </div>
                </div>
                
                <div className="h-px bg-white/10 w-full"></div>

                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white shadow-lg shrink-0">
                        <span className="text-lg">👂</span>
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{t.listeners}</p>
                        <p className="text-xl font-bold text-white">{listenerName}</p>
                    </div>
                </div>
           </div>

           <div className="space-y-2">
             <p className="text-sm text-slate-500">{t.opponentWatch}</p>
             {settings.voiceDetection && (
                 <div className="flex items-center justify-center gap-2 text-rose-400 text-xs font-bold animate-pulse">
                    <LucideMic size={14} />
                    {t.aiReferee} ON
                 </div>
             )}
           </div>
           
           <Button onClick={startRound} size="lg" variant="success" className="w-full shadow-lg shadow-emerald-500/20">
             {t.readyButton}
           </Button>

           <button 
             onClick={() => setShowExitModal(true)}
             className="text-slate-500 hover:text-red-400 text-sm font-semibold transition-colors flex items-center gap-1 mt-2"
           >
             <LucideLogOut size={14} />
             {t.exitGame}
           </button>
        </div>
      </div>
    );
  };

  const renderGame = () => {
    const currentCard = cards[currentCardIndex];
    if (!currentCard) return <div className="text-center mt-20">{t.loading}</div>;

    const activeTeam = teams.find(t => t.id === currentTeamId);

    return (
      <div className="flex flex-col h-[100dvh] max-w-md mx-auto relative overflow-hidden bg-slate-900">
        
        {/* Taboo Triggered Overlay - WITH WORD DISPLAY */}
        {tabooTriggered && (
             <div className="absolute inset-0 z-50 flex items-center justify-center bg-rose-600 z-50 animate-[fadeIn_0.1s_ease-out]">
                 <div className="text-center p-6 space-y-4 animate-[scaleIn_0.3s_ease-out]">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                        <LucideX size={64} className="text-white" strokeWidth={4} />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-wider text-white drop-shadow-lg">{t.tabooDetected}</h2>
                    {detectedTabooWord && (
                        <div className="bg-white text-rose-600 px-6 py-3 rounded-2xl text-4xl font-extrabold shadow-2xl inline-block mt-4 border-4 border-rose-800">
                            {detectedTabooWord}
                        </div>
                    )}
                 </div>
             </div>
        )}

        {/* Top Bar */}
        <div className="flex items-center justify-between p-3 bg-slate-800/90 backdrop-blur-md z-30 shadow-lg border-b border-white/5 gap-2 shrink-0">
          {/* Left: Exit & Timer */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowExitModal(true)}
              className="p-2 bg-slate-700/50 rounded-xl hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all active:scale-95"
            >
              <LucideLogOut size={20} />
            </button>
            <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-slate-200'}`}>
              <LucideTimer size={20} />
              <span>{timeLeft}</span>
            </div>
          </div>

          {/* Center: Team Name */}
          <div className={`font-bold text-sm sm:text-base truncate px-1 text-transparent bg-clip-text bg-gradient-to-r ${activeTeam?.color}`}>
            {activeTeam?.name}
          </div>

          {/* Right: Score */}
          <div className="flex items-center gap-1.5 bg-slate-700/50 px-3 py-1.5 rounded-xl border border-white/5 min-w-[70px] justify-center">
             <LucideCheck size={18} className="text-emerald-400"/>
             <span className={`text-xl font-black ${roundScore >= 0 ? 'text-white' : 'text-rose-400'}`}>
               {roundScore}
             </span>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 w-full">
           <div className="relative w-full max-w-sm">
             <div className="absolute -top-10 left-0 w-full text-center pb-2 z-20 flex justify-center items-center gap-2">
                <span className="bg-slate-800/80 text-slate-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  {t.bannedTitle}
                </span>
                {settings.voiceDetection && (
                    <div className="bg-rose-500/20 text-rose-400 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse border border-rose-500/30">
                        <LucideMic size={10} /> {isListening ? t.listening : '...'}
                    </div>
                )}
             </div>
             <GameCard card={currentCard} isVisible={true} />
           </div>
        </div>

        {/* Controls */}
        <div className="p-4 pb-6 space-y-3 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent z-20 shrink-0">
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={handleTaboo}
              className="flex flex-col items-center justify-center bg-rose-500 hover:bg-rose-600 active:scale-95 text-white rounded-2xl py-4 shadow-lg shadow-rose-500/20 transition-all"
            >
              <LucideX size={28} strokeWidth={3} />
              <span className="text-[10px] font-bold mt-1 uppercase">{t.tabooBtn}</span>
            </button>
            
            <button 
              onClick={handlePass}
              disabled={passesUsed >= settings.passLimit}
              className={`flex flex-col items-center justify-center rounded-2xl py-4 shadow-lg transition-all ${
                passesUsed >= settings.passLimit 
                ? 'bg-slate-700 text-slate-500 opacity-50' 
                : 'bg-amber-400 hover:bg-amber-500 text-white shadow-amber-400/20 active:scale-95'
              }`}
            >
              <LucideSkipForward size={28} strokeWidth={3} />
              <span className="text-[10px] font-bold mt-1 uppercase">{t.passBtn} ({settings.passLimit - passesUsed})</span>
            </button>

            <button 
              onClick={handleCorrect}
              className="flex flex-col items-center justify-center bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-2xl py-4 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <LucideCheck size={28} strokeWidth={3} />
              <span className="text-[10px] font-bold mt-1 uppercase">{t.correctBtn}</span>
            </button>
          </div>
          <div className="text-center">
             <span className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">Design by Polad</span>
          </div>
        </div>
      </div>
    );
  };

  const renderRoundOver = () => {
    const activeTeam = teams.find(t => t.id === currentTeamId);
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8">
        <h2 className="text-4xl font-bold text-white mb-4">{t.timeUp}</h2>
        
        <div className="glass-panel p-8 rounded-3xl w-full max-w-sm space-y-6">
          <div className="text-sm text-slate-400 uppercase tracking-widest">{t.roundResult}</div>
          <div className={`text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r ${activeTeam?.color}`}>
            {roundScore > 0 ? `+${roundScore}` : roundScore}
          </div>
          <div className="text-slate-300">
             {activeTeam?.name}: <span className="font-bold text-white text-xl">{activeTeam?.score}</span> {t.score}
          </div>
        </div>

        {/* Scoreboard */}
        <div className="w-full max-w-sm grid grid-cols-2 gap-4">
           <div className="bg-slate-800 p-4 rounded-xl">
             <div className="text-xs text-slate-500 mb-1">{teams[0].name}</div>
             <div className="flex items-end justify-center gap-1">
                 <span className="text-2xl font-bold text-blue-400">{teams[0].score}</span>
                 {settings.mode === GameMode.RACE && <span className="text-xs text-amber-500 mb-1">({teams[0].wins} {t.wins})</span>}
             </div>
           </div>
           <div className="bg-slate-800 p-4 rounded-xl">
             <div className="text-xs text-slate-500 mb-1">{teams[1].name}</div>
             <div className="flex items-end justify-center gap-1">
                 <span className="text-2xl font-bold text-purple-400">{teams[1].score}</span>
                 {settings.mode === GameMode.RACE && <span className="text-xs text-amber-500 mb-1">({teams[1].wins} {t.wins})</span>}
             </div>
           </div>
        </div>

        <Button onClick={nextTurn} size="lg" className="w-full max-w-sm">
           {t.continue}
        </Button>
        
        <button 
             onClick={() => setShowExitModal(true)}
             className="text-slate-500 hover:text-red-400 text-sm font-semibold transition-colors flex items-center gap-1"
           >
             <LucideLogOut size={14} />
             {t.exitGame}
        </button>
      </div>
    );
  };

  const renderGameOver = () => {
    // Determine winner based on Mode
    let winner = teams[0]; // default
    if (settings.mode === GameMode.RACE) {
       // Winner based on Wins
       winner = teams.reduce((prev, current) => (prev.wins > current.wins) ? prev : current);
       // Handle Tie in wins (fallback to score)
       if (teams[0].wins === teams[1].wins) {
          winner = teams.reduce((prev, current) => (prev.score > current.score) ? prev : current);
       }
    } else {
       // Winner based on Score
       winner = teams.reduce((prev, current) => (prev.score > current.score) ? prev : current);
    }
    
    // Check for true tie
    const isTie = settings.mode === GameMode.RACE 
        ? (teams[0].wins === teams[1].wins && teams[0].score === teams[1].score)
        : (teams[0].score === teams[1].score);

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-8">
        <LucideTrophy size={80} className="text-yellow-400 animate-bounce" />
        <div className="space-y-4">
          <h2 className="text-2xl text-slate-400 font-light">{isTie ? "Draw!" : t.winner}</h2>
          {!isTie && (
            <div className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r ${winner.color}`}>
                {winner.name}
            </div>
          )}
          {settings.mode === GameMode.RACE ? (
             <p className="text-xl text-white font-mono">{winner.wins} {t.wins} ({winner.score} pts)</p>
          ) : (
             <p className="text-xl text-white font-mono">{winner.score} {t.score}</p>
          )}
        </div>

        <div className="bg-slate-800/50 p-4 rounded-xl text-sm text-slate-400 max-w-xs mx-auto">
           {t.thanks}
        </div>

        <Button onClick={() => setPhase(GamePhase.MENU)} variant="secondary" size="lg">
          <LucideRotateCcw size={20} />
          {t.restart}
        </Button>
      </div>
    );
  };

  // Main Render Switch
  return (
    <div className="min-h-screen w-full bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black text-slate-100 overflow-hidden relative">
      
      {isLoading && phase === GamePhase.LOADING && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-lg font-medium animate-pulse">{t.loading}</p>
          </div>
        </div>
      )}

      {showExitModal && renderExitConfirmModal()}
      {showRulesModal && renderRulesModal()}

      {phase === GamePhase.MENU && renderMenu()}
      {phase === GamePhase.TEAM_SETUP && renderTeamSetup()}
      {phase === GamePhase.SETUP && renderSetup()}
      {phase === GamePhase.PLAYING && renderGame()}
      {phase === GamePhase.ROUND_OVER && renderRoundOver()}
      {phase === GamePhase.GAME_OVER && renderGameOver()}
    </div>
  );
};

export default App;