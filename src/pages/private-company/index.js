import Header from '@/components/Header'
import Image from 'next/image'
import { Oswald, Montserrat } from '@next/font/google'
import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import { useFormik, FormikProvider, Form } from 'formik'
import * as Yup from 'yup'
import axios, { AxiosError, isAxiosError } from 'axios'
import Appointments from '@/components/Appointments'

const oswald = Oswald({ subsets: ['latin'] });
const montserrat = Montserrat({ subsets: ['latin'] });

export default function PrivateDashboard() {
    const [user, setUser] = useState({});
    const [appointments, setAppointments] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        // Perform localStorage action

        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/appointments/confirmed`, { headers:{ 'x-access-token': `${localStorage.getItem('token')}` } })
        .then((response)=>{
            console.log('**** response: ', response.data);
            setAppointments(response.data);
            setIsLoading(false);
            
        }).catch((error)=>{
            setHasError(true);
            setIsLoading(false);
            console.log('**** error: ', error);
        });

        setUser({id:localStorage.getItem('id'), firstName:localStorage.getItem('firstName'), company:localStorage.getItem('company'), token:localStorage.getItem('token')});
    }, []);


      return (
        <main className={`${montserrat.className} bg-white w-screen flex flex-col`}>
            <Header hasSignedIn={true} />
            <section className='w-[100%] flex items-start'>
                <div className='w-[60%] pl-24 pb-20 mt-4 pt-4'>
                    <h1 className={oswald.className}>
                        <div className='text-secondary text-7xl font-bold'>{`Agenda ${user.company}`}</div>
                        <div className='text-primary text-7xl font-bold'>Nos Rendez-vous</div>
                    </h1>
                    {
                        isLoading? <span> En cours de chargement ... </span>: appointments.userAppointments.rows.length === 0 ? <span>Vous n'avez aucun rendez-vous</span>: appointments.userAppointments.rows.map((row, idx)=>{ return (<Appointments key={idx} appointment={row} company={appointments.company}/>)})
                    }
                </div>
                <div className='w-[40%] h-full flex relative'>
                    <div className='relative'>
                        <Image src="/images/match_making_bg.png" alt='match-making background' width={600} height={600} className='absolutes' />
                    </div>          
                </div>
            </section>
        </main>
      )  
}
