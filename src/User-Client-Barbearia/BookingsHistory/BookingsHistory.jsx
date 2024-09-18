import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';

import './BookingsHistory.css'

import { IoArrowBackSharp } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { PiTimerLight } from "react-icons/pi";
import { CiBookmarkCheck } from "react-icons/ci";
import { BsCalendar2Check } from "react-icons/bs";
import { FaLayerGroup } from "react-icons/fa";

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

    const currentDate = new Date();

    // Formate cada parte da data com padStart para garantir que tenham dois dígitos quando necessário
    const day = String(currentDate.getDate()).padStart(2, '0');
    const year = String(currentDate.getFullYear());
    const month = String(currentDate.getMonth() + 1).padStart(1);
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');

    const currentMonthAndYear = Number (`${month}` + `${year}`)
    const currentDay = Number(day)
    const currentTime = Number(`${hours}` + `${minutes}`)

    // Concatene as partes formatadas
    const handleBackClick = () => {
        navigate("/Home");
    };

    //passando os dados da barbearia selecionada
    const handleBookingClick = (booking) => {
        navigate("/BookingDetails", { state: { booking } });
    };

    const [allBookings, setAllBookings] = useState ([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState (true);

    const getAllBookings = () =>{
        axios.get(`${urlApi}/api/v1/bookingsOfUser/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
              }
        }).then(res =>{
            if(res.data.Bookings === 0){
                return setIsLoading(false)
            }
            setAllBookings(res.data.Bookings)
            setIsLoading(false)
                
        }).catch(err =>{
            setIsLoading(false)
            console.error('Erro ao buscar agendamentos', err)
        })
    }

    useEffect(() =>{
        getAllBookings()
    }, [])

    // Convertendo o valor do search para minúsculo
    const searchLowerCase = search.toLowerCase();

    // Buscando Barbearia pelo input Search
    const bookingSearch = allBookings.filter((booking) =>
        booking.bookingDate.toLowerCase().includes(searchLowerCase) ||
        booking.serviceName.toLowerCase().includes(searchLowerCase) ||
        booking.servicePrice.toLowerCase().includes(searchLowerCase) ||
        booking.barbeariaName.toLowerCase().includes(searchLowerCase) ||
        booking.bookingTime.toLowerCase().includes(searchLowerCase)
    );
    
    function campareCurrentDateWithBookingDate(monthAndYearBookings, bookingDay, bookingTime){
        if(currentMonthAndYear === monthAndYearBookings){
            if(currentDay === bookingDay){
                if(currentTime > bookingTime){
                    return true
                }else{
                    return false
                }
            }else{
                if(currentDay > bookingDay){
                    return true
                }else{
                    return false
                }
            }
        }else{
            if (currentMonthAndYear > monthAndYearBookings){
                    return true
                }else{
                    return false
                }
            }
    }

    return(
        <>
            <div className="container__profile__professional">
                <div className="header__bookings__history">
                    <div className="back">
                        <IoArrowBackSharp className="Icon__Back" onClick={handleBackClick}/>
                    </div>
                    <div className='tittle__historic'>
                        <FaLayerGroup className='icon__FaLayerGroup'/>
                        <h2>Histórico</h2>
                    </div>
                    <div className='Box__input__Search'>
                        <IoIosSearch id='lupa__in__bookings__history'/>
                        <input type="search" className='Inner__input__search' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Buscar agendamento'/>
                    </div>
                </div>
                {isLoading?(
                    <div className='container__loading__in__bookings__history'>
                        <div className="loaderCreatingBooking"></div>
                    </div>
                ):(
                    <>
                        {allBookings.length > 0 ?(
                            <div className='section__bookings__history'>
                            {bookingSearch.map((booking, index) => {
                                //obtendo o mês e o ano do agandamento
                                const yearBooking = Number (booking.bookingDate.substring(17).replace(/[^0-9]/g, ''));
                                const monthBooking = booking.bookingDate.match(/(Jan|Fev|Mar|Abr|Mai|Jun|Jul|Ago|Set|Out|Nov|Dez)/g, '');
                                const monthAndYearBookings = Number (`${numbersMonth[monthBooking]}` + `${yearBooking}`);
                                //obtendo o dia do agendamento
                                const bookingDay = Number (booking.bookingDate.split(', ')[1].split(' ')[0]);
                                //Obtendo o horário inicial do agendamento
                                const bookingTimes = Number (booking.bookingTime.split(',')[booking.bookingTime.split(',').length-1].replace(/[^0-9]/g, ''));

                                let isTrue;

                                return(
                                    <div key={index} className={`Box__bookings__history ${isTrue = campareCurrentDateWithBookingDate(monthAndYearBookings, bookingDay, bookingTimes) ? 'colorTexts':''}`} onClick={() => handleBookingClick(booking)} >
                                        <div className='box__status__bookings__history'>
                                            {isTrue = campareCurrentDateWithBookingDate(monthAndYearBookings, bookingDay, bookingTimes) ?(
                                                <>
                                                    <BsCalendar2Check className='icon__GiSandsOfTime' style={{fontSize: '40px'}}/>
                                                    <p className='status__bookings__history'>Finalizado</p>
                                                </>
                                            ):(
                                                <>
                                                    <CiBookmarkCheck className='icon__CiBookmarkCheck' style={{fontSize: '40px'}}/>
                                                    <p className='status__bookings__history'>Agendado</p>
                                                </>
                                            )}
                                            
                                            
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
                    </>
                )}
                
            </div>
        </>
    )
}
export default BookingsHistory