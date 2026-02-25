import DeviceHeader from '@/components/dashboard/DeviceHeader';
import SwitchDigitalCard from '@/components/dashboard/SwitchDigitalCard';
import AnalogDimmerCard from '@/components/dashboard/AnalogDimmerCard';
import ChartMonitoringCard from '@/components/dashboard/ChartMonitoringCard';
import TerminalLogCard from '@/components/dashboard/TerminalLogCard';
import FirebaseConfigCard from '@/components/dashboard/FirebaseConfigCard';
import BuilderParameterCard from '@/components/dashboard/BuilderParameterCard';
import GlobalSimulatorCard from '@/components/dashboard/GlobalSimulatorCard';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* LEFT SIDE */}
        <div className="space-y-5">
          <DeviceHeader />
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-5">
            <SwitchDigitalCard />
            <AnalogDimmerCard />
          </div>
          <ChartMonitoringCard />
          <TerminalLogCard />
        </div>

        {/* RIGHT SIDE - Config Sidebar */}
        <div className="space-y-5">
          <FirebaseConfigCard />
          <BuilderParameterCard />
          <GlobalSimulatorCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
