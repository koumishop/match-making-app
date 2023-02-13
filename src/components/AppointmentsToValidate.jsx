import { Icon } from '@iconify/react';
import { Montserrat } from '@next/font/google';
import axios, { AxiosError, isAxiosError } from 'axios'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

const montserrat = Montserrat({ subsets: ['latin'] });

export default function Appointments({ appointment, token, getData}) {

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
    <div className='w-full mb-4'>
        <div className={`${montserrat.className} font-medium w-[100%] text-secondary flex`}>
            <div className='w-[21%] p-3 flex border border-primary'>
                <Icon icon="material-symbols:nest-clock-farsight-analog-outline-rounded" width={24} className='text-primary mr-2' />
                {`${appointmentTimeStart} - ${appointmentTimeEnd}`}
            </div>
            <div className='w-[21%] p-3 flex border border-primary'>
                <Icon icon="material-symbols:work-outline" width={24} className='text-primary mr-2' />
                {appointment.publicCompanyName}
            </div>
            <div className='w-[27%] p-3 flex border border-primary'>
                <Icon icon="material-symbols:work-outline" width={24} className='text-primary mr-2' />
                {appointment.privateCompanyName}
            </div>
            <div className='border border-primary text-white flex flex-col justify-start space-y-2'>
                <button type='button' className='w-full border border-primary bg-primary font-semibold p-3 hover:bg-opacity-50' onClick={()=>handleAppointmentValidation(appointment.id)}>confirmer le rendez-vous</button>
            </div>
        </div>
    </div>
  );
}
