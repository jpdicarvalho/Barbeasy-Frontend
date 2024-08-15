import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom"
import axios from 'axios';

import './ScheduleBarbearia.css';
import { BsCalendar2Check } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import { SlGraph } from "react-icons/sl";
import { GrAppsRounded } from "react-icons/gr";
import { CiLogout } from "react-icons/ci";
import { IoHomeOutline } from "react-icons/io5";

import { SlLayers } from "react-icons/sl";
const monthNames = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];
const weekNames = [
    'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
];

function ScheduleBarbearia() {


    const date = new Date();

    const options = { weekday: 'short', locale: 'pt-BR' };
    let dayOfWeek = date.toLocaleDateString('pt-BR', options);
    dayOfWeek = dayOfWeek.slice(0, -1);
    dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
    const year = date.getFullYear();

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

const navigateToScheduleBarbearia = () =>{
    navigate("/ScheduleBarbearia");
}

//Função LogOut
const logoutClick = () => {
    ['token', 'dataBarbearia', 'code_verifier', 'AmountVisibility'].forEach(key => localStorage.removeItem(key));
    navigate("/");
};
//================ Get date ====================
//Function to get current time
function getCurrentTime(){
    // get default current time
    const currentTime = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const currentTimeStr = String(currentTime).padStart(2, '0');
    const currentMinuteStr = String(currentMinute).padStart(2, '0');
    const fullCurrentTime = Number(`${currentTimeStr}${currentMinuteStr}`);
    return fullCurrentTime;
  }

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

  // Function to get current day in format: [Sex, 12 de Abr de 2024]
  function getCurrentDayOfWeek(){
    const currentDayOfWeek = weekNames[date.getDay()];//Dia atual da semana
    const currentDayOfMonth = date.getDate();//Dia atua do mês
    const currentNameMonth = monthNames[date.getMonth()];//Mês atual  
    let currentDay = `${currentDayOfWeek}, ${currentDayOfMonth} de ${currentNameMonth} de ${year}`;// Monta a data no formato do dia selecionado
    return currentDay;
  }

  const weekDays = getWeeks();
  const numberDays = getNumber();
  const currentDay = getCurrentDayOfWeek()
  const currentTime = getCurrentTime()

//================ Get Bookings ================
//Função para pegar os dias da semana
const [bookings, setBookings] = useState([]);
const [expandedCardBooking, setExpandedCardBooking] = useState([]);
const [isRotating, setIsRotating] = useState(false);
const [messagemNotFound, setMessagemNotFound] = useState("");

const [selectedDay, setSelectedDay] = useState(null);

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
    orderBookings(bookings);
    }else{
    setBookings(false)
    setMessagemNotFound("Sem agendamento por enquanto...")
    }
})
.catch(err => console.log(err));
}

useEffect(() =>{
handleDateClick()
}, [])

  //Function to expanded booking cards
const toggleItem = (itemId) => {
    if (expandedCardBooking.includes(itemId)) {
      setExpandedCardBooking(expandedCardBooking.filter(id => id !== itemId));
    } else {
      setExpandedCardBooking([...expandedCardBooking, itemId]);
    }
};
return (
    <div className="container__main__home__barbearia">
        <div className="header__bookings__history">
            <div className='inner__header__agenda'>
                <BsCalendar2Check className='icon__RiExchangeFundsLine'/>   
                <h2>Agenda</h2>
            </div>
            <div className='Box__input__Search'>
                <IoIosSearch id='lupa__in__bookings__history'/>
                <input type="search" className='Inner__input__search' placeholder='Buscar agendamento'/>
            </div>
        </div>

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
        
        
        
        <div className='container__buttons__header'>
            
            <div className='inner__buttons__header'>
            <button className='button__header' onClick={logoutClick}>
                <CiLogout className='icon__RiExchangeFundsLine'/>
            </button>
            <p className='label__button__header'>Sair</p>
            </div>

            <div className='inner__buttons__header'>
            <button className='button__header'>
                <SlGraph className='icon__RiExchangeFundsLine'/>
            </button>
            <p className='label__button__header'>Relatório</p>
            </div>
            
            <div className='inner__buttons__header'>
            <button className='button__header' onClick={navigateToScheduleBarbearia}>
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
