import { useState } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { ChevronDown } from 'lucide-react';

const BuilderParameterCard = () => {
  const { isConnected, createDevice } = useFirebase();
  const [keyName, setKeyName] = useState('');
  const [component, setComponent] = useState<'sensor' | 'switch' | 'analog'>('sensor');
  const [units, setUnits] = useState('');
  const [upperLimit, setUpperLimit] = useState('1023');
  const [open, setOpen] = useState(true);

  const handleSave = async () => {
    if (!keyName.trim()) return;
    const device: any = { type: component, value: 0 };
    if (component === 'sensor') {
      device.unit = units || '%';
      device.max = Number(upperLimit) || 1023;
    }
    if (component === 'analog') {
      device.max = Number(upperLimit) || 1023;
    }
    await createDevice(keyName.trim(), device);
    setKeyName('');
    setUnits('');
    setUpperLimit('1023');
  };

  return (
    <div className={`iot-card ${!isConnected ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpen(!open)}>
        <h3 className="text-lg font-semibold text-card-foreground">Builder Parameter</h3>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${open ? '' : '-rotate-90'}`} />
      </div>
      {open && (
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Key Name: Ex: Temp</label>
            <input
              className="config-input"
              value={keyName}
              onChange={e => setKeyName(e.target.value)}
              placeholder="e.g., humidity"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Component</label>
            <select
              className="config-input"
              value={component}
              onChange={e => setComponent(e.target.value as any)}
            >
              <option value="sensor">Sensor</option>
              <option value="switch">Switch</option>
              <option value="analog">Analog</option>
            </select>
          </div>
          {component !== 'switch' && (
            <>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Units: Ex: %</label>
                <input
                  className="config-input"
                  value={units}
                  onChange={e => setUnits(e.target.value)}
                  placeholder="e.g., %, C, RPM"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Upper limit (default: 100/1024)</label>
                <input
                  className="config-input"
                  value={upperLimit}
                  onChange={e => setUpperLimit(e.target.value)}
                  placeholder="1023"
                />
              </div>
            </>
          )}
          <button
            onClick={handleSave}
            className="config-button bg-secondary text-card-foreground border border-border hover:bg-muted"
          >
            Save Structure
          </button>
        </div>
      )}
    </div>
  );
};

export default BuilderParameterCard;
