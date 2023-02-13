import { Icon } from '@iconify/react'
import { Montserrat } from '@next/font/google'

const montserrat = Montserrat({ subsets: ['latin'] });

export default function CompanyList() {
    return(
        <div className='w-full mb-4'>
            <div className={`${montserrat.className} font-medium w-[100%] text-secondary flex items-center`}>
                <div className='w-[15%] p-3 flex border border-primary'>
                    <Icon icon="material-symbols:work-outline" width={24} className='text-primary mr-2' />
                    Regideso
                    {/* {`${appointmentTimeStart} - ${appointmentTimeEnd}`} */}
                </div>
                <div className='w-[25%] p-3 flex border border-primary'>
                    <Icon icon="ic:outline-place" width={24} className='text-primary mr-2' />
                    59, Blvd du 30 Juin - Gombe
                    {/* {`${appointmentTimeStart} - ${appointmentTimeEnd}`} */}
                </div>
                <div className='w-[20%] p-3 flex border border-primary'>
                    <Icon icon="mdi:user-circle-outline" width={24} className='text-primary mr-2' />
                    Randy Buhendwa
                    {/* {`${appointmentTimeStart} - ${appointmentTimeEnd}`} */}
                </div>
                <div className='w-[28%] p-3 flex border border-primary'>
                    <Icon icon="ic:outline-mark-email-unread" width={24} className='text-primary mr-2' />
                    randy.buhendwa@gmail.com
                    {/* {`${appointmentTimeStart} - ${appointmentTimeEnd}`} */}
                </div>
                <div className='w-[20%] p-3 flex border border-primary'>
                    <Icon icon="bi:phone" width={24} className='text-primary mr-2' />
                    +243 822 561 854
                    {/* {`${appointmentTimeStart} - ${appointmentTimeEnd}`} */}
                </div>
            </div>
        </div>
    )
}