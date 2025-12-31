import React from 'react';
import { GeneratedStand } from '../types';
import { StatRadar } from './StatRadar';
import { Sparkles, Zap, Shield, Crosshair, TrendingUp, Gauge } from 'lucide-react';

interface StandCardProps {
  stand: GeneratedStand;
  onReset: () => void;
}

const StatRow = ({ label, value, icon: Icon }: { label: string; value: string; icon: any }) => (
  <div className="flex items-center justify-between border-b border-white/10 py-1">
    <div className="flex items-center gap-2 text-gray-300">
      <Icon size={14} className="text-jojo-pink" />
      <span className="text-sm font-bold">{label}</span>
    </div>
    <span className={`text-lg font-black ${value.includes('A') ? 'text-jojo-yellow' : 'text-white'}`}>
      {value}
    </span>
  </div>
);

export const StandCard: React.FC<StandCardProps> = ({ stand, onReset }) => {
  return (
    <div className="animate-in fade-in zoom-in duration-700 w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="relative bg-jojo-dark border-4 border-jojo-purple rounded-xl overflow-hidden shadow-[0_0_30px_rgba(107,47,186,0.5)]">
        
        {/* Header - Name */}
        <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-jojo-purple to-jojo-pink p-4 z-10 transform -skew-y-1 border-b-4 border-black">
          <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg text-center">
            {stand.name}
          </h1>
          <p className="text-center text-black font-bold text-sm tracking-widest mt-1">
             替身使者: {stand.user}
          </p>
        </div>

        <div className="flex flex-col md:flex-row mt-24 md:mt-24">
          
          {/* Left Column: Image & Radar */}
          <div className="w-full md:w-1/2 p-4 flex flex-col items-center">
             <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border-2 border-jojo-yellow shadow-2xl mb-6 bg-black">
                {stand.imageUrl ? (
                    <img 
                        src={stand.imageUrl} 
                        alt={stand.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                        Image Generation Failed
                    </div>
                )}
                {/* Battle Cry Overlay */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-jojo-pink font-black text-2xl px-4 py-2 rotate-[-5deg] border-2 border-white">
                    "{stand.battleCry}!"
                </div>
             </div>
             
             <div className="w-full bg-black/40 rounded-lg p-2 border border-white/10">
                 <h3 className="text-center text-jojo-yellow font-bold mb-2 uppercase tracking-widest">能力参数</h3>
                 <StatRadar stats={stand.stats} />
             </div>
          </div>

          {/* Right Column: Details */}
          <div className="w-full md:w-1/2 p-6 flex flex-col gap-6">
            
            {/* Ability Section */}
            <div className="bg-white/5 p-6 rounded-lg border-l-4 border-jojo-pink">
                <h2 className="text-2xl font-black text-jojo-yellow mb-2 flex items-center gap-2">
                    <span className="text-3xl">『</span> {stand.abilityName} <span className="text-3xl">』</span>
                </h2>
                <p className="text-gray-200 leading-relaxed text-lg">
                    {stand.abilityDescription}
                </p>
            </div>

            {/* Stats List (Detailed View) */}
            <div className="grid grid-cols-2 gap-4 bg-black/20 p-4 rounded-lg">
                <StatRow label="破坏力 (Power)" value={stand.stats.power} icon={Zap} />
                <StatRow label="速度 (Speed)" value={stand.stats.speed} icon={Sparkles} />
                <StatRow label="射程 (Range)" value={stand.stats.range} icon={Crosshair} />
                <StatRow label="持久力 (Durability)" value={stand.stats.durability} icon={Shield} />
                <StatRow label="精密度 (Precision)" value={stand.stats.precision} icon={Gauge} />
                <StatRow label="成长性 (Potential)" value={stand.stats.potential} icon={TrendingUp} />
            </div>

            {/* Action Buttons */}
            <div className="mt-auto pt-4">
                <button 
                    onClick={onReset}
                    className="w-full py-4 bg-jojo-yellow hover:bg-yellow-400 text-black font-black text-xl uppercase tracking-widest transform hover:-translate-y-1 transition-all shadow-lg border-b-4 border-yellow-700"
                >
                    觉醒另一个替身
                </button>
            </div>

          </div>
        </div>
        
        {/* Decorative Menacing Text */}
        <div className="absolute top-1/2 right-4 text-6xl font-black text-jojo-purple opacity-20 select-none pointer-events-none rotate-12">ゴ</div>
        <div className="absolute bottom-10 left-4 text-5xl font-black text-jojo-purple opacity-20 select-none pointer-events-none -rotate-12">ゴ</div>
        <div className="absolute top-32 left-10 text-4xl font-black text-jojo-purple opacity-20 select-none pointer-events-none">ゴ</div>

      </div>
    </div>
  );
};
