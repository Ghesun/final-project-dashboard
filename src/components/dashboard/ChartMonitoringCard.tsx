import { useFirebase } from '@/contexts/FirebaseContext';
import { Activity, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useEffect, useState } from 'react';

const COLORS = ['#7c5cbf', '#4ade80', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];

const ChartMonitoringCard = () => {
  const { devices } = useFirebase();
  const sensors = Object.entries(devices).filter(([, d]) => d.type === 'sensor');
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (sensors.length === 0) {
      setChartData([]);
      return;
    }
    const point: any = { time: new Date().toLocaleTimeString() };
    sensors.forEach(([key, device]) => {
      point[key] = device.value;
    });
    setChartData(prev => [...prev.slice(-29), point]);
  }, [JSON.stringify(sensors.map(([k, d]) => [k, d.value]))]);

  return (
    <div className="iot-card">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="card-title-icon" />
        <span className="text-xs text-muted-foreground font-medium">|</span>
        <h3 className="text-sm font-medium text-card-foreground">Chart Monitoring</h3>
      </div>
      <div className="border-t border-border" />
      {sensors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BarChart3 className="w-10 h-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No sensor devices</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Add sensors via Builder Parameter</p>
        </div>
      ) : (
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(245, 20%, 88%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(230, 10%, 50%)" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(230, 10%, 50%)" />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                }}
              />
              <Legend />
              {sensors.map(([key], i) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  animationDuration={300}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ChartMonitoringCard;
