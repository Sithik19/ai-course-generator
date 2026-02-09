import React from 'react';
import Image from "next/image";
import { Button } from '@/components/ui/button';
function Header() {
  return (
    <div className='flex justify-between p-5 shadow-md'> 
      <Image src={"/logo.svg"} width={135} height={110} alt="Logo"/>
      <Button  className="bg-blue-500 hover:bg-blue-600" >Get Started</Button>
    </div>
  )
}

export default Header
