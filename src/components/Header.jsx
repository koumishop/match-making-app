import Image from 'next/image'
import { Icon } from '@iconify/react';

export default function Header({hasSignedIn}) {
const User = { id:"c7756d9b-69fb-448f-a5a8-c752af05f4b6", firstName:"Randy", companyName:"Regideso" };
const handleLogOut = ()=>{
  alert("logged out");
  
};

  return (
    <nav className='py-6 px-4 bg-dark flexrelative justify-between'>
      <div className='w-1/6 p-4 relative'>
        <Image src="/images/header_logo.png" alt='match-making logo' fill className='absolute' />
      </div>
      {hasSignedIn?
          <div className='w-1/3 flex justify-end items-center '>
            <Icon icon="mdi:user-circle-outline" width={35} className='text-white border' />
            <div className='px-1'>Bonjour <span className='font-extrabold'>{ User.firstName }</span> - <span className='font-extrabold'>{ User.companyName }</span></div>
            <button onClick={handleLogOut} className='border border-primary rounded-xl bg-primary hover:bg-opacity-0 px-2 ml-4'>Déconnexion</button>
          </div> 
        :
          <></>
        }
    </nav>
  );
}
