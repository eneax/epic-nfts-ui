import React from "react";
import { ethers } from "ethers";

import "./styles/App.css";
import { CONTRACT_ADDRESS } from "./utils/constants";
import myEpicNft from "./utils/MyEpicNFT.json";

const App = () => {
  // State variable we use to store our user's public wallet
  const [currentAccount, setCurrentAccount] = React.useState("");

  const checkIfWalletIsConnected = async () => {
    // Make sure we have access to window.ethereum
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    // Check if we're authorized to access the user's wallet
    const accounts = await ethereum.request({ method: "eth_accounts" });

    // User can have multiple authorized accounts, we grab the first one if its there
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      // Request access to account
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      // Print out public address once we authorize Metamask
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        // "Provider" is what we use to actually talk to Ethereum nodes
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        // Creates connection to our contract
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let nftTransaction = await connectedContract.makeAnEpicNFT();

        console.log("Mining...please wait.");
        await nftTransaction.wait();

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTransaction.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  React.useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button
              onClick={askContractToMintNft}
              className="cta-button connect-wallet-button"
            >
              Mint NFT
            </button>
          )}
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
