'use client'
import Header from '@/components/Header'
import Image from 'next/image'
import { Oswald, Montserrat } from '@next/font/google'
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
            setAppointments(response.data);
            setIsLoading(false);
            
        }).catch((error)=>{
            setIsLoading(false);
            console.log('**** error: ', error);
        });

        setUser({id:localStorage.getItem('id'), firstName:localStorage.getItem('firstName'), company:localStorage.getItem('company'), companyType:localStorage.getItem('companyType'), token:localStorage.getItem('token')});
    }, []);


      return (
        <main className={`${montserrat.className} bg-white w-screen flex flex-col`}>
            <Header hasSignedIn={true} />
            <section className='w-[100%] flex items-start'>
                <div className='w-[100%] md:w-[70%] pl-6 md:pl-24 md:pb-20 mt-4 pt-4'>
                    <h1 className={`${oswald.className} mb-10`}>
                        <div className='text-secondary text-5xl md:text-7xl font-bold'>{`Agenda ${user.company}`}</div>
                        <div className='text-primary text-5xl md:text-7xl font-bold'>Nos Rendez-vous</div>
                    </h1>
                    {
                        isLoading? <span> En cours de chargement ... </span>: (!appointments.userAppointment) || appointments.userAppointment.rows.length === 0 ? <div className='w-[60%] text-secondary'><span className='w-full h-full'><Image src='/images/nothing_to_validate.png' alt='rendez-vous not found' className=' mb-6' width={1000} height={600} /></span><span className='font-bold  text-xl'>Vous n'avez aucun rendez-vous validé</span></div>: appointments.userAppointment.rows.map((row, idx)=>{ return (<Appointments key={idx} appointment={row} user={user}/>)})
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
