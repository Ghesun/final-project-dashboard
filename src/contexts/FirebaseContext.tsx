import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { initializeApp, FirebaseApp, deleteApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, update, remove, Database, off } from 'firebase/database';

export interface IoTDevice {
  type: 'sensor' | 'switch' | 'analog';
  value: number;
  unit?: string;
  max?: number;
}

interface FirebaseContextType {
  app: FirebaseApp | null;
  db: Database | null;
  isConnected: boolean;
  devices: Record<string, IoTDevice>;
  connect: (apiKey: string, databaseURL: string, path: string) => void;
  disconnect: () => void;
  path: string;
  createDevice: (key: string, device: IoTDevice) => Promise<void>;
  updateDevice: (key: string, data: Partial<IoTDevice>) => Promise<void>;
  deleteDevice: (key: string) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const useFirebase = () => {
  const ctx = useContext(FirebaseContext);
  if (!ctx) throw new Error('useFirebase must be used within FirebaseProvider');
  return ctx;
};

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [app, setApp] = useState<FirebaseApp | null>(null);
  const [db, setDb] = useState<Database | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [devices, setDevices] = useState<Record<string, IoTDevice>>({});
  const [path, setPath] = useState('iot');
  const listenerRef = useRef<any>(null);
  const dbRef = useRef<Database | null>(null);
  const pathRef = useRef('iot');

  const connect = useCallback((apiKey: string, databaseURL: string, dbPath: string) => {
    try {
      const firebaseApp = initializeApp({ apiKey, databaseURL }, `iot-app-${Date.now()}`);
      const database = getDatabase(firebaseApp);
      
      setApp(firebaseApp);
      setDb(database);
      dbRef.current = database;
      setPath(dbPath);
      pathRef.current = dbPath;

      const dbReference = ref(database, dbPath);
      listenerRef.current = onValue(dbReference, (snapshot) => {
        const data = snapshot.val();
        if (data && typeof data === 'object') {
          const devs: Record<string, IoTDevice> = {};
          Object.entries(data).forEach(([key, val]: [string, any]) => {
            if (val && typeof val === 'object' && val.type) {
              devs[key] = val as IoTDevice;
            }
          });
          setDevices(devs);
        } else {
          setDevices({});
        }
        setIsConnected(true);
        window.dispatchEvent(new CustomEvent('terminal-log', { detail: '✓ Firebase connected' }));
      }, (error) => {
        window.dispatchEvent(new CustomEvent('terminal-log', { detail: `✗ Firebase error: ${error.message}` }));
        setIsConnected(false);
      });
    } catch (err: any) {
      window.dispatchEvent(new CustomEvent('terminal-log', { detail: `✗ Connection failed: ${err.message}` }));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (dbRef.current && listenerRef.current) {
      const dbReference = ref(dbRef.current, pathRef.current);
      off(dbReference);
    }
    if (app) {
      deleteApp(app).catch(() => {});
    }
    setApp(null);
    setDb(null);
    dbRef.current = null;
    setIsConnected(false);
    setDevices({});
    window.dispatchEvent(new CustomEvent('terminal-log', { detail: '⊘ Firebase disconnected' }));
  }, [app]);

  const createDevice = useCallback(async (key: string, device: IoTDevice) => {
    if (!dbRef.current) return;
    const deviceRef = ref(dbRef.current, `${pathRef.current}/${key}`);
    await set(deviceRef, device);
    window.dispatchEvent(new CustomEvent('terminal-log', { detail: `+ Device added: ${key}` }));
  }, []);

  const updateDevice = useCallback(async (key: string, data: Partial<IoTDevice>) => {
    if (!dbRef.current) return;
    const deviceRef = ref(dbRef.current, `${pathRef.current}/${key}`);
    await update(deviceRef, data);
    window.dispatchEvent(new CustomEvent('terminal-log', { detail: `~ Device updated: ${key}` }));
  }, []);

  const deleteDevice = useCallback(async (key: string) => {
    if (!dbRef.current) return;
    const deviceRef = ref(dbRef.current, `${pathRef.current}/${key}`);
    await remove(deviceRef);
    window.dispatchEvent(new CustomEvent('terminal-log', { detail: `- Device removed: ${key}` }));
  }, []);

  return (
    <FirebaseContext.Provider value={{ app, db, isConnected, devices, connect, disconnect, path, createDevice, updateDevice, deleteDevice }}>
      {children}
    </FirebaseContext.Provider>
  );
};
