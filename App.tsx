import React, { useState, useEffect } from 'react';
import { generateStandProfile, generateStandImage } from './services/geminiService';
import { GeneratedStand } from './types';
import { StandCard } from './components/StandCard';
import { ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

const MenacingEffect = () => {
    // Random positions for "Go go go" characters
    const positions = [
        { top: '10%', left: '5%' },
        { top: '20%', right: '10%' },
        { bottom: '15%', left: '8%' },
        { bottom: '30%', right: '5%' },
        { top: '50%', left: '2%' },
        { top: '5%', right: '30%' },
    ];

    return (
        <>
            {positions.map((pos, i) => (
                <div 
                    key={i}
                    className="menacing text-jojo-purple animate-pulse"
                    style={{ ...pos, fontSize: `${Math.random() * 40 + 40}px`, animationDelay: `${i * 0.2}s` }}
                >
                    ゴ
                </div>
            ))}
        </>
    );
};

const App: React.FC = () => {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  const [userName, setUserName] = useState('');
  const [personality, setPersonality] = useState('');
  const [standData, setStandData] = useState<GeneratedStand | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Generating Stand...');

  const handleGenerate = async () => {
    if (!userName.trim() || !personality.trim()) {
        setError("Please fill in all fields / 请填写所有字段");
        return;
    }
    
    setError(null);
    setStep('loading');
    setLoadingMessage('Gemini is analyzing your soul signal...');

    try {
      // 1. Generate Text Profile
      const profile = await generateStandProfile(userName, personality);
      
      setLoadingMessage('Manifesting visual form...');
      
      // 2. Generate Image
      const imageUrl = await generateStandImage(profile.appearanceDescription);
      
      setStandData({ ...profile, imageUrl });
      setStep('result');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'The arrow rejected you... (API Error)');
      setStep('input');
    }
  };

  const LoadingScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <div className="relative">
            <div className="w-32 h-32 border-8 border-jojo-purple border-t-jojo-yellow rounded-full animate-spin mb-8"></div>
            <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-jojo-pink animate-pulse">
                STAND
            </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 tracking-widest uppercase">
            {loadingMessage}
        </h2>
        <p className="text-white/50 italic text-sm">
            <span className="inline-block animate-bounce delay-100">To</span>&nbsp;
            <span className="inline-block animate-bounce delay-200">Be</span>&nbsp;
            <span className="inline-block animate-bounce delay-300">Continued</span>
            <span className="inline-block animate-pulse">...</span>
        </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1a1a] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-[#1a1a1a] to-black overflow-x-hidden">
      <MenacingEffect />
      
      {/* Header / Nav */}
      <nav className="p-6 flex justify-between items-center bg-black/50 backdrop-blur-sm border-b border-jojo-purple/30 sticky top-0 z-50">
        <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-jojo-yellow italic tracking-tighter transform -skew-x-12">
                JOJO
            </span>
            <span className="text-white font-bold tracking-widest text-sm md:text-base border-l-2 border-white/20 pl-2 ml-2">
                STAND GENERATOR
            </span>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        
        {step === 'input' && (
            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-500">
                <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-jojo-purple/50 shadow-[0_0_50px_rgba(107,47,186,0.2)]">
                    <h1 className="text-4xl md:text-5xl font-black text-center mb-2 text-white italic drop-shadow-[0_2px_0_#6B2Fba]">
                        觉醒你的替身
                    </h1>
                    <p className="text-center text-gray-400 mb-10 text-lg">
                        Tell us about yourself, and the Arrow will decide your power.
                    </p>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-jojo-yellow font-bold text-sm uppercase tracking-widest mb-2">
                                你的名字 (Your Name)
                            </label>
                            <input 
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full bg-white/5 border-2 border-white/20 focus:border-jojo-pink focus:bg-white/10 text-white rounded p-4 outline-none transition-all font-bold text-lg"
                                placeholder="Jotaro Kujo..."
                            />
                        </div>
                        
                        <div>
                            <label className="block text-jojo-yellow font-bold text-sm uppercase tracking-widest mb-2">
                                性格/氛围 (Personality/Vibe)
                            </label>
                            <textarea 
                                value={personality}
                                onChange={(e) => setPersonality(e.target.value)}
                                className="w-full bg-white/5 border-2 border-white/20 focus:border-jojo-pink focus:bg-white/10 text-white rounded p-4 outline-none transition-all font-medium h-32 resize-none"
                                placeholder="E.g., Calm but gets angry easily, loves marine biology, determined protector..."
                            />
                            <p className="text-xs text-gray-500 mt-2 text-right">
                                Detailed descriptions yield better Stands.
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded flex items-center gap-2 animate-shake">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}

                        <button 
                            onClick={handleGenerate}
                            className="group relative w-full py-5 bg-jojo-purple hover:bg-purple-600 text-white font-black text-2xl uppercase tracking-widest transition-all overflow-hidden clip-path-polygon"
                            style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 80%, 95% 100%, 0 100%, 0 20%)' }}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3 group-hover:scale-105 transition-transform">
                                <Sparkles className="animate-pulse-fast" />
                                STAND UP!
                                <ArrowRight />
                            </span>
                            <div className="absolute inset-0 bg-jojo-pink transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 -z-0 opacity-50"></div>
                        </button>
                    </div>
                </div>
            </div>
        )}

        {step === 'loading' && <LoadingScreen />}

        {step === 'result' && standData && (
            <StandCard stand={standData} onReset={() => setStep('input')} />
        )}
        
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-white/20 text-xs">
         <p>Powered by Google Gemini AI • Fan Project</p>
      </footer>
    </div>
  );
};

export default App;
