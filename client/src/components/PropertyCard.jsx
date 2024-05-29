import React, { useEffect, useState } from 'react'
import { Modal, ConfigProvider, message, Button } from 'antd';
import { useContext } from 'react';
import AppContext from '../AppContext';
import Logo from '../assets/logo.png'
import { FaIndianRupeeSign } from "react-icons/fa6";
import { GoHeart, GoHeartFill } from "react-icons/go";
import EditProperty from './EditProperty';
import { deleteProperty, getAllProperties, likeProperty, dislikeProperty } from '../api/property';
import emailjs from '@emailjs/browser'


const PropertyCard = ({property}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const {user,setUser,loading,setLoading,properties,setProperties} = useContext(AppContext);
    const [edit,setEdit] = useState(false);
    const [liked,setLiked] = useState(false);

    useEffect(()=>{
        if(user?.token && user?.likedProperties?.includes(property._id)){
            setLiked(true);
        }
    },[user])

    const quoteHandler = ()=>{
        setLoading(true);
        const templateParams = {
            to_email: user.email,
            to_name: user.firstName,
            subject: 'Property renting quote request',
            message: `This is in response to the property that you were interested in on our platform.\n\nProperty Reference:\nLocation: ${property.location}, ${property.city}\nRooms: ${property.bhk}\nArea: ${property.area} Yards\nPrice: INR ${property.price}\nNearby Facilities: ${property.nearbyFacilities.join(', ')}\n\nHere are the seller details:\nSeller Email: ${property.sellerEmail}\nSeller Phone: ${property.sellerPhone}\n\nPlease contact the seller for further details.\n`,
        };
        emailjs.send(String(import.meta.env.VITE_EMAILJS_SERVICE_NAME), String(import.meta.env.VITE_EMAILJS_TEMPLATE_NAME), templateParams, String(import.meta.env.VITE_EMAILJS_PUBLIC_KEY))
        .then((result) => {
            message.success('Quote sent to your mail successfully!');
        }, (error) => {
            message.error('Error sending quote to your mail');
        });

        const newTemplateParams = {
            to_email: property.sellerEmail,
            to_name: 'Renter',
            subject: 'Your property listing is getting attention!',
            message: `This is in response to the property that you have listed on our platform.\n\nProperty Reference:\nLocation: ${property.location}, ${property.city}\nRooms: ${property.bhk}\nArea: ${property.area} Yards\nPrice: INR ${property.price}\nNearby Facilities: ${property.nearbyFacilities.join(', ')}\n\nHere are the interested user's details:\nUser Email: ${user.email}\nUser Phone: ${user.phoneNumber}\n\nPlease contact the seller for further details.\n`,
        }
        emailjs.send(String(import.meta.env.VITE_EMAILJS_SERVICE_NAME), String(import.meta.env.VITE_EMAILJS_TEMPLATE_NAME), newTemplateParams, String(import.meta.env.VITE_EMAILJS_PUBLIC_KEY))
        .then((result) => {
            message.success('Quote request sent to seller successfully!');
        }, (error) => {
            message.error('Error sending quote request to seller');
        });
        setLoading(false);
    }

    const handleLike = async ()=>{
        try {
            setLoading(true);
            const response = await likeProperty(property._id,user);
            if(response?.token){
                setUser(response);
                localStorage.removeItem('currUser');
                localStorage.setItem('currUser',JSON.stringify(response));
                setLiked(true);
                const freshProperties = await getAllProperties();
                if(Array.isArray(freshProperties)){
                    setProperties(freshProperties);
                }
                message.success('Liked a property!');
            }
        } catch (error) {
            console.log('Error: ',error);
        } finally{
            setLoading(false);
        }
    }

    const handleDislike = async ()=>{
        try {
            setLoading(true);
            const response = await dislikeProperty(property._id,user);
            if(response?.token){
                console.log(response);
                setUser(response);
                localStorage.removeItem('currUser');
                localStorage.setItem('currUser',JSON.stringify(response));
                setLiked(false);
                const freshProperties = await getAllProperties();
                if(Array.isArray(freshProperties)){
                    setProperties(freshProperties);
                }
                message.success('Disliked a property');
            }
        } catch (error) {
            console.log('Error: ',error);
        } finally{
            setLoading(false);
        }
    }

    const deleteHandler = async ()=>{
        try {
            setLoading(true);
            const response = await deleteProperty(property._id,user);
            if(response.message){
                message.success('Property deleted successfully');
                const freshProperties = await getAllProperties();
                if(Array.isArray(freshProperties)){
                    setProperties(freshProperties);
                }
            }
        } catch (error) {
            message.error('Error deleting property');
        } finally {
            setLoading(false);
            setModalOpen(false);
        }
    }
    return (
        <>
            <div onClick={()=>setModalOpen(true)} className='w-full aspect-3/4 bg-primary/10 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/20 rounded-xl p-6 gap-3'>
                <div className='h-1/2 overflow-hidden flex items-center rounded-xl mb-1'>
                    <img src={property.image ? property.image : Logo} alt="" className='rounded-xl'/>
                </div>
                <div className='flex items-center gap-0 text-lg sm:text-xl'>
                    <span className='flex items-center gap-1'>
                        <FaIndianRupeeSign/>
                        {property.price}
                    </span>
                    <span>/month</span>
                </div>
                <div className='flex items-center gap-2 text-center'>
                    <span className='italic text-neutral-500'>{property.location}, {property.city}</span>
                </div>
                <div className='flex items-center justify-center gap-3 text-xl w-full'>
                    {user?.token && user.email===property.sellerEmail && <div className='italic text-sm leading-2 text-center w-1/2'>Hosted by you</div>}
                    <div className='flex items-center justify-center gap-1 w-1/2'>
                        {liked ? <GoHeartFill className='text-red-600' size={24}/> : <GoHeart/>}
                        <span className={`${liked ? 'text-red-500' : ''}`}>{property.likes}</span>
                    </div>
                </div>
            </div>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#00a200',
                    }
                }}
            >
                <Modal
                    centered
                    title={false}
                    footer={false}
                    open={modalOpen}
                    onCancel={()=>{setModalOpen(false); setEdit(false);}}
                    onClose={()=>{setModalOpen(false); setEdit(false);}}
                    onOk={()=>{setModalOpen(false); setEdit(false);}}
                    width={edit ? 'fit-content' : '400px'}
                >
                    {!edit ? <div className='flex flex-col items-center gap-4 p-3 sm:p-5 h-full'>
                        <div className='max-h-[35vh] overflow-hidden flex items-center rounded-xl'>
                            <img src={property.image ? property.image : Logo} alt="" className='rounded-xl'/>
                        </div>
                        <div className='flex items-center gap-1 text-xl'>
                            <span className='text-lg'>Price:</span>
                            <div className='flex items-center'>
                                <FaIndianRupeeSign className=''/>
                                <span className=''>{property.price}/Month</span>
                            </div>
                        </div>
                        <div className='flex gap-1 w-full'>
                            <div className='text-lg text-center flex items-center justify-center w-1/4'>Property Info:</div>
                            <div className='grid grid-cols-2 gap-1 p-2 text-nowrap rounded-xl bg-primary/20 w-3/4'>
                                <div className='gap-1 flex items-start justify-start'>
                                    Rooms: <span className='font-bold'>{property.bhk} BHK</span>
                                </div>
                                <div className='gap-1 flex items-start justify-start'>
                                    Area: <span className='font-bold'>{property.area} Yards</span>
                                </div>
                                <div className='col-span-2 gap-1 flex items-start justify-start'>
                                    Loaction: <span className='font-bold'>{property.location}</span>
                                </div>
                                <div className='gap-1 flex items-start justify-start'>
                                    City: <span className='font-bold'>{property.city}</span>
                                </div>
                                <div className='col-span-2 gap-0 flex flex-col items-start justify-start text-wrap'>
                                    <span>Nearby Facilities:</span>
                                    <span className='font-bold'>{property.nearbyFacilities.join(', ')}</span>
                                </div>
                            </div>
                        </div>
                        {user?.token ? 
                        <div className='flex gap-1 w-full'>
                            <div className='text-lg text-center flex items-center justify-center w-1/4'>Seller Info:</div>
                            <div className='grid grid-cols-1 gap-1 p-2 text-nowrap rounded-xl bg-primary/20 w-3/4'>
                                <div className='gap-1 flex items-start justify-start'>
                                    Email: <span className='font-bold'>{property.sellerEmail}</span>
                                </div>
                                <div className='gap-1 flex items-start justify-start'>
                                    Phone Number: <span className='font-bold'>{property.sellerPhone}</span>
                                </div>
                            </div>
                        </div> : <div className='text-lg'>Login to see seller information</div>}

                       

                        {user?.token && 
                        <div className='flex items-center gap-1'>
                            <div onClick={liked ? handleDislike : handleLike} className='flex items-center gap-1 text-[15px] bg-red-600/20 px-3 py-[4.5px] rounded-md hover:bg-red-600/60 hover:text-white cursor-pointer duration-200 transition-all'>
                                {!liked ? <GoHeart/> : <GoHeartFill className='text-red-600' />}
                                <span>{liked ? 'Dislike' : 'Like'}</span>
                            </div>
                            {user.email!==property.sellerEmail ?
                            <Button onClick={quoteHandler} className='bg-primary text-white'>Get Quote</Button> : 
                            <div className='flex items-center gap-1'>
                                <Button onClick={()=>setEdit(true)} className='bg-primary border-primary text-white'>Edit Property</Button>
                                <ConfigProvider theme={{token:{colorPrimary:'red'}}}><Button onClick={deleteHandler} className='border-red-600 text-red-600'>Delete Property</Button></ConfigProvider>
                            </div>}
                        </div>
                        }
                    </div> : <EditProperty property={property} setModalOpen={setModalOpen}/>}
                </Modal>
            </ConfigProvider>
        </>
    )
}

export default PropertyCard;