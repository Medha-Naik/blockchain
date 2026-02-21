import { useState, useRef, useCallback, useEffect } from "react";
import { socket } from "@/socket";
import { toast } from "@/hooks/use-toast";

const CHUNK_SIZE = 64 * 1024; // 64KB chunks

export type TransferStatus =
  | "idle"
  | "waiting"
  | "connected"
  | "transferring"
  | "done"
  | "error";

export interface FileTransferInfo {
  name: string;
  size: number;
  type: string;
  progress: number;
}

interface UseRelayTransferOptions {
  role: "sender" | "receiver";
  roomCode: string;
  onFilesReceived?: (files: FileTransferInfo[]) => void;
  onProgress?: (fileName: string, progress: number) => void;
  onTransferComplete?: () => void;
}

export function useRelayTransfer({
  role,
  roomCode,
  onFilesReceived,
  onProgress,
  onTransferComplete,
}: UseRelayTransferOptions) {
  const [status, setStatus] = useState<TransferStatus>("idle");
  const [fileInfos, setFileInfos] = useState<FileTransferInfo[]>([]);

  const receiveBufferRef = useRef<
    Record<
      string,
      { chunks: ArrayBuffer[]; received: number; total: number; type: string }
    >
  >({});
  const currentFileRef = useRef<string | null>(null);

  const cleanup = useCallback(() => {
    socket.off("relay-connected");
    socket.off("relay-data");
    socket.off("relay-file-list");
    socket.off("relay-file-start");
    socket.off("relay-file-chunk");
    socket.off("relay-file-end");
    socket.off("relay-transfer-complete");
    socket.off("relay-error");
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  // ───────────── SENDER ─────────────
  const startSender = useCallback(async () => {
    console.log("🚀 Starting sender with relay network...");
    setStatus("waiting");

    // Join room via relay
    socket.emit("join-relay-room", { roomId: roomCode, role: "sender" });

    // Wait for receiver to connect
    socket.on("relay-connected", () => {
      console.log("✅ Receiver connected via relay");
      setStatus("connected");
      toast({ title: "🔒 Receiver connected (IP hidden)" });
    });

    socket.on("relay-error", (error) => {
      console.error("❌ Relay error:", error);
      setStatus("error");
      toast({
        title: "Connection error",
        description: error.message,
        variant: "destructive",
      });
    });
  }, [roomCode]);

  // ───────────── RECEIVER ─────────────
  const startReceiver = useCallback(async () => {
    console.log("🚀 Starting receiver with relay network...");
    setStatus("waiting");

    // Join room via relay
    socket.emit("join-relay-room", { roomId: roomCode, role: "receiver" });

    // Connected to sender
    socket.on("relay-connected", () => {
      console.log("✅ Connected to sender via relay");
      setStatus("connected");
      toast({ title: "🔒 Connected (IP hidden)" });
    });

    // Receive file list
    socket.on("relay-file-list", (data: { files: FileTransferInfo[] }) => {
      console.log("📋 Received file list:", data.files);
      const infos = data.files.map((f) => ({ ...f, progress: 0 }));
      setFileInfos(infos);
      onFilesReceived?.(infos);
      setStatus("transferring");
    });

    // File start
    socket.on(
      "relay-file-start",
      (data: { name: string; size: number; type: string }) => {
        console.log("📥 Starting file:", data.name);
        currentFileRef.current = data.name;
        receiveBufferRef.current[data.name] = {
          chunks: [],
          received: 0,
          total: data.size,
          type: data.type,
        };
      }
    );

    // File chunk
    socket.on("relay-file-chunk", (data: { name: string; chunk: string }) => {
      const fileName = data.name;
      if (!receiveBufferRef.current[fileName]) return;

      // Convert base64 to ArrayBuffer
      const binaryString = atob(data.chunk);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const fileData = receiveBufferRef.current[fileName];
      fileData.chunks.push(bytes.buffer);
      fileData.received += bytes.length;

      const progress = Math.round((fileData.received / fileData.total) * 100);
      onProgress?.(fileName, progress);
    });

    // File end
    socket.on("relay-file-end", (data: { name: string }) => {
      console.log("✅ File complete:", data.name);
      const fileData = receiveBufferRef.current[data.name];
      if (!fileData) return;

      // Create blob and download
      const blob = new Blob(fileData.chunks, { type: fileData.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.name;
      a.click();
      URL.revokeObjectURL(url);

      onProgress?.(data.name, 100);
    });

    // Transfer complete
    socket.on("relay-transfer-complete", () => {
      console.log("🎉 All files transferred!");
      setStatus("done");
      onTransferComplete?.();
      toast({ title: "✅ Transfer complete!" });
    });

    socket.on("relay-error", (error) => {
      console.error("❌ Relay error:", error);
      setStatus("error");
      toast({
        title: "Transfer error",
        description: error.message,
        variant: "destructive",
      });
    });
  }, [roomCode, onFilesReceived, onProgress, onTransferComplete]);

  // ───────────── SEND FILES ─────────────
  const sendFiles = useCallback(
    async (files: File[]) => {
      if (status !== "connected") {
        toast({
          title: "Not connected",
          description: "Wait for receiver to join",
          variant: "destructive",
        });
        return;
      }

      console.log("📤 Sending files via relay...");
      setStatus("transferring");

      // Send file list
      const fileList = files.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      }));

      socket.emit("relay-file-list", {
        roomId: roomCode,
        files: fileList,
      });

      // Send each file
      for (const file of files) {
        console.log("📤 Sending file:", file.name);

        // Send file start
        socket.emit("relay-file-start", {
          roomId: roomCode,
          name: file.name,
          size: file.size,
          type: file.type,
        });

        // Send file in chunks
        let offset = 0;
        while (offset < file.size) {
          const slice = file.slice(offset, offset + CHUNK_SIZE);
          const buffer = await slice.arrayBuffer();

          // Convert to base64 for transmission
          const bytes = new Uint8Array(buffer);
          let binary = "";
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = btoa(binary);

          socket.emit("relay-file-chunk", {
            roomId: roomCode,
            name: file.name,
            chunk: base64,
          });

          offset += buffer.byteLength;
          const progress = Math.round((offset / file.size) * 100);
          onProgress?.(file.name, progress);

          // Small delay to prevent overwhelming the relay
          await new Promise((resolve) => setTimeout(resolve, 10));
        }

        // Send file end
        socket.emit("relay-file-end", {
          roomId: roomCode,
          name: file.name,
        });

        console.log("✅ File sent:", file.name);
      }

      // Send transfer complete
      socket.emit("relay-transfer-complete", { roomId: roomCode });
      setStatus("done");
      toast({ title: "✅ Files sent successfully!" });
    },
    [roomCode, status, onProgress]
  );

  return {
    status,
    fileInfos,
    setFileInfos,
    startSender,
    startReceiver,
    sendFiles,
    cleanup,
  };
}
