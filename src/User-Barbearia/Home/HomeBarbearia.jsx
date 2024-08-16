import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom"
import axios from 'axios';

import './HomeBarbearia.css';
import { GiRazor } from "react-icons/gi";
import { MdOutlineTimer } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import { RiExchangeFundsLine } from "react-icons/ri";
import { SlGraph } from "react-icons/sl";
import { IoNotificationsOutline } from "react-icons/io5";
import { BsGraphDownArrow } from "react-icons/bs";
import { HiArrowPath } from "react-icons/hi2";
import { BsCalendar2Check } from "react-icons/bs";
import { GrAppsRounded } from "react-icons/gr";
import { CiLogout } from "react-icons/ci";
import { SlLayers } from "react-icons/sl";
import { PiContactlessPayment } from "react-icons/pi";


const months = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

const daysOfWeek = [
  'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
];

function HomeBarbearia() {

  const urlApi = 'https://barbeasy.up.railway.app'
  const urlCloudFront = "https://d15o6h0uxpz56g.cloudfront.net/"

  const today = new Date();
  const dayOfWeek = daysOfWeek[today.getDay()];
  const day = today.getDate();
  const month = months[today.getMonth()];
  const year = today.getFullYear();
  
  //date to get bookings of current day
  let selectedDate = `${dayOfWeek}, ${day} de ${month} de ${year}`;

  const navigate = useNavigate();

  //Buscando informações do usuário logado
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('dataBarbearia');//Obtendo os dados salvo no localStorage
  const visibility = localStorage.getItem('AmountVisibility');
  const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
  const barbeariaId = userInformation.barbearia[0].id;
  const barbeariaUserName = userInformation.barbearia[0].usuario;

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
//==================================================
const [saudacao, setSaudacao] = useState('');

//pegando a hora para saudar o usuário
useEffect(() => {
  const obterSaudacao = () => {
  const horaAtual = new Date().getHours();
    if (horaAtual >= 5 && horaAtual < 12) {
        setSaudacao('Bom dia,');
    } else if (horaAtual >= 12 && horaAtual < 18) {
        setSaudacao('Boa tarde,');
    } else {
        setSaudacao('Boa noite,');
    }
  }
obterSaudacao();
}, []);

//==================================================
const [changeVisibilityAmount, setChangeVisibilityAmount] = useState(visibility === 'true'?true:false)
const [updatedVisibilityAmount, setUpdatedVisibilityAmount] = useState(false)

useEffect(() =>{
  const getAmountVisibility = () =>{
    axios.get(`${urlApi}/api/v1/amountVibility/${barbeariaId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res =>{
        if(res.data.visibility === 'visible'){
          setChangeVisibilityAmount(true)
        }else{
          setChangeVisibilityAmount(false)
        }
    }).catch(err =>{
      console.log('Erro: ', err)
    })
  }
  getAmountVisibility()
}, [])

const updateVisibilityAmount = (valueVisibility) =>{
  const values = {
    changeVisibilityAmount: valueVisibility,
    barbeariaId
  }
  axios.put(`${urlApi}/api/v1/updateAmountVisibility`, values, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res =>{
      if(res.data.status === 200){
        return setUpdatedVisibilityAmount(true)
      }
  }).catch(err =>{
    console.log('Erro: ', err)
  })
}

//function to hidden amount visibility
const hiddenAmountVisibility = () =>{
  setChangeVisibilityAmount(false)
  localStorage.setItem('AmountVisibility', 'false');
  updateVisibilityAmount('hidden')
}

//function to show amount visibility
const showAmountVisibility = () =>{
  setChangeVisibilityAmount(true)
  localStorage.setItem('AmountVisibility', 'true');
  updateVisibilityAmount('visible')
}
//==================================================
//Função para pegar os dias da semana
const [bookings, setBookings] = useState([]);
const [expandedCardBooking, setExpandedCardBooking] = useState([]);
const [isRotating, setIsRotating] = useState(false);
const [messagemNotFound, setMessagemNotFound] = useState("");

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
  const handleDateClick = () => {
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

const updateListBookingsToday = () => {
  // Inicia a rotação
  setIsRotating(true);
  handleDateClick()

  // Simula o tempo de atualização (pode ser substituído pela lógica de atualização real)
  setTimeout(() => {
    setIsRotating(false);
  }, 1000);
}

//Function to expanded booking cards
const toggleItem = (itemId) => {
    if (expandedCardBooking.includes(itemId)) {
      setExpandedCardBooking(expandedCardBooking.filter(id => id !== itemId));
    } else {
      setExpandedCardBooking([...expandedCardBooking, itemId]);
    }
};
//==========Secction to get amout of current month==========
const [valuesSerice, setValuesService] = useState (false)

useEffect(() =>{
  const getAmountOfMonth = () =>{
    axios.get(`${urlApi}/api/v1/getAmountOfMonth/${barbeariaId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res =>{
      setValuesService(res.data.totalAmount)
    }).catch(err =>{
      console.log(err)
    })
  }
  getAmountOfMonth()
}, [])
console.log(bookings)

return (
    <div className="container__main__home__barbearia">
          <div className='header_container'>
              <div className="container__text__header">
                <div className='inner__text_header'>
                  <p className='text__barbearia__name'>{saudacao} {barbeariaUserName}</p>
                  <p className='text__salutation'>{selectedDate}</p>
                </div>
                <IoNotificationsOutline className='icon__IoNotificationsOutline'/>
              </div>
              <div className='container__amount'>
                {changeVisibilityAmount ?(
                <>
                  <p className='tittle__amount'>Total faturado esse mês</p>
                  <div className='box__amount'>
                    <p className='text__amount'>R$ {valuesSerice ? valuesSerice:'00,00'}</p>
                    <AiOutlineEyeInvisible className='icon__AiOutlineEyeInvisible' onClick={hiddenAmountVisibility}/>     
                  </div>
                  
                </>
                ):(
                  <div className='box__amount'>
                    <p className='hidden__amount'></p>
                    <AiOutlineEye className='icon__AiOutlineEyeInvisible' onClick={showAmountVisibility}/>
                  </div>
                )}
              </div>

              <div className='text__for__today'>
                <SlLayers className='icon__SlLayers'/>
                <h3 className='inner__text__for__today'>Pra hoje ({bookings ? bookings.length:0})</h3>
                <HiArrowPath className={`icon__HiArrowPath ${isRotating ? 'rotating' : ''}`} onClick={updateListBookingsToday}/>
              </div>
          </div>
          
          <div className='body__home__barbearia'>
                  {bookings &&(
                    <>
                      {bookings.length > 0 ? (
                        bookings.map((booking, index) => {

                          return(
                                <div key={index} className='container__booking' onClick={() => toggleItem(booking.booking_id)}>
                                  <div className={`${booking.paymentStatus === "pending" ? 'booking__pending':'booking' } ${expandedCardBooking.includes(booking.booking_id) ? 'expandCard':''}`}>
                                    <div className="container_professional">
                                      {booking.professional_user_image != 'default.png' ?(
                                        <div className='container__img__client__booking'>
                                          <div className='user__image__professional'>
                                            <img src={urlCloudFront + booking.user_image} id='img__user__professional'/>
                                          </div>
                                          <p className='phone__client'>Cliente</p>
                                        </div>
                                        ):(
                                          <div className='container__img__client__booking'>
                                            <div className="Box__image">
                                              <p className='firstLetter'>{firstLetter}</p>
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
                                          <PiContactlessPayment className='icon__information'/>
                                          Status do pagamento
                                        </p>
                                        <p>{booking.paymentStatus === "pending"? 'Pendente':'Aprovado'}</p>
                                      </div>
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
                    <div className='message__notFound'>
                      <BsGraphDownArrow  className='icon__BsGraphDownArrow'/>
                      <p>{messagemNotFound}</p>
                    </div>
                  )}
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
                      <BsCalendar2Check className='icon__RiExchangeFundsLine'/>
                    </button>
                    <p className='label__button__header'>Agenda</p>
                  </div>

                  <div className='inner__buttons__header'>
                    <button className='button__header' onClick={navigateToProfileBarbearia}>
                      <GrAppsRounded className='icon__RiExchangeFundsLine'/>
                    </button>
                    <p className='label__button__header'>Menu</p>
                  </div>

              </div>
          </div>

        
     </div>
);
}

export default HomeBarbearia;
