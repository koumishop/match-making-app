import axios, { AxiosError, isAxiosError } from 'axios';
import { Icon } from '@iconify/react';
import { Montserrat } from '@next/font/google';
import { useEffect, useState } from 'react';

const montserrat = Montserrat({ subsets: ['latin'] });
const meetPlace = "Salon Congo";

export default function Appointments({ appointment, user}) {
    const [publicCompanyData, setPublicCompanyData] = useState({});
    const [privateCompanyData, setPrivateCompanyData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
        
    useEffect(() => {
        // Perform localStorage action
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/companies/${appointment.publicCompanyId}`, { headers:{ 'x-access-token': `${localStorage.getItem('token')}` } })
            .then((response)=>{
                setPublicCompanyData(response.data);
                setIsLoading(false);
                
            }).catch((error)=>{
                setIsLoading(false);
                console.log('**** error: ', error);
            });

            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/companies/${appointment.privateCompanyId}`, { headers:{ 'x-access-token': `${localStorage.getItem('token')}` } })
            .then((response)=>{
                setPrivateCompanyData(response.data);
                setIsLoading(false);
                
            }).catch((error)=>{
                setIsLoading(false);
                console.log('**** error: ', error);
            });    

    }, []);

    const getTimeStart =  (appointmentDate)=>{
        let dateTime= new Date(appointmentDate), hour = dateTime.getUTCHours()+1, minutes = dateTime.getUTCMinutes();
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${hour}:${minutes}`
    }
    const getTimeEnd =  (appointmentDate)=>{
        let dateTime= new Date(appointmentDate), hour = dateTime.getUTCHours()+1, minutes = dateTime.getUTCMinutes()+20;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${hour}:${minutes}`
    }
    const appointmentTimeStart = getTimeStart(appointment.appointmentTime);
    const appointmentTimeEnd = getTimeEnd(appointment.appointmentTime);
    //appointment.appointmentTime
    console.log("***** data : ", privateCompanyData);
  return (
    <div className='w-full mb-4'>
        <div className={`${montserrat.className} font-medium w-full text-secondary flex`}>
            <div className='p-2 md:w-[21%] md:p-3 md:flex border border-primary'>
                <Icon icon="material-symbols:nest-clock-farsight-analog-outline-rounded" width={24} className='text-primary mr-2' />
                {`${appointmentTimeStart} - ${appointmentTimeEnd}`}
            </div>
            <div className='p-2 md:w-[27%] md:p-3 md:flex border border-primary'>
                <Icon icon="material-symbols:work-outline" width={24} className='text-primary mr-2' />
                {isLoading?<span> En cours de chargement ... </span>:user.companyType==='PUBLIC'? privateCompanyData.companyName:publicCompanyData.companyName}
            </div>
            <div className='p-2 md:p-3 md:flex border border-primary'>
                <Icon icon="ic:outline-place" width={24} className='text-primary mr-2' />
                {meetPlace}
            </div>
            {user.companyType==='PUBLIC'?
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
