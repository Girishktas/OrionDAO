import type { AppProps } from 'next/app';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@/styles/globals.css';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, sepolia, hardhat],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </WagmiConfig>
  );
}

