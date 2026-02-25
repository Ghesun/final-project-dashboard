import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface TerminalContextType {
  logs: string[];
  addLog: (msg: string) => void;
  clearLogs: () => void;
}

const TerminalContext = createContext<TerminalContextType | null>(null);

export const useTerminal = () => {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error('useTerminal must be used within TerminalProvider');
  return ctx;
};

export const TerminalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<string[]>(['$ waiting for instructions...']);

  const addLog = useCallback((msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${msg}`]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs(['$ waiting for instructions...']);
  }, []);

  useEffect(() => {
    const handler = (e: CustomEvent) => addLog(e.detail);
    window.addEventListener('terminal-log', handler as EventListener);
    return () => window.removeEventListener('terminal-log', handler as EventListener);
  }, [addLog]);

  return (
    <TerminalContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </TerminalContext.Provider>
  );
};
