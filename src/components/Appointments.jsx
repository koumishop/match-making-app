import axios, { AxiosError, isAxiosError } from 'axios';
import { Icon } from '@iconify/react';
import { Montserrat } from '@next/font/google';
import { useEffect, useState } from 'react';
import TimePicker from './TimePicker';

const montserrat = Montserrat({ subsets: ['latin'] });
const meetPlace = "Salon Congo";

export default function Appointments({ appointment, user}) {
    const [publicCompanyData, setPublicCompanyData] = useState({});
    const [privateCompanyData, setPrivateCompanyData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [disabled, setDisabled] = useState(true);
    const [appointmentTime, setAppointmentTime] = useState("");
        
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
    const handleChangeAppointmentTime = (event)=>{
        console.log("time : ", event.target.value);
        setDisabled(false);
        setAppointmentTime(event.target.value)
    }
    const handleModifyAppointmentTime = ()=>{
        console.log("appointment ID to modify : ", appointment.id);
        if(!appointmentTime){ 
            console.log("time has not changed");
        }else{
            console.log("edit appointment time to : ", appointmentTime);
            const today = formatDate();
            const appointmentData = { appointmentTime:`${today} ${appointmentTime}:00`}
            console.log("appointment to be submitted : ", appointment);

            axios.put(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointment.id}`, appointmentData, { headers:{ 'x-access-token': `${localStorage.getItem('token')}` } })
            .then((response)=>{ 
                console.log(response);
                setDisabled(true);
            })
            .catch((error)=>{ 
                console.log('error : ', error);
                alert('error : ', error.message)
            });
        }
    }

    const formatDate = ()=>{
        var today = new Date(),
        month = '' + (today.getMonth() + 1),
        day = '' + today.getDate(),
        year = today.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }
    const getTimeStart =  (appointmentDate)=>{
        let dateTime= new Date(appointmentDate), hour = dateTime.getUTCHours(), minutes = dateTime.getUTCMinutes();
   
        return `${hour < 10 && hour > 0 ? `0${hour}` : hour}:${minutes < 10 && hour > 0 ? `0${minutes}` : minutes}`
    }
    const getTimeEnd =  (appointmentDate)=>{
        let dateTime= new Date(appointmentDate), hour = dateTime.getUTCMinutes()+20 === 60 ? dateTime.getUTCHours()+1 : dateTime.getUTCHours(), minutes = dateTime.getUTCMinutes()+20 === 60 ? 0 : dateTime.getUTCMinutes()+20;
   
        return `${hour < 10 && hour > 0 ? `0${hour}` : hour}:${minutes < 10 && hour > 0 ? `0${minutes}` : minutes}`
    }
    const appointmentTimeStart = getTimeStart(appointment.appointmentTime);
    const appointmentTimeEnd = !appointmentTime? getTimeEnd(appointment.appointmentTime):parseInt(appointmentTime.split(':')[1])+20 === 60 ?`${parseInt(appointmentTime.split(':')[0])+1}:00` : `${appointmentTime.split(':')[0]}:${parseInt(appointmentTime.split(':')[1])+20}` ;

    return (
    <div className='w-full mb-4'>
        <div className={`${montserrat.className} font-medium w-full text-secondary flex`}>
            <div className='p-2 md:w-[25%] md:p-3 md:flex border border-primary'>
                <Icon icon="material-symbols:nest-clock-farsight-analog-outline-rounded" width={24} className='text-primary mr-2' />
                <span>{user.companyType==='PUBLIC'?
                    <span>
                        <TimePicker defaultValue={appointmentTimeStart} onChange={handleChangeAppointmentTime} className='bg-white border-none focus:outline-none'/>{` - ${appointmentTimeEnd}`}
                    </span>
                    :
                    `${appointmentTimeStart} - ${appointmentTimeEnd}`
                    }
                </span>
                {user.companyType==='PUBLIC'?
                    <div className='flex ml-5'>
                        <button type='button' disabled={disabled} className='w-1/7' onClick={handleModifyAppointmentTime}><Icon icon="material-symbols:edit" width={18} className='text-secondary' /></button>
                    </div>
                    :
                    <></>
                }
            </div>
            <div className='p-2 md:w-[27%] md:p-3 md:flex border border-primary'>
                <Icon icon="material-symbols:work-outline" width={24} className='text-primary mr-2' />
                {isLoading?<span> En cours de chargement ... </span>:user.companyType==='PUBLIC'? privateCompanyData.companyName:publicCompanyData.companyName}
            </div>
            <div className='p-2 md:p-3 md:flex border border-primary'>
                <Icon icon="ic:outline-place" width={24} className='text-primary mr-2' />
                {meetPlace}
            </div>                            
        </div>
    </div>
  );
}
