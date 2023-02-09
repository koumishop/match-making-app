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

export default function PublicDashboard() {
    const [hasSuccess, setHasSuccess] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorStatus, setErrorStatus] = useState("");
    const [appointmentTime, setAppointmentTime] = useState(new Date().getHours(), ":",new Date().getMinutes() );
    const [privateCompanyId, setPrivateCompanyId] = useState("");
    const [user, setUser] = useState({});
    const [appointments, setAppointments] = useState({});
    const [isLoading, setIsLoading] = useState(true);

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
    const privateCompany={
        "count": 1,
        "rows": [
          {
            "id": "dafde8f0-85c7-40f3-8e04-d47aafa6c7ef",
            "companyName": "Mon petit truc en plus",
            "adress": "25 Av. du Tourisme C/ Ngaliema",
            "companyType": "PRIVATE",
            "createdAt": "2023-02-02T16:12:03.000Z",
            "updatedAt": "2023-02-02T16:12:03.000Z"
          }
        ]
      }; 
    const meetPlace = "Salon Congo";
    const handleChangePrivateCompanyId = (event)=>{
        setPrivateCompanyId(event.target.value);
        console.log("**** company : ", event.target.value);
    }
    const handleChangeAppointmentTime = (event)=>{
        setAppointmentTime(event.target.value)
        console.log("**** time : ", event.target.value);
    }
    const handleSubmit = ()=>{
        console.log("private company : ", privateCompany, " time : ", appointmentTime);
    //       setHasError(false);
    //       setErrorStatus("");
    //       axios.post(`${process.env.NEXT_PUBLIC_API_URL}/appointments/`, { appointmentTime, privateCompanyId }, { headers:{ 'x-access-token': `${localStorage.getItem('token')}` } })
    //       .then((response)=>{ 
    //         setHasSuccess(true);
    //         formik.values.privateCompanyId = "";
    //         formik.values.appointmentTime = "";
    //         console.log(response);
    //        })
    //       .catch((error)=>{ 
    //         setHasError(true);
    //         console.log('error : ', error);
    //         if(error.response.status){
    //           setErrorStatus(error.response.status);
    //         } else {
    //           setErrorStatus(error);
    //         }
    //       })
    }
    // const MeetSchema = Yup.object().shape({ 
    //     appointmentTime: Yup.date("votre heure doit être valide").required("votre heure de rendez-vous est requis"),
    //     privateCompanyId: Yup.string().required("le prestataire à rencontrer est requis")
    //    });
    
    // const formik = useFormik({ 
    //     initialValues: { 
    //       appointmentTime:"",
    //       privateCompanyId:"",
    //      },
    //      validationSchema: MeetSchema,
    //      onSubmit: ({ appointmentTime, privateCompanyId })=>{ 
    //         console.log("private company : ", privateCompany, " time : ", appointmentTime);
    //       setHasError(false);
    //       setErrorStatus("");
    //       axios.post(`${process.env.NEXT_PUBLIC_API_URL}/appointments/`, { appointmentTime, privateCompanyId }, { headers:{ 'x-access-token': `${localStorage.getItem('token')}` } })
    //       .then((response)=>{ 
    //         setHasSuccess(true);
    //         formik.values.privateCompanyId = "";
    //         formik.values.appointmentTime = "";
    //         console.log(response);
    //        })
    //       .catch((error)=>{ 
    //         setHasError(true);
    //         console.log('error : ', error);
    //         if(error.response.status){
    //           setErrorStatus(error.response.status);
    //         } else {
    //           setErrorStatus(error);
    //         }
    //       })
    //      }
    
    //   }); 
    //   const {errors, touched, getFieldProps} = formik;
    

    return (
        <main className={`${montserrat.className} bg-white w-screen flex flex-col`}>
            <Header hasSignedIn={true} />
            <section className='w-[100%] flex items-start'>
                <div className='w-[60%] h-full mr-4'>
                        <form className='w-[100%] h-[100%] mt-4 pt-4 pl-24 bg-white flex flex-col items-start justify-start' autoComplete='off' onSubmit={handleSubmit}>
                            <h1 className={oswald.className}>
                                <div className='text-secondary text-7xl font-bold'>Prendre un</div>
                                <div className='text-primary text-7xl font-bold'>Rendez-vous</div>
                            </h1>
                            <span className='text-secondary my-3'>Remplissez ce formulaire et nous vous enverrons une confirmation de rendez-vous</span>
                            {
                            hasError? <span className='w-full p-2 mt-4 bg-error bg-opacity-80 text-white flex justify-center'><Icon icon="material-symbols:warning-outline-rounded" width={24} className='text-white mr-2' />{errorStatus ? `erreur : utilisateur ou mot de passe incorrect`:`erreur : ${errorStatus}`}</span> : hasSuccess? <span className='w-full p-2 mt-4 bg-error bg-opacity-80 text-white flex justify-center'><Icon icon="mdi:success-circle-outline" width={24} className='text-white mr-2' />{`succès : le rendez-vous est pris, attendez sa confirmation`}</span> : <></>
                            }   
                            <div className={hasError ? 'w-[59%] mt-5 mb-5 flex flex-col justify-start space-y-2':'w-[59%] mt-1 mb-5 flex flex-col justify-start space-y-2'}>
                                <h2 className='text-secondary text-lg font-medium'>Entreprise du secteur à contacter</h2>
                                <div className='w-full p-3 border border-primary flex items-centers'>
                                    <Icon icon="ic:baseline-work-outline" width={24} className='text-secondary' />
                                    <select required value={privateCompanyId} onChange={handleChangePrivateCompanyId} className='bg-white mx-2  w-4/5 border-none focus:outline-none text-secondary'>
                                        {
                                            privateCompany.rows.map((row)=>(<option value={row.id} key={row.id}>{row.companyName}</option>))
                                        }
                                    </select>
                                </div>            
                            </div>
                            <div className='w-[59%] mt-5 mb-10 flex flex-col justify-start space-y-2'>
                                <h2 className='text-secondary text-lg font-medium'>Heure de rendez-vous</h2>
                                <div className='w-full p-3 border border-primary flex items-centers'>
                                    <Icon icon="material-symbols:nest-clock-farsight-analog-outline-rounded" width={24} className='text-secondary' />
                                    <input type="text" value={meetPlace} disabled className='bg-white mx-2  w-[40%] border-none focus:outline-none text-secondary text-opacity-60 font-bold' />
                                    <input type="time" required value={appointmentTime} onChange={handleChangeAppointmentTime} className='bg-white mx-2 w-[25%] border-none focus:outline-none text-secondary' />
                                </div>  
                            </div>
                            <div className='w-[59%] border border-primary flex flex-col justify-start space-y-2 mb-24'>
                                <button type="submit" className='w-full border border-primary bg-primary font-semibold p-3 hover:bg-opacity-50'>Validez le rendez-vous</button>  
                            </div>                                                
                        </form>
                </div>
                <div className='w-[40%] h-full flex relative'>
                    <div className='relative'>
                        <Image src="/images/match_making_bg.png" alt='match-making background' width={600} height={600} className='absolutes' />
                    </div>          
                </div>
            </section>
            <section className='w-[100%] flex items-start'>
                <div className='w-[60%] pl-24 pb-20'>
                    <h1 className={oswald.className}>
                        <div className='text-secondary text-7xl font-bold'>{`Agenda ${user.company}`}</div>
                        <div className='text-primary text-7xl font-bold'>Nos Rendez-vous</div>
                    </h1>
                    {
                        isLoading? <span> En cours de chargement ... </span>: appointments.userAppointments.rows.length === 0 ? <span>Vous n'avez aucun rendez-vous</span>: appointments.userAppointments.rows.map((row, idx)=>{ return (<Appointments key={idx} appointment={row} company={appointments.company}/>)})
                    }
                </div>

            </section>
        </main>
    );
}