import Header from '@/components/Header'
import Image from 'next/image'
import { Oswald, Montserrat } from '@next/font/google'
import { Icon } from '@iconify/react'
import { useState } from 'react'
import { useFormik, FormikProvider, Form } from 'formik'
import * as Yup from 'yup'
import axios, { AxiosError, isAxiosError } from 'axios'
import Appointments from '@/components/Appointments'

const oswald = Oswald({ subsets: ['latin'] });
const montserrat = Montserrat({ subsets: ['latin'] });

export default function PrivateDashboard() {
    const appointments={
        "userAppointment": {
          "count": 1,
          "rows": [
            {
              "id": "86965851-ba27-438a-909f-3edb4ab3972f",
              "isConfirmed": true,
              "publicCompanyName": "Regideso",
              "privateCompanyId": "dafde8f0-85c7-40f3-8e04-d47aafa6c7ef",
              "appointmentTime": "2023-02-03T09:30:00.000Z",
              "createdAt": "2023-02-03T10:06:46.000Z",
              "updatedAt": "2023-02-03T11:46:26.000Z"
            }
          ]
        },
        "company": {
          "id": "dafde8f0-85c7-40f3-8e04-d47aafa6c7ef",
          "companyName": "Mon petit truc en plus",
          "adress": "25 Av. du Tourisme C/ Ngaliema",
          "companyType": "PRIVATE",
          "createdAt": "2023-02-02T16:12:03.000Z",
          "updatedAt": "2023-02-02T16:12:03.000Z"
        }
      }
      return (
        <main className={`${montserrat.className} bg-white w-screen flex flex-col`}>
            <Header hasSignedIn = {true} />
            <section className='w-[100%] flex items-start'>
                <div className='w-[60%] pl-24 pb-20 mt-4 pt-4'>
                    <h1 className={oswald.className}>
                        <div className='text-secondary text-7xl font-bold'>{`Agenda ${appointments.company.companyName}`}</div>
                        <div className='text-primary text-7xl font-bold'>Nos Rendez-vous</div>
                    </h1>
                    <Appointments appointments={appointments}/>
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
