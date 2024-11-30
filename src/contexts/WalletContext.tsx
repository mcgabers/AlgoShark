'use client'

import { createContext, useContext, useState, useEffect } from 'react';

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Safe storage access with try-catch
  const getStorageItem = (key: string): string | null => {
    try {
      return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    } catch (error) {
      console.warn('Storage access error:', error);
      return null;
    }
  };

  const setStorageItem = (key: string, value: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('Storage write error:', error);
    }
  };

  useEffect(() => {
    // Initialize wallet state from storage
    const storedConnected = getStorageItem('walletConnected') === 'true';
    const storedAddress = getStorageItem('walletAddress');
    
    setIsConnected(storedConnected);
    setWalletAddress(storedAddress);
  }, []);

  const connect = async () => {
    try {
      // Simulated wallet connection for testing
      const address = '0x123...abc';
      setWalletAddress(address);
      setIsConnected(true);
      setStorageItem('walletConnected', 'true');
      setStorageItem('walletAddress', address);
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  };

  const disconnect = () => {
    try {
      setWalletAddress(null);
      setIsConnected(false);
      setStorageItem('walletConnected', 'false');
      setStorageItem('walletAddress', '');
    } catch (error) {
      console.error('Wallet disconnection error:', error);
    }
  };

  return (
    <WalletContext.Provider value={{ isConnected, walletAddress, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
} 