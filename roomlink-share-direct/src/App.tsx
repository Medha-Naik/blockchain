import { useEffect } from "react";
import { socket } from "./socket";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import Index from "./pages/Index";
import SendRoom from "./pages/SendRoom";
import ReceiveRoom from "./pages/ReceiveRoom";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const App = () => {

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to backend:", socket.id);
    });

    socket.on("error-message", (message) => {
      console.error("Socket error:", message);
    });

    return () => {
      socket.off("connect");
      socket.off("error-message");
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ConnectionStatus />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/send/:roomCode" element={<SendRoom />} />
            <Route path="/receive" element={<ReceiveRoom />} />
            <Route path="/receive/:roomCode" element={<ReceiveRoom />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;