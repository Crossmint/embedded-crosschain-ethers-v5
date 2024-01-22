"use client";

import React, { useState, useEffect } from "react";
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
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [signer, setSigner] = useState<any>();
  const [transactionHash, setTransactionHash] = useState("");

  const projectId = process.env.NEXT_PUBLIC_CROSSMINT_PROJECT_ID as string;
  const collectionId = process.env
    .NEXT_PUBLIC_CROSSMINT_COLLECTION_ID as string;
  const environment = process.env.NEXT_PUBLIC_CROSSMINT_ENVIRONMENT as string;

  useEffect(() => {
    const initializeEthers = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          // Request account access
          await window.ethereum.request({ method: "eth_requestAccounts" });

          // Initialize the provider
          const provider = new ethers.providers.Web3Provider(window.ethereum);

          // Get the signer
          const signer = provider.getSigner();

          console.log("Ethers provider and signer initialized");
          return { provider, signer };
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
              address: "0x6C3b3225759Cbda68F96378A9F0277B4374f9F06", // metamask wallet address
              signAndSendTransaction: async (transaction) => {
                console.log("signAndSendTransaction called");
                console.log("transaction object:", transaction);
                const txn = {
                  to: "0xa105C311fA72b8Fb78c992EcbDb8b02Ea5bd394d",
                  from: "0x6C3b3225759Cbda68F96378A9F0277B4374f9F06",
                  value: BigInt(1000000000000000),
                };
                console.log("about to send request");
                const { hash } = await window.ethereum.request({
                  method: "eth_sendTransaction",
                  params: [transaction],
                });
                console.log("about to return hash");
                return hash;
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
