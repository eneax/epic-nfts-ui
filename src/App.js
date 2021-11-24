import React from "react";
import { ethers } from "ethers";

import "./styles/App.css";
import { CONTRACT_ADDRESS } from "./utils/constants";
import myEpicNft from "./utils/MyEpicNFT.json";

const App = () => {
  // State variable we use to store our user's public wallet
  const [currentAccount, setCurrentAccount] = React.useState("");
  const [totalMintCount, setTotalMintCount] = React.useState(0);

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

      // Setup listener! In case where a user connected their wallet for the first time
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  // Setup listener
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        const chainId = await ethereum.request({ method: "eth_chainId" });
        console.log("Connected to chain " + chainId);

        // String, hex code of the chainId of the Rinkeby test network
        const rinkebyChainId = "0x4";
        if (chainId !== rinkebyChainId) {
          alert("You are not connected to the Rinkeby Test Network!");
        }

        // Capture event when contract throws it
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(
            `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
        });

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
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

        let totalMinted = await connectedContract.getTotalNFTsMintedSoFar();
        setTotalMintCount(totalMinted);

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

  const getTotalNFTsMintedSoFar = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let totalMinted = await connectedContract.getTotalNFTsMintedSoFar();
        setTotalMintCount(totalMinted);
        console.log(`Total NFTs Minted: ${totalMinted}`);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
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

        // Setup listener! In case a user ALREADY had their wallet connected + authorized
        setupEventListener();
      } else {
        console.log("No authorized account found");
      }
    };

    checkIfWalletIsConnected();
    getTotalNFTsMintedSoFar();
  }, []);

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <button
      onClick={askContractToMintNft}
      className="cta-button connect-wallet-button"
    >
      Mint NFT
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
          <p className="gradient-text">
            {Number(totalMintCount)}/50 NFTs minted so far
          </p>
          {currentAccount === ""
            ? renderNotConnectedContainer()
            : renderMintUI()}
        </div>
        <div className="footer-container">
          <a
            className="footer-text"
            href="https://testnets.opensea.io/collection/squarenft-yunfx0g2ar"
            target="_blank"
            rel="noreferrer"
          >
            🌊 View Collection on OpenSea
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
