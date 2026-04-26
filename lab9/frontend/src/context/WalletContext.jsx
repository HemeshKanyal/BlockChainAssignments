import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import ABI from "../contracts/abi.json";
import { CONTRACT_ADDRESS, SEPOLIA_CHAIN_ID, SEPOLIA_NETWORK, TOKEN_IDS } from "../contracts/config";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [inventory, setInventory] = useState({});
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [chainOk, setChainOk] = useState(false);

  // Check and switch to Sepolia
  const ensureSepolia = useCallback(async () => {
    try {
      const currentChain = await window.ethereum.request({ method: "eth_chainId" });
      if (currentChain !== SEPOLIA_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
        } catch (switchErr) {
          if (switchErr.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [SEPOLIA_NETWORK],
            });
          } else {
            throw switchErr;
          }
        }
      }
      setChainOk(true);
      return true;
    } catch (err) {
      setError("Please switch to Sepolia testnet");
      setChainOk(false);
      return false;
    }
  }, []);

  // Fetch player inventory from contract
  const fetchInventory = useCallback(async (contractInstance, userAddress) => {
    try {
      const ids = [TOKEN_IDS.GOLD, TOKEN_IDS.SILVER, TOKEN_IDS.SWORD, TOKEN_IDS.SHIELD, TOKEN_IDS.CROWN, TOKEN_IDS.TROPHY];
      const addresses = ids.map(() => userAddress);
      const balances = await contractInstance.balanceOfBatch(addresses, ids);
      
      const inv = {};
      ids.forEach((id, i) => {
        inv[id] = Number(balances[i]);
      });
      setInventory(inv);
      return inv;
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
      return {};
    }
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask not found! Please install MetaMask.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const ok = await ensureSepolia();
      if (!ok) {
        setIsConnecting(false);
        return;
      }

      const browserProvider = new BrowserProvider(window.ethereum);
      const userSigner = await browserProvider.getSigner();
      const userAddress = await userSigner.getAddress();
      const gameContract = new Contract(CONTRACT_ADDRESS, ABI, userSigner);

      setProvider(browserProvider);
      setSigner(userSigner);
      setAccount(userAddress);
      setContract(gameContract);

      await fetchInventory(gameContract, userAddress);
    } catch (err) {
      console.error("Connect error:", err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  }, [ensureSepolia, fetchInventory]);

  // Mint any item (for shop)
  const mintItem = useCallback(async (tokenId, amount) => {
    if (!contract || !account) throw new Error("Not connected");
    const tx = await contract.mint(account, tokenId, amount);
    await tx.wait();
    await fetchInventory(contract, account);
    return tx;
  }, [contract, account, fetchInventory]);

  // Mint trophy NFT
  const mintTrophy = useCallback(async () => {
    if (!contract || !account) throw new Error("Not connected");
    const tx = await contract.mint(account, TOKEN_IDS.TROPHY, 1);
    await tx.wait();
    await fetchInventory(contract, account);
    return tx;
  }, [contract, account, fetchInventory]);

  // Refresh inventory
  const refreshInventory = useCallback(async () => {
    if (contract && account) {
      await fetchInventory(contract, account);
    }
  }, [contract, account, fetchInventory]);

  // Disconnect
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setInventory({});
    setChainOk(false);
  }, []);

  // Listen for account/chain changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [account, connectWallet, disconnectWallet]);

  const value = {
    account,
    provider,
    signer,
    contract,
    inventory,
    isConnecting,
    error,
    chainOk,
    connectWallet,
    disconnectWallet,
    mintItem,
    mintTrophy,
    refreshInventory,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}
