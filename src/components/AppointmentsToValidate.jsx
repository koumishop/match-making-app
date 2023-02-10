import { Icon } from '@iconify/react';
import { Montserrat } from '@next/font/google';
import axios, { AxiosError, isAxiosError } from 'axios'

const montserrat = Montserrat({ subsets: ['latin'] });

export default function Appointments({ appointment, setIsLoading}) {
    const handleAppointmentValidation = (id) => {
        setIsLoading(true);
        const appointmentId = id;
        console.log("appointment id : ", appointmentId);
        axios.put(`${process.env.NEXT_PUBLIC_API_URL}/appointments/validate/${appointmentId}`, { headers:{ 'x-access-token': `${localStorage.getItem('token')}` } })
        .then((response)=>{
            setIsLoading(false);
            console.log('**** response : ', response);
        })
        .catch((error)=>console.log("error : ", error))
    }

    const getTimeStart =  (appointmentDate)=>{
        let dateTime= new Date(appointmentDate), hour = dateTime.getUTCHours()+1, minutes = dateTime.getUTCMinutes();
        return `${hour}:${minutes}`
    }
    const getTimeEnd =  (appointmentDate)=>{
        let dateTime= new Date(appointmentDate), hour = dateTime.getUTCHours()+1, minutes = dateTime.getUTCMinutes()+20;
        return `${hour}:${minutes}`
    }
    const appointmentTimeStart = getTimeStart(appointment.appointmentTime);
    const appointmentTimeEnd = getTimeEnd(appointment.appointmentTime);
    //appointment.appointmentTime

  return (
    <div className='w-full mb-4'>
        <div className={`${montserrat.className} font-medium w-full text-secondary flex`}>
            <div className='p-3 flex border border-primary'>
                <Icon icon="material-symbols:nest-clock-farsight-analog-outline-rounded" width={24} className='text-primary mr-2' />
                {`${appointmentTimeStart} - ${appointmentTimeEnd}`}
            </div>
            <div className='p-3 flex border border-primary'>
                <Icon icon="material-symbols:work-outline" width={24} className='text-primary mr-2' />
                {appointment.publicCompanyName}
            </div>
            <div className='p-3 flex border border-primary'>
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
