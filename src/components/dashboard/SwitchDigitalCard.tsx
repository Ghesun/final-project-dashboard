import { useFirebase } from '@/contexts/FirebaseContext';
import { Power, ToggleLeft, ToggleRight } from 'lucide-react';

const SwitchDigitalCard = () => {
  const { devices, updateDevice } = useFirebase();
  const switches = Object.entries(devices).filter(([, d]) => d.type === 'switch');

  return (
    <div className="iot-card">
      <div className="flex items-center gap-2 mb-4">
        <Power className="card-title-icon" />
        <span className="text-xs text-muted-foreground font-medium">|</span>
        <h3 className="text-sm font-medium text-card-foreground">Switch Digital (0/1)</h3>
      </div>
      {switches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-10 h-10 rounded-xl border border-border flex items-center justify-center mb-3">
            <ToggleLeft className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">No switch devices</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Add switches via Builder Parameter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {switches.map(([key, device]) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
              <span className="text-sm font-medium text-card-foreground">{key}</span>
              <button
                onClick={() => updateDevice(key, { value: device.value === 1 ? 0 : 1 })}
                className="transition-colors"
              >
                {device.value === 1 ? (
                  <ToggleRight className="w-8 h-8 text-success" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-muted-foreground" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SwitchDigitalCard;
