
import Image from 'next/image'
import { Icon } from '@iconify/react';

export default function Footer() {
  return (
    <footer className='py-6 px-4 bg-dark relative'>
      <div className='w-32 h-24 p-4 relative'>
        <Image src="/images/footer_logo.png" alt='match-making logo' fill className='absolute' />
      </div>
      <p className='w-1/2 py-4'>
          Africa Tech Invest est une initiative panafricaine qui offre l’opportunité au secteur privé de soutenir de manière concrète et innovante le secteur public.
      </p>
    </footer>
  );
}
