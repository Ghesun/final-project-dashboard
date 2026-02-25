import { useState } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { ChevronDown } from 'lucide-react';

const FirebaseConfigCard = () => {
  const { isConnected, connect, disconnect } = useFirebase();
  const [apiKey, setApiKey] = useState('');
  const [dbUrl, setDbUrl] = useState('');
  const [path, setPath] = useState('iot');
  const [open, setOpen] = useState(true);

  const handleConnect = () => {
    if (!apiKey || !dbUrl) return;
    connect(apiKey, dbUrl, path);
  };

  return (
    <div className="iot-card">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpen(!open)}>
        <h3 className="text-lg font-semibold text-card-foreground">Firebase Config</h3>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${open ? '' : '-rotate-90'}`} />
      </div>
      {open && (
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Firebase API Key</label>
            <input
              className="config-input"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              disabled={isConnected}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Database URL</label>
            <input
              className="config-input"
              value={dbUrl}
              onChange={e => setDbUrl(e.target.value)}
              placeholder="https://your-db.firebaseio.com"
              disabled={isConnected}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Path (iot/monitoring)</label>
            <input
              className="config-input"
              value={path}
              onChange={e => setPath(e.target.value)}
              placeholder="iot"
              disabled={isConnected}
            />
          </div>
          {isConnected && (
            <div className="flex items-center gap-2 py-1">
              <span className="status-dot" />
              <span className="text-xs text-success font-medium">Connected</span>
            </div>
          )}
          <button
            onClick={isConnected ? disconnect : handleConnect}
            className={`config-button ${
              isConnected
                ? 'bg-secondary text-card-foreground border border-border hover:bg-muted'
                : 'bg-primary text-primary-foreground hover:opacity-90'
            }`}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FirebaseConfigCard;
