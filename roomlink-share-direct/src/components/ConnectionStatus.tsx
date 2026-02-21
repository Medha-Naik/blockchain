import { useEffect, useState } from 'react';
import { socket } from '@/socket';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      setSocketId(socket.id || null);
      console.log('✅ Socket connected:', socket.id);
    }

    function onDisconnect() {
      setIsConnected(false);
      setSocketId(null);
      console.log('❌ Socket disconnected');
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Check initial connection
    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge 
        variant={isConnected ? "default" : "destructive"}
        className="flex items-center gap-2 px-3 py-2"
      >
        {isConnected ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Connected</span>
          </>
        ) : (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Connecting...</span>
          </>
        )}
      </Badge>
      {socketId && (
        <div className="text-xs text-muted-foreground mt-1 text-right">
          ID: {socketId.slice(0, 8)}
        </div>
      )}
    </div>
  );
}
