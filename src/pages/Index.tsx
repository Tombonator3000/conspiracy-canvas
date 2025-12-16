import { useState, useCallback } from "react";
import { MainMenu } from "@/components/game/MainMenu";
import { FilingCabinet } from "@/components/game/FilingCabinet";
import { ConspiracyBoard } from "@/components/game/ConspiracyBoard";
import { VictoryScreenModal } from "@/components/game/VictoryScreenModal";
import { GameOverScreen } from "@/components/game/GameOverScreen";
import { allCases } from "@/data/cases";
import { useGameProgress } from "@/hooks/useGameProgress";
import type { CaseData, CredibilityStats } from "@/types/game";

type GameScreen = 'menu' | 'files' | 'game' | 'result' | 'gameover';

interface GameResult {
  isVictory: boolean;
  sanityRemaining: number;
  connectionsFound: number;
  credibilityStats: CredibilityStats;
}

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('menu');
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  
  const { completedCases, completeCase } = useGameProgress();

  const handleStartGame = useCallback(() => {
    setCurrentScreen('files');
  }, []);

  const handleSelectCase = useCallback((caseData: CaseData) => {
    setSelectedCase(caseData);
    setCurrentScreen('game');
  }, []);

  const handleGameEnd = useCallback((
    isVictory: boolean,
    sanityRemaining: number,
    connectionsFound: number,
    credibilityStats: CredibilityStats
  ) => {
    setGameResult({ isVictory, sanityRemaining, connectionsFound, credibilityStats });

    if (isVictory && selectedCase) {
      const followersGained = Math.floor(Math.random() * 500) + 100;
      completeCase(selectedCase.id, followersGained);
      setCurrentScreen('result');
    } else {
      setCurrentScreen('gameover');
    }
  }, [selectedCase, completeCase]);

  const handleRetry = useCallback(() => {
    setGameResult(null);
    setCurrentScreen('game');
  }, []);

  const handleNextCase = useCallback(() => {
    if (!selectedCase) return;
    
    const currentIndex = allCases.findIndex(c => c.id === selectedCase.id);
    const nextCase = allCases[currentIndex + 1];
    
    if (nextCase) {
      setSelectedCase(nextCase);
      setGameResult(null);
      setCurrentScreen('game');
    } else {
      // No more cases, go back to files
      setSelectedCase(null);
      setGameResult(null);
      setCurrentScreen('files');
    }
  }, [selectedCase]);

  const handleBackToMenu = useCallback(() => {
    setSelectedCase(null);
    setGameResult(null);
    setCurrentScreen('menu');
  }, []);

  const handleBackToFiles = useCallback(() => {
    setSelectedCase(null);
    setGameResult(null);
    setCurrentScreen('files');
  }, []);

  // Render current screen
  switch (currentScreen) {
    case 'menu':
      return <MainMenu onStartGame={handleStartGame} />;
    
    case 'files':
      return (
        <FilingCabinet
          cases={allCases}
          completedCases={completedCases}
          onSelectCase={handleSelectCase}
          onBack={handleBackToMenu}
        />
      );
    
    case 'game':
      if (!selectedCase) return null;
      return (
        <ConspiracyBoard
          caseData={selectedCase}
          onBackToMenu={handleBackToFiles}
          onGameEnd={handleGameEnd}
        />
      );
    
    case 'result': {
      if (!selectedCase || !gameResult) return null;
      const currentCaseIndex = allCases.findIndex(c => c.id === selectedCase.id);
      const hasNextCase = currentCaseIndex < allCases.length - 1;
      return (
        <VictoryScreenModal
          caseData={selectedCase}
          isVictory={gameResult.isVictory}
          sanityRemaining={gameResult.sanityRemaining}
          connectionsFound={gameResult.connectionsFound}
          credibilityStats={gameResult.credibilityStats}
          onNextCase={handleNextCase}
          onRetry={handleRetry}
          onBackToMenu={handleBackToFiles}
          hasNextCase={hasNextCase}
        />
      );
    }
    
    case 'gameover':
      return (
        <GameOverScreen
          onRetry={handleRetry}
          onBackToMenu={handleBackToFiles}
        />
      );
    
    default:
      return <MainMenu onStartGame={handleStartGame} />;
  }
};

export default Index;
