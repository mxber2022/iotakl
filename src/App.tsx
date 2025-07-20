import { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/pages/HomePage';
import { CredentialsPage } from './components/pages/CredentialsPage';
import { IssuePage } from './components/pages/IssuePage';
import { DIDPage } from './components/pages/DIDPage';
import { WalletDashboard } from './components/wallet/WalletDashboard';
import { CredentialViewer } from './components/credentials/CredentialViewer';
import { credentials, achievements as allAchievements } from './data/credentialData';
import { Achievement } from './types';
import { createNetworkConfig, IotaClientProvider, WalletProvider } from '@iota/dapp-kit';
import { getFullnodeUrl } from '@iota/iota-sdk/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@iota/dapp-kit/dist/index.css';

const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
});
const queryClient = new QueryClient();

type Page = 'home' | 'credentials' | 'issue'  | 'wallet' | 'did';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentCredential, setCurrentCredential] = useState<string | null>(null);
  const [verifiedCredentials, setVerifiedCredentials] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setCurrentCredential(null);
  };

  const handleCredentialSelect = (credentialId: string) => {
    setCurrentCredential(credentialId);
  };

  const handleCredentialVerify = (credentialId: string) => {
    setVerifiedCredentials(prev => prev.includes(credentialId) ? prev : [...prev, credentialId]);
    // Award achievement if credential has an achievement and user doesn't already have it
    const credential = credentials.find(c => c.id === credentialId);
    if (credential && credential.achievement) {
      const achievement = allAchievements.find(a => a.name.toLowerCase() === credential.achievement!.toLowerCase() || a.id === credential.achievement!.toLowerCase().replace(/ /g, '-'));
      if (achievement && !achievements.some(a => a.id === achievement.id)) {
        setAchievements(prev => [...prev, { ...achievement, unlockedAt: new Date() }]);
      }
    }
    setCurrentCredential(null);
    setCurrentPage('wallet');
  };

  // Show credential viewer if a credential is selected
  if (currentCredential) {
    const credential = credentials.find(c => c.id === currentCredential);
    if (credential) {
      return (
        <CredentialViewer
          credential={credential}
          onVerify={handleCredentialVerify}
          onBack={() => setCurrentCredential(null)}
          verifiedCredentials={verifiedCredentials}
        />
      );
    }
  }

  // Calculate total points from verified credentials
  const totalPoints = verifiedCredentials
    .map(credentialId => credentials.find(c => c.id === credentialId)?.points || 0)
    .reduce((sum, pts) => sum + pts, 0);

  // Placeholder for streak logic (e.g., number of unique days with verified credentials)
  const currentStreak = 0; // TODO: Implement streak calculation based on completion dates

  return (
    <QueryClientProvider client={queryClient}>
      <IotaClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <div className="min-h-screen bg-black flex flex-col">
            <Header currentPage={currentPage} onNavigate={handleNavigate} />
            {currentPage === 'home' && (
              <HomePage onNavigate={handleNavigate} />
            )}
            {/* {currentPage === 'credentials' && (
              <CredentialsPage />
            )} */}
            {currentPage === 'issue' && (
              <IssuePage />
            )}
            {currentPage === 'did' && (
              <DIDPage />
            )}
            {currentPage === 'wallet' && (
              <WalletDashboard 
                onCredentialSelect={handleCredentialSelect} 
                verifiedCredentials={verifiedCredentials}
                achievements={achievements}
                totalPoints={totalPoints}
                currentStreak={currentStreak}
              />
            )}
            <Footer />
          </div>
        </WalletProvider>
      </IotaClientProvider>
    </QueryClientProvider>
  );
}

export default App;