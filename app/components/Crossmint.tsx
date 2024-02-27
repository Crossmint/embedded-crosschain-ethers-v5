"use client";

import React, { useState } from "react";
import { CrossmintPaymentElement } from "@crossmint/client-sdk-react-ui";
import { Blockchain } from "@crossmint/common-sdk-base";
import { ethers } from "ethers";
import Minting from "./Minting";

type CrossmintProps = {
  signer: ethers.providers.JsonRpcSigner;
  accounts: string[];
};

const Crossmint: React.FC<CrossmintProps> = ({ signer, accounts }) => {
  const [orderIdentifier, setOrderIdentifier] = useState<string | null>(null);
  const [network, setNetwork] = useState<Blockchain>("ethereum");

  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;
  const collectionId = process.env.NEXT_PUBLIC_COLLECTION_ID as string;
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT as string;

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
                const response = await signer.sendTransaction({
                  ...transaction,
                  type: transaction.type!,
                });

                return response.hash;
              },
              supportedChains: ["arbitrum", "ethereum", "optimism"],
              chain: network,
              handleChainSwitch: async (chain) => {
                const networkChainId = chain === "ethereum" ? 5 : 421613;
                // await (window as any).ethereum.request({
                //   method: "wallet_switchEthereumChain",
                //   params: [{ chainId: ethers.toBeHex(11155111) }],
                // });

                setNetwork(chain);
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
