import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import { AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { FaLayerGroup } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

import './StatisticBarbearia.css';

const monthNames = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

function StatisticBarbearia() {

  const urlApi = 'https://barbeasy.up.railway.app';
  const navigate = useNavigate();
  const graficRef = useRef(null);

  const date = new Date();
  const year = date.getFullYear();

  // Buscando informações do usuário logado
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('dataBarbearia'); // Obtendo os dados salvos no localStorage
  const userInformation = JSON.parse(userData); // Transformando os dados para JSON
  const barbeariaId = userInformation.barbearia[0].id;

  const [search, setSearch] = useState('');
  const [dataBookings, setDataBookings] = useState([]);

//================= Section data for grafic =================
  // Função para buscar os agendamentos
  const getAllBookings = () => {
    axios.get(`${urlApi}/api/v1/amountBookings/${barbeariaId}/${year}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      setDataBookings(res.data.amountBookings);
    }).catch(err => {
      console.error('Erro ao buscar agendamentos', err);
    });
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  //Function to move scroll for current month
  useEffect(() => {
    // Função para rolar até o mês atual
    const scrollToCurrentMonth = () => {
      const currentMonth = date.getMonth(); // Mês atual (0-11)

      // Se houver um gráfico e o dataBookings estiver preenchido, rola
      if (graficRef.current && dataBookings.length > 0) {
        const scrollX = (graficRef.current.scrollWidth / 12) * currentMonth;

        // Adicionando scroll suave
        graficRef.current.scrollTo({
          left: scrollX,
          behavior: 'smooth' // Faz o scroll ser suave
        });
      }
    };

    scrollToCurrentMonth(); // Executa após a renderização do gráfico
  }, [dataBookings]);
//================= Section data for grafic =================
  return (
    <div className='container__statistic__barbearia'>
      <div>
        <h3>{year}</h3>
      </div>
      <div className='section__grafic__barbearia' ref={graficRef}>
        <AreaChart
          width={550}
          height={200}
          data={dataBookings}
          margin={{
            top: 10,
            right: 30,
            left: 30,
            bottom: 0,
          }}>

          <XAxis dataKey='month' />
          <Tooltip />
          <Area type="monotone" dataKey="Agendamentos" stroke="#4a17d537" fill="#4a17d537" />
        </AreaChart>
      </div>
      <div className='section__input__search__statistic__barbearia'>
        <div className='tittle__historic'>
          <FaLayerGroup className='icon__FaLayerGroup' />
          <h2>Histórico</h2>
        </div>
        <div className='Box__input__Search'>
          <IoIosSearch id='lupa__in__bookings__history' />
          <input
            type="search"
            className='Inner__input__search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Buscar agendamento'
          />
        </div>
      </div>
    </div>
  );
}

export default StatisticBarbearia;