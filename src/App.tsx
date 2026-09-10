import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { BoardView } from './components/BoardView';
import { TemplatesView } from './components/TemplatesView';
import { ClassroomsView } from './components/ClassroomsView';
import { PricingView } from './components/PricingView';
import { SettingsView } from './components/SettingsView';
import { AdminView } from './components/AdminView';

// Modals
import { AuthModal } from './components/AuthModal';
import { CreateBoardModal } from './components/CreateBoardModal';
import { ShareModal } from './components/ShareModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { ReportModal } from './components/ReportModal';

const AppContent: React.FC = () => {
  const { 
    currentView, 
    setCurrentView,
    activeBoardId, 
    isAuthModalOpen, 
    setIsAuthModalOpen,
    isCreateBoardOpen, 
    setIsCreateBoardOpen,
    isShareModalOpen, 
    setIsShareModalOpen,
    isAiModalOpen, 
    setIsAiModalOpen,
    isAnalyticsOpen, 
    setIsAnalyticsOpen,
    isReportModalOpen,
    setIsReportModalOpen
  } = useApp();

  const [showSplash, setShowSplash] = React.useState<boolean>(() => {
    // Only show splash screen once per browser session
    return sessionStorage.getItem('lawhati_splash_dismissed') !== 'true';
  });

  const handleDismissSplash = () => {
    sessionStorage.setItem('lawhati_splash_dismissed', 'true');
    setShowSplash(false);
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {showSplash && (
        <SplashScreen onComplete={handleDismissSplash} />
      )}

      {/* Landing Page View */}
      {currentView === 'landing' ? (
        <>
          <Navbar />
          <LandingPage />
        </>
      ) : activeBoardId ? (
        /* Active Interactive Board View */
        <>
          <Navbar />
          <BoardView />
        </>
      ) : (
        /* Dashboard & App Views with Sidebar */
        <div className="flex-1 flex flex-col">
          <Navbar />
          
          <div className="flex-1 flex">
            {/* Desktop Navigation Sidebar */}
            <Sidebar />

            {/* Main Application Content Container */}
            <main className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
              {currentView === 'dashboard' && <DashboardView />}
              {currentView === 'templates' && <TemplatesView />}
              {currentView === 'classrooms' && <ClassroomsView />}
              {currentView === 'pricing' && <PricingView />}
              {currentView === 'settings' && <SettingsView />}
              {currentView === 'admin' && <AdminView />}
            </main>
          </div>

          {/* Mobile Navigation Dock */}
          <MobileBottomNav />
        </div>
      )}

      {/* Global Modals */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CreateBoardModal isOpen={isCreateBoardOpen} onClose={() => setIsCreateBoardOpen(false)} />
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
      <AiAssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
      <AnalyticsModal isOpen={isAnalyticsOpen} onClose={() => setIsAnalyticsOpen(false)} />
      <ReportModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
