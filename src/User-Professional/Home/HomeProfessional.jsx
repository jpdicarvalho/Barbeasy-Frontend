import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';

import './HomeProfessional.css';
import { GiRazorBlade } from "react-icons/gi";
import { TfiTime } from "react-icons/tfi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { GrSchedules } from "react-icons/gr";
import { SlOptionsVertical } from "react-icons/sl";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { PiPassword } from "react-icons/pi";
import { MdOutlineDone } from "react-icons/md";
import { VscError } from "react-icons/vsc";

const monthNames = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Aug', 'Set', 'Out', 'Nov', 'Dez'
];

const weekNames = [
  'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
];

function HomeProfessional() {

  const urlApi = 'https://barbeasy.up.railway.app'

  const date = new Date();
  const options = { weekday: 'short', locale: 'pt-BR' };
  let dayOfWeek = date.toLocaleDateString('pt-BR', options);
  dayOfWeek = dayOfWeek.slice(0, -1);
  dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  const year = date.getFullYear();

  const navigate = useNavigate();

  //Buscando informações do usuário logado
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('dataprofessional');//Obtendo os dados salvo no localStorage
  const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
  const professionalId = userInformation.professional[0].id;
  const professionalUserName = userInformation.professional[0].name;
  const firstLetter = professionalUserName.charAt(0).toUpperCase();

  const [confirmPassword, setConfirmPassword] = useState('');


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
//const currentDay = getCurrentDayOfWeek()

  const handleDateClick = (dayOfWeek, day, month, year, barbeariaId) => {
    setSelectedDay(`${dayOfWeek}, ${day} de ${month} de ${year}`);
    let selectedDate = `${dayOfWeek}, ${day} de ${month} de ${year}`;

      axios.get(`${urlApi}/api/v1/professionalBookings/${barbeariaId}/${professionalId}/${selectedDate}`, {
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
//=========== GET BARB TO PROFESSIONAL ==============
  const [barbearias, setBarbearias] = useState([]);
  const [barbeariaSelected, setBarbeariaSelected] = useState();

  const getBarbearias = () =>{
    axios.get(`${urlApi}/api/v1/listBarbeariaToProfessional/${professionalId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
      }).then(res =>{
        if(res.data.Success === 'Success'){
          setBarbearias(res.data.Barbearias)
        }
      }).catch(err =>{
        console.log("Error", err)
      })
  }

  useEffect(() =>{
    getBarbearias()
  }, [])

  const handleBarbeariaSelected = (barbeariaId) =>{
      setBarbeariaSelected(barbeariaId);
  }
//Function to show small div for unlink barbearia
  const [showBoxUnlinkBarbearia, setShowBoxUnlinkBarbearia] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [barbeariaId, setBarbeariaId] = useState();


  const handleBoxUnlinkClick = () =>{
    setShowBoxUnlinkBarbearia(!showBoxUnlinkBarbearia)
  }
  const handleConfirmPasswordClick = (barbeariaId) =>{
    setBarbeariaId(barbeariaId)
    setShowConfirmPassword(!showConfirmPassword)
  }

//============= Section Unlink professional =============
const [messageUnlinkBarbearia, setMessageUnlinkBarbearia] = useState('');

  const unlinkBarbearia = () =>{
    axios.delete(`${urlApi}/api/v1/unlinkBarbearia/${barbeariaId}/${professionalId}/${confirmPassword}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res =>{
        if(res.data.Success === "Success"){
          setMessageUnlinkBarbearia('Barbearia desvinculada com sucesso.')
          setTimeout(() => {
            setMessageUnlinkBarbearia('');
            setConfirmPassword('')
          }, 2000);
        }
      }).catch(err =>{
        setMessageUnlinkBarbearia('Erro ao desvincular a barbearia. Tente novamente mais tarde.')
        console.error("Error:", err)
        setTimeout(() => {
          setMessageUnlinkBarbearia('');
          setConfirmPassword('')
        }, 2000);
      })
  }

return (
<>
    <div className="container__main">
      <div className='header_container'>
        <div className="img__user__professional">
            {imageUser.length > 49 ? (
                  <div className="img-view-professional" onClick={navigateToProfileProfessional}>
                    <img src={imageUser} alt="" id='img-profile' />
                  </div>
                ) : (
                  <div className="Box__image imgViewDefault" onClick={navigateToProfileProfessional}>
                    <p>{firstLetter}</p>
                  </div>
            )}
            <div className="user__name__professional">
                <p className='name__professional__InHome'>Olá, {professionalUserName}</p>
                <p className='subtittle__professional'> {saudacao}</p>
            </div>
            <div className="icon__notification" onClick={navigateToNotification}>
              {notification.length >= 1 &&(
                <div className='circle__notification'></div>
              )}
                <IoIosNotifications/>
            </div>
        </div>
        {messageUnlinkBarbearia === 'Barbearia desvinculada com sucesso.' ?(
          <div className="mensagem-sucesso">
            <MdOutlineDone className="icon__success"/>
            <p className="text__message">{messageUnlinkBarbearia}</p>
          </div>
          ) : (
          <div className={` ${messageUnlinkBarbearia ? 'mensagem-erro' : ''}`}>
            <VscError className={`hide_icon__error ${messageUnlinkBarbearia ? 'icon__error' : ''}`}/>
            <p className="text__message">{messageUnlinkBarbearia}</p>
          </div>
        )}
        {showConfirmPassword &&(
          <div >
            <div className="form__change__data">
            <div className='container__text__change__data'>
                Digite sua senha para confirmar a alteração
            </div>
 
           <div className='container__form__change__data'>
            <input
                type="password"
                id="senha"
                name="senha"
                value={confirmPassword}
                className={`input__change__data ${confirmPassword ? 'input__valided':''}`}
                onChange={(e) => {
                    const inputValue = e.target.value;
                    // Limitar a 10 caracteres
                    const truncatedPasswordConfirm = inputValue.slice(0, 10);
                    setConfirmPassword(truncatedPasswordConfirm);
                }}
                placeholder="Senha atual"
                maxLength={8}
                required
                /><PiPassword className='icon__input__change__data'/>
                <button className={`Btn__confirm__changes ${confirmPassword ? 'Btn__valided':''}`} onClick={unlinkBarbearia}>
                    Confirmar
                </button>
           </div>
        </div>
          </div>
        )}
        
        {barbearias.length === 1 ?(
          <div className='tittle_menu'>
            <h3>Barbearia</h3>
            <hr id='sublime'/>
        </div>
        ):(
          <>
            {barbearias.length > 1 &&(
              <div className='tittle_menu'>
                <h3>Barbearias</h3>
              <hr id='sublime'/>
          </div>
            )}
          </>
        )}

        <div className="section__barbearia__InHome">
          <div className="section__professional">

            {barbearias.map((barbearias) => { 
              // Obtendo a primeira letra do nome do profissional
              const firstLetter = barbearias.nameBarbearia.charAt(0).toUpperCase();
              
              return (
                <div key={barbearias.barbeariaId} onClick={() => handleBarbeariaSelected(barbearias.barbeariaId)} className={`Box__barbearia__inHome ${barbeariaSelected === barbearias.barbeariaId? 'barbeariaSelected':''}`}>
                    {barbeariaSelected === barbearias.barbeariaId &&(
                      <div className={`box__unlink__barbearia ${!showBoxUnlinkBarbearia ? 'ocultDivUnlink':''}`} onClick={() => handleConfirmPasswordClick(barbearias.barbeariaId)}>
                        <IoIosRemoveCircleOutline />
                        <p>Desvincular</p>
                      </div>
                    )}
                    
                    <div className='mini__menu__in__homeProfessional'>
                      <SlOptionsVertical className='icon__SlOptionsVertical__inHomeProfessional'onClick={handleBoxUnlinkClick}/>
                    </div>
                    <div className="Box__image__barbearia__inHome">
                      <div className='inner__firstLetter__barbearia__InHome'>
                        <p className='firstLetter__barbearia__InHome'>{firstLetter}</p>
                      </div>
                      <p className='name__barbearia__InHome'>{barbearias.nameBarbearia}</p>
                    </div>
                    
                </div>
              );
            })}

          </div>
        </div>
      </div>
      {barbeariaSelected ?(
        <div className="container__calendar__home__professional">
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
                    onClick={() => handleDateClick(dayOfWeek, numberDays[index].number, numberDays[index].month, year, barbeariaSelected)}
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
                          {}
                            <p className='firstLetter__professional_Span'>{firstLetter}</p>
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
        <div className="message__notFound">
          <p >Selecione uma barbearia para visualizar os agendamentos.</p>
        </div>
        </>
      )}
    </div>
    
    </>
);
}

export default HomeProfessional;
