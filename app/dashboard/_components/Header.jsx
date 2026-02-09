import React from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

function Header() {
  return (
    <div className="flex justify-between items-center p-5 shadow-md">
      <Image
        src="/m_Logo.svg"
        width={40}
        height={40}
        alt="Application logo"
      />
      <UserButton />
    </div>
  );
}

export default Header;
