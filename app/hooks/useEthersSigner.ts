"use client";

import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum: any;
  }
}

const useEthersSigner = () => {
  const [accounts, setAccounts] = useState([]);
  const signerRef = useRef<ethers.providers.JsonRpcSigner>();

  useEffect(() => {
    const initializeEthers = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setAccounts(accounts);

          const provider = new ethers.providers.Web3Provider(window.ethereum);

          const signer = provider.getSigner();
          signerRef.current = signer;
        } catch (error) {
          console.error("User denied account access", error);
        }
      } else {
        console.log("MetaMask is not installed!");
      }
    };

    initializeEthers();
  }, []);

  return { signer: signerRef.current, accounts };
};

export default useEthersSigner;
