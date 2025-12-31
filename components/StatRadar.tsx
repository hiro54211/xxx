import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { StandStats } from '../types';

interface StatRadarProps {
  stats: StandStats;
}

const convertStatToNumber = (stat: string): number => {
  const s = stat.toUpperCase();
  if (s.includes('A')) return 5;
  if (s.includes('B')) return 4;
  if (s.includes('C')) return 3;
  if (s.includes('D')) return 2;
  if (s.includes('E')) return 1;
  return 5; // ? or Infinite usually implies broken power
};

export const StatRadar: React.FC<StatRadarProps> = ({ stats }) => {
  const data = [
    { subject: '破坏力', A: convertStatToNumber(stats.power), fullMark: 5 },
    { subject: '速度', A: convertStatToNumber(stats.speed), fullMark: 5 },
    { subject: '射程', A: convertStatToNumber(stats.range), fullMark: 5 },
    { subject: '持久力', A: convertStatToNumber(stats.durability), fullMark: 5 },
    { subject: '精密度', A: convertStatToNumber(stats.precision), fullMark: 5 },
    { subject: '成长性', A: convertStatToNumber(stats.potential), fullMark: 5 },
  ];

  return (
    <div className="w-full h-64 relative">
        {/* Background circle mimicking the eye catch stats */}
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#6B2Fba" strokeOpacity={0.5} />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#ffe600', fontSize: 12, fontWeight: 'bold' }} 
          />
          <Radar
            name="Stand Stats"
            dataKey="A"
            stroke="#ff00cc"
            strokeWidth={3}
            fill="#ff00cc"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Stat overlay text */}
      <div className="absolute top-0 right-0 text-xs text-white/50 space-y-1 bg-black/50 p-2 rounded">
          <p>A: 超强</p>
          <p>B: 强</p>
          <p>C: 普通</p>
          <p>D: 差</p>
          <p>E: 很差</p>
      </div>
    </div>
  );
};
