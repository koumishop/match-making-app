import { Icon } from '@iconify/react';
import { Montserrat } from '@next/font/google';
import axios, { AxiosError, isAxiosError } from 'axios'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

const montserrat = Montserrat({ subsets: ['latin'] });

export default function Appointments({ appointment, token, getData}) {
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
    
    const handleAppointmentValidation = (id) => {
        const appointmentId = id;
        console.log("appointment id : ", appointmentId, " token: ", token);
        axios.put(`${process.env.NEXT_PUBLIC_API_URL}/appointments/validate/${appointmentId}`, { headers:{ 'x-access-token': `${token}` } })
        .then((response)=>{
            console.dir(response);
            getData();
        })
        .catch((error)=>console.dir(error))
        
    }

    const getTimeStart =  (appointmentDate)=>{
        let dateTime= new Date(appointmentDate), hour = dateTime.getUTCHours()+1, minutes = dateTime.getUTCMinutes();
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${hour < 10 ? `0${hour}` : hour}:${minutes < 10 ? `0${minutes}` : minutes}`
    }
    const getTimeEnd =  (appointmentDate)=>{
        let dateTime= new Date(appointmentDate), hour = dateTime.getUTCHours()+1, minutes = dateTime.getUTCMinutes()+20;
        return `${hour < 10 ? `0${hour}` : hour}:${minutes < 10 ? `0${minutes}` : minutes}`
    }
    const appointmentTimeStart = getTimeStart(appointment.appointmentTime);
    const appointmentTimeEnd = getTimeEnd(appointment.appointmentTime);
    //appointment.appointmentTime

  return (
    <div className='md:w-full mb-4'>
        <div className={`${montserrat.className} font-medium w-[100%] text-secondary flex`}>
            <div className='p-2 w-1/4 md:w-[21%] md:p-3 md:flex border border-primary'>
                <Icon icon="material-symbols:nest-clock-farsight-analog-outline-rounded" width={24} className='text-primary mr-2' />
                {`${appointmentTimeStart} - ${appointmentTimeEnd}`}
            </div>
            <div className='p-2 w-[25%] md:w-[21%] md:p-3 md:flex border border-primary'>
                <Icon icon="material-symbols:work-outline" width={24} className='text-primary mr-2' />
                {isLoading?'En cours de chargement': publicCompanyData.companyName}
            </div>
            <div className='p-2  w-[30%] md:w-[27%] md:p-3 md:flex border border-primary'>
                <Icon icon="material-symbols:work-outline" width={24} className='text-primary mr-2' />
                {isLoading?'En cours de chargement': privateCompanyData.companyName}
            </div>
            <div className='md:hidden w-[15%] bg-primary border border-primary text-white flex justify-start'>
                <button type='button' className='w-full border border-primary bg-primary font-semibold p-3 hover:bg-opacity-50' onClick={()=>handleAppointmentValidation(appointment.id)}><Icon icon="mdi:check-bold" width={24}/></button>
            </div>            
            <div className='hidden bg-primary md:border md:border-primary md:text-white md:flex md:flex-col md:justify-start md:space-y-2'>
                <button type='button' className='w-full border border-primary bg-primary font-semibold p-3 hover:bg-opacity-50' onClick={()=>handleAppointmentValidation(appointment.id)}>confirmer le rendez-vous</button>
            </div>
        </div>
    </div>
  );
}
