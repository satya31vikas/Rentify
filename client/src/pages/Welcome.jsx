import React, {useContext, useEffect} from 'react'
import WelcomeImg from '../assets/welcome.jpg'
import { FaCircleArrowRight } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import AppContext from '../AppContext';


const Welcome = () => {
    const navigate = useNavigate();
    const {user} = useContext(AppContext);
    useEffect(()=>{
        if(user?.token){
            navigate('/dashboard');
        }
    },[])
    return (
        <div 
            className='flex items-center justify-center w-full h-full relative overflow-hidden'
            style={{
                backgroundImage: `url(${WelcomeImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className='z-10 flex flex-col items-center gap-10'>
                <h1 className=' text-5xl sm:text-7xl font-[650] text-center'>
                    <span className='text-white'>Welcome to</span>
                    <br/>
                    <span className='font-[1000] text-7xl sm:text-9xl text-green-500'>Rentify</span>
                </h1>
                <div onClick={()=>navigate('/dashboard')} className='flex items-center gap-2 hover:underline hover:scale-110 duration-150 cursor-pointer text-neutral-800'>
                    <span className='text-xl'>Find your home now</span>
                    <FaCircleArrowRight size={20}/>
                </div>
            </div>
        </div>
    )
}

export default Welcome;