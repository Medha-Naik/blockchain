import { useNavigate } from "react-router-dom";
import {
  Shield,
  Zap,
  Lock,
  Upload,
  Download,
  ArrowRight,
  Globe,
  CheckCircle,
  Clock3,
  Link as LinkIcon,
  ShieldCheck,
  ZapOff,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const features = [
  {
    icon: Lock,
    label: "End-to-end encrypted",
    desc: "WebRTC DTLS secures transfer from sender to receiver. Your files never touch our servers.",
    color: "text-blue-400",
  },
  {
    icon: Globe,
    label: "Global Availability",
    desc: "Share files even when devices are on different networks with zero configuration.",
    color: "text-purple-400",
  },
  {
    icon: ShieldCheck,
    label: "Zero Privacy Risk",
    desc: "Files move directly between peers and are not stored anywhere in the cloud.",
    color: "text-emerald-400",
  },
];

const steps = [
  {
    num: "01",
    icon: Upload,
    title: "Initiate Room",
    desc: "Start a secure room and get a unique room code instantly with sub-second latency.",
  },
  {
    num: "02",
    icon: LinkIcon,
    title: "Share Access",
    desc: "Securely send the room link or code to the receiver via your preferred channel.",
  },
  {
    num: "03",
    icon: Download,
    title: "Peer Transfer",
    desc: "Files stream directly with live progress tracking and blazing fast speeds.",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCreateRoom = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${BACKEND_URL}/api/create-room`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to create room");
      }

      const data = await res.json();
      navigate(`/send/${data.roomId}`);
    } catch (error: unknown) {
      toast({
        title: "Error creating room",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30 overflow-x-hidden">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] bg-blue-600/10 rounded-full blur-[120px] animate-blob animation-delay-4000" />
      </div>

      <header 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled ? "py-4 bg-black/40  backdrop-blur-lg border-b border-white/10" : "py-6 bg-transparent"
        }`}
      >
        <div className="container max-w-7xl mx-auto px-6 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl  bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white m-0">JustPost</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold mt-[-2px]">Private P2P File Transfer </p>
            </div>
          </motion.div>

          <nav className="hidden md:flex  items-center gap-8">
            {["Home", "Features", "Security", "FAQ"].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="text-l font-medium text-white hover:text-primary transition-colors hover:scale-105 active:scale-95"
              >
                {item}
              </a>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button 
              onClick={handleCreateRoom}
              className="hidden sm:flex bg-white/5 hover:bg-white/10 border border-white/20 text-white rounded-full px-6 transition-all"
            >
              Get Started
            </Button>
          </motion.div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6">
          <div className="container max-w-7xl mx-auto text-center">
            {/* <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-medium mb-8"
            >
              <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">v2.0 Beta</Badge>
              <span>Next generation P2P file transfer is here</span>
            </motion.div> */}
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight mb-8"
            >
              Transfer anything <br />
              <span className="text-gradient">anywhere, instantly.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 mb-12 leading-relaxed"
            >
              Encrypted, browser-to-browser file sharing without size limits. 
              No logins, no uploads to servers—just direct peer-to-peer delivery.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                onClick={handleCreateRoom}
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20 group rounded-2xl"
              >
                <Upload className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
                Send Files
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                onClick={() => navigate("/receive")}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-14 px-8 text-lg font-bold border-white/20 bg-white/5 hover:bg-white/10 text-white rounded-2xl"
              >
                <Download className="w-5 h-5 mr-2" />
                Receive Files 
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6">
          <div className="container max-w-7xl mx-auto">
            <motion.div 
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {features.map((feature) => (
                <motion.div key={feature.label} variants={fadeInUp}>
                  <Card className="glass-card h-full transition-all hover:scale-[1.02] active:scale-95 group">
                    <CardContent className="p-8">
                      <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all ${feature.color}`}>
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-white">{feature.label}</h3>
                      <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-24 px-6 bg-white/[0.02]">
          <div className="container max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4">How it works</h2>
              <p className="text-white/50 max-w-xl mx-auto italic">Simplifying complex protocols into three easy steps.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector lines (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-white/10" />
              
              {steps.map((step, idx) => (
                <motion.div 
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative z-10 flex flex-col items-center text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-black border-2 border-primary/30 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(139,92,246,0.15)] group-hover:border-primary transition-colors">
                    <step.icon className="w-10 h-10 text-primary" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                      {step.num}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                  <p className="text-white/40 text-sm leading-relaxed px-4">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Callout */}
        <section className="py-24 px-6">
          <div className="container max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative p-8 md:p-16 rounded-[2rem] overflow-hidden border border-white/10 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none group-hover:scale-110 transition-transform duration-700" />
              
              <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                <div className="shrink-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-primary/20 flex items-center justify-center animate-pulse">
                    <Shield className="w-12 h-12 md:w-16 md:h-16 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black mb-4">Enterprise-grade security for everyone.</h3>
                  <p className="text-white/60 text-lg mb-8 leading-relaxed">
                    We use standard-compliant WebRTC DTLS and SRTP encryption protocol to secure your transfers. 
                    No registration, no tracking, and no footprint. Your privacy is our architecture.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-xs font-semibold uppercase tracking-wider">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      E2E Encrypted
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-xs font-semibold uppercase tracking-wider">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      No Server Storage
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-xs font-semibold uppercase tracking-wider">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Auditable Protocol
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="pb-32 px-6">
          <div className="container max-w-7xl mx-auto text-center">
            <Card className="glass h-full p-12 md:p-20 border-white/5 rounded-[3rem] text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 blur-[100px] pointer-events-none" />
              
              <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10">Ready to break the gap?</h2>
              <p className=" text-lg text-black md:text-xl max-w-2xl mx-auto mb-12 relative z-10">
                Join thousands of users sharing files securely and instantly without the clouds. 
                Experience true direct sharing today.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                <Button 
                  onClick={handleCreateRoom}
                  size="lg" 
                  className="w-full sm:w-auto h-16 px-10 rounded-2xl bg-white text-black hover:bg-white/90 text-lg font-black shadow-xl"
                >
                  Create Your Room
                </Button>
                <Button 
                  onClick={() => navigate("/receive")}
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto h-16 px-10   rounded-2xl border-white/10 bg-white/5  hover:bg-white/10 text-white text-lg font-bold"
                >
                  Join via Room Code
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 px-6 bg-black/50 relative z-10">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xl font-black">JustPost</span>
            </div>
            
            <div className="flex gap-8 text-sm text-white/40">
              <a href="#" className="hover:text-primary transition-colors">Documentation</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">GitHub</a>
            </div>
          </div>
          
          <div className="text-center  text-s text-white/34">
            &copy; {new Date().getFullYear()} JustPost. Peer-to-peer encrypted file transfers. Built by Team <strong>GoodFellas</strong>.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;