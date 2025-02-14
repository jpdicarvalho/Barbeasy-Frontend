import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom"
import axios from 'axios';

import './ScheduleBarbearia.css';
import { BsCalendar2Check } from "react-icons/bs";
import { IoArrowBackSharp } from "react-icons/io5";
import { SlGraph } from "react-icons/sl";
import { GrAppsRounded } from "react-icons/gr";
import { CiLogout } from "react-icons/ci";
import { IoHomeOutline } from "react-icons/io5";
import { BsGraphDownArrow } from "react-icons/bs";
import { GiRazor } from "react-icons/gi";
import { MdOutlineTimer } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { RiExchangeFundsLine } from "react-icons/ri";
import { PiContactlessPayment } from "react-icons/pi";
import { GiReceiveMoney } from "react-icons/gi";

const monthNames = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];
const weekNames = [
    'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
];

function ScheduleBarbearia() {

    const navigate = useNavigate();

    const date = new Date();

    const options = { weekday: 'short', locale: 'pt-BR' };
    const day = date.getDate();
    let dayOfWeek = date.toLocaleDateString('pt-BR', options);
    dayOfWeek = dayOfWeek.slice(0, -1);
    dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const currenteDate = `${dayOfWeek}, ${day} de ${month} de ${year}`;

    //Buscando informações do usuário logado
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('dataBarbearia');//Obtendo os dados salvo no localStorage
    const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
    const barbeariaId = userInformation.barbearia[0].id;

    const urlApi = 'https://barbeasy.up.railway.app'
    const urlCloudFront = "https://d15o6h0uxpz56g.cloudfront.net/"


const navigateToProfileBarbearia = () =>{
    navigate("/ProfileBarbearia");
}

const navigateToHomeBarbearia = () =>{
    navigate("/HomeBarbearia");
}

const navigateStatisticBarbearia = () =>{
    navigate("/StatisticBarbearia");
}

const handleBackClick = () => {
    navigate("/HomeBarbearia");
  };


//Função LogOut
const logoutClick = () => {
    ['token', 'dataBarbearia', 'code_verifier', 'AmountVisibility'].forEach(key => localStorage.removeItem(key));
    navigate("/");
};
//================ Get date ====================

  //Função para pegar os dias da semana
  function getWeeks() {
    const arrayWeeks = [];
    const startIndex = weekNames.indexOf(dayOfWeek);
    const lastDayToShow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 30);

    for (let i = 0; i < 30; i++) {
      const currentDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + i);
      const index = (startIndex + i) % 7;
      const nameWeek = weekNames[index];

      if (currentDay <= lastDayToShow) {
        arrayWeeks.push(nameWeek);
      }
    }

    return arrayWeeks;
  }

  //Função para gerar a quantidade de dias que a agenda vai ficar aberta
  function getNumber() {
    const numbersWeek = [];
    const lastDayToShow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 30);
  
    for (let i = 0; i < 30; i++) {
      const currentDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + i);
      const numberWeek = currentDay.getDate();
      const isCurrentDay = currentDay.toDateString() === date.toDateString();
      const month = monthNames[currentDay.getMonth()]; // Obtém o nome do mês
  
      if (currentDay <= lastDayToShow) {
        numbersWeek.push({
          number: numberWeek,
          isCurrentDay: isCurrentDay,
          month: month, // Adiciona o nome do mês ao objeto
        });
      }
    }
  
    return numbersWeek;
  }

  const weekDays = getWeeks();
  const numberDays = getNumber();

//================ Get Bookings ================
//Função para pegar os dias da semana
const [bookings, setBookings] = useState(false);
const [expandedCardBooking, setExpandedCardBooking] = useState([]);
const [messagemNotFound, setMessagemNotFound] = useState("");

const [selectedDay, setSelectedDay] = useState(false);

//function to order all bookings by date
function orderBookings(bookings) {
  // Ordenação dos bookings por menor horário (booking_time)
  bookings.sort((a, b) => {
    const [horaA, minutoA] = a.booking_time.split(',')[0].split(':'); // Primeiro horário de a
    const [horaB, minutoB] = b.booking_time.split(',')[0].split(':'); // Primeiro horário de b

    const horarioCompletoA = Number(horaA) * 60 + Number(minutoA); // Horário completo em minutos para a
    const horarioCompletoB = Number(horaB) * 60 + Number(minutoB); // Horário completo em minutos para b

    // Comparação de horários completos (menor para maior)
    if (horarioCompletoA < horarioCompletoB) {
      return -1; // a vem antes de b
    } else if (horarioCompletoA > horarioCompletoB) {
      return 1; // b vem antes de a
    } else {
      return 0; // horários são iguais
    }
  });
}

//Function to get all bookings of today
const handleDateClick = (dayOfWeek, day, month, year) => {
    if(dayOfWeek && day && month && year){
        setSelectedDay(`${dayOfWeek}, ${day} de ${month} de ${year}`)
        let selectedDate = `${dayOfWeek}, ${day} de ${month} de ${year}`;
    
        axios.get(`${urlApi}/api/v1/bookings/${barbeariaId}/${selectedDate}`, {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            if(res.data.Message === "true"){
            setBookings(res.data.bookings);
            // Chamando a função para ordenar os bookings por menor horário
            orderBookings(bookings || []);
            }else{
            setBookings(false)
            setMessagemNotFound("Sem agendamento por enquanto...")
            }
        })
        .catch(err => {
            if(err.response.status === 403){
                return navigate("/SessionExpired")
              }
            console.log(err)});   
    }else{
        //Condition to get all bookings of current day
        let selectedDate = currenteDate;
        axios.get(`${urlApi}/api/v1/bookings/${barbeariaId}/${selectedDate}`, {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            if(res.data.Message === "true"){
            setBookings(res.data.bookings);
            // Chamando a função para ordenar os bookings por menor horário
            orderBookings(bookings || []);
            }else{
            setBookings(false)
            setMessagemNotFound("Sem agendamento por enquanto...")
            }
        })
        .catch(err => {
            if(err.response.status === 403){
                return navigate("/SessionExpired")
              }
            console.log(err)});
    }
}

useEffect(() =>{
    handleDateClick()
}, [])

//Function to formatted received amount
function formattedTransactionAmount (transaction_amount){
    let amountFormatted = Number (transaction_amount).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    return amountFormatted;
  }
  
//Function to expanded booking cards
const toggleItem = (itemId) => {
    if (expandedCardBooking.includes(itemId)) {
      setExpandedCardBooking(expandedCardBooking.filter(id => id !== itemId));
    } else {
      setExpandedCardBooking([...expandedCardBooking, itemId]);
    }
};

return (
    <div className="container__main__Schedule__barbearia" translate="no">
        <div className="header__bookings__schedule" translate="no">
            <div className="back__in__schedule">
                <IoArrowBackSharp className="Icon__Back" onClick={handleBackClick}/>
            </div>
            <div className='inner__header__agenda'>
                <BsCalendar2Check className='icon__RiExchangeFundsLine'/>   
                <h2>Agenda</h2>
            </div>
            <p className='text__schedule__information'>{selectedDay ? selectedDay:currenteDate}</p>
            
            <div className='container__Calendar'>
            <div className='sectionCalendar'>
                <div className="list__Names__Week__And__Day">
                    {weekDays.map((dayOfWeek, index) => (
                        <div key={`weekDay-${index}`} className="list__name__Week">
                            <div
                                className={`dayWeekCurrent ${selectedDay === `${dayOfWeek}, ${numberDays[index].number} de ${numberDays[index].month} de ${year}` ? 'selectedDay' : ''} ${numberDays[index].isCurrentDay ? 'currentDay' : ''}`}
                                onClick={() => handleDateClick(dayOfWeek, numberDays[index].number, numberDays[index].month, year)}
                            >
                                <p className='Box__day'>{dayOfWeek}</p>
                                <p className='Box__NumDay'>{numberDays[index].number}</p>
                                <p className='Box__month'>{numberDays[index].month}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </div>

        <div className='body__Schedule__barbearia' translate="no">
            {bookings &&(
                        <>
                        {bookings.length > 0 ? (
                            bookings.map((booking, index) => {

                            return(
                                    <div key={index} className='container__booking' onClick={() => toggleItem(booking.booking_id)}>
                                    <div className={`booking ${expandedCardBooking.includes(booking.booking_id) ? 'expandCard':''}`}>
                                        <div className="container_professional">
                                        {booking.user_image != 'default.jpg' ?(
                                            <div className='container__img__client__booking'>
                                            <div className='user__image__professional'>
                                                <img src={urlCloudFront + booking.user_image} id='img__user__professional'/>
                                            </div>
                                            <p className='phone__client'>Cliente</p>
                                            </div>
                                            ):(
                                            <div className='container__img__client__booking'>
                                                <div className="Box__image">
                                                <p className='firstLetter__client_Span'>{booking.user_name.charAt(0).toUpperCase()}</p>
                                                </div>
                                                <p className='phone__client'>Cliente</p>
                                            </div>
                                            )}
                                            <div className='container__name__client'>
                                            <p className='name__client'>{booking.user_name}</p>
                                            <p className='phone__client'>{booking.user_phone}</p>
                                            
                                            </div>
                                        
                                        <div className="time__booking">
                                            <p className='time'>{booking.booking_time.split(',')[0]}</p>
                                        </div>

                                        </div>
                                        <div className="section__information__booking">
                                            {booking.paymentStatus === "approved" &&(
                                            <>
                                                <div className="tittle__information">
                                                <p className='section__icon'>
                                                    <PiContactlessPayment className='icon__information'/>
                                                    Status do pagamento
                                                </p>
                                                <p>Aprovado</p>
                                                </div>
                                                <div className="tittle__information__GiRazor">
                                                <p className='section__icon'>
                                                    <GiReceiveMoney className='icon__information__GiRazor'/>
                                                    Valor Recebido
                                                </p>
                                                <p>{booking.transaction_amount ? `${formattedTransactionAmount(booking.transaction_amount)}`:null}</p>
                                                </div>
                                            </>
                                            )}
                                            {booking.paymentStatus === null &&(
                                            <>
                                                <div className="tittle__information">
                                                <p className='section__icon'>
                                                    <PiContactlessPayment className='icon__information'/>
                                                    Status do pagamento
                                                </p>
                                                <p>Não realizado</p>
                                                </div>
                                            </>
                                            )}
                                            <div className="tittle__information__GiRazor">
                                                <p className='section__icon'>
                                                <GiRazor className='icon__information__GiRazor'/>
                                                {booking.service_name}
                                                </p>
                                                <p>{booking.service_price}</p>
                                            </div>
                                            <div className="tittle__information">
                                                <p className='section__icon'>
                                                <MdOutlineTimer className='icon__information'/>
                                                Duração
                                                </p>
                                                <p>{booking.service_duration}</p>
                                            </div>
                                        </div>
                                        <div className="section__information__booking">
                                        <div className="tittle__information">
                                            <p className='section__icon'>
                                            <IoPersonCircleOutline className='icon__information' />
                                            Profissional
                                            </p>
                                            <p>{booking.professional_name}</p>
                                        </div>
                                        <div className="tittle__information">
                                            <p className='section__icon'>
                                            <RiExchangeFundsLine className='icon__information' />
                                            Comissão
                                            </p>
                                            <p>{booking.service_commission_fee}</p>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                );
                            })
                        ):(
                            <div className="message__notFound">
                            <p style={{fontSize:"20px"}}>{messagemNotFound}</p>
                        </div>
                        )}
                        </>
            )}
            {!bookings &&(
            <div className='message__notFound animation__fade'>
                <BsGraphDownArrow  className='icon__BsGraphDownArrow animation__fade'/>
                <p>{messagemNotFound}</p>
            </div>
            )}
        </div>
        
        
        <div className='container__buttons__header' translate="no">
            
            <div className='inner__buttons__header'>
            <button className='button__header' onClick={logoutClick}>
                <CiLogout className='icon__RiExchangeFundsLine'/>
            </button>
            <p className='label__button__header'>Sair</p>
            </div>

            <div className='inner__buttons__header'>
                <button className='button__header' onClick={navigateStatisticBarbearia}>
                    <SlGraph className='icon__RiExchangeFundsLine'/>
                </button>
                <p className='label__button__header'>Relatório</p>
            </div>

            <div className='inner__buttons__header'>
            <button className='button__header' onClick={navigateToHomeBarbearia}>
                <IoHomeOutline className='icon__RiExchangeFundsLine'/>
            </button>
            <p className='label__button__header'>Home</p>
            </div>

            <div className='inner__buttons__header'>
            <button className='button__header' onClick={navigateToProfileBarbearia}>
                <GrAppsRounded className='icon__RiExchangeFundsLine'/>
            </button>
            <p className='label__button__header'>Menu</p>
            </div>

        </div>
    </div>
);
}

export default ScheduleBarbearia;
