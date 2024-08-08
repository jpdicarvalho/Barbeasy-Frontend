import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom"
import axios from 'axios';

import './HomeBarbearia.css';
import { GiRazorBlade } from "react-icons/gi";
import { TfiTime } from "react-icons/tfi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";
import { BsCalendar2Week } from "react-icons/bs";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import { RiExchangeFundsLine } from "react-icons/ri";
import { SlGraph } from "react-icons/sl";
import { RiDashboardFill } from "react-icons/ri";
import { IoIosArrowRoundUp } from "react-icons/io";
import { IoIosArrowRoundDown } from "react-icons/io";


const months = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Aug', 'Set', 'Out', 'Nov', 'Dez'
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
  
  let selectedDate = `${dayOfWeek}, ${day} de ${month} de ${year}`;

console.log(selectedDate)

  const navigate = useNavigate();

  //Buscando informações do usuário logado
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('dataBarbearia');//Obtendo os dados salvo no localStorage
  const visibility = localStorage.getItem('AmountVisibility');
  const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
  const barbeariaId = userInformation.barbearia[0].id;
  const barbeariaUserName = userInformation.barbearia[0].usuario;

  const banner__main = userInformation.barbearia[0].banner_main;


const navigateToProfileBarbearia = () =>{
  navigate("/ProfileBarbearia");
}

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
      console.log(res.data.visibility)
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
useEffect(() =>{
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
        <div className='section__scroll__home__barbearia'>
          <div className='header_container'>
            <div className='conatiner__img__banner__main'>
                <img  className="img__banner__main__home" src={urlCloudFront + banner__main} alt="" />
            </div>
              <div className="container__text__header">
                <p className='text__salutation'>{saudacao} </p>
                <p className='text__barbearia__name'>{barbeariaUserName}</p>
              </div>
              <div className='container__amount'>
                {changeVisibilityAmount ?(
                <>
                  <div className='box__amount'>
                    <p className='text__amount'>R$ 00,00</p>
                    <AiOutlineEyeInvisible className='icon__AiOutlineEyeInvisible' onClick={hiddenAmountVisibility}/>
                  </div>
                  <p className='tittle__amount'>Total faturado esse mês</p>
                </>
                ):(
                  <div className='box__amount'>
                    <p className='hidden__amount'></p>
                    <AiOutlineEye className='icon__AiOutlineEyeInvisible' onClick={showAmountVisibility}/>
                  </div>
                )}
              </div>
              
              <div className='container__buttons__header'>
                  <div className='inner__buttons__header'>
                    <button className='button__header'>
                      <SlGraph className='icon__RiExchangeFundsLine'/>
                    </button>
                    <p className='label__button__header'>Histórico</p>
                  </div>

                  <div className='inner__buttons__header'>
                    <button className='button__header'>
                      <RiExchangeFundsLine className='icon__RiExchangeFundsLine'/>
                    </button>
                    <p className='label__button__header'>Comissões</p>
                  </div>

                  <div className='inner__buttons__header'>
                    <button className='button__header' onClick={navigateToProfileBarbearia}>
                      <RiDashboardFill className='icon__RiExchangeFundsLine'/>
                    </button>
                    <p className='label__button__header'>Menu</p>
                  </div>
                
              </div>
          </div>
          
          <div className='body__home__barbearia'>
              <div className='text__stats'>
                <h>Estatísticas</h>
              </div>
              <div className='constinner__stats__barbearia'>
                    <div className='inner__stats__barbearia'>
                    <div className='inner__stats__barbearia'>
                        <p className='text__today__in__stats'>Hoje</p>
                        <p className='total__bookings__today__in__stats'>10</p>
                        <div className='container__text__bookings__in__stats'>
                          <p className='text__bookings__in__stats'>Agendamentos</p>
                          <IoIosArrowRoundUp className='icon__IoIosArrowRoundUp'/>
                        </div>
                    </div>
                    </div>

                    <div className='inner__stats__barbearia'>
                    <div className='inner__stats__barbearia'>
                        <p className='text__today__in__stats'>AGO</p>
                        <p className='total__bookings__today__in__stats'>10</p>
                        <div className='container__text__bookings__in__stats'>
                          <p className='text__bookings__in__stats'>Cancelamentos</p>
                          <IoIosArrowRoundDown className='icon__IoIosArrowRoundDown'/>
                        </div>
                    </div>
                    </div>
              </div>

              <div className='text__for__today'>
                <h>Para hoje</h>
              </div>

              <div>
                  {bookings &&(
                    <div>
                      teste
                    </div>
                  )}
                  {!bookings &&(
                    <div className='message__notFound'>
                      <p>{messagemNotFound}</p>
                    </div>
                  )}
              </div>
          </div>
        </div>
     </div>
);
}

export default HomeBarbearia;
