import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';

import './HomeBarbearia.css';
import { GrSchedules } from "react-icons/gr";
import { CiSettings } from "react-icons/ci";
import { GiRazorBlade } from "react-icons/gi";
import { TfiTime } from "react-icons/tfi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";
import { IoMenuSharp } from "react-icons/io5";


const monthNames = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Aug', 'Set', 'Out', 'Nov', 'Dez'
];

const weekNames = [
  'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
];

function HomeBarbearia() {

  const urlApi = 'https://barbeasy.up.railway.app'
  const urlCloudFront = "https://d15o6h0uxpz56g.cloudfront.net/"

  const date = new Date();
  const options = { weekday: 'short', locale: 'pt-BR' };
  let dayOfWeek = date.toLocaleDateString('pt-BR', options);
  dayOfWeek = dayOfWeek.slice(0, -1);
  dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  const year = date.getFullYear();

  const navigate = useNavigate();

  //Buscando informações do usuário logado
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('dataBarbearia');//Obtendo os dados salvo no localStorage
  const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
  const barbeariaId = userInformation.barbearia[0].id;
  const barbeariaUserName = userInformation.barbearia[0].usuario;

const navigateToProfileBarbearia = () =>{
  navigate("/ProfileBarbearia");
}

//Variáveis para abrir o madal
const [professional, setProfessional] = useState([])
const [professionalSelected, setProfessionalSelected] = useState();

  //Function to get all professionais
  useEffect(() => {
    const getProfessional = () =>{
    axios.get(`${urlApi}/api/v1/listProfessionalToBarbearia/${barbeariaId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setProfessional(res.data.Professional)
      })
      .catch(error => console.log(error));
    }
    getProfessional()
  }, [barbeariaId])

//Function to selected Professional
const handleProfessionalSelected = (professionalId) =>{
  setProfessionalSelected(professionalId);
}
//==================================================
const [saudacao, setSaudacao] = useState('');
//pegando a hora para saudar o usuário
useEffect(() => {
  const obterSaudacao = () => {
  const horaAtual = new Date().getHours();
    if (horaAtual >= 5 && horaAtual < 12) {
        setSaudacao('Bom dia!');
    } else if (horaAtual >= 12 && horaAtual < 18) {
        setSaudacao('Boa tarde!');
    } else {
        setSaudacao('Boa noite!');
    }
  }
obterSaudacao();
}, []);

//==================================================
//Função para pegar os dias da semana
const [selectedDay, setSelectedDay] = useState(null);
const [bookings, setBookings] = useState([]);
const [expandedCardBooking, setExpandedCardBooking] = useState([]);
const [messagemNotFound, setMessagemNotFound] = useState("");


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

/* Function to get current day in format: [Sex, 12 de Abr de 2024]
function getCurrentDayOfWeek(){
  const currentDayOfWeek = weekNames[date.getDay()];//Dia atual da semana
  const currentDayOfMonth = date.getDate();//Dia atua do mês
  const currentNameMonth = monthNames[date.getMonth()];//Mês atual  
  let currentDay = `${currentDayOfWeek}, ${currentDayOfMonth} de ${currentNameMonth} de ${year}`;// Monta a data no formato do dia selecionado
  return currentDay;
}*/

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

const weekDays = getWeeks();
const numberDays = getNumber();
//const currentDay = getCurrentDayOfWeek()

const handleDateClick = (dayOfWeek, day, month, year) => {
  setSelectedDay(`${dayOfWeek}, ${day} de ${month} de ${year}`);
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
        setBookings([])
        setMessagemNotFound("Nenhum agendamento encontrado")
      }
    })
    .catch(err => console.log(err));
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
<main>
    <div className="container__main">
      <div className='header_container'>
        <div className="img__user">
            <div className="settings" onClick={navigateToProfileBarbearia}>
              <IoMenuSharp />
            </div>
            <div className="user__name">
              <h2>Barbeasy</h2>
            </div>
            
        </div>
      {professional.length > 0 ? (
        <>
        <div className='tittle_menu'>
          {professional.length > 1 ?(
            <>
              <h3>Profissionais</h3>
              <hr id='sublime'/>
            </>
          ):(
            <>
              <h3>Profissional</h3>
              <hr id='sublime'/>
            </>
          )}
        </div>
        <div className="section__professional__barbearia">
          <div className="section__professional">

            {professional.map((professional) => { 
              // Obtendo a primeira letra do nome do profissional
              const firstLetter = professional.name.charAt(0).toUpperCase();
              
              return (
                <div key={professional.id} onClick={() => handleProfessionalSelected(professional.id)} className={`Box__professional ${professionalSelected === professional.id? 'barbeariaSelected':''}`}> 
                 {professional.user_image != 'default.png' ?(
                  <div className='user__image__professional'>
                    <img src={urlCloudFront + professional.user_image} id='img__user__professional'/>
                  </div>
                 ):(
                  <div className="Box__image">
                    <p className='firstLetter'>{firstLetter}</p>
                  </div>
                 )}
                  <p className='name__professional'>{professional.name}</p>
                </div>
              );
            })}

          </div>
        </div>

        {professionalSelected ?(
          <div className="container__calendar__home__barbearia">
          <div className='header__agenda'>
            <GrSchedules className='icon__schedules'/>
            <h3>Agenda</h3>
          </div>
        <div className='calendar__barbearia'>
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
        {bookings.length > 0 && (
          <div className="tittle__bookings">
            <p>Agendamentos • ({bookings.length})</p>
          </div>
        )}
        {selectedDay ? (
          <div className="section__bookings" >
          {bookings.length > 0 ? (
            bookings.map((booking, index) => {
              const bookingTimes = booking.booking_time.split(',');
                return(
                    <div key={index} className='container__booking' onClick={() => toggleItem(booking.booking_id)}>
                      <div className={`booking ${expandedCardBooking.includes(booking.booking_id) ? 'expandCard':''}`}>
                        <div className="container_professional">
                          <div className="Box__image  Box__first__letter__professional">
                              <p className='firstLetter__professional_Span'>{booking.professional_name.charAt(0).toUpperCase()}</p>
                          </div>
                          <p className='name__Professional'>{booking.professional_name}</p>
                          <div className="time__booking">
                              <p className='time'>{booking.booking_time.split(',')[0]}</p>
                          </div>
                        </div>
                        <div className="section__information__booking">
                          <div className="tittle__information">
                            <p className='section__icon'>
                              <GiRazorBlade className='icon__information'/>
                              {booking.service_name}
                            </p>
                            <p>{booking.service_price}</p>
                          </div>
                          <div className="tittle__information">
                            <p className='section__icon'>
                              <TfiTime className='icon__information'/>
                              Duração
                            </p>
                            <p>{booking.service_duration}</p>
                          </div>
                        </div>
                        <div className="section__information__booking">
                          <div className="tittle__information">
                            <p className='section__icon'>
                              <IoPersonCircleOutline className='icon__information' />
                              Cliente
                            </p>
                            <p>{booking.user_name}</p>
                          </div>
                          <div className="tittle__information">
                            <p className='section__icon'>
                              <FaWhatsapp className='icon__information'/>
                              Contato
                            </p>
                            <p>{booking.user_phone}</p>
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

      </div>
        ):(
          <div className="message__notFound">
            <p >Selecione um dia para visualizar os agendamentos.</p>
          </div>
        )}
        </div>
        ):(
          <>
          <p className='message__notFound'>Selecione um profissional para visualizar sua agenda. </p>
        </>
        )}
        </>
      ):(
        <>
          <p className='message__notFound'>Configure sua barbearia para começar :) </p>
        </>
      )}
      </div>
     </div>
    </main>
);
}

export default HomeBarbearia;
