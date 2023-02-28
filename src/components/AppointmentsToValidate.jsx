import { Icon } from '@iconify/react';
import { Montserrat } from '@next/font/google';
import axios, { AxiosError, isAxiosError } from 'axios'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import TimePicker from './TimePicker';

const montserrat = Montserrat({ subsets: ['latin'] });

export default function Appointments({ appointment, token, getData, setIsDataLoading}) {
    const [publicCompanyData, setPublicCompanyData] = useState({});
    const [privateCompanyData, setPrivateCompanyData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [appointmentTime, setAppointmentTime] = useState("");
    const [disabled, setDisabled] = useState(true);

    
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
    const handleAppointmentValidation = (id) => {
        setIsDataLoading(true);
        const appointmentId = id;
        console.log("appointment id : ", appointmentId, " token: ", token);
        axios.put(`${process.env.NEXT_PUBLIC_API_URL}/appointments/validate/${appointmentId}`, { headers:{ 'x-access-token': `${token}` } })
        .then((response)=>{
            console.dir(response);
            getData();
        })
        .catch((error)=>console.dir(error))
        
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
        // minutes = minutes < 10 && minutes > 0 ? `0${minutes}` : minutes;
        return `${hour < 10 && hour > 0 ? `0${hour}` : hour}:${minutes < 10 && hour > 0 ? `0${minutes}` : minutes}`
    }
    const getTimeEnd =  (appointmentDate)=>{
        let dateTime= new Date(appointmentDate), hour = dateTime.getUTCMinutes()+20 === 60 ? dateTime.getUTCHours()+1 : dateTime.getUTCHours(), minutes = dateTime.getUTCMinutes()+20 === 60 ? 0 : dateTime.getUTCMinutes()+20;
        return `${hour < 10 && hour > 0 ? `0${hour}` : hour}:${minutes < 10 && hour > 0 ? `0${minutes}` : minutes}`
    }
    const appointmentTimeStart = getTimeStart(appointment.appointmentTime);
    const appointmentTimeEnd = !appointmentTime? getTimeEnd(appointment.appointmentTime):parseInt(appointmentTime.split(':')[1])+20 === 60 ?`${parseInt(appointmentTime.split(':')[0])+1}:00` : `${appointmentTime.split(':')[0]}:${parseInt(appointmentTime.split(':')[1])+20}`;
    //appointment.appointmentTime

  return (
    <div className='md:w-full mb-4'>
        <div className={`${montserrat.className} font-medium w-[100%] text-secondary flex`}>
            <div className='p-2 w-1/4 md:w-[25%] md:p-3 md:flex border border-primary'>
                <Icon icon="material-symbols:nest-clock-farsight-analog-outline-rounded" width={24} className='text-primary mr-2' />
                <span>
                    <TimePicker defaultValue={appointmentTimeStart} onChange={handleChangeAppointmentTime} className='bg-white border-none focus:outline-none'/>{` - ${appointmentTimeEnd}`}
                </span>
                <div className='flex ml-5'>
                    <button type='button' disabled={disabled} className='w-1/7' onClick={handleModifyAppointmentTime}><Icon icon="material-symbols:edit" width={18} className='text-secondary' /></button>
                </div>                
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
