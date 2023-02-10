'use client'
import Image from 'next/image'
import { Oswald, Montserrat } from '@next/font/google'
import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useFormik, FormikProvider, Form } from 'formik'
import * as Yup from 'yup'
import axios, { AxiosError, isAxiosError } from 'axios'
import Header from '@/components/Header'
import AppointmentsToValidate from '@/components/AppointmentsToValidate'

const oswald = Oswald({ subsets: ['latin'] });
const montserrat = Montserrat({ subsets: ['latin'] });

export default function AdminDashboard() {
    const [hasSuccess, setHasSuccess] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorStatus, setErrorStatus] = useState("");
    const [user, setUser] = useState({});
    const [appointmentToConfirm, setAppointmentToConfirm] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Perform localStorage action
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/appointments/validate`, { headers:{ 'x-access-token': `${localStorage.getItem('token')}` } })
        .then((response)=>{
            console.log('**** response: ', response.data.appointmentsToValidate);
            setAppointmentToConfirm(response.data.appointmentsToValidate);
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
                    <h1 className={`${oswald.className} mb-10`}>
                        <div className='text-secondary text-7xl font-bold'>Agenda Partenaires</div>
                        <div className='text-primary text-7xl font-bold'>Rendez-vous à valider</div>
                    </h1>
                    {
                        isLoading? <span> En cours de chargement ... </span>: appointmentToConfirm.rows.length === 0 ? <span>Vous n'avez aucun rendez-vous à valider</span>: appointmentToConfirm.rows.map((row, idx)=>{ return (<AppointmentsToValidate key={idx} appointment={row} />)})
                    }
                </div>
            </section>
        </main>
    )
}