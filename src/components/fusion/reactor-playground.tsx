'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
  Wrench, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertOctagon, 
  Zap, 
  Orbit, 
  Sparkles
} from 'lucide-react';

interface SimulationData {
  time: string;
  temperature: number;
  power: number;
  heatLoad: number;
}

export function ReactorPlayground() {
  // Config state
  const [geometry, setGeometry] = useState<string>('Tokamak');
  const [magnetType, setMagnetType] = useState<string>('HTS');
  const [divertor, setDivertor] = useState<string>('Tungsten');
  const [blanket, setBlanket] = useState<string>('Solid Ceramic');
  const [heating, setHeating] = useState<string>('Neutral Beam (NBI)');
  const [fuel, setFuel] = useState<string>('D-T');

  // Simulation status
  const [simStatus, setSimStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [chartData, setChartData] = useState<SimulationData[]>([]);
  const [outcome, setOutcome] = useState<{
    status: 'success' | 'warning' | 'fatal';
    title: string;
    description: string;
    maxQ: number;
    totalPower: number;
    breedingStatus: string;
  } | null>(null);

  const simIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  const handleStartSimulation = () => {
    setSimStatus('running');
    setCurrentTime(0);
    setChartData([]);
    setOutcome(null);

    let t = 0;
    const maxT = 10;
    const steps: SimulationData[] = [];

    const isTokamak = geometry === 'Tokamak';
    const isStellarator = geometry === 'Stellarator';
    const isLaserICF = geometry === 'Laser ICF';
    const isFRC = geometry === 'Field-Reversed (FRC)';

    const isHTS = magnetType === 'HTS';
    const isLTS = magnetType === 'LTS';
    const isLaserBank = magnetType === 'Laser Bank';

    const isCarbon = divertor === 'Carbon Fiber';
    const isTungsten = divertor === 'Tungsten';

    const hasNoBlanket = blanket === 'None';
    const isCeramic = blanket === 'Solid Ceramic';
    const isLeadLithium = blanket === 'Liquid Lead-Lithium';
    const isFlibe = blanket === 'Flibe Molten Salt';
    const isHybrid = blanket === 'Fission-Fusion Hybrid';

    const isDT = fuel === 'D-T';
    const isDD = fuel === 'D-D';
    const isPB11 = fuel === 'p-B11';
    const isHe3 = fuel === 'He3-He3';

    const isOhmic = heating === 'Ohmic';
    const isNBI = heating === 'Neutral Beam (NBI)';
    const isRF = heating === 'RF Cyclotron (ICRF)';

    const magnetMismatch = (isLaserICF && !isLaserBank) || (!isLaserICF && isLaserBank);
    const frcOhmicMismatch = isFRC && isOhmic;

    simIntervalRef.current = setInterval(() => {
      t += 0.5;
      setCurrentTime(t);

      let temp = 0;
      let power = 0;
      let heat = 0;

      if (magnetMismatch || frcOhmicMismatch) {
        temp = 10 + Math.random() * 5;
        power = 0.1;
        heat = 1.0;
      } else if (isLaserICF) {
        if (t < 1.5) {
          temp = t * 110;
          power = 0;
          heat = t * 3.0;
        } else if (t >= 1.5 && t < 2.5) {
          temp = 160 + (Math.random() * 20);
          const depletionFactor = hasNoBlanket ? 0.35 : 1.0;
          const fuelFactor = (isPB11 || isHe3) ? 0.08 : isDD ? 0.25 : 1.0;
          power = 750 * depletionFactor * fuelFactor;
          if (isHybrid) power *= 7.0;
          heat = isHybrid ? 28.0 : 18.5;
        } else {
          temp = Math.max(10, 160 - (t - 2.5) * 30);
          power = Math.max(0, (isHybrid ? 5250 : 750) - (t - 2.5) * 350);
          if (hasNoBlanket) power = 0;
          heat = Math.max(1.0, (isHybrid ? 28.0 : 18.5) - (t - 2.5) * 5);
        }
      } else {
        let heatingPowerFactor = 1.0;
        let tempLimit = 550;
        if (isOhmic) {
          tempLimit = 85;
          heatingPowerFactor = 0.6;
        } else if (isNBI) {
          tempLimit = 450;
          heatingPowerFactor = 1.3;
        } else if (isRF) {
          tempLimit = 380;
          heatingPowerFactor = 1.1;
        }

        const magnetPower = isHTS ? 2.2 : 1.0;
        const geometryPower = isTokamak ? 1.4 : isFRC ? 1.25 : 0.95;

        const targetTemp = Math.min(tempLimit, 100 * magnetPower * (isFRC ? 1.6 : geometryPower) * heatingPowerFactor);
        temp = Math.min(targetTemp, (t / 4) * targetTemp + 15 + Math.random() * 5);

        if (isPB11) {
          power = temp > 350 ? Math.min(950, Math.pow((temp - 330) / 45, 2.3) * magnetPower * (isFRC ? 1.5 : geometryPower) * 18) : 0;
        } else if (isHe3) {
          power = temp > 380 ? Math.min(980, Math.pow((temp - 350) / 45, 2.4) * magnetPower * (isFRC ? 1.5 : geometryPower) * 20) : 0;
        } else {
          const fuelScale = isDD ? 0.22 : 1.0;
          power = temp > 40 ? Math.min(800, Math.pow(temp / 45, 2.2) * magnetPower * geometryPower * 12 * fuelScale) : 0;
        }

        if (isHybrid && power > 0) power *= 7.0;

        let rawHeat = (power * (isHybrid ? 0.025 : 0.085)) / (isStellarator ? 1.6 : isFRC ? 1.3 : 1.0);
        if (isFlibe) rawHeat *= 0.8;
        heat = Math.min(40, rawHeat);
      }

      const dataPoint: SimulationData = {
        time: `${t.toFixed(1)}s`,
        temperature: Math.round(temp),
        power: Math.round(power * 10) / 10,
        heatLoad: Math.round(heat * 10) / 10
      };

      steps.push(dataPoint);
      setChartData([...steps]);

      const heatLimit = isCarbon ? 8.0 : isTungsten ? 15.0 : 25.0;
      const isOverheated = heat > heatLimit;

      if ((magnetMismatch || frcOhmicMismatch) && t >= 2.0) {
        clearInterval(simIntervalRef.current!);
        setSimStatus('failed');
        setOutcome({
          status: 'fatal',
          title: frcOhmicMismatch ? 'FRC COIL OVERLOAD' : 'MAGNET CONDUIT QUENCH',
          description: frcOhmicMismatch ? 'FRC geometry mismatch with Ohmic heating.' : 'Incompatible magnet drivers.',
          maxQ: 0.0, totalPower: 0, breedingStatus: 'Inactive'
        });
      } else if (isOverheated && t >= 3.0) {
        clearInterval(simIntervalRef.current!);
        setSimStatus('failed');
        setOutcome({
          status: 'fatal',
          title: `${divertor.toUpperCase()} TARGET SHIELD VAPORIZATION`,
          description: `Heat flux reached ${heat.toFixed(1)} MW/m², melting the ${divertor} divertor plate.`,
          maxQ: isTokamak ? 3.1 : 2.0,
          totalPower: Math.round(steps.reduce((acc, s) => acc + s.power, 0) * 0.5),
          breedingStatus: 'Compromised'
        });
      }

      if (t >= maxT) {
        clearInterval(simIntervalRef.current!);
        setSimStatus('completed');
        const totalGen = Math.round(steps.reduce((acc, s) => acc + s.power, 0) * 0.5);
        let maxQ = isLaserICF ? ((hasNoBlanket ? 0.75 : 1.2) * ((isPB11 || isHe3) ? 0.05 : isDD ? 0.3 : 1.0) * (isHybrid ? 6.5 : 1)) : (Math.pow((isHTS ? 20 : 11.5) / 12, 4) * (isTokamak ? 1.4 : isFRC ? 1.1 : 0.9) * 4.5 * (isDD ? 0.25 : 1) * (isHybrid ? 7.0 : 1));
        const tbr = (isPB11 || isHe3) ? 0.0 : (hasNoBlanket ? 0.0 : isCeramic ? 1.05 : isLeadLithium ? 1.18 : isFlibe ? 1.15 : 0.85);
        
        setOutcome({
          status: maxQ > 1.0 ? 'success' : 'warning',
          title: maxQ > 10 ? 'OPTIMAL IGNITION ACHIEVED' : 'SUB-OPTIMAL BURN',
          description: maxQ > 10 ? 'Stunning success! High-performance configuration maintained stability.' : 'Reactor completed window but performance was constrained.',
          maxQ: Math.round(maxQ * 100) / 100,
          totalPower: totalGen,
          breedingStatus: (isPB11 || isHe3) ? 'N/A (Aneutronic)' : `Stable (TBR: ${tbr})`
        });
      }
    }, 300);
  };

  const handleResetSimulation = () => {
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    setSimStatus('idle');
    setCurrentTime(0);
    setChartData([]);
    setOutcome(null);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-4 flex flex-col gap-6">
        <Card className="glass-panel text-white border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Wrench className="text-cyan-400 size-5" />
              Reactor Constructor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-400">1. Shell Geometry</label>
              <div className="grid grid-cols-2 gap-2">
                {['Tokamak', 'Stellarator', 'Laser ICF', 'Field-Reversed (FRC)'].map((g) => (
                  <button key={g} disabled={simStatus === 'running'} onClick={() => setGeometry(g)} className={`px-2 py-2 rounded-lg border text-xs font-mono transition ${geometry === g ? 'bg-cyan-950/60 border-cyan-500 text-cyan-400' : 'bg-slate-950 border-slate-900 text-slate-400'}`}>{g}</button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400">2. Magnet Coils</label>
              <div className="grid grid-cols-3 gap-2">
                {['LTS', 'HTS', 'Laser Bank'].map((m) => (
                  <button key={m} disabled={simStatus === 'running'} onClick={() => setMagnetType(m)} className={`px-2 py-2 rounded-lg border text-xs font-mono transition ${magnetType === m ? 'bg-cyan-950/60 border-cyan-500 text-cyan-400' : 'bg-slate-950 border-slate-900 text-slate-400'}`}>{m}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              {simStatus !== 'running' ? (
                <Button onClick={handleStartSimulation} className="flex-1 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold">
                  <Play className="size-4 mr-2" /> Initiate Burn
                </Button>
              ) : (
                <Button onClick={handleResetSimulation} variant="destructive" className="flex-1 font-bold">
                  <RotateCcw className="size-4 mr-2" /> Abort
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-8 flex flex-col gap-6">
        <Card className="glass-panel text-white border-slate-800 flex-1 flex flex-col min-h-[400px]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Orbit className="text-cyan-400 size-5" /> Live Diagnostics
              </CardTitle>
              {simStatus === 'running' && <Badge variant="outline" className="border-cyan-500 text-cyan-400 animate-pulse">{currentTime.toFixed(1)}s / 10s</Badge>}
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-4">
            {chartData.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-950/20 border border-dashed border-slate-900 rounded-xl min-h-[300px]">
                <Sparkles className="size-12 text-slate-600 mb-3" />
                <h4 className="text-slate-400 font-bold text-sm font-mono">SYSTEM STANDBY</h4>
              </div>
            ) : (
              <div className="w-full h-[300px] bg-slate-950/30 rounded-xl border border-slate-900/60 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#161e2e" />
                    <XAxis dataKey="time" stroke="#475569" style={{ fontSize: '10px' }} />
                    <YAxis stroke="#475569" style={{ fontSize: '10px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                    <Area name="Temp" type="monotone" dataKey="temperature" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1} />
                    <Area name="Power" type="monotone" dataKey="power" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {outcome && (
              <div className={`mt-4 p-4 rounded-xl border flex flex-col gap-3 ${outcome.status === 'success' ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-red-950/20 border-red-900/40'}`}>
                <h4 className={`text-sm font-extrabold font-mono uppercase ${outcome.status === 'success' ? 'text-emerald-400 text-glow-emerald' : 'text-rose-400 text-glow-rose'}`}>
                  {outcome.title}
                </h4>
                <p className="text-slate-300 text-xs">{outcome.description}</p>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-900/60 text-center font-mono text-xs">
                  <div><span className="text-slate-500 uppercase">Max Q</span><div className="font-bold text-cyan-400">{outcome.maxQ}</div></div>
                  <div><span className="text-slate-500 uppercase">Power</span><div className="font-bold text-slate-200">{outcome.totalPower} MJ</div></div>
                </div>
              </div>
            )}
          </CardContent>0q
        </Card>
      </div>
    </div>
  );
}