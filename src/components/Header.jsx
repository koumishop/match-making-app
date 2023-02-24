import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Image from 'next/image'
import { Icon } from '@iconify/react';

export default function Header({hasSignedIn,}) {
  const [user, setUser] = useState({});
  const router = useRouter();
  useEffect(() => {
    // Perform localStorage action
    setUser({id:localStorage.getItem('id'), firstName:localStorage.getItem('firstName'), company:localStorage.getItem('company')});
  }, [])

const handleLogOut = ()=>{
  console.log(`${user.firstName} logged out`);
  window.localStorage.clear();
  router.push('/');
  
};

  return (
    <nav className='p-3 md:py-6 md:px-4 bg-dark flex relative justify-between'>
      <div className='w-1/4 md:w-1/6 p-4 relative'>
        <Image src="/images/header_logo.png" alt='match-making logo' fill className='absolute' />
      </div>
      {hasSignedIn?
          <div className='w-[60%] md:w-[40%] flex justify-end items-center '>
            <Icon icon="mdi:user-circle-outline" color='#FFFFFF' width={35} className='text-white' />
            <div className='text-xs md:text-base md:px-1 flex text-white'><span className='hidden md:flex md:mr-1'>Bonjour </span> <span className='font-extrabold mr-1'>{ user.firstName }</span>{user.company? <span> - <span className='font-extrabold'>{ ` ${user.company}` }</span></span> : ""}</div>
            <button onClick={handleLogOut} className='flex md:border md:border-primary md:rounded-xl md:bg-primary hover:bg-opacity-0 md:px-2 md:ml-4'><span className='hidden md:flex md:text-white'>Déconnexion</span></button>
            <button onClick={handleLogOut} className='ml-4 md:hidden'>
              <Icon icon="ic:baseline-logout" width={25} className='md:hidden text-white' />
            </button>
          </div> 
        :
          <></>
        }
    </nav>
  );
}
