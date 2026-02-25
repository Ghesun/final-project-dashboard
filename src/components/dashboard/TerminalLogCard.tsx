import { useTerminal } from '@/contexts/TerminalContext';
import { Terminal, Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

const TerminalLogCard = () => {
  const { logs, clearLogs } = useTerminal();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="iot-card !p-0 overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="card-title-icon" />
          <span className="text-xs text-muted-foreground font-medium">|</span>
          <h3 className="text-sm font-medium text-card-foreground">Terminal Log</h3>
        </div>
        <button
          onClick={clearLogs}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
      <div ref={scrollRef} className="terminal-container max-h-[200px]">
        {logs.map((log, i) => (
          <div key={i} className="leading-relaxed">
            <span className={log.startsWith('$') ? 'text-terminal-foreground' : 'text-terminal-muted'}>
              {log}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TerminalLogCard;
