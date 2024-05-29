import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import AppContext from '../AppContext';
import CustomSwitchBig from '../components/CustomSwitchBig';
import Find from '../components/Find';
import Rent from '../components/Rent';
import Liked from '../components/Liked';
import { getAllProperties } from '../api/property';
import { message } from 'antd';

const Dashboard = () => {
    const {user,properties,setProperties,loading,setLoading} = useContext(AppContext);
    const [currPage,setCurrPage] = useState('Find');

    useEffect(()=>{
        ;(async ()=>{
            try {
                setLoading(true);
                const response = await getAllProperties();
                if(Array.isArray(response)){
                    setProperties(response);
                }else{
                    message.error('Error while fetching properties');
                }
            } catch (errr) {
                message.error('Error while fetching properties');
            } finally {
                setLoading(false);
            }
        })();
    },[])

    return (
        <div className='h-full w-full flex flex-col items-center'>
            <div className='p-2 w-1/2'>
                <CustomSwitchBig currOption={currPage} setOption={setCurrPage} options={['Find','Rent','Liked']}/>
            </div>
            <div className='w-full flex items-center justify-center'>
                {currPage==='Find' ? <Find/> : (currPage==='Rent' ? <Rent/> : <Liked/>)}
            </div>
        </div>
    )
}

export default Dashboard;