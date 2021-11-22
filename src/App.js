import React from "react";

import "./styles/App.css";

const App = () => {
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <a
            className="footer-text"
            href="https://eneaxharja.com"
            target="_blank"
            rel="noreferrer"
          >
            © {new Date().getFullYear()} Enea Xharja
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
