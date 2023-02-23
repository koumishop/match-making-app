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
            console.log('**** response: ', response.data);
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
        <div className='w-full mb-4 overflow-auto'>
            <div className={`${montserrat.className} font-medium w-[290%] md:w-[100%] text-secondary flex items-start`}>
                <div className='w-[35%] p-1 md:w-[23%] md:p-3 md:flex border border-primary'>
                    <Icon icon="material-symbols:work-outline" width={24} className='text-primary mr-2' />
                    <span className='w-[90%]'>{company.companyName}</span>
                </div>
                <div className='w-[50%] p-1 md:w-[28%] md:p-3 md:flex border border-primary'>
                    <Icon icon="ic:outline-place" width={24} className='text-primary mr-2' />
                    <span className='w-[90%]'>{company.adress}</span>
                </div>
                <div className='w-[30%] p-1 md:w-[20%] md:p-3 md:flex border border-primary'>
                    <Icon icon="mdi:user-circle-outline" width={24} className='text-primary mr-2' />
                    <span className='w-[90%]'>{`${ref.firstName} ${ref.lastName}`}</span>
                </div>
                <div className='w-[25%] p-1 md:w-[24%] md:p-3 md:flex border border-primary'>
                    <Icon icon="ic:outline-mark-email-unread" width={24} className='text-primary mr-2' />
                    <span className='w-[90%]'>{ref.email}</span>
                </div>
                <div className='w-[30%] p-1 md:w-[20%] md:p-3 md:flex border border-primary'>
                    <Icon icon="bi:phone" width={24} className='text-primary mr-2' />
                    <span className='w-[90%]'>{ref.phoneNumber}</span>
                </div>
            </div>
        </div>
    )
}