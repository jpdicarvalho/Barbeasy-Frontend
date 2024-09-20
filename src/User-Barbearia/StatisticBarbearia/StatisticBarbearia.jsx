import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaLayerGroup } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

import './StatisticBarbearia.css'

const data = [
    {
      name: 'Jan',
      Agendamentos: 1000,
      
    },
    {
      name: 'Fev',
      Agendamentos: 1100,
      
    },
    {
      name: 'Mar',
      Agendamentos: 1200,
      
    },
    {
      name: 'Abr',
      Agendamentos: 1300,
      
    },
    {
      name: 'Mai',
      Agendamentos: 1400,
    
    },
    {
      name: 'Jun',
      Agendamentos: 1500,
     
    },
    {
      name: 'Jul',
      Agendamentos: 1690,
    },
    {
        name: 'Ago',
        Agendamentos: 1790,
      },
      {
        name: 'Set',
        Agendamentos: 1890,
      },
      {
        name: 'Out',
        Agendamentos: 1990,
      },
      {
        name: 'Nov',
        Agendamentos: 2190,
      },
      {
        name: 'Dez',
        Agendamentos: 2190,
      },
  ];


function StatisticBarbearia (){

  const urlApi = 'https://barbeasy.up.railway.app'

  const navigate = useNavigate();

  //Buscando informações do usuário logado
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('dataBarbearia');//Obtendo os dados salvo no localStorage
  const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
  const barbeariaId = userInformation.barbearia[0].id;

  const [search, setSearch] = useState('');

  const getAllBookings = () =>{
        axios.get(`${urlApi}/api/v1/amountBookings/${barbeariaId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
              }
        }).then(res =>{
            console.log('res')
                
        }).catch(err =>{
            console.error('Erro ao buscar agendamentos', err)
        })
    }
  useEffect(() =>{
    getAllBookings()
  }, [])

    return (
        <div className='container__statistic__barbearia'>
            <div>
                <h3>2024</h3>
            </div>
            <div className='section__grafic__barbearia'>
                <AreaChart
                    width={550}
                    height={200}
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 30,
                        bottom: 0,
                }}>

                <XAxis dataKey="name"/>
                <Tooltip />
                <Area type="monotone" dataKey="Agendamentos" stroke="#4a17d537" fill="#4a17d537" />
                </AreaChart>
            </div>
            <div className='section__input__search__statistic__barbearia'>
              <div className='tittle__historic'>
                  <FaLayerGroup className='icon__FaLayerGroup'/>
                  <h2>Histórico</h2>
              </div>
              <div className='Box__input__Search'>
                  <IoIosSearch id='lupa__in__bookings__history'/>
                  <input type="search" className='Inner__input__search' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Buscar agendamento'/>
              </div>
            </div>
           
        </div>
      );
}
export default StatisticBarbearia;