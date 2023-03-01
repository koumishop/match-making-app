'use client'
import Header from '@/components/Header'
import Image from 'next/image'
import { Oswald, Montserrat } from '@next/font/google'
import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import TimePicker from '@/components/TimePicker';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import axios, { AxiosError, isAxiosError } from 'axios'
import Appointments from '@/components/Appointments'

const oswald = Oswald({ subsets: ['latin'] });
const montserrat = Montserrat({ subsets: ['latin'] });

export default function PublicDashboard() {
    const [hasError, setHasError] = useState(false);
    const [errorStatus, setErrorStatus] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [selectedCompanyId, setSelectedCompanyId] = useState("");
    const [user, setUser] = useState({});
    const [appointments, setAppointments] = useState({});
    const [companies, setCompanies] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isCompanyLoading, setIsCompanyLoading] = useState(true);
    const [isLoadingAppointment, setIsLoadingAppointment] = useState(true);
    const [appointmentData, setAppointmentData] = useState({});
    const [isAlertOpened, setIsAlertOpened] = useState(false);
    const [message, setMessage] = useState("");


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

        setUser({id:localStorage.getItem('id'), firstName:localStorage.getItem('firstName'), company:localStorage.getItem('company'), companyType:localStorage.getItem('companyType'), token:localStorage.getItem('token')});
    }, []);

    const meetPlace = "Salon Congo";
    const getTimeData = async (privateCompanyId)=>{
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/appointments/${privateCompanyId}`, { headers: { 'x-access-token': `${localStorage.getItem('token')}` } })
            return response.data
        } catch (error) {
            console.log('**** error: ', error)
        }finally {
            setIsLoadingAppointment(false)
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

    const handleChangeCompanyId = async (event)=>{
        setSelectedCompanyId(event.target.value);        
        const appointmentValue = await getTimeData(event.target.value);
        setAppointmentData(appointmentValue);
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
            setIsAlertOpened(true);
            console.log(response);
            setAppointmentTime('');
            setSelectedCompanyId('');
            setMessage("succès : le rendez-vous est pris, attendez sa confirmation")
        })
        .catch((error)=>{ 
            setHasError(true);
            console.log('error : ', error);
            setMessage("erreur : soit vous avez déjà pris ce rendez-vous, soit c'est une insertion d'informations erronées");

            if(error.response.status){
                setErrorStatus(error.response.status);
            } else {
                setErrorStatus(error);
            }
        });
    }
    //console.log("***** appointments :", appointments, " appointmentTimeData :", appointmentData);
    return (
        <main className={`${montserrat.className} bg-white w-screen flex flex-col`}>
            <Header hasSignedIn={true} />
            <section className='w-[100%] flex items-start'>
                <div className='w-[100%] md:w-[60%] h-full md:mr-4'>
                        <form className='w-[100%] h-[100%] mt-4 pt-4 pl-6 pr-2 md:pl-24 bg-white flex flex-col items-start justify-start' autoComplete='off' >
                            <h1 className={oswald.className}>
                                <div className='text-secondary text-5xl md:text-7xl font-bold'>Prendre un</div>
                                <div className='text-primary text-5xl md:text-7xl font-bold'>Rendez-vous</div>
                            </h1>
                            <span className='text-secondary my-3'>Remplissez ce formulaire et nous vous enverrons une confirmation de rendez-vous</span>

                            <Collapse in={hasError}>
                                <Alert severity='error'
                                    action={
                                        <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setHasError(false);
                                        }}
                                        >
                                            <Icon icon="material-symbols:close" />
                                        </IconButton>
                                    }
                                    sx={{ mb: 2 }}
                                >
                                    { message }
                                </Alert>
                            </Collapse>
                            <Collapse in={isAlertOpened}>
                                <Alert
                                    action={
                                        <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setIsAlertOpened(false);
                                        }}
                                        >
                                            <Icon icon="material-symbols:close" />
                                        </IconButton>
                                    }
                                    sx={{ mb: 2 }}
                                >
                                    { message }
                                </Alert>
                            </Collapse>

                            <div className={hasError ? 'w-[96%] md:w-[59%] my-4 md:mt-5 md:mb-5 flex flex-col justify-start space-y-2':'w-[96%] md:w-[59%] mt-1 mb-4 md:mb-5 flex flex-col justify-start space-y-2'}>
                                <h2 className='text-secondary text-lg font-medium'>Entreprise du secteur à contacter</h2>
                                <div className='w-full p-3 border border-primary flex items-centers'>
                                    <Icon icon="ic:baseline-work-outline" width={24} className='text-secondary' />
                                    <select required value={selectedCompanyId} onChange={handleChangeCompanyId} className='bg-white mx-2  w-full border-none focus:outline-none text-secondary'>
                                        <option value="" disabled>Selectionnez l'Entreprise</option>
                                        {
                                            isCompanyLoading? <option value=""> En cours de chargement ... </option> : !companies.rows? <option value="" disabled>Aucune entreprise trouvée</option> : companies.rows.map((row, idx)=>(<option value={row.id} key={idx}>{row.companyName}</option>))
                                        }
                                    </select>
                                </div>            
                            </div>
                            <div className='w-[96%] md:w-[59%] md:mt-5 mb-10 flex flex-col justify-start space-y-2'>
                                <h2 className='text-secondary text-lg font-medium'>Heure de rendez-vous</h2>
                                <div className='w-full p-3 border border-primary flex items-centers'>
                                    <Icon icon="material-symbols:nest-clock-farsight-analog-outline-rounded" width={24} className='text-secondary' />
                                    <input type="text" value={meetPlace} disabled className='bg-white mx-2  w-[40%] border-none focus:outline-none text-secondary text-opacity-60 font-bold' />
                                    <TimePicker privateCompanyId={appointmentData} onChange={handleChangeAppointmentTime} className='bg-white mx-2 w-[50%] border-none focus:outline-none text-secondary' />
                                </div>  
                            </div>
                            <div className='w-[96%] md:w-[59%] border border-primary flex flex-col justify-start space-y-2 mb-12 md:mb-24'>
                                <button onClick={handleSubmit} type="button" className='w-full border border-primary bg-primary font-semibold p-3 hover:bg-opacity-50 text-white'>Validez le rendez-vous</button>  
                            </div>                                                
                        </form>
                </div>
                <div className=' hidden md:w-[40%] md:h-full md:flex md:relative'>
                    <div className='relative'>
                        <Image src="/images/match_making_bg.png" alt='match-making background' width={600} height={600} className='absolutes' />
                    </div>          
                </div>
            </section>
            <section className='w-[100%] flex items-start'>
                <div className='w-[100%] md:w-[70%] pl-6 md:pl-24 md:pb-20'>
                    <h1 className={`${oswald.className} mb-10`}>
                        <div className='text-secondary text-5xl md:text-7xl font-bold'>{`Agenda ${user.company}`}</div>
                        <div className='text-primary text-5xl md:text-7xl font-bold'>Nos Rendez-vous</div>
                    </h1>
                    {
                        isLoading? <span className={`${montserrat.className} font-medium w-full text-secondary flex`}> En cours de chargement ... </span>: (!appointments.userAppointment) || appointments.userAppointment.rows.length === 0 ? <div className='w-[50%] text-secondary'><span className='w-full h-full'><Image src='/images/nothing_to_validate.png' alt='rendez-vous not found' className=' mb-6' width={1000} height={600} /></span><span className='font-bold  text-xl'>Vous n'avez aucun rendez-vous validé</span></div>: appointments.userAppointment.rows.map((row, idx)=>{ return (<Appointments key={idx} appointment={row} user={user}/>)})
                    }
                </div>

            </section>
        </main>
    );
}