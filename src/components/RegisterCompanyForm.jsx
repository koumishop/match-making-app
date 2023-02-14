import { Icon } from '@iconify/react'
import { Montserrat, Oswald } from '@next/font/google'
import axios, { AxiosError, isAxiosError } from 'axios'
import { useEffect, useState } from 'react';


const montserrat = Montserrat({ subsets: ['latin'] });
const oswald = Oswald({ subsets: ['latin'] });

export default function RegisterCompanyForm() {
    const [hasSuccess, setHasSuccess] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorStatus, setErrorStatus] = useState("");
    const [selectedCompanyType, setSelectedCompanyType] = useState("");
    const [companyDesignation, setCompanyDesignation] = useState("");
    const [companyAdress, setCompanyAdress] = useState("");
    const [refName, setRefName] = useState("");
    const [refEmail, setRefEmail] = useState("");
    const [refPhone, setRefPhone] = useState("");
    
    
    const handleChangeCompanyType = (event)=>{
        setSelectedCompanyType(event.target.value);
    }
    const handleChangeCompanyDesignation = (event)=>{
        setCompanyDesignation(event.target.value);
    }
    const handleChangeCompanyAdress = (event)=>{
        setCompanyAdress(event.target.value);
    }
    const handleChangeRefName = (event)=>{
        setRefName(event.target.value);
    }
    const handleChangeRefEmail = (event)=>{
        setRefEmail(event.target.value);
    }
    const handleChangeRefPhone = (event)=>{
        setRefPhone(event.target.value);
    }
    const handleSubmit = ()=>{
        const refNames = refName.split(" "); 
        const company = {
            companyName: companyDesignation,
            adress: companyAdress,
            companyType: selectedCompanyType,
            firstName: refNames[0],
            lastName: refNames[1],
            email: refEmail,
            phoneNumber: refPhone
        }
        console.dir(
            {
                companyName: companyDesignation,
                adress: companyAdress,
                companyType: selectedCompanyType,
                firstName: refNames[0],
                lastName: refNames[1],
                email: refEmail,
                phoneNumber: refPhone
            }
        );
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/companies`, company, { headers:{ 'x-access-token': `${localStorage.getItem('token')}` } })
        .then((response)=>{ 
            setHasSuccess(true);
            console.dir(response);
            setCompanyDesignation('');
            setCompanyAdress('');
            setSelectedCompanyType('');
            setRefName('');
            setRefEmail('');
            setRefPhone('');
            setHasSuccess(false);
        })
        .catch((error)=>{ 
            setHasError(true);
            console.log('error : ', error);

            if(error.response.status){
                setErrorStatus(error.response.status);
            } else {
                setErrorStatus(error);
            }
        });
    }

    return(
        <div className='w-[60%] h-full mr-4 border border-primary'>
            <form className='w-[100%] h-[100%] mt-4 pt-4 pl-24 bg-white flex flex-col items-start justify-start' autoComplete='off' >
                {
                hasError? <span className='w-full p-2 mt-4 bg-error bg-opacity-80 text-white flex justify-center'><Icon icon="material-symbols:warning-outline-rounded" width={24} className='text-white mr-2' />{errorStatus ? `erreur : utilisateur ou mot de passe incorrect`:`erreur : ${errorStatus}`}</span> : hasSuccess? <span className='w-full p-2 mt-4 bg-primary bg-opacity-80 text-white flex justify-center'><Icon icon="mdi:success-circle-outline" width={24} className='text-white mr-2' />{`succès : le rendez-vous est pris, attendez sa confirmation`}</span> : <></>
                }
                <div className={hasError ? 'w-[59%] mt-5 mb-4 flex flex-col justify-start space-y-2':'w-[59%] mt-1 mb-5 flex flex-col justify-start space-y-2'}>
                    <h2 className='text-secondary text-lg font-medium'>Type Entreprise</h2>
                    <div className='w-full p-3 border border-primary flex items-centers'>
                        <Icon icon="material-symbols:home-work-outline-rounded" width={24} className='text-secondary' />
                        <select required value={selectedCompanyType} onChange={handleChangeCompanyType} className='bg-white mx-2  w-full border-none focus:outline-none text-secondary'>
                            <option value="" disabled>Selectionnez le type d'Etreprise</option>
                            <option value="PUBLIC">Publique</option>
                            <option value="PRIVATE">Privée</option>
                        </select>
                    </div>            
                </div>   
                <div className='w-[59%] mb-4 flex flex-col justify-start space-y-2'>
                    <h2 className='text-secondary text-lg font-medium'>Designation</h2>
                    <div className='w-full p-3 border border-primary flex items-centers'>
                        <Icon icon="ic:baseline-work-outline" width={24} className='text-secondary' />
                        <input type="text" placeholder="ex: mon entreprise" required value={companyDesignation} onChange={handleChangeCompanyDesignation} className='bg-white mx-2  w-4/5 border-none focus:outline-none text-secondary' />
                    </div>            
                </div>
                <div className='w-[59%] mb-4 flex flex-col justify-start space-y-2'>
                    <h2 className='text-secondary text-lg font-medium'>Adresse</h2>
                    <div className='w-full p-3 border border-primary flex items-centers'>
                        <Icon icon="ic:outline-place" width={24} className='text-secondary' />
                        <input type="text" placeholder="ex: 25 av. de l’equateur c/ gombe" required value={companyAdress} onChange={handleChangeCompanyAdress} className='bg-white mx-2  w-4/5 border-none focus:outline-none text-secondary' />
                    </div>            
                </div>
                <div className='w-[59%] mb-4 flex flex-col justify-start space-y-2'>
                    <h2 className='text-secondary text-lg font-medium'>Identité Reférent</h2>
                    <div className='w-full p-3 border border-primary flex items-centers'>
                        <Icon icon="mdi:user-circle-outline" width={24} className='text-secondary' />
                        <input type="text" placeholder="ex: prénom nom" required value={refName} onChange={handleChangeRefName} className='bg-white mx-2  w-4/5 border-none focus:outline-none text-secondary' />
                    </div>            
                </div>
                <div className='w-[59%] mb-4 flex flex-col justify-start space-y-2'>
                    <h2 className='text-secondary text-lg font-medium'>Adresse E-mail</h2>
                    <div className='w-full p-3 border border-primary flex items-centers'>
                        <Icon icon="ic:outline-mark-email-unread" width={24} className='text-secondary' />
                        <input type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" placeholder="ex: monemail@email.em" required value={refEmail} onChange={handleChangeRefEmail} className='bg-white mx-2  w-4/5 border-none focus:outline-none text-secondary' />
                    </div>            
                </div>
                <div className='w-[59%] mb-5 flex flex-col justify-start space-y-2'>
                    <h2 className='text-secondary text-lg font-medium'>Numéro Tel</h2>
                    <div className='w-full p-3 border border-primary flex items-centers'>
                        <Icon icon="bi:phone" width={24} className='text-secondary' />
                        <input type="text" placeholder="ex: +243 895 956 735" required value={refPhone} onChange={handleChangeRefPhone} className='bg-white mx-2  w-4/5 border-none focus:outline-none text-secondary' />
                    </div>            
                </div>
                <div className='w-[59%] border border-primary flex flex-col justify-start space-y-2 mb-24 text-white'>
                    <button onClick={handleSubmit} type="button" className='w-full border border-primary bg-primary font-semibold p-3 hover:bg-opacity-50'>Validez l’enregistrement</button>  
                </div>
            </form>
        </div>
    )
}