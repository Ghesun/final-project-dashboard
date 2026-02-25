import { useFirebase, IoTDevice } from '@/contexts/FirebaseContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Plus, Activity, Power, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const typeIcons = {
  sensor: Activity,
  switch: Power,
  analog: SlidersHorizontal,
};

const DeviceList = () => {
  const navigate = useNavigate();
  const { devices, isConnected, deleteDevice, updateDevice, createDevice } = useFirebase();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newType, setNewType] = useState<'sensor' | 'switch' | 'analog'>('sensor');

  const handleEdit = (key: string, device: IoTDevice) => {
    setEditingKey(key);
    setEditValue(String(device.value));
  };

  const handleSaveEdit = async () => {
    if (!editingKey) return;
    await updateDevice(editingKey, { value: Number(editValue) });
    setEditingKey(null);
  };

  const handleAdd = async () => {
    if (!newKey.trim()) return;
    const device: IoTDevice = { type: newType, value: 0 };
    if (newType === 'sensor') { device.unit = '%'; device.max = 100; }
    if (newType === 'analog') { device.max = 1023; }
    await createDevice(newKey.trim(), device);
    setNewKey('');
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[900px] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-2xl bg-card flex items-center justify-center shadow-sm hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-card-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Device List</h1>
          {isConnected && (
            <button
              onClick={() => setShowAdd(true)}
              className="ml-auto w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5 text-primary-foreground" />
            </button>
          )}
        </div>

        {!isConnected ? (
          <div className="iot-card text-center py-12">
            <p className="text-muted-foreground">Connect to Firebase first</p>
          </div>
        ) : Object.keys(devices).length === 0 ? (
          <div className="iot-card text-center py-12">
            <p className="text-muted-foreground">No devices found</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Add devices via Builder Parameter</p>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(devices).map(([key, device]) => {
              const Icon = typeIcons[device.type];
              return (
                <div key={key} className="iot-card flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-card-foreground truncate">{key}</p>
                    <p className="text-xs text-muted-foreground capitalize">{device.type}{device.unit ? ` • ${device.unit}` : ''}</p>
                  </div>
                  {editingKey === key ? (
                    <div className="flex items-center gap-2">
                      <input
                        className="config-input w-20"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        autoFocus
                      />
                      <button onClick={handleSaveEdit} className="text-xs text-primary font-medium">Save</button>
                      <button onClick={() => setEditingKey(null)} className="text-xs text-muted-foreground">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5">
                        <span className="status-dot" />
                        <span className="text-sm font-mono text-card-foreground">{device.value}</span>
                      </div>
                      <button onClick={() => handleEdit(key, device)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors">
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button onClick={() => deleteDevice(key)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-destructive/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add Device Modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAdd(false)}>
            <div className="iot-card w-full max-w-sm mx-4 space-y-3" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-card-foreground">Add Device</h3>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Key Name</label>
                <input className="config-input" value={newKey} onChange={e => setNewKey(e.target.value)} placeholder="e.g., temperature" autoFocus />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Type</label>
                <select className="config-input" value={newType} onChange={e => setNewType(e.target.value as any)}>
                  <option value="sensor">Sensor</option>
                  <option value="switch">Switch</option>
                  <option value="analog">Analog</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowAdd(false)} className="config-button flex-1 bg-secondary text-card-foreground border border-border">Cancel</button>
                <button onClick={handleAdd} className="config-button flex-1 bg-primary text-primary-foreground">Add</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceList;
