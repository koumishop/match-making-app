'use client'
import Image from 'next/image'
import { Oswald, Montserrat } from '@next/font/google'
import { useState, useEffect } from 'react'
import axios, { AxiosError, isAxiosError } from 'axios'
import Header from '@/components/Header'
import AppointmentsToValidate from '@/components/AppointmentsToValidate'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CompanyList from '@/components/CompanyList'

const oswald = Oswald({ subsets: ['latin'] });
const montserrat = Montserrat({ subsets: ['latin'] });

export default function AdminDashboard() {
    const [hasSuccess, setHasSuccess] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorStatus, setErrorStatus] = useState("");
    const [tabValue, setTabValue] = useState('1');
    const [user, setUser] = useState({});
    const [publicCompany, setPublicCompany] = useState({});
    const [privateCompany, setPrivateCompany] = useState({});
    const [appointmentToConfirm, setAppointmentToConfirm] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isPublicCompanyLoading, setIsPublicCompanyLoading] = useState(true);
    const [isPrivateCompanyLoading, setIsPrivateCompanyLoading] = useState(true);


    const getData = () => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/appointments/validate`, { headers:{ 'x-access-token': `${localStorage.getItem('token')}` } })
        .then((response)=>{
            setAppointmentToConfirm(response.data.appointmentsToValidate);
            setIsLoading(false);
            
        }).catch((error)=>{
            setHasError(true);
            setIsLoading(false);
            console.log('**** error: ', error);
        });

    }
    const getCompanies=(companyType)=>{
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyType}`, { headers:{ 'x-access-token': `${localStorage.getItem('token')}` } })
        .then((response)=>{
            if(companyType==="public"){
                setPublicCompany(response.data);
                setIsPublicCompanyLoading(false);
                console.log('**** public : ', response.data);
            }else if(companyType==="private"){
                setPrivateCompany(response.data);
                setIsPrivateCompanyLoading(false);               
            }
        })
        .catch((error)=>{
            setHasError(true);
            setIsPublicCompanyLoading(false);
            setIsPrivateCompanyLoading(false);
            console.log('**** error: ', error);
        })
    } ;

    useEffect(() => {
        getData();
        getCompanies("public");
        getCompanies("private");
        // Perform localStorage action
        setUser({id:localStorage.getItem('id'), firstName:localStorage.getItem('firstName'), token:localStorage.getItem('token')});
    }, []);

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
      };

    return (
        <main className={`${montserrat.className} bg-white w-screen flex flex-col`}>
            <Header hasSignedIn={true} />
            <section className='w-[100%] flex items-start'>
                <div className='w-[70%] pl-24 pb-20 mt-4 pt-4'>
                    <h1 className={`${oswald.className} mb-10`}>
                        <div className='text-secondary text-7xl font-bold'>Agenda Partenaires</div>
                        <div className='text-primary text-7xl font-bold'>Rendez-vous à valider</div>
                    </h1>
                    {
                        isLoading? <span> En cours de chargement ... </span>: (!appointmentToConfirm.rows) || appointmentToConfirm.rows.length === 0 ? <div className='w-[50%] text-secondary'><span className='w-full h-full'><Image src='/images/nothing_to_validate.png' className=' mb-6' width={1000} height={600} /></span><span className='font-bold  text-xl'>Vous n'avez aucun rendez-vous à valider</span></div>: appointmentToConfirm.rows.map((row, idx)=>{ return (<AppointmentsToValidate key={idx} appointment={row} token={user.token} getData={getData}  />)})
                    }
                </div>
                <div className='w-[33%] h-full flex relative'>
                    <div className='relative'>
                        <Image src="/images/match_making_bg.png" alt='match-making background' width={600} height={600} className='absolutes' />
                    </div>          
                </div>
            </section>
            <section className='w-[100%] flex items-start text-secondary'>
                <div className='w-[98%] pl-24 pb-20'>
                    <h1 className={`${oswald.className} mb-10 text-primary text-7xl font-bold`}>
                        Nos partenaires
                    </h1>
                    <TabContext value={tabValue}>
                        <TabList className='w-full border-b pb-1 border-secondary' onChange={handleChangeTab} indicatorColor="#12CFD9">
                            <Tab className='border border-primary w-1/3 text-secondary font-semibold' label="Entreprises Publiques" value="1" />
                            <Tab className='text-secondary w-1/3 font-semibold' label="Entreprises Privées" value="2" />
                            <Tab className=' w-1/3 text-white font-semibold border border-primary bg-primary hover:opacity-50' label="Enregistrer une Entreprise" value="3" />
                        </TabList>
                        <TabPanel value="1">
                            {isPublicCompanyLoading ? <span> En cours de chargement ... </span>: (!publicCompany.rows) || publicCompany.rows.length === 0 ? <div className='w-[50%] text-secondary'><span className='w-full h-full'><Image src='/images/no_companies.png' className=' mb-6' width={1000} height={600} /></span><span className='font-bold  text-xl'>Vous n'avez encore enregistré aucune Entreprise</span></div>: publicCompany.rows.map((row, idx)=>(<CompanyList key={idx} company={row}/>))}
                        </TabPanel>
                        <TabPanel value="2">
                            {isPrivateCompanyLoading ? <span> En cours de chargement ... </span>: (!privateCompany.rows) || privateCompany.rows.length === 0 ? <div className='w-[50%] text-secondary'><span className='w-full h-full'><Image src='/images/no_companies.png' className=' mb-6' width={1000} height={600} /></span><span className='font-bold  text-xl'>Vous n'avez encore enregistré aucune Entreprise</span></div>: privateCompany.rows.map((row, idx)=>(<CompanyList key={idx} company={row}/>))}
                        </TabPanel>
                        <TabPanel value="3">Item Three</TabPanel>
                    </TabContext>
                </div>
            </section>
        </main>
    )
}