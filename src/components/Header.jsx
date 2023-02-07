import { useEffect, useState } from 'react';
import Image from 'next/image'
import { Icon } from '@iconify/react';

export default function Header({hasSignedIn}) {
  const [user, setUser] = useState({});
  useEffect(() => {
    // Perform localStorage action
    setUser({id:localStorage.getItem('id'), firstName:localStorage.getItem('firstName'), companyName:'Regideso'})
  }, [])

const handleLogOut = ()=>{
  console.log("logged out");
  window.localStorage.clear;
  
};

  return (
    <nav className='py-6 px-4 bg-dark flex relative justify-between'>
      <div className='w-1/6 p-4 relative'>
        <Image src="/images/header_logo.png" alt='match-making logo' fill className='absolute' />
      </div>
      {hasSignedIn?
          <div className='w-1/3 flex justify-end items-center '>
            <Icon icon="mdi:user-circle-outline" width={35} className='text-white' />
            <div className='px-1'>Bonjour <span className='font-extrabold'>{ user.firstName }</span> - <span className='font-extrabold'>{ user.companyName }</span></div>
            <button onClick={handleLogOut} className='border border-primary rounded-xl bg-primary hover:bg-opacity-0 px-2 ml-4'>Déconnexion</button>
          </div> 
        :
          <></>
        }
    </nav>
  );
}
