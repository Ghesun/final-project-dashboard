import { useState, useRef, useCallback } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { ChevronDown } from 'lucide-react';

const GlobalSimulatorCard = () => {
  const { isConnected, devices, updateDevice } = useFirebase();
  const [min, setMin] = useState('67');
  const [max, setMax] = useState('1024');
  const [duration, setDuration] = useState('30');
  const [running, setRunning] = useState(false);
  const [open, setOpen] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startSimulation = useCallback(() => {
    const minVal = Number(min);
    const maxVal = Number(max);
    const durationSec = Number(duration);
    if (isNaN(minVal) || isNaN(maxVal) || isNaN(durationSec)) return;

    setRunning(true);
    window.dispatchEvent(new CustomEvent('terminal-log', { detail: `▶ Simulation started (${durationSec}s)` }));

    const tick = () => {
      Object.entries(devices).forEach(([key, device]) => {
        if (device.type === 'sensor' || device.type === 'analog') {
          const val = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
          const clamped = Math.min(val, device.max || maxVal);
          updateDevice(key, { value: clamped });
        } else if (device.type === 'switch') {
          updateDevice(key, { value: Math.random() > 0.5 ? 1 : 0 });
        }
      });
      window.dispatchEvent(new CustomEvent('terminal-log', { detail: '↻ Data written to Firebase' }));
    };

    tick();
    intervalRef.current = setInterval(tick, 3000);
    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRunning(false);
      window.dispatchEvent(new CustomEvent('terminal-log', { detail: '■ Simulation stopped' }));
    }, durationSec * 1000);
  }, [min, max, duration, devices, updateDevice]);

  const stopSimulation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setRunning(false);
    window.dispatchEvent(new CustomEvent('terminal-log', { detail: '■ Simulation stopped' }));
  }, []);

  return (
    <div className={`iot-card ${!isConnected ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpen(!open)}>
        <h3 className="text-lg font-semibold text-card-foreground">Global Simulator</h3>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${open ? '' : '-rotate-90'}`} />
      </div>
      {open && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Min</label>
              <input className="config-input" value={min} onChange={e => setMin(e.target.value)} disabled={running} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Max</label>
              <input className="config-input" value={max} onChange={e => setMax(e.target.value)} disabled={running} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Simulation time</label>
            <input className="config-input" value={duration} onChange={e => setDuration(e.target.value)} disabled={running} />
          </div>
          <button
            onClick={running ? stopSimulation : startSimulation}
            className={`config-button ${
              running
                ? 'bg-destructive text-destructive-foreground hover:opacity-90'
                : 'bg-secondary text-card-foreground border border-border hover:bg-muted'
            }`}
          >
            {running ? 'Stop Simulation' : 'Start Simulation'}
          </button>
        </div>
      )}
    </div>
  );
};

export default GlobalSimulatorCard;
