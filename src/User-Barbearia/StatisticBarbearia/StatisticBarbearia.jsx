import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import { AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { FaLayerGroup } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";

import { GiRazor } from "react-icons/gi";
import { MdOutlineTimer } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { RiExchangeFundsLine } from "react-icons/ri";
import { BsGraphDownArrow } from "react-icons/bs";
import { PiContactlessPayment } from "react-icons/pi";

import './StatisticBarbearia.css';

const monthNames = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

function StatisticBarbearia() {

  const urlApi = 'https://barbeasy.up.railway.app';
  const urlCloudFront = "https://d15o6h0uxpz56g.cloudfront.net/";

  const navigate = useNavigate();
  const graficRef = useRef(null);

  const date = new Date();
  const currentMonth = date.getMonth(); // Mês atual (0-11)
  const month = currentMonth + 1;
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

//================= Section list all bookings by month =================
const [bookings, setBookings] = useState([]);
const [expandedCardBooking, setExpandedCardBooking] = useState([]);
const [messagemNotFound, setMessagemNotFound] = useState("");

//Function to get all bookings of today
const handleDateClick = () => {
  axios.get(`${urlApi}/api/v1/bookingsByMonth/${barbeariaId}/${month}/${year}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => {
    if(res.status === 200){
      setBookings(res.data.bookings);
      // Chamando a função para ordenar os bookings por menor horário
      //orderBookings(bookings);
    }else{
      setBookings(false)
      setMessagemNotFound("Sem agendamento por enquanto...")
    }
  })
  .catch(err => console.log(err));
}

useEffect(() =>{
  handleDateClick()
}, [dataBookings])

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
      {bookings &&(
                    <>
                      {bookings.length > 0 ? (
                        bookings.map((booking, index) => {

                          return(
                                <div key={index} className='container__booking' onClick={() => toggleItem(booking.booking_id)}>
                                  <div className={`${booking.paymentStatus === "pending" ? 'booking__pending':'booking' } ${expandedCardBooking.includes(booking.booking_id) ? 'expandCard':''}`}>
                                    <div className="container_professional">
                                      {booking.user_image != "default.jpg" ?(
                                        <div className='container__img__client__booking'>
                                          <div className='user__image__professional'>
                                            <img src={urlCloudFront + booking.user_image} id='img__user__professional'/>
                                          </div>
                                          <p className='phone__client'>Cliente</p>
                                        </div>
                                        ):(
                                          <div className='container__img__client__booking'>
                                            <div className='user__image__professional'>
                                              <p className='firstLetter__client_Span'>{booking.user_name.charAt(0).toUpperCase()}</p>
                                            </div>
                                            <p className='phone__client'>Cliente</p>
                                          </div>
                                        )}
                                        <div className='container__name__client'>
                                          <p className='name__client'>{booking.user_name}</p>
                                          <p className='phone__client'>{booking.user_phone}</p>
                                          
                                        </div>
                                      
                                      <div className="date_time__booking__in__statistic__barbearia">
                                          <p className='date_booking__in__statistic__barbearia'>{booking.booking_date}</p>
                                          <p className='time_booking__in__statistic__barbearia'>{booking.booking_time.split(',')[0]}</p>
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
    </div>
  );
}

export default StatisticBarbearia;