import Image from 'next/image'
import { Oswald } from '@next/font/google'
import { Icon } from '@iconify/react'
import React,{ useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useFormik, FormikProvider, Form } from 'formik';
import * as Yup from 'yup'
import axios, { AxiosError, isAxiosError } from 'axios'
import Header from '@/components/Header';


const oswald = Oswald({ subsets: ['latin'] })

export default function Home() {

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    const isConnected = localStorage.getItem("isConnected");
    if(!isConnected) router.push('/');
    const queryParameters = new URLSearchParams(window.location.search);
    const email = queryParameters.get("mail");
    const password = queryParameters.get("password");

    if(email && password){
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password })
      .then((response)=>{ 
        const { id, accessToken, firstName, email, role, company} = response.data;

        localStorage.setItem("userId",id);
        localStorage.setItem("token",accessToken);
        localStorage.setItem("firstName",firstName);
        localStorage.setItem("email",email);
        localStorage.setItem("role",role);
        localStorage.setItem("isConnected",true);

        console.log(`user ${localStorage.getItem("firstName")} is connected`);
        
        if(role==='REFERENT'){
          localStorage.setItem("company",company.companyName);
          localStorage.setItem("companyType",company.companyType);
          if(company.companyType==='PUBLIC'){       
            router.push('/public-company');
          } else if(company.companyType==='PRIVATE'){       
            router.push('/private-company');
          }
        }else if(role==='ADMIN'){
          router.push('/admin');
        }else{
          router.push('/');
        }
       })
      .catch((error)=>{
        router.push('/');
        setHasError(true);
        console.log('error : ', error);
        if(error.response.status){
          setErrorStatus(error.response.status);
        } else {
          setErrorStatus(error);
        }
      })
    }else{
    // Perform localStorage action
      localStorage.setItem("isConnected",false);
    }

}, []);

  axios.defaults.withCredentials=true;
  const LoginSchema = Yup.object().shape({ 
    email: Yup.string().email("votre e-mail doit être valide").required("votre e-mail est requis"),
    password: Yup.string().min(5, "votre mot de passe doit avoir au moins 5 caractères").required("votre mot de passe est requis")
   });
  const formik = useFormik({ 
    initialValues: { 
      email:"",
      password:"",
     },
     validationSchema: LoginSchema,
     onSubmit: ({ email, password })=>{ 
      setHasError(false);
      setErrorStatus("");
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password })
      .then((response)=>{ 
        const { id, accessToken, firstName, email, role, company} = response.data;
        
        localStorage.setItem("userId",id);
        localStorage.setItem("token",accessToken);
        localStorage.setItem("firstName",firstName);
        localStorage.setItem("email",email);
        localStorage.setItem("role",role);
        localStorage.setItem("isConnected",true);

        console.log(`user ${localStorage.getItem("firstName")} is connected`);
        
        if(role==='REFERENT'){
          localStorage.setItem("company",company.companyName);
          localStorage.setItem("companyType",company.companyType);
          if(company.companyType==='PUBLIC'){       
            router.push('/public-company');
          } else if(company.companyType==='PRIVATE'){       
            router.push('/private-company');
          }
        }else if(role==='ADMIN'){
          router.push('/admin');
        }else{
          router.push('/');
        }
       })
      .catch((error)=>{ 
        setHasError(true);
        console.log('error : ', error);
        if(error.response.status){
          setErrorStatus(error.response.status);
        } else {
          setErrorStatus(error);
        }
      })
     }

  }); 
  const {errors, touched, getFieldProps} = formik;

  return (
    <main className='bg-white flex flex-col justify-between'>
      <Header hasSignedIn={false} />
      <section className='md:flex md:w-full md:h-[92%] md:items-start md:justify-between bg-white'>
        <FormikProvider value={formik}>
          <Form className='w-[100%] md:w-1/2 h-[100%] mt-4 p-4 bg-white flex flex-col items-center' autoComplete='off' onSubmit={formik.handleSubmit}>
            <h1 className={oswald.className}>
              <div className='text-secondary text-5xl md:text-7xl font-bold'>Bienvenue sur</div>
              <div className='text-primary text-5xl md:text-7xl font-bold'>Match-Making</div>
            </h1>
            {
             hasError? <span className='w-full p-2 mt-4 bg-error bg-opacity-80 text-white flex justify-center'><Icon icon="material-symbols:warning-outline-rounded" width={24} className='text-white mr-2' />{errorStatus ? `erreur : utilisateur ou mot de passe incorrect`:`erreur : ${errorStatus}`}</span> : <></>
            }
            <div className={hasError ? 'w-[80%] md:w-[59%] md:mt-5 md:mb-5 flex flex-col justify-start space-y-2':'w-[80%] md:w-[59%] mt-14 mb-5 flex flex-col justify-start space-y-2'}>
              <h2 className='text-secondary text-lg font-medium'>Identifiant utilisateur</h2>
              <div className='w-full p-3 border border-primary flex items-centers'>
                <Icon icon="mdi:user-circle-outline" width={24} className='text-secondary' />
                <input type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" placeholder="ex: monemail@email.em" required {...getFieldProps('email')} value={formik.values.email} onChange={formik.handleChange} onError={()=>Boolean(touched.email && errors.email)} className='bg-white mx-2  w-4/5 border-none focus:outline-none text-secondary' />
              </div>            
            </div>
            <div className='w-[80%] md:w-[59%] mt-3 md:mt-5 mb-10 flex flex-col justify-start space-y-2'>
              <h2 className='text-secondary text-lg font-medium'>Mot de passe</h2>
              <div className='w-full p-3 border border-primary flex items-centers'>
                <Icon icon="material-symbols:lock-outline" width={24} className='text-secondary' />
                <input type={ isPasswordVisible ? "text" : "password" } placeholder="ex: mon mot de passe" required {...getFieldProps('password')} value={formik.values.password} onChange={formik.handleChange} onError={()=>formik.setErrors} className='bg-white mx-2 w-4/5 border-none focus:outline-none text-secondary' />
                <button type='button' className='w-1/7' onClick={()=>setIsPasswordVisible(!isPasswordVisible)}><Icon icon={ isPasswordVisible ? "mdi:eye-off" : "ic:baseline-remove-red-eye" } width={24} className='text-primary' /></button>
              </div>  
            </div>
            <div className='w-[80%] md:w-[59%] border border-primary flex flex-col justify-start space-y-2 mb-24'>
              <button type="submit" className='w-full border border-primary bg-primary text-white font-semibold p-3 hover:bg-opacity-50'>Connectez-vous</button>  
            </div>          
          </Form>
        </FormikProvider>
        <div className='hidden md:w-1/2 md:h-full md:flex md:justify-end md:relative'>
          <div>
            <Image src="/images/match_making_bg.png" alt='match-making background' width={600} height={600} className='absolutes' />
          </div>          
        </div>
      </section>
    </main>
  )
}
