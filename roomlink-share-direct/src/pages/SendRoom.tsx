import { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  Copy, Check, Upload, X, FileText, Image, Film, Archive, ArrowLeft,
  Zap, Lock, Wifi, WifiOff, Loader2, SendHorizontal, Shield, Timer, Link as LinkIcon,
  Pause, Play, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useRelayTransfer, FileTransferInfo } from "@/hooks/useRelayTransfer";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const MAX_TOTAL_SIZE = 1024 * 1024 * 1024; // 1GB
const ROOM_DURATION_SECONDS = 6 * 60;    // 6 minutes

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

// ─── Countdown Timer Hook ─────────────────────────────────────────────────────
function useCountdown(durationSeconds: number, onExpire: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          onExpireRef.current();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const isWarning = secondsLeft <= 60;
  const isCritical = secondsLeft <= 30;
  const progressPercent = (secondsLeft / durationSeconds) * 100;

  return { secondsLeft, formatted, isWarning, isCritical, progressPercent };
}

// ─── Timer Badge ──────────────────────────────────────────────────────────────
const TimerBadge = ({
  formatted,
  isWarning,
  isCritical,
}: {
  formatted: string;
  isWarning: boolean;
  isCritical: boolean;
}) => {
  const className = isCritical
    ? "bg-destructive/10 text-destructive border-destructive/30 animate-pulse"
    : isWarning
      ? "bg-amber-100/10 text-amber-400 border-amber-400/30"
      : "bg-white/5 text-white/70 border-white/10";

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border font-mono ${className}`}>
      <Timer className="w-3.5 h-3.5" />
      {formatted}
    </div>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status, isPaused }: { status: string; isPaused?: boolean }) => {
  const configs: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; className: string }> = {
    idle: { label: "Idle", icon: WifiOff, className: "bg-white/5 text-white/50 border-white/10" },
    waiting: { label: "Waiting...", icon: Loader2, className: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
    connected: { label: "Connected", icon: Wifi, className: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" },
    transferring: { label: isPaused ? "Paused" : "Transferring", icon: isPaused ? Pause : Loader2, className: isPaused ? "bg-amber-400/10 text-amber-400 border-amber-400/20" : "bg-primary/10 text-primary border-primary/20" },
    done: { label: "Complete", icon: Check, className: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" },
    error: { label: "Error", icon: WifiOff, className: "bg-destructive/10 text-destructive border-destructive/20" },
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

const SendRoom = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [fileInfos, setFileInfos] = useState<FileTransferInfo[]>([]);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [transferStarted, setTransferStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const shareUrl = `${window.location.origin}/receive/${roomCode}`;

  const handleExpire = useCallback(() => {
    toast({
      title: "Room expired",
      description: "Redirecting to home…",
      variant: "destructive",
    });
    setTimeout(() => {
      navigate("/");
    }, 1500);
  }, [navigate]);

  const { formatted, isWarning, isCritical, progressPercent } = useCountdown(
    ROOM_DURATION_SECONDS,
    handleExpire
  );

  const handleProgress = useCallback((fileName: string, progress: number) => {
    setFileInfos((prev) => prev.map((f) => (f.name === fileName ? { ...f, progress } : f)));
  }, []);

  const { status, startSender, sendFiles, isPaused, togglePause } = useRelayTransfer({
    role: "sender",
    roomCode: roomCode ?? "",
    onProgress: handleProgress,
  });

  useEffect(() => {
    if (roomCode) {
      startSender();
    }
  }, [roomCode]); // eslint-disable-line

  const addFiles = useCallback((incoming: File[]) => {
    const dangerousFiles = incoming.filter(f => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      return ['exe', 'sh', 'apk', 'bat', 'msi'].includes(ext || '');
    });

    if (dangerousFiles.length > 0) {
      toast({
        title: "⚠️ Dangerous File Type",
        description: `You are trying to send: ${dangerousFiles.map(f => f.name).join(', ')}. Executable files can be harmful.`,
        variant: "destructive",
      });
    }

    setFiles((prev) => {
      const merged = [...prev, ...incoming];
      const totalSize = merged.reduce((s, f) => s + f.size, 0);
      if (totalSize > MAX_TOTAL_SIZE) {
        toast({ title: "Size limit exceeded", description: "Total file size must be under 1GB.", variant: "destructive" });
        return prev;
      }
      const infos: FileTransferInfo[] = merged.map((f) => ({ name: f.name, size: f.size, type: f.type, progress: 0 }));
      setFileInfos(infos);
      return merged;
    });
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setFileInfos(next.map((f) => ({ name: f.name, size: f.size, type: f.type, progress: 0 })));
      return next;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    if (files.length === 0) {
      toast({ title: "No files", description: "Add files to send first.", variant: "destructive" });
      return;
    }
    if (status !== "connected") {
      toast({ title: "Waiting", description: "Wait for the receiver to join.", variant: "destructive" });
      return;
    }
    setTransferStarted(true);
    await sendFiles(files);
  };

  const totalSize = files.reduce((s, f) => s + f.size, 0);

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30 overflow-x-hidden">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-blob animation-delay-4000" />
      </div>

      <header className="fixed top-0 inset-x-0 z-50 bg-black/40 backdrop-blur-lg border-b border-white/10">
        <div className="container max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:block">justPost</span>
          </button>

          <div className="flex items-center gap-2 md:gap-4">
            <TimerBadge formatted={formatted} isWarning={isWarning} isCritical={isCritical} />
            <StatusBadge status={status} isPaused={isPaused} />
          </div>
        </div>

        <div className="h-[2px] w-full bg-white/5">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: `${progressPercent}%` }}
            className={`h-full transition-colors duration-1000 ${isCritical ? "bg-destructive" : isWarning ? "bg-amber-400" : "bg-primary"
              }`}
          />
        </div>
      </header>

      <main className="relative z-10 pt-28 pb-20 px-6">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8"
          >
            {/* Left: Connection Info */}
            <div className="space-y-6">
              <Card className="glass-card border-white/10 overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-white/50 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Secure Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-xs text-white/40 mb-3 uppercase tracking-widest font-bold">Room Code</p>
                    <div className="flex justify-center gap-2">
                      {(roomCode ?? "").split("").map((char, i) => (
                        <motion.span
                          key={i}
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="text-4xl md:text-5xl font-black text-primary font-mono bg-white/5 w-12 h-16 flex items-center justify-center rounded-xl border border-white/10"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={() => handleCopy(roomCode ?? "")} variant="secondary" className="bg-white/5 hover:bg-white/10 text-white border-white/10 h-12 rounded-xl">
                      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      Code
                    </Button>
                    <Button onClick={() => handleCopy(shareUrl)} variant="secondary" className="bg-white/5 hover:bg-white/10 text-white border-white/10 h-12 rounded-xl">
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Link
                    </Button>
                  </div>

                  <div className="flex flex-col items-center gap-4 pt-4 border-t border-white/10">
                    <div className="p-4 bg-white rounded-2xl shadow-2xl">
                      <QRCodeSVG value={shareUrl} size={180} level="H" />
                    </div>
                    <p className="text-xs text-white/30 text-center px-8">
                      Recipients can scan the code to join instantly.
                      No installation required.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className={`p-4 rounded-2xl border transition-all ${isCritical ? "bg-destructive/10 border-destructive/30" : "bg-white/5 border-white/10"
                }`}>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm font-bold text-white">E2E Secure Session</p>
                    <p className="text-xs text-white/40">Encryption: WebRTC DTLS-SRTP</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Transfer Engine */}
            <div className="space-y-6">
              <Card className="glass-card border-white/10 h-full flex flex-col">
                <CardHeader className="pb-3 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                      <Upload className="w-5 h-5 text-white  text-primary" />
                      Transfer Engine
                    </CardTitle>
                    {files.length > 0 && (
                      <Badge className="bg-primary/20 text-primary border-primary/30 rounded-lg">
                        {files.length} Files · {formatSize(totalSize)}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 py-8 flex flex-col gap-6">
                  {!transferStarted && (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onDragEnter={() => setIsDragging(true)}
                      onDragLeave={() => setIsDragging(false)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => inputRef.current?.click()}
                      className={`relative overflow-hidden border-2 border-dashed rounded-[2rem] p-12 text-center cursor-pointer transition-all duration-300 group ${isDragging
                        ? "border-primary bg-primary/5 shadow-[0_0_40px_rgba(139,92,246,0.1)]"
                        : "border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
                        }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                          <Upload className={`w-8 h-8 ${isDragging ? "text-primary" : "text-white/40"}`} />
                        </div>
                        <h4 className="text-xl text-white font-bold mb-2">Select Files to Share</h4>
                        <p className="text-white/40 text-sm max-w-xs mx-auto">
                          Drag and drop or click to browse. <br />
                          Limit: 1GB per session.
                        </p>
                      </div>
                      <input
                        ref={inputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => addFiles(Array.from(e.target.files ?? []))}
                      />
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {fileInfos.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-3"
                      >
                        {fileInfos.map((file, i) => {
                          const Icon = getFileIcon(file.name);
                          const isDangerous = ['exe', 'sh', 'apk', 'bat', 'msi'].includes(file.name.split('.').pop()?.toLowerCase() || '');

                          return (
                            <motion.div
                              key={`${file.name}-${i}`}
                              layout
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`flex items-center gap-4 p-4 rounded-2xl border group transition-colors ${isDangerous ? 'bg-destructive/10 border-destructive/20' : 'bg-white/5 border-white/10'
                                }`}
                            >
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDangerous ? 'bg-destructive/20' : 'bg-white/5'
                                }`}>
                                <Icon className={`w-5 h-5 ${isDangerous ? 'text-destructive' : 'text-primary'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                  <div className="flex items-center gap-2 min-w-0 px-1">
                                    <p className="text-sm text-white font-bold truncate">{file.name}</p>
                                    {isDangerous && (
                                      <Badge variant="destructive" className="h-4 text-[8px] uppercase px-1 shrink-0">
                                        Dangerous
                                      </Badge>
                                    )}
                                  </div>
                                  <span className="text-[10px] font-mono text-white/40">{formatSize(file.size)}</span>
                                </div>
                                <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${file.progress}%` }}
                                    className={`absolute inset-y-0 left-0 ${isDangerous ? 'bg-destructive' : 'bg-primary'}`}
                                  />
                                </div>
                              </div>
                              {!transferStarted && (
                                <button
                                  onClick={() => removeFile(i)}
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/20 hover:text-destructive hover:bg-destructive/10 transition-all"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                              {file.progress === 100 && <Check className="w-5 h-5 text-emerald-400 shrink-0" />}
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3 mt-auto pt-6 border-t border-white/5">
                    {status === "transferring" && (
                      <Button
                        onClick={togglePause}
                        variant="outline"
                        className="h-16 w-16 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
                      >
                        {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                      </Button>
                    )}
                    <Button
                      onClick={handleSend}
                      disabled={files.length === 0 || status !== "connected" || transferStarted}
                      className="flex-1 h-16 text-lg font-black rounded-2xl bg-white text-black hover:bg-white/90 shadow-2xl disabled:opacity-50 disabled:bg-white/10 disabled:text-white/20"
                    >
                      {status === "transferring" ? (
                        <><Loader2 className="w-6 h-6 text-black animate-spin mr-3" /> {isPaused ? 'Paused by You' : 'Sending Payload...'}</>
                      ) : status === "done" ? (
                        <><Check className="w-6 h-6 text-black mr-3" /> All Files Sent!</>
                      ) : status === "waiting" ? (
                        <><Loader2 className="w-5 h-5 text-black animate-spin mr-3" /> Waiting for Peer...</>
                      ) : (
                        <><SendHorizontal className="w-6 h-6 mr-3" />   Send Files</>
                      )}
                    </Button>
                  </div>

                  {status === "waiting" && (
                    <p className="text-center text-xs text-white/30 mt-4 animate-pulse">
                      Waiting for the receiver to join the encrypted tunnel...
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SendRoom;