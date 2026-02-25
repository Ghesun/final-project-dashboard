import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FirebaseProvider } from "@/contexts/FirebaseContext";
import { TerminalProvider } from "@/contexts/TerminalContext";
import Dashboard from "./pages/Dashboard";
import DeviceList from "./pages/DeviceList";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <FirebaseProvider>
        <TerminalProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/devices" element={<DeviceList />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TerminalProvider>
      </FirebaseProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
