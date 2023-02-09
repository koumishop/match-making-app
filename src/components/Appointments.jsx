import { Icon } from '@iconify/react';
import { Montserrat } from '@next/font/google';

const montserrat = Montserrat({ subsets: ['latin'] });
const meetPlace = "Salon Congo";

export default function Appointments({ appointment, company}) {
  return (
    <div className='w-full my-10'>
        <div className={`${montserrat.className} font-medium w-full text-secondary flex`}>
            <div className='p-3 flex border border-primary'>
                <Icon icon="material-symbols:nest-clock-farsight-analog-outline-rounded" width={24} className='text-primary mr-2' />
                {appointment.appointmentTime}
            </div>
            <div className='p-3 flex border border-primary'>
                <Icon icon="material-symbols:work-outline" width={24} className='text-primary mr-2' />
                {company.companyType==='PUBLIC'? appointment.privateCompanyName:appointment.publicCompanyName}
            </div>
            <div className='p-3 flex border border-primary'>
                <Icon icon="ic:outline-place" width={24} className='text-primary mr-2' />
                {meetPlace}
            </div>
            {company.companyType==='PUBLIC'?
            <div className='p-3 flex'>
                <button type='button' className='w-1/7' onClick={()=>console.log("edit appointment")}><Icon icon="material-symbols:edit" width={24} className='text-primary' /></button>
            </div>
            :
            <></>
            }                            
        </div>
    </div>
  );
}
