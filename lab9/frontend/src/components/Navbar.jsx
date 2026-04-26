import { useWallet } from "../context/WalletContext";
import "./Navbar.css";

export default function Navbar({ currentPage, onNavigate }) {
  const { account, connectWallet, disconnectWallet, isConnecting } = useWallet();

  const truncateAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-brand" onClick={() => onNavigate("landing")}>
        <span className="logo-icon">⚔️</span>
        <h1>AWESOME ARENA</h1>
      </div>

      <div className="navbar-nav">
        <button
          className={`nav-link ${currentPage === "landing" ? "active" : ""}`}
          onClick={() => onNavigate("landing")}
          id="nav-home"
        >
          Home
        </button>
        {account && (
          <>
            <button
              className={`nav-link ${currentPage === "shop" ? "active" : ""}`}
              onClick={() => onNavigate("shop")}
              id="nav-shop"
            >
              🏪 Shop
            </button>
            <button
              className={`nav-link ${currentPage === "inventory" ? "active" : ""}`}
              onClick={() => onNavigate("inventory")}
              id="nav-inventory"
            >
              Inventory
            </button>
            <button
              className={`nav-link ${currentPage === "game" ? "active" : ""}`}
              onClick={() => onNavigate("game")}
              id="nav-game"
            >
              Battle
            </button>
          </>
        )}
      </div>

      <div className="navbar-wallet">
        {account ? (
          <>
            <div className="wallet-address">
              <span className="wallet-dot"></span>
              {truncateAddress(account)}
            </div>
            <button className="btn btn-danger" onClick={disconnectWallet} id="btn-disconnect">
              Disconnect
            </button>
          </>
        ) : (
          <button
            className="btn btn-primary"
            onClick={connectWallet}
            disabled={isConnecting}
            id="btn-connect-nav"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </div>
    </nav>
  );
}
