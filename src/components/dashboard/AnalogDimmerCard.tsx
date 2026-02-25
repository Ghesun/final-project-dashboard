import { useFirebase } from '@/contexts/FirebaseContext';
import { CircleDot, SlidersHorizontal } from 'lucide-react';

const AnalogDimmerCard = () => {
  const { devices, updateDevice } = useFirebase();
  const analogs = Object.entries(devices).filter(([, d]) => d.type === 'analog');

  return (
    <div className="iot-card">
      <div className="flex items-center gap-2 mb-4">
        <CircleDot className="card-title-icon" />
        <span className="text-xs text-muted-foreground font-medium">|</span>
        <h3 className="text-sm font-medium text-card-foreground">Analog Dimmer</h3>
      </div>
      {analogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <SlidersHorizontal className="w-10 h-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No dimmer devices</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Add dimmers via Builder Parameter</p>
        </div>
      ) : (
        <div className="space-y-3">
          {analogs.map(([key, device]) => (
            <div key={key} className="p-3 rounded-xl bg-secondary/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-card-foreground">{key}</span>
                <span className="text-xs text-muted-foreground">{device.value} / {device.max || 1023}</span>
              </div>
              <input
                type="range"
                min={0}
                max={device.max || 1023}
                value={device.value}
                onChange={(e) => updateDevice(key, { value: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalogDimmerCard;
