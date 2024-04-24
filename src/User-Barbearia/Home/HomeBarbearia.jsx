import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import {motion} from 'framer-motion';

import './HomeBarbearia.css';
import { IoPersonOutline } from "react-icons/io5";
import { CgMenuRightAlt } from "react-icons/cg";

const monthNames = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Aug', 'Set', 'Out', 'Nov', 'Dez'
];

const weekNames = [
  'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
];

function HomeBarbearia() {
  const date = new Date();
  const options = { weekday: 'short', locale: 'pt-BR' };
  let dayOfWeek = date.toLocaleDateString('pt-BR', options);
  dayOfWeek = dayOfWeek.slice(0, -1);
  dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  const year = date.getFullYear();

  const navigate = useNavigate();

  //Buscando informações do usuário logado
  const userData = localStorage.getItem('dataBarbearia');//Obtendo os dados salvo no localStorage
  const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
  const barbeariaId = userInformation.barbearia[0].id;
  const barbeariaUserName = userInformation.barbearia[0].usuario;

const navigateToProfileBarbearia = () =>{
  navigate("/ProfileBarbearia");
}

const [imageUser, setImageUser] = useState([]);
//Função para obter as imagens cadastradas
useEffect(() => {
  axios.get('https://api-user-barbeasy.up.railway.app/api/image-user-barbearia', {
    params: {
      barbeariaId: barbeariaId
    }
  })
  .then(res => {
    setImageUser(res.data.url);
  })
  .catch(err => console.log(err));
}, [barbeariaId]);

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

const handleDateClick = (dayOfWeek, day, month, year) => {
  setSelectedDay(`${dayOfWeek}, ${day} de ${month} de ${year}`);
  let selectedDate = `${dayOfWeek}, ${day} de ${month} de ${year}`;

  useEffect(() => {
    axios.get(`https://api-user-barbeasy.up.railway.app/api/bookings/${barbeariaId}/${selectedDate}`)
    .then(res => {
      setBookings(res.data.url);
    })
    .catch(err => console.log(err));
  }, [barbeariaId]);
}
  return (
      <div className="header_main">
        <div className='header_container'>

          <div className="img__user">
          {imageUser.length > 48 ? (
                    <div className="img-view-profile">
                      <img src={imageUser} alt="" id='img-profile' />
                    </div>
                  ) : (
                    <motion.div className="img-view-user">
                     <IoPersonOutline className='icon_user_edit'/>
                    </motion.div>
                  )}
          </div>

          <div className="user__name">
            <p>Olá, {barbeariaUserName}</p>
            <p>{saudacao}</p>
          </div>

          <div className="settings" onClick={navigateToProfileBarbearia}>
            <CgMenuRightAlt />
          </div>
        </div>
        
        <div className="container__calendar__barbearia">
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
        </div>
      </div>
  );
}

export default HomeBarbearia;
