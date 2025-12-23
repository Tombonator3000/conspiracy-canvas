import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Smartphone, Monitor, Share, PlusSquare, MoreVertical, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop" | "unknown">("unknown");

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform("ios");
    } else if (/android/.test(userAgent)) {
      setPlatform("android");
    } else {
      setPlatform("desktop");
    }

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-[hsl(240,10%,5%)] text-[hsl(120,100%,50%)] font-mono">
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
        }}
      />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-[hsl(120,100%,50%)] hover:bg-[hsl(120,100%,50%)]/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 
              className="text-2xl font-bold tracking-wider"
              style={{ textShadow: '0 0 10px hsl(120,100%,50%)' }}
            >
              INSTALL APOPHENIA
            </h1>
            <p className="text-sm opacity-70">OFFLINE ACCESS PROTOCOL</p>
          </div>
        </div>

        {/* Already installed state */}
        {isInstalled ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[hsl(120,100%,50%)]/10 border border-[hsl(120,100%,50%)]/30 rounded-lg p-6 text-center"
          >
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-xl font-bold mb-2">ALREADY INSTALLED</h2>
            <p className="opacity-70 text-sm">
              Apophenia er allerede installert på enheten din.
              <br />
              Du kan nå bruke appen offline.
            </p>
            <Link to="/">
              <Button className="mt-4 bg-[hsl(120,100%,50%)] text-black hover:bg-[hsl(120,100%,40%)]">
                START INVESTIGATION
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Native install button (Chrome/Edge on Android/Desktop) */}
            {deferredPrompt && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8"
              >
                <Button 
                  onClick={handleInstallClick}
                  className="w-full py-6 text-lg bg-[hsl(120,100%,50%)] text-black hover:bg-[hsl(120,100%,40%)] font-bold"
                >
                  <Download className="w-6 h-6 mr-3" />
                  INSTALL NOW
                </Button>
              </motion.div>
            )}

            {/* Platform-specific instructions */}
            <div className="space-y-6">
              {/* iOS Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`bg-[hsl(120,100%,50%)]/5 border border-[hsl(120,100%,50%)]/20 rounded-lg p-6 ${
                  platform === "ios" ? "ring-2 ring-[hsl(120,100%,50%)]" : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Smartphone className="w-6 h-6" />
                  <h2 className="text-lg font-bold">iOS (iPhone/iPad)</h2>
                  {platform === "ios" && (
                    <span className="text-xs bg-[hsl(120,100%,50%)] text-black px-2 py-1 rounded">
                      DIN ENHET
                    </span>
                  )}
                </div>
                
                <ol className="space-y-4 text-sm opacity-90">
                  <li className="flex items-start gap-3">
                    <span className="bg-[hsl(120,100%,50%)]/20 rounded-full w-6 h-6 flex items-center justify-center shrink-0">1</span>
                    <div>
                      <p>Trykk på <strong>Del-knappen</strong> <Share className="inline w-4 h-4" /> nederst i Safari</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-[hsl(120,100%,50%)]/20 rounded-full w-6 h-6 flex items-center justify-center shrink-0">2</span>
                    <div>
                      <p>Scroll ned og trykk <strong>"Legg til på Hjem-skjerm"</strong> <PlusSquare className="inline w-4 h-4" /></p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-[hsl(120,100%,50%)]/20 rounded-full w-6 h-6 flex items-center justify-center shrink-0">3</span>
                    <div>
                      <p>Trykk <strong>"Legg til"</strong> øverst til høyre</p>
                    </div>
                  </li>
                </ol>
                
                <p className="mt-4 text-xs opacity-60">
                  Merk: Du må bruke Safari for å installere på iOS
                </p>
              </motion.div>

              {/* Android Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`bg-[hsl(120,100%,50%)]/5 border border-[hsl(120,100%,50%)]/20 rounded-lg p-6 ${
                  platform === "android" ? "ring-2 ring-[hsl(120,100%,50%)]" : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Smartphone className="w-6 h-6" />
                  <h2 className="text-lg font-bold">Android</h2>
                  {platform === "android" && (
                    <span className="text-xs bg-[hsl(120,100%,50%)] text-black px-2 py-1 rounded">
                      DIN ENHET
                    </span>
                  )}
                </div>
                
                <ol className="space-y-4 text-sm opacity-90">
                  <li className="flex items-start gap-3">
                    <span className="bg-[hsl(120,100%,50%)]/20 rounded-full w-6 h-6 flex items-center justify-center shrink-0">1</span>
                    <div>
                      <p>Trykk på <strong>meny-knappen</strong> <MoreVertical className="inline w-4 h-4" /> øverst til høyre i Chrome</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-[hsl(120,100%,50%)]/20 rounded-full w-6 h-6 flex items-center justify-center shrink-0">2</span>
                    <div>
                      <p>Velg <strong>"Installer app"</strong> eller <strong>"Legg til på startskjerm"</strong></p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-[hsl(120,100%,50%)]/20 rounded-full w-6 h-6 flex items-center justify-center shrink-0">3</span>
                    <div>
                      <p>Bekreft ved å trykke <strong>"Installer"</strong></p>
                    </div>
                  </li>
                </ol>
              </motion.div>

              {/* Desktop Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`bg-[hsl(120,100%,50%)]/5 border border-[hsl(120,100%,50%)]/20 rounded-lg p-6 ${
                  platform === "desktop" ? "ring-2 ring-[hsl(120,100%,50%)]" : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Monitor className="w-6 h-6" />
                  <h2 className="text-lg font-bold">Desktop (Chrome/Edge)</h2>
                  {platform === "desktop" && (
                    <span className="text-xs bg-[hsl(120,100%,50%)] text-black px-2 py-1 rounded">
                      DIN ENHET
                    </span>
                  )}
                </div>
                
                <ol className="space-y-4 text-sm opacity-90">
                  <li className="flex items-start gap-3">
                    <span className="bg-[hsl(120,100%,50%)]/20 rounded-full w-6 h-6 flex items-center justify-center shrink-0">1</span>
                    <div>
                      <p>Se etter <strong>installer-ikonet</strong> <Download className="inline w-4 h-4" /> i adressefeltet</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-[hsl(120,100%,50%)]/20 rounded-full w-6 h-6 flex items-center justify-center shrink-0">2</span>
                    <div>
                      <p>Klikk på ikonet og velg <strong>"Installer"</strong></p>
                    </div>
                  </li>
                </ol>
                
                <p className="mt-4 text-xs opacity-60">
                  Merk: Firefox støtter ikke PWA-installasjon på desktop
                </p>
              </motion.div>
            </div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 border-t border-[hsl(120,100%,50%)]/20 pt-8"
            >
              <h3 className="text-lg font-bold mb-4">HVORFOR INSTALLERE?</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li className="flex items-center gap-2">
                  <span className="text-[hsl(120,100%,50%)]">►</span>
                  Spill offline – ingen internett nødvendig
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[hsl(120,100%,50%)]">►</span>
                  Raskere lasting – cached lokalt
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[hsl(120,100%,50%)]">►</span>
                  Fullskjerm-opplevelse uten nettleser-UI
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[hsl(120,100%,50%)]">►</span>
                  App-ikon på hjemskjermen
                </li>
              </ul>
            </motion.div>
          </>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-xs opacity-50">
          <p>APOPHENIA v1.337 | THEY CAN'T TRACK YOU OFFLINE</p>
        </div>
      </div>
    </div>
  );
}
