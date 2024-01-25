import React from "react";
import Image from "next/image";

const CollectionInfo: React.FC = () => {
  return (
    <>
      <div className="sm:col-span-2 flex flex-col">
        <Image
          src="/assets/ninjanaut.png"
          width={500}
          height={500}
          className="rounded-lg shrink"
          alt="nft collection image"
          priority={true}
        />
        <div className="justify-between p-5 my-6 space-y-3 rounded-lg border">
          <p className="text-sm text-black font-bold">
            This is a test collection
          </p>
          <p className="text-sm text-black ">
            You can test out the purchase experience by using the test credit
            card below and enter random information for other payment details.
          </p>
          <div className="w-full p-2 border rounded-lg">
            <div className="cursor-pointer flex items-start gap-1 text-black justify-between">
              <p className="text-black text-sm">4242 4242 4242 4242</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionInfo;
