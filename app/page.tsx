"use client";

import React from "react";
import CollectionInfo from "./components/CollectionInfo";
import Crossmint from "./components/Crossmint";
import useEthersSigner from "./hooks/useEthersSigner";

const Page: React.FC = () => {
  const { signer, accounts } = useEthersSigner();

  return (
    <div className="container mx-auto max-w-4xl bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-5 sm:gap-4 p-4">
        <CollectionInfo />
        {signer && <Crossmint signer={signer} accounts={accounts} />}
      </div>
    </div>
  );
};

export default Page;
