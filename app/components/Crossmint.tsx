"use client";

import React, { useState, useEffect, useRef } from "react";
import { CrossmintPaymentElement } from "@crossmint/client-sdk-react-ui";
import { ethers } from "ethers";
import Minting from "./Minting";

declare global {
  interface Window {
    ethereum: any;
  }
}

const Crossmint: React.FC = () => {
  const [orderIdentifier, setOrderIdentifier] = useState<string | null>(null);
  const [accounts, setAccounts] = useState([]);
  const signerRef = useRef<ethers.providers.JsonRpcSigner>();

  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;
  const collectionId = process.env.NEXT_PUBLIC_COLLECTION_ID as string;
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT as string;

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

  return (
    <>
      <div className="sm:col-span-3">
        {orderIdentifier === null ? (
          <CrossmintPaymentElement
            projectId={projectId}
            collectionId={collectionId}
            environment={environment}
            paymentMethod="ETH"
            signer={{
              address: accounts[0],
              signAndSendTransaction: async (transaction) => {
                if (!signerRef.current) {
                  throw new Error("Signer is not initialized");
                }

                const response = await signerRef.current.sendTransaction({
                  ...transaction,
                  type: transaction.type!,
                });

                return response.hash;
              },
            }}
            mintConfig={{
              type: "erc-721",
              totalPrice: "0.001",
              _quantity: "1",
            }}
            onEvent={(event) => {
              switch (event.type) {
                case "payment:process.succeeded":
                  console.log(event);
                  setOrderIdentifier(event.payload.orderIdentifier);
                  break;
                default:
                  console.log(event);
                  break;
              }
            }}
          />
        ) : (
          <Minting orderIdentifier={orderIdentifier} />
        )}
      </div>
    </>
  );
};

export default Crossmint;
