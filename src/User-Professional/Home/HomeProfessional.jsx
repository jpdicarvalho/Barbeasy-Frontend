import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';

import './HomeProfessional.css';
import { GiRazorBlade } from "react-icons/gi";
import { TfiTime } from "react-icons/tfi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import { BsCalendar2Check } from "react-icons/bs";
import { AiOutlineEyeInvisible } from "react-icons/ai";

const monthNames = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

const weekNames = [
  'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
];

function HomeProfessional() {

  const urlApi = 'https://barbeasy.up.railway.app'
  const urlCloudFront = "https://d15o6h0uxpz56g.cloudfront.net/"

  const date = new Date();
  const options = { weekday: 'short', locale: 'pt-BR' };
  const day = date.getDate();
  let dayOfWeek = date.toLocaleDateString('pt-BR', options);
  dayOfWeek = dayOfWeek.slice(0, -1);
  dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const currenteDate = `${dayOfWeek}, ${day} de ${month} de ${year}`;

  const navigate = useNavigate();

  //Buscando informações do usuário logado
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('dataprofessional');//Obtendo os dados salvo no localStorage
  const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
  const professionalId = userInformation.professional[0].id;
  const professionalUserName = userInformation.professional[0].name;
  const firstLetter = professionalUserName.charAt(0).toUpperCase();


  const navigateToProfileProfessional = () =>{
    navigate("/ProfileProfessional");
  }

  const navigateToNotification = () =>{
    navigate("/Notification");
  }

//==================== GET NOTIFICATION ================
  const[notification, setNotification] = useState([]);

  //function to get all notification
  const getAllnotification = () =>{
      axios.get(`${urlApi}/api/v1/notificationToProfe/${professionalId}`, {
          headers: {
              'Authorization': `Bearer ${token}`
            }
      }).then(res =>{
          if(res.data.Success === 'true'){
            setNotification(res.data.AllNotification)
          }
      }).catch(err =>{
          console.log("Error", err)
      })
  }

  useEffect(() =>{
      getAllnotification()
  }, [])

//============== GET IMAGE PROFESSIONAL ============
  const [imageUser, setImageUser] = useState([]);
//Função para obter as imagens cadastradas
  useEffect(() => {
    axios.get(`${urlApi}/api/v1/userImageProfessional`, {
      params: {
        professionalId: professionalId
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      setImageUser(res.data.url);
    })
    .catch(err => console.log(err));
  }, [professionalId]);

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

  const handleDateClick = (dayOfWeek, day, month, year, barbeariaId) => {
    setSelectedDay(`${dayOfWeek}, ${day} de ${month} de ${year}`);
    let selectedDate = `${dayOfWeek}, ${day} de ${month} de ${year}`;

      axios.get(`${urlApi}/api/v1/professionalBookings/${professionalId}/${selectedDate}`, {
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
 console.log(bookings)
return (
<>
    <div className="container__main__in__home__professional">
      <div className='header_container__in__home__professional'>
        <div className="img__user__professional">
            {imageUser.length > 49 ? (
                  <div className="user__img__home__professional" onClick={navigateToProfileProfessional}>
                    <img src={imageUser} alt="" id='img-profile' />
                  </div>
                ) : (
                  <div className="Box__image imgViewDefault" onClick={navigateToProfileProfessional}>
                    <p>{firstLetter}</p>
                  </div>
            )}
            <div className="user__name__professional">
                <p className='name__professional__InHome'>Olá, {professionalUserName}</p>
                <p className='saudacao__in__home__professional'> {saudacao}</p>
            </div>
            <div className="icon__notification" onClick={navigateToNotification}>
              {notification.length >= 1 &&(
                <div className='circle__notification'></div>
              )}
                <IoNotificationsOutline className='icon__IoNotificationsOutline'/>  
            </div>
        </div>
        <div className='container__amount__home__professional'>
          <p className='tittle__amount'>Total faturado esse mês</p>
          <div className='box__amount'>
            <p className='text__amount'>R$ 20,00</p>
            <AiOutlineEyeInvisible className='icon__AiOutlineEyeInvisible'/>     
          </div>
                  
        </div>
      </div>
      
        <div className="container__calendar__home__professional">
          <div className='header__agenda__in__home__professional'>
            <BsCalendar2Check className='icon__RiExchangeFundsLine'/> 
            <h3 className='text__agenda__in__home__professional'>Agenda</h3>
          </div>
          <div className='container__currentDate__in__home__professional'>
            <p className='inner__text__currentDate__in__home__professional'>{selectedDay ? selectedDay:currenteDate}</p>
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
        <div className="section__bookings__in__home__professional" >
        {bookings.length > 0 ? (
          bookings.map((booking, index) => {
            //const bookingTimes = booking.booking_time.split(',');
              return(
                  <div key={index} className='container__booking' onClick={() => toggleItem(booking.booking_id)}>
                    <div className={`booking ${expandedCardBooking.includes(booking.booking_id) ? 'expandCard':''}`}>
                      <div className="container_professional">
                          {booking.user_image === 'default.jpg' ?(
                            <div className='container__img__client__booking'>
                              <div className='user__image__professional'>
                                  <p className='firstLetter__professional_Span'>{booking.user_name.charAt(0).toUpperCase()}</p>
                              </div>
                            <p className='phone__client'>Cliente</p>
                          </div>
                          ):(
                            <div className='container__img__client__booking'>
                              <div className='user__image__professional'>
                                <img src={urlCloudFront + booking.user_image} id='img__user__professional'/>
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
      
    </div>
    
    </>
);
}

export default HomeProfessional;
