import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';

import './BookingsHistory.css'

import { IoArrowBackSharp } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { PiTimerLight } from "react-icons/pi";
import { GiSandsOfTime } from "react-icons/gi";

const numbersMonth = {
    Jan: 1,
    Fev: 2,
    Mar: 3,
    Abr: 4,
    Maio: 5,
    Jun: 6,
    Jul: 7,
    Ago: 8,
    Set: 9,
    Out: 10,
    Nov: 11,
    Dez: 12
}

function BookingsHistory (){
    const urlApi = 'https://barbeasy.up.railway.app'

    const navigate = useNavigate();

    //Buscando informações do usuário logado
    const token = localStorage.getItem('token');
    const userDataFromLocalStorage = localStorage.getItem('userData');//Obtendo os dados salvo no localStorage
    const userInformation = JSON.parse(userDataFromLocalStorage);//trasnformando os dados para JSON
    const userId = userInformation.user[0].id;

    const handleBackClick = () => {
        navigate("/Home");
    };
    
    const date = new Date()
    const currentDate = new Date();

    // Formate cada parte da data com padStart para garantir que tenham dois dígitos quando necessário
    const day = String(currentDate.getDate()).padStart(2, '0');
    const year = String(currentDate.getFullYear());
    const month = String(currentDate.getMonth() + 1).padStart(1);
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    // Concatene as partes formatadas
    const formattedDate = Number(`${day}${year}${month}${hours}${minutes}`);


    const [expandedCardBooking, setExpandedCardBooking] = useState([]);
    const [allBookings, setAllBookings] = useState ([]);
    const [message, setMessage] = useState ('');

    
    //Function to expanded booking cards
    const toggleItem = (itemId) => {
        if (expandedCardBooking.includes(itemId)) {
        setExpandedCardBooking(expandedCardBooking.filter(id => id !== itemId));
        } else {
        setExpandedCardBooking([...expandedCardBooking, itemId]);
        }
    };

    const getAllBookings = () =>{
        axios.get(`${urlApi}/api/v1/bookingsOfUser/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
              }
        }).then(res =>{
            setAllBookings(res.data.Bookings)
            if(res.data.Success != 'Success'){
                setMessage('Nenhum agendamento encontrado.')
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            }
        }).catch(err =>{
            console.error('Erro ao buscar agendamentos', err)
        })
    }

    useEffect(() =>{
        getAllBookings()
    }, [])

    //passando os dados da barbearia selecionada
    const handleBookingClick = (booking) => {
        navigate("/BookingDetails", { state: { booking } });
    };
    return(
        <>
            <div className="container__profile__professional">
                <div className="header__bookings__history">
                    <div className="back">
                        <IoArrowBackSharp className="Icon__Back" onClick={handleBackClick}/>
                    </div>
                    <div className='tittle__historic'>
                        <h2>Histórico</h2>
                    </div>
                    <div className='Box__input__Search'>
                        <IoIosSearch id='lupa__in__bookings__history'/>
                        <input type="search" className='Inner__input__search' placeholder='Buscar agendamento'/>
                    </div>
                </div>
                {allBookings.length > 0 ?(
                    <div className='section__bookings__history'>
                    {allBookings.map((booking, index) => {
                        //Metodo para verificar se os horários do agendamentos já estão obsoletos, caso seja, será aplicado um estilo diferente nos agendamentos passados
                        const dayAndYearBooking = booking.bookingDate.replace(/[^0-9]/g, '');
                        const monthBooking = booking.bookingDate.match(/(Jan|Fev|Mar|Abr|Mai|Jun|Jul|Ago|Set|Out|Nov|Dez)/g, '');
                        const bookingTimes = booking.bookingTime.split(',')[booking.bookingTime.split(',').length-1].replace(/[^0-9]/g, '');
                        const valuesDateBooking = Number (dayAndYearBooking+numbersMonth[monthBooking]+bookingTimes)

                        return(
                            <div key={index} className={`Box__bookings__history ${formattedDate > valuesDateBooking ? 'colorTexts':''}`} onClick={() => handleBookingClick(booking)} >
                                <div className='box__status__bookings__history'>
                                    <GiSandsOfTime className={` ${formattedDate > valuesDateBooking ? 'icon__GiSandsOfTime':''}`} style={{fontSize: '40px'}}/>
                                    <p className={`status__bookings__history ${formattedDate > valuesDateBooking ? 'colorTexts':''}`}>Agendado</p>
                                </div>

                                <div className='body__bookings__history'>
                                    <p className='date__bookings__history'>
                                        {booking.bookingDate}
                                    </p>
                                    <div className='innner__bookings__history'>
                                        <p>{booking.serviceName}</p>
                                        <div className='time__bookings__history'>
                                            <p className='price__service__bookings__history'>{booking.servicePrice} | </p>
                                            <PiTimerLight className='icon__PiTimerLight'/>
                                            <p>{booking.bookingTime.split(',')[0]} - {booking.bookingTime.split(',')[booking.bookingTime.split(',').length-1]}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                ):(
                    <div className='box__message__no__bookings__history'>
                        <h3>Nenhum agendamento encontrado.</h3>
                    </div>
                )}
            </div>
        </>
    )
}
export default BookingsHistory