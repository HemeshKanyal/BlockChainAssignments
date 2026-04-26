export const CONTRACT_ADDRESS = "0x793BE0e2A0BB9F7434C145390b488e6968ceF149";

export const SEPOLIA_CHAIN_ID = "0xaa36a7";
export const SEPOLIA_CHAIN_ID_DECIMAL = 11155111;

export const SEPOLIA_NETWORK = {
  chainId: SEPOLIA_CHAIN_ID,
  chainName: "Sepolia Testnet",
  nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://rpc.sepolia.org"],
  blockExplorerUrls: ["https://sepolia.etherscan.io"],
};

// Token IDs matching the smart contract
export const TOKEN_IDS = {
  GOLD: 0,
  SILVER: 1,
  SWORD: 2,
  SHIELD: 3,
  CROWN: 4,
  TROPHY: 5,
};

// Token metadata for display
export const TOKEN_META = {
  0: { name: "Gold Coin", type: "Currency", rarity: "Common", image: "/assets/gold.png", color: "#ffd700" },
  1: { name: "Silver Coin", type: "Currency", rarity: "Common", image: "/assets/silver.png", color: "#c0c0c0" },
  2: { name: "Sword", type: "Weapon", rarity: "Rare", attack: 50, image: "/assets/sword.png", color: "#4da6ff" },
  3: { name: "Shield", type: "Armor", rarity: "Rare", defense: 40, image: "/assets/shield.png", color: "#4da6ff" },
  4: { name: "Crown", type: "Collectible", rarity: "Epic", image: "/assets/crown.png", color: "#a855f7" },
  5: { name: "Champion Trophy", type: "Prize", rarity: "Legendary", image: "/assets/trophy.png", color: "#ff8c00" },
};

export const RARITY_COLORS = {
  Common: "#9ca3af",
  Rare: "#3b82f6",
  Epic: "#a855f7",
  Legendary: "#f97316",
};
