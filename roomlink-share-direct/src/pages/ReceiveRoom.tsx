import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Zap,
  Lock,
  Download,
  Loader2,
  Check,
  FileText,
  Image,
  Film,
  Archive,
  WifiOff,
  Wifi,
  AlertCircle,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Badge } from "@/components/ui/badge";
import { useRelayTransfer, FileTransferInfo, TransferStatus } from "@/hooks/useRelayTransfer";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return Image;
  if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) return Film;
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return Archive;
  if (["exe", "sh", "apk", "bat", "msi"].includes(ext)) return AlertTriangle;
  return FileText;
}

const StatusBadge = ({ status, isPaused }: { status: TransferStatus; isPaused?: boolean }) => {
  const configs: Record<string, { label: string; icon: any; className: string }> = {
    idle: { label: "Awaiting Session", icon: WifiOff, className: "bg-white/5 text-white/50 border-white/10" },
    waiting: { label: "Syncing...", icon: Loader2, className: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
    connected: { label: "Connected", icon: Wifi, className: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" },
    transferring: { label: isPaused ? "Transfer Paused" : "Decrypting Stream", icon: isPaused ? Loader2 : Loader2, className: isPaused ? "bg-amber-400/10 text-amber-400 border-amber-400/20" : "bg-primary/10 text-primary border-primary/20" },
    done: { label: "Verified & Saved", icon: Check, className: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" },
    error: { label: "Signal Lost", icon: AlertCircle, className: "bg-destructive/10 text-destructive border-destructive/20" },
  };

  const cfg = configs[status] ?? configs.idle;
  const Icon = cfg.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium border ${cfg.className}`}>
      <Icon className={`w-3.5 h-3.5 ${status === "transferring" && !isPaused ? "animate-spin" : ""}`} />
      {cfg.label}
    </div>
  );
};

const ReceiveRoom = () => {
  const { roomCode: paramCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();

  const [inputCode, setInputCode] = useState(paramCode?.toUpperCase() ?? "");
  const [activeCode, setActiveCode] = useState<string | null>(paramCode ?? null);
  const [fileInfos, setFileInfos] = useState<FileTransferInfo[]>([]);
  const [hasJoined, setHasJoined] = useState(!!paramCode);

  const handleFilesReceived = useCallback((files: FileTransferInfo[]) => {
    setFileInfos(files);
  }, []);

  const handleProgress = useCallback((fileName: string, progress: number) => {
    setFileInfos((prev) =>
      prev.map((f) => (f.name === fileName ? { ...f, progress } : f))
    );
  }, []);

  const { status, startReceiver, isPaused } = useRelayTransfer({
    role: "receiver",
    roomCode: activeCode ?? "",
    onFilesReceived: handleFilesReceived,
    onProgress: handleProgress,
  });

  useEffect(() => {
    if (activeCode && hasJoined) {
      startReceiver();
    }
  }, [activeCode, hasJoined]); // eslint-disable-line

  const handleJoin = () => {
    const code = inputCode.trim();

    if (!code) {
      toast({
        title: "Invalid room",
        description: "Enter a valid room link or code.",
        variant: "destructive",
      });
      return;
    }

    setActiveCode(code);
    setHasJoined(true);
    navigate(`/receive/${code}`, { replace: true });
  };

  const allDone =
    fileInfos.length > 0 && fileInfos.every((f) => f.progress === 100);

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30 overflow-x-hidden">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px] animate-blob animation-delay-4000" />
      </div>

      <header className="fixed top-0 inset-x-0 z-50 bg-black/40 backdrop-blur-lg border-b border-white/10">
        <div className="container max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:block">justPost</span>
          </button>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden md:flex gap-1.5 border-white/10 bg-white/5 text-white/50">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span className="text-xs">Peer Guard Active</span>
            </Badge>
            <StatusBadge status={status} isPaused={isPaused} />
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="container max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!hasJoined ? (
              <motion.div
                key="join-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="glass-card border-white/10 overflow-hidden">
                  <CardHeader className="text-center pt-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                      <Download className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-3xl text-white font-black mb-2">Join Room</CardTitle>
                    <p className="text-white text-sm">Enter the code shared by the sender to establish a secure tunnel.</p>
                  </CardHeader>
                  <CardContent className="space-y-8 flex flex-col items-center pb-12">
                    <div className="group">
                      <InputOTP
                        maxLength={36}
                        value={inputCode}
                        onChange={(v) => setInputCode(v)}
                        onComplete={handleJoin}
                        className="gap-2"
                      >
                        <InputOTPGroup className="gap-2 md:gap-4">
                          {[0, 1, 2, 3].map((index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="w-12 h-16 md:w-16 md:h-20 text-2xl text-white rounded-xl border-white/10 bg-white/5 focus-within:ring-primary focus-within:border-primary transition-all"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    <Button
                      onClick={handleJoin}
                      className="w-full h-16 text-lg font-black rounded-2xl bg-white text-black hover:bg-white/90 shadow-2xl transition-all active:scale-95"
                    >
                      Establish Connection
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="transfer-status"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="glass-card border-white/10">
                  <CardHeader className="border-b border-white/5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Lock className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-bold text-white text-lg">Room: <span className="font-mono text-primary">{activeCode}</span></span>
                      </CardTitle>
                      {fileInfos.length > 0 && (
                        <Badge className="bg-emerald-400/20 text-emerald-400 border-emerald-400/30 rounded-lg">
                          {fileInfos.length} Payload{fileInfos.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="py-8">
                    {status === "waiting" && (
                      <div className="text-center py-12 flex flex-col items-center">
                        <div className="relative mb-6">
                          <Loader2 className="w-12 h-12 animate-spin text-primary" />
                          <div className="absolute inset-0 blur-xl bg-primary/30" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Establishing Tunnel</h3>
                        <p className="text-white/40 max-w-xs mx-auto text-sm">Waiting for the sender to verify and start the encrypted stream...</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      {fileInfos.map((file, i) => {
                        const Icon = getFileIcon(file.name);
                        const isDangerous = ['exe', 'sh', 'apk', 'bat', 'msi'].includes(file.name.split('.').pop()?.toLowerCase() || '');

                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-4 rounded-2xl border transition-colors ${isDangerous ? 'bg-destructive/10 border-destructive/20' : 'bg-white/5 border-white/10'
                              }`}
                          >
                            <div className="flex items-center gap-4 mb-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDangerous ? 'bg-destructive/20' : 'bg-white/5'
                                }`}>
                                <Icon className={`w-5 h-5 ${isDangerous ? 'text-destructive' : 'text-primary'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-sm font-bold truncate pr-4">{file.name}</p>
                                  {isDangerous && (
                                    <Badge variant="destructive" className="h-4 text-[8px] uppercase px-1 shrink-0">
                                      Risk
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-[10px] font-mono text-white/40">{formatSize(file.size)}</p>
                              </div>
                              {file.progress === 100 && <Check className="w-5 h-5 text-emerald-400" />}
                            </div>
                            <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${file.progress}%` }}
                                className={`absolute inset-y-0 left-0 ${isDangerous ? 'bg-destructive' : 'bg-primary'}`}
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {status === "idle" && fileInfos.length === 0 && (
                      <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <p className="text-white/40">No files detected yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <AnimatePresence>
                  {(status === "done" || allDone) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Button
                        onClick={() => navigate("/")}
                        className="w-full h-16 text-lg font-black rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl flex items-center justify-center gap-3"
                      >
                        <Check className="w-6 h-6" />
                        All Transfers Verified
                      </Button>
                      <p className="text-center text-xs text-white/30 mt-4 italic">
                        The temporary tunnel is now closed. Your files are saved locally.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default ReceiveRoom;