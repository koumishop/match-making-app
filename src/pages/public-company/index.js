'use client'
import Header from '@/components/Header'
import Image from 'next/image'
import { Oswald, Montserrat } from '@next/font/google'
import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import TimePicker from '@/components/TimePicker';
import axios, { AxiosError, isAxiosError } from 'axios'
import Appointments from '@/components/Appointments'

const oswald = Oswald({ subsets: ['latin'] });
const montserrat = Montserrat({ subsets: ['latin'] });

export default function PublicDashboard() {
    const [hasSuccess, setHasSuccess] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorStatus, setErrorStatus] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [selectedCompanyId, setSelectedCompanyId] = useState("");
    const [user, setUser] = useState({});
    const [appointments, setAppointments] = useState({});
    const [companies, setCompanies] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isCompanyLoading, setIsCompanyLoading] = useState(true);

    useEffect(() => {
        // Perform localStorage action

        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/appointments/confirmed`, { headers:{ 'x-access-token': `${localStorage.getItem('token')}` } })
        .then((response)=>{
            setAppointments(response.data);
            setIsLoading(false);
            
        }).catch((error)=>{
            setIsLoading(false);
        });

        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/companies/private`, { headers:{ 'x-access-token': `${localStorage.getItem('token')}` } })
        .then((response)=>{
            setCompanies(response.data);
            setIsCompanyLoading(false);
            
        })
        .catch((error)=>{
            setHasError(true);
            setIsCompanyLoading(false);
        });

        setUser({id:localStorage.getItem('id'), firstName:localStorage.getItem('firstName'), company:localStorage.getItem('company'), token:localStorage.getItem('token')});
    }, []);

    const meetPlace = "Salon Congo";

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

    const handleChangeCompanyId = (event)=>{
        setSelectedCompanyId(event.target.value);
    }
    const handleChangeAppointmentTime = (event)=>{
        console.log("time : ", event.target.value);
        setAppointmentTime(event.target.value)
    }
    const handleSubmit = ()=>{
        const today = formatDate();
        const appointment = { appointmentTime:`${today} ${appointmentTime}:00`, privateCompanyId:selectedCompanyId}
        setHasError(false);
        setErrorStatus("");

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/appointments/`, appointment, { headers:{ 'x-access-token': `${localStorage.getItem('token')}` } })
        .then((response)=>{ 
            setHasSuccess(true);
            console.log(response);
            setAppointmentTime('');
            setSelectedCompanyId('');
            setHasSuccess(false);
        })
        .catch((error)=>{ 
            setHasError(true);
            console.log('error : ', error);

            if(error.response.status){
                setErrorStatus(error.response.status);
            } else {
                setErrorStatus(error);
            }
        });
    }

    return (
        <main className={`${montserrat.className} bg-white w-screen flex flex-col`}>
            <Header hasSignedIn={true} />
            <section className='w-[100%] flex items-start'>
                <div className='w-[60%] h-full mr-4'>
                        <form className='w-[100%] h-[100%] mt-4 pt-4 pl-24 bg-white flex flex-col items-start justify-start' autoComplete='off' >
                            <h1 className={oswald.className}>
                                <div className='text-secondary text-7xl font-bold'>Prendre un</div>
                                <div className='text-primary text-7xl font-bold'>Rendez-vous</div>
                            </h1>
                            <span className='text-secondary my-3'>Remplissez ce formulaire et nous vous enverrons une confirmation de rendez-vous</span>
                            {
                            hasError? <span className='w-full p-2 mt-4 bg-error bg-opacity-80 text-white flex justify-center'><Icon icon="material-symbols:warning-outline-rounded" width={24} className='text-white mr-2' />{errorStatus ? `erreur : utilisateur ou mot de passe incorrect`:`erreur : ${errorStatus}`}</span> : hasSuccess? <span className='w-full p-2 mt-4 bg-primary bg-opacity-80 text-white flex justify-center'><Icon icon="mdi:success-circle-outline" width={24} className='text-white mr-2' />{`succès : le rendez-vous est pris, attendez sa confirmation`}</span> : <></>
                            }   
                            <div className={hasError ? 'w-[59%] mt-5 mb-5 flex flex-col justify-start space-y-2':'w-[59%] mt-1 mb-5 flex flex-col justify-start space-y-2'}>
                                <h2 className='text-secondary text-lg font-medium'>Entreprise du secteur à contacter</h2>
                                <div className='w-full p-3 border border-primary flex items-centers'>
                                    <Icon icon="ic:baseline-work-outline" width={24} className='text-secondary' />
                                    <select required value={selectedCompanyId} onChange={handleChangeCompanyId} className='bg-white mx-2  w-full border-none focus:outline-none text-secondary'>
                                        <option value="" disabled>Selectionnez l'Etreprise</option>
                                        {
                                            isCompanyLoading? <option value=""> En cours de chargement ... </option> : companies.rows.map((row, idx)=>(<option value={row.id} key={idx}>{row.companyName}</option>))
                                        }
                                    </select>
                                </div>            
                            </div>
                            <div className='w-[59%] mt-5 mb-10 flex flex-col justify-start space-y-2'>
                                <h2 className='text-secondary text-lg font-medium'>Heure de rendez-vous</h2>
                                <div className='w-full p-3 border border-primary flex items-centers'>
                                    <Icon icon="material-symbols:nest-clock-farsight-analog-outline-rounded" width={24} className='text-secondary' />
                                    <input type="text" value={meetPlace} disabled className='bg-white mx-2  w-[40%] border-none focus:outline-none text-secondary text-opacity-60 font-bold' />
                                    <TimePicker onChange={handleChangeAppointmentTime} className='bg-white mx-2 w-[50%] border-none focus:outline-none text-secondary' />
                                </div>  
                            </div>
                            <div className='w-[59%] border border-primary flex flex-col justify-start space-y-2 mb-24'>
                                <button onClick={handleSubmit} type="button" className='w-full border border-primary bg-primary font-semibold p-3 hover:bg-opacity-50'>Validez le rendez-vous</button>  
                            </div>                                                
                        </form>
                </div>
                <div className='w-[40%] h-full flex relative'>
                    <div className='relative'>
                        <Image src="/images/match_making_bg.png" alt='match-making background' width={600} height={600} className='absolutes' />
                    </div>          
                </div>
            </section>
            <section className='w-[100%] flex items-start'>
                <div className='w-[70%] pl-24 pb-20'>
                    <h1 className={`${oswald.className} mb-10`}>
                        <div className='text-secondary text-7xl font-bold'>{`Agenda ${user.company}`}</div>
                        <div className='text-primary text-7xl font-bold'>Nos Rendez-vous</div>
                    </h1>
                    {
                        isLoading? <span className={`${montserrat.className} font-medium w-full text-secondary flex`}> En cours de chargement ... </span>: (!appointments.userAppointments) || appointments.userAppointments.rows.length === 0 ? <div className='w-[50%] text-secondary'><span className='w-full h-full'><Image src='/images/nothing_to_validate.png' className=' mb-6' width={1000} height={600} /></span><span className='font-bold  text-xl'>Vous n'avez aucun rendez-vous validé</span></div>: appointments.userAppointments.rows.map((row, idx)=>{ return (<Appointments key={idx} appointment={row} company={appointments.company}/>)})
                    }
                </div>

            </section>
        </main>
    );
}