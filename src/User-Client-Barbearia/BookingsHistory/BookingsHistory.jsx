import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';

import './BookingsHistory.css'

import { IoArrowBackSharp } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { PiTimerLight } from "react-icons/pi";
import { CiCalendar } from "react-icons/ci";
import { GiSandsOfTime } from "react-icons/gi";
import { BsCalendar2Check } from "react-icons/bs";

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

const [expandedCardBooking, setExpandedCardBooking] = useState([]);

//Function to expanded booking cards
const toggleItem = (itemId) => {
    if (expandedCardBooking.includes(itemId)) {
      setExpandedCardBooking(expandedCardBooking.filter(id => id !== itemId));
    } else {
      setExpandedCardBooking([...expandedCardBooking, itemId]);
    }
};
    const [allBookings, setAllBookings] = useState ([]);
    const [message, setMessage] = useState ('');

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
console.log(allBookings)
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
                <div className='section__bookings__history'>
                    {allBookings.map((booking, index) => (
                        <div key={index} className='Box__bookings__history'>
                        <div className='box__status__bookings__history'>
                            <GiSandsOfTime style={{color: '#fff', fontSize: '40px'}}/>
                            <p className='status__bookings__history' style={{color: '#fff'}}>Agendado</p>
                        </div>

                        <div className='body__bookings__history' style={{color: '#fff'}}>
                            <p className='date__bookings__history' style={{color: '#fff'}}>
                                {booking.bookingDate}
                            </p>
                            <div className='innner__bookings__history'>
                                <p>Corte Navalhado</p>
                                <div className='time__bookings__history' style={{color: '#fff'}}>
                                    <p className='price__service__bookings__history' style={{color: '#fff'}}>R$30,00 | </p>
                                    <PiTimerLight className='icon__PiTimerLight'/>
                                    <p>09:30 - 10:15 pm</p>
                                </div>
                            </div>
                        </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
export default BookingsHistory