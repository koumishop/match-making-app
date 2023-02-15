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
            <Icon icon="mdi:user-circle-outline" width={35} className='hidden md:text-white' />
            <Icon icon="mdi:user-circle-outline" width={25} className='mr-1 md:hidden text-white' />
            <div className='text-xs md:hidden'><span className='font-extrabold'>{ user.firstName }</span>{user.company? <span> -<span className='font-extrabold'>{ ` ${user.company}` }</span></span> : ""}</div>
            <div className='hidden md:px-1'>Bonjour <span className='font-extrabold'>{ user.firstName }</span>{user.company? <span> -<span className='font-extrabold'>{ ` ${user.company}` }</span></span> : ""}</div>
            <button onClick={handleLogOut} className='hidden md:border md:border-primary md:rounded-xl md:bg-primary hover:bg-opacity-0 md:px-2 md:ml-4'>Déconnexion</button>
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
