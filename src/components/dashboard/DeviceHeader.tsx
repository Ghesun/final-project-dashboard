import { useNavigate } from 'react-router-dom';
import { useFirebase } from '@/contexts/FirebaseContext';
import { ChevronRight } from 'lucide-react';

const DeviceHeader = () => {
  const navigate = useNavigate();
  const { isConnected } = useFirebase();

  return (
    <div className="iot-card flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center overflow-hidden">
        <span className="text-2xl">🦄</span>
      </div>
      <div className="flex-1">
        <h2 className="font-semibold text-card-foreground">Green Horse</h2>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={isConnected ? 'status-dot' : 'status-dot-disconnected'} />
          <span className="text-xs text-muted-foreground">{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
      <button
        onClick={() => navigate('/devices')}
        className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-secondary transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </button>
    </div>
  );
};

export default DeviceHeader;
