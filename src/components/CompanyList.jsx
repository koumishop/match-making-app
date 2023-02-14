import { Icon } from '@iconify/react'
import { Montserrat } from '@next/font/google'
import axios, { AxiosError, isAxiosError } from 'axios'
import { useEffect, useState } from 'react';


const montserrat = Montserrat({ subsets: ['latin'] });

export default function CompanyList({ company }) {
    const [user, setUser] = useState({});
    const [ref, setRef] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const getData = () => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/companies/referent/${company.id}`, { headers:{ 'x-access-token': `${localStorage.getItem('token')}` } })
        .then((response)=>{
            setRef(response.data);
            setIsLoading(false);
        }).catch((error)=>{
            setIsLoading(false);
            console.log('**** error: ', error);
        });

    }
    useEffect(() => {
        getData();
        // Perform localStorage action
        setUser({id:localStorage.getItem('id'), firstName:localStorage.getItem('firstName'), token:localStorage.getItem('token')});
    }, []);    

    return(
        <div className='w-full mb-4'>
            <div className={`${montserrat.className} font-medium w-[100%] text-secondary flex items-center`}>
                <div className='w-[22%] p-3 flex border border-primary'>
                    <Icon icon="material-symbols:work-outline" width={24} className='text-primary mr-2' />
                    {company.companyName}
                </div>
                <div className='w-[28%] p-3 flex border border-primary'>
                    <Icon icon="ic:outline-place" width={24} className='text-primary mr-2' />
                    {company.adress}
                </div>
                <div className='w-[20%] p-3 flex border border-primary'>
                    <Icon icon="mdi:user-circle-outline" width={24} className='text-primary mr-2' />
                    {`${ref.firstName} ${ref.lastName}`}
                </div>
                <div className='w-[20%] p-3 flex border border-primary'>
                    <Icon icon="ic:outline-mark-email-unread" width={24} className='text-primary mr-2' />
                    {ref.email}
                </div>
                <div className='w-[20%] p-3 flex border border-primary'>
                    <Icon icon="bi:phone" width={24} className='text-primary mr-2' />
                    {ref.phoneNumber}
                </div>
            </div>
        </div>
    )
}