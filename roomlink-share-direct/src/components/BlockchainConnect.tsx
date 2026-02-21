import { Wallet, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBlockchain } from '@/hooks/useBlockchain';

export function BlockchainConnect() {
  const { isEnabled, isConnected, isLoading, account, chainId, connect, disconnect } = useBlockchain();

  if (!isEnabled) {
    return null;
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isConnected ? 'bg-success/10' : 'bg-muted'
            }`}>
              <Wallet className={`w-5 h-5 ${isConnected ? 'text-success' : 'text-muted-foreground'}`} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">
                  {isConnected ? 'Wallet Connected' : 'Blockchain Features'}
                </p>
                {isConnected && (
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle className="w-3 h-3 mr-1 text-success" />
                    Active
                  </Badge>
                )}
              </div>
              
              {isConnected && account ? (
                <p className="text-xs text-muted-foreground">
                  {account.slice(0, 6)}...{account.slice(-4)}
                  {chainId && ` • Chain ${chainId}`}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Connect wallet for anonymous routing
                </p>
              )}
            </div>
          </div>

          <Button
            onClick={isConnected ? disconnect : connect}
            disabled={isLoading}
            variant={isConnected ? 'outline' : 'default'}
            size="sm"
            className="shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : isConnected ? (
              'Disconnect'
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </>
            )}
          </Button>
        </div>

        {isConnected && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle className="w-3 h-3 text-success" />
              <span>IP address hidden via relay network</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
