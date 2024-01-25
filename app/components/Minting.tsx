import React from "react";
import Image from "next/image";
import { useCrossmintEvents } from "@crossmint/client-sdk-react-ui";

interface MintingProps {
  orderIdentifier: string;
}

const Minting: React.FC<MintingProps> = ({ orderIdentifier }) => {
  const [status, setStatus] = React.useState<string>("pending"); // ["pending", "success", "failure"]
  const [result, setResult] = React.useState<any>(null);
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT as string;
  const { listenToMintingEvents } = useCrossmintEvents({
    environment: environment,
  });

  if (status === "pending") {
    listenToMintingEvents({ orderIdentifier }, (event) => {
      switch (event.type) {
        case "transaction:fulfillment.succeeded":
          setStatus("success");
          setResult(event.payload);
          break;
        case "transaction:fulfillment.failed":
          setStatus("failure");
          break;
        default:
          break;
      }
      console.log(event.type, ":", event);
    });
  }

  return (
    <>
      <div className="text-black font-mono p-5 text-center">
        {status === "pending" && (
          <>
            <h3>Minting your NFT...</h3>
            <Image
              src="/assets/sphere.gif"
              width={256}
              height={256}
              className="shrink mx-auto mt-10"
              alt="processing animation"
            />
            This may take up to a few minutes
          </>
        )}
        {status === "success" && (
          <>
            <h3>NFT Minted Successfully!</h3>
            <div className="mt-10">
              <a
                target="_blank"
                className="block bg-[#2081e2] rounded-lg mt-3 p-3 text-white"
                href={`https://testnets.opensea.io/assets/mumbai/${result?.contractAddress}/${result?.tokenIds[0]}`}
              >
                View on OpenSea
              </a>
              <a
                target="_blank"
                className="block bg-[#663399] rounded-lg mt-3 p-3 text-white"
                href={`https://mumbai.polygonscan.com/tx/${result?.txId}`}
              >
                View on Polygonscan
              </a>
              <a
                target="_blank"
                className="block bg-[#81feab] rounded-lg mt-3 p-3 text-black"
                href={`https://staging.crossmint.com/user/collection/poly:${result?.contractAddress}:${result?.tokenIds[0]}`}
              >
                View in Crossmint
              </a>
            </div>
          </>
        )}
        {status === "failure" && (
          <>
            <h3>Failed to Mint NFT</h3>
            <p>
              Something went wrong. You will be refunded if the mint cannot be
              fulfilled successfully.
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default Minting;
