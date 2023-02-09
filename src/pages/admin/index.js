import Image from 'next/image'
import { Oswald, Montserrat } from '@next/font/google'
import { Icon } from '@iconify/react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useFormik, FormikProvider, Form } from 'formik'
import * as Yup from 'yup'
import axios, { AxiosError, isAxiosError } from 'axios'
import Header from '@/components/Header'

const oswald = Oswald({ subsets: ['latin'] });
const montserrat = Montserrat({ subsets: ['latin'] });

export default function AdminDashboard() {
    return (
        <main className={`${montserrat.className} bg-white w-screen flex flex-col`}>
            <Header hasSignedIn={true} />
            <h1>ADMIN DASHBOARD</h1>
        </main>
    )
}