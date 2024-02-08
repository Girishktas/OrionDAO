import Head from 'next/head';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  return (
    <>
      <Head>
        <title>OrionDAO - Progressive Consensus Governance</title>
        <meta name="description" content="Decentralized governance with quadratic voting" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-primary-600">OrionDAO</h1>
              </div>
              <div>
                {isConnected ? (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                    <button
                      onClick={() => disconnect()}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => connect()}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">
              Progressive Consensus Governance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fair, transparent, and efficient DAO decision-making powered by quadratic voting and reputation systems
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quadratic Voting</h3>
              <p className="text-gray-600">
                Prevent whale manipulation through quadratic cost curves that ensure fair representation
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Reputation System</h3>
              <p className="text-gray-600">
                Dynamic weighting based on participation, accuracy, and community contribution
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Treasury</h3>
              <p className="text-gray-600">
                Multi-signature with 48-hour timelock for maximum fund security and transparency
              </p>
            </div>
          </div>

          {isConnected && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Active Proposals</h3>
              <div className="text-center py-12 text-gray-500">
                <p>No active proposals at the moment</p>
                <button className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition">
                  Create New Proposal
                </button>
              </div>
            </div>
          )}
        </div>

        <footer className="bg-white border-t mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-gray-600">
              © 2024 OrionDAO. Built on Ethereum with ❤️
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}

