"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useServerData } from "@/hooks/useServerData";
import { AnimatePresence } from "framer-motion";
import { oracleService } from "@/utils/oracleService";


// Dynamically import all components to avoid SSR issues
const BackgroundVideo = dynamic(() => import("@/components/BackgroundVideo"), { ssr: false });
const LeftTypewriter = dynamic(() => import("@/components/LeftTypewriter"), { ssr: false });
const RadialVideoButtons = dynamic(() => import("@/components/RadialVideoButtons"), { ssr: false });
const BottomNavigation = dynamic(() => import("@/components/BottomNavigation"), { ssr: false });
const BirthdayEntry = dynamic(() => import("@/components/BirthdayEntry"), { ssr: false });
const Scope = dynamic(() => import("@/components/Scope"), { ssr: false });
const NavigationHub = dynamic(() => import("@/components/NavigationHub"), { ssr: false });
const OracleHub = dynamic(() => import("@/components/OracleHub"), { ssr: false });
const RetroGeometry = dynamic(() => import("@/components/RetroGeometry"), { ssr: false });
const Manifesto = dynamic(() => import("@/components/Manifesto"), { ssr: false });
const CornerLogo = dynamic(() => import("@/components/CornerLogo"), { ssr: false });

export default function Page() {
  const [userBirthday, setUserBirthday] = useState<Date | null>(null);
  const [zodiacSign, setZodiacSign] = useState<string>("");
  const [showMainPage, setShowMainPage] = useState(false);
  const [isNavigationHubOpen, setIsNavigationHubOpen] = useState(false);
  const [isScopeOpen, setIsScopeOpen] = useState(false);
  const [isOracleHubOpen, setIsOracleHubOpen] = useState(false);
  const [isManifestoOpen, setIsManifestoOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cornerLogoVisible, setCornerLogoVisible] = useState(true);

  // Solana monitoring - runs continuously regardless of Scope state
  const {
    tokens,
    isLoading: solanaLoading,
    lastUpdate,
    stats,
    connectionStatus,
    live,
    resumeLive,
    pauseLive,
    pauseLiveOnHover,
    resumeLiveAfterHover,
    isHoverPaused,
    queuedTokens,
    searchTokens,
    filterByStatus,
    refresh,
    newTokenMint,
  } = useServerData(isScopeOpen); // Enable when Scope is open



  // Debug logging for state changes
  useEffect(() => {
    console.log("🎯 STATE CHANGED - isScopeOpen:", isScopeOpen, "isNavigationHubOpen:", isNavigationHubOpen, "isOracleHubOpen:", isOracleHubOpen, "isManifestoOpen:", isManifestoOpen);
    
    // Additional debug info
    if (isScopeOpen) {
      console.log("🎯 SCOPE IS NOW OPEN - useServerData continues monitoring (always active)");
    } else {
      console.log("🎯 SCOPE IS NOW CLOSED - useServerData continues monitoring (always active)");
    }
  }, [isScopeOpen, isNavigationHubOpen, isOracleHubOpen]);

  // Smooth CornerLogo visibility transitions
  useEffect(() => {
    const shouldBeVisible = !isScopeOpen && !isNavigationHubOpen && !isOracleHubOpen && !isManifestoOpen;
    
    if (shouldBeVisible) {
      // Show immediately when closing hubs
      setCornerLogoVisible(true);
    } else {
      // Small delay when opening hubs to prevent flash
      const timer = setTimeout(() => {
        setCornerLogoVisible(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isScopeOpen, isNavigationHubOpen, isOracleHubOpen, isManifestoOpen]);

  // Check localStorage on component mount
  useEffect(() => {
    const savedBirthday = localStorage.getItem('userBirthday');
    const savedZodiacSign = localStorage.getItem('zodiacSign');
    const savedScopeOpen = localStorage.getItem('isScopeOpen');
    const savedNavigationOpen = localStorage.getItem('isNavigationHubOpen');
    const savedOracleOpen = localStorage.getItem('isOracleHubOpen');
    const savedManifestoOpen = localStorage.getItem('isManifestoOpen');
    
    if (savedBirthday && savedZodiacSign) {
      setUserBirthday(new Date(savedBirthday));
      setZodiacSign(savedZodiacSign);
      setShowMainPage(true);
    } else {
      // If no saved data, still set loading to false so we can show birthday entry
      setShowMainPage(false);
    }
    
    // Restore UI states from localStorage
    if (savedScopeOpen) {
      setIsScopeOpen(savedScopeOpen === 'true');
    }
    if (savedNavigationOpen) {
      setIsNavigationHubOpen(savedNavigationOpen === 'true');
    }
    if (savedOracleOpen) {
      setIsOracleHubOpen(savedOracleOpen === 'true');
    }
    if (savedManifestoOpen) {
      setIsManifestoOpen(savedManifestoOpen === 'true');
    }
    
    setIsLoading(false);
  }, []);

  // Initialize Oracle service to run 24/7
  useEffect(() => {
    console.log('🚀 Initializing Oracle service for 24/7 operation...');
    oracleService.startOracle();
    
    // Cleanup on unmount
    return () => {
      console.log('🛑 Cleaning up Oracle service...');
      oracleService.stopOracle();
    };
  }, []);

  const handleBirthdaySubmit = (birthday: Date) => {
    setUserBirthday(birthday);
    
    // Calculate zodiac sign
    const month = birthday.getMonth() + 1;
    const day = birthday.getDate();
    
    let sign = "";
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) sign = "aries";
    else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) sign = "taurus";
    else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) sign = "gemini";
    else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) sign = "cancer";
    else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) sign = "leo";
    else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) sign = "virgo";
    else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) sign = "libra";
    else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) sign = "scorpio";
    else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) sign = "sagittarius";
    else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) sign = "capricorn";
    else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) sign = "aquarius";
    else sign = "pisces";
    
    setZodiacSign(sign);
    
    // Save to localStorage
    localStorage.setItem('userBirthday', birthday.toISOString());
    localStorage.setItem('zodiacSign', sign);
    
    // Don't automatically proceed - let the user click the button in BirthdayEntry
  };

  const handleProceedToMainPage = () => {
    setShowMainPage(true);
  };


  // Functions to save UI states to localStorage
  const saveScopeState = (isOpen: boolean) => {
    setIsScopeOpen(isOpen);
    localStorage.setItem('isScopeOpen', isOpen.toString());
  };

  const saveNavigationState = (isOpen: boolean) => {
    setIsNavigationHubOpen(isOpen);
    localStorage.setItem('isNavigationHubOpen', isOpen.toString());
  };

  const saveOracleState = (isOpen: boolean) => {
    setIsOracleHubOpen(isOpen);
    localStorage.setItem('isOracleHubOpen', isOpen.toString());
  };

  const saveManifestoState = (isOpen: boolean) => {
    setIsManifestoOpen(isOpen);
    localStorage.setItem('isManifestoOpen', isOpen.toString());
  };

  // Show loading state while checking localStorage
  if (isLoading) {
    return <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>;
  }

  // Show birthday entry first (only if no saved data)
  if (!userBirthday) {
    return <BirthdayEntry onBirthdaySubmit={handleBirthdaySubmit} onProceedToMainPage={handleProceedToMainPage} />;
  }

  // No longer need separate zodiac display - it's now integrated into BirthdayEntry

  // Show main page
  return (
    <ErrorBoundary>
      <main className="fixed inset-0 overflow-visible">
        {/* Always show background components - Scope will overlay on top */}
        <RetroGeometry isSlow={isNavigationHubOpen} isOracleOpen={isOracleHubOpen} isScopeOpen={isScopeOpen} />
        <BackgroundVideo isOracleOpen={isOracleHubOpen} />
        {!isOracleHubOpen && !isScopeOpen && <LeftTypewriter />}
        <CornerLogo size={64} isVisible={cornerLogoVisible} />
        <RadialVideoButtons 
          isNavigationHubOpen={isNavigationHubOpen}
          setIsNavigationHubOpen={saveNavigationState}
          isScopeOpen={isScopeOpen}
          setIsScopeOpen={saveScopeState}
          isOracleHubOpen={isOracleHubOpen}
          setIsOracleHubOpen={saveOracleState}
          isManifestoOpen={isManifestoOpen}
          setIsManifestoOpen={saveManifestoState}
        />
        <BottomNavigation isNavigationHubOpen={isNavigationHubOpen} isOracleHubOpen={isOracleHubOpen} isScopeOpen={isScopeOpen} />
        
        {/* NAVIGATION HUB component - overlays on top of background */}
        <AnimatePresence mode="wait">
          {isNavigationHubOpen && (
            <NavigationHub 
              key="navigation"
              isOpen={isNavigationHubOpen}
              onClose={() => saveNavigationState(false)}
            />
          )}
        </AnimatePresence>

        {/* SCOPE component - now overlays on top of background */}
        <AnimatePresence mode="wait">
          {isScopeOpen && (
            <Scope 
              key="scope"
              isOpen={isScopeOpen}
              tokens={tokens}
              isLoading={solanaLoading}
              lastUpdate={lastUpdate}
              stats={stats}
              connectionStatus={connectionStatus}
              live={live}
              resumeLive={resumeLive}
              pauseLive={pauseLive}
              pauseLiveOnHover={pauseLiveOnHover}
              resumeLiveAfterHover={resumeLiveAfterHover}
              isHoverPaused={isHoverPaused}
              queuedTokens={queuedTokens}
              newTokenMint={newTokenMint}
              onClose={() => saveScopeState(false)}
            />
          )}
        </AnimatePresence>

        {/* ORACLE HUB component - overlays on top of background */}
        <OracleHub 
          isOpen={isOracleHubOpen}
          onClose={() => saveOracleState(false)}
        />

        {/* MANIFESTO component - overlays on top of background */}
        <AnimatePresence mode="wait">
          {isManifestoOpen && (
            <Manifesto 
              key="manifesto"
              isOpen={isManifestoOpen}
              onClose={() => saveManifestoState(false)}
            />
          )}
        </AnimatePresence>
      </main>
    </ErrorBoundary>
  );
}
