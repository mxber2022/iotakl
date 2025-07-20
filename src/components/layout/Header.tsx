import { Home, Shield, Plus, User, Wallet, Key } from 'lucide-react';
import { useWallets, useConnectWallet, useCurrentAccount, useDisconnectWallet } from '@iota/dapp-kit';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

function formatAddress(address: string) {
  return address.slice(0, 6) + '...' + address.slice(-4);
}

export const Header = ({ currentPage, onNavigate }: HeaderProps) => {
  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-red-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br rounded-xl">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none" className="logo-spin">
                  <circle className="dot dot1" cx="24" cy="8" r="5" fill="#00E5FF"/>
                  <circle className="dot dot2" cx="40" cy="24" r="5" fill="#1DE9B6"/>
                  <circle className="dot dot3" cx="24" cy="40" r="5" fill="#76FF03"/>
                  <circle className="dot dot4" cx="8" cy="24" r="5" fill="#00BCD4"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl brand-text text-white">IOTA PASSPORT</h1>
                <p className="brand-subtitle text-cyan-400">DECENTRALIZED CREDENTIALS</p>
              </div>
            </div>
            {/* Navigation */}
            <nav className="flex items-center space-x-1 bg-neutral-950 border border-cyan-900/30 rounded-xl p-1 overflow-x-auto">
              <button
                onClick={() => onNavigate('home')}
                className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ease-out ${
                  currentPage === 'home'
                    ? 'bg-cyan-900/50 text-white shadow-lg transform scale-[1.02]'
                    : 'text-neutral-400 hover:text-white hover:bg-cyan-900/20 hover:scale-[1.01]'
                }`}
              >
                <Home className={`w-4 h-4 transition-all duration-300 ${
                  currentPage === 'home' ? 'text-white' : 'text-neutral-400'
                }`} />
                <span className="transition-all duration-300">HOME</span>
                {currentPage === 'home' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-cyan-500/20 rounded-xl animate-pulse" />
                )}
              </button>
              <button
                onClick={() => onNavigate('wallet')}
                className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ease-out ${
                  currentPage === 'wallet'
                    ? 'bg-cyan-900/50 text-white shadow-lg transform scale-[1.02]'
                    : 'text-neutral-400 hover:text-white hover:bg-cyan-900/20 hover:scale-[1.01]'
                }`}
              >
                <Wallet className={`w-4 h-4 transition-all duration-300 ${
                  currentPage === 'wallet' ? 'text-white' : 'text-neutral-400'
                }`} />
                <span className="transition-all duration-300">WALLET</span>
                {currentPage === 'wallet' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-cyan-500/20 rounded-xl animate-pulse" />
                )}
              </button>
              {/* <button
                onClick={() => onNavigate('credentials')}
                className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ease-out ${
                  currentPage === 'credentials'
                    ? 'bg-cyan-900/50 text-white shadow-lg transform scale-[1.02]'
                    : 'text-neutral-400 hover:text-white hover:bg-cyan-900/20 hover:scale-[1.01]'
                }`}
              >
                <Shield className={`w-4 h-4 transition-all duration-300 ${
                  currentPage === 'credentials' ? 'text-white' : 'text-neutral-400'
                }`} />
                <span className="transition-all duration-300">CREDENTIALS</span>
                {currentPage === 'credentials' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-cyan-500/20 rounded-xl animate-pulse" />
                )}
              </button> */}
              <button
                onClick={() => onNavigate('issue')}
                className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ease-out ${
                  currentPage === 'issue'
                    ? 'bg-cyan-900/50 text-white shadow-lg transform scale-[1.02]'
                    : 'text-neutral-400 hover:text-white hover:bg-cyan-900/20 hover:scale-[1.01]'
                }`}
              >
                <Plus className={`w-4 h-4 transition-all duration-300 ${
                  currentPage === 'issue' ? 'text-white' : 'text-neutral-400'
                }`} />
                <span className="transition-all duration-300">ISSUE</span>
                {currentPage === 'issue' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-cyan-500/20 rounded-xl animate-pulse" />
                )}
              </button>
              <button
                onClick={() => onNavigate('did')}
                className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ease-out ${
                  currentPage === 'did'
                    ? 'bg-cyan-900/50 text-white shadow-lg transform scale-[1.02]'
                    : 'text-neutral-400 hover:text-white hover:bg-cyan-900/20 hover:scale-[1.01]'
                }`}
              >
                <Key className={`w-4 h-4 transition-all duration-300 ${
                  currentPage === 'did' ? 'text-white' : 'text-neutral-400'
                }`} />
                <span className="transition-all duration-300">DID</span>
                {currentPage === 'did' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-cyan-500/20 rounded-xl animate-pulse" />
                )}
              </button>

            </nav>
          </div>
          {/* Wallet Connect Area */}
          <div className="flex items-center space-x-4">
            {account && account.address ? (
              <div className="relative group">
                <div className="flex items-center space-x-3 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 hover:bg-neutral-900 hover:border-cyan-700 transition-all duration-300 cursor-pointer group-hover:border-cyan-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse group-hover:bg-cyan-400 transition-colors duration-300"></div>
                  <span className="text-white font-semibold text-sm tracking-wide group-hover:text-cyan-300 transition-colors duration-300">
                    {formatAddress(account.address)}
                  </span>
                </div>
                {/* Hover Tooltip */}
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50">
                  <div className="bg-neutral-950 border border-cyan-800 rounded-xl p-3 shadow-2xl animate-scale-in">
                    <div className="text-center mb-3">
                      <div className="text-cyan-400 font-semibold text-sm mb-1">Disconnect Wallet?</div>
                      <div className="text-neutral-400 text-xs">
                        {formatAddress(account.address)}
                      </div>
                    </div>
                    <button
                      onClick={() => disconnect()}
                      className="w-full bg-gradient-to-r from-cyan-900 to-cyan-800 hover:from-cyan-800 hover:to-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm"
                    >
                      Disconnect
                    </button>
                  </div>
                  {/* Arrow pointer */}
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-neutral-950 border-l border-t border-cyan-800 rotate-45"></div>
                </div>
              </div>
            ) : (
              wallets.map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() =>
                    connect(
                      { wallet },
                      {
                        onSuccess: () => console.log('connected'),
                      },
                    )
                  }
                  className="relative inline-flex items-center space-x-2 bg-neutral-950 hover:bg-neutral-900 border border-cyan-900/30 hover:border-cyan-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide overflow-hidden group"
                >
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span>Connect to {wallet.name}</span>
                  {/* Subtle hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/5 to-cyan-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </header>
  );
};