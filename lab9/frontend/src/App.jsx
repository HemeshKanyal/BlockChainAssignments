import { useState } from "react";
import { useWallet } from "./context/WalletContext";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Inventory from "./components/Inventory";
import Shop from "./components/Shop";
import GameArena from "./components/GameArena";

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const { account } = useWallet();

  const handleNavigate = (page) => {
    // Only allow protected pages if connected
    if (["inventory", "game", "shop"].includes(page) && !account) {
      return;
    }
    setCurrentPage(page);
  };

  return (
    <>
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      
      {currentPage === "landing" && (
        <Landing onNavigate={handleNavigate} />
      )}
      {currentPage === "shop" && account && (
        <Shop />
      )}
      {currentPage === "inventory" && account && (
        <Inventory />
      )}
      {currentPage === "game" && account && (
        <GameArena onNavigate={handleNavigate} />
      )}
    </>
  );
}

export default App;
