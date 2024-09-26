import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';


import { AreaChart, Area, XAxis, Tooltip, BarChart, Bar, Legend, ResponsiveContainer, LabelList} from 'recharts';


import { IoIosSearch } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { GiRazor } from "react-icons/gi";
import { MdOutlineTimer } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import { RiExchangeFundsLine } from "react-icons/ri";
import { BsGraphDownArrow } from "react-icons/bs";
import { PiContactlessPayment } from "react-icons/pi";
import { LuGanttChartSquare } from "react-icons/lu";

import './StatisticBarbearia.css';

const monthNames = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

const data = [
  {
    name: 'Navalhado',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Degradê',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Social',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Barba',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Sobrancelha',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  }
];
function StatisticBarbearia() {

  const urlApi = 'https://barbeasy.up.railway.app';
  const urlCloudFront = "https://d15o6h0uxpz56g.cloudfront.net/";

  const navigate = useNavigate();
  const graficRef = useRef(null);

  const date = new Date();
  const currentMonth = date.getMonth(); // Mês atual (0-11)
  const currentYear = date.getFullYear();

  const [year, setYear] = useState(currentYear);


  // Buscando informações do usuário logado
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('dataBarbearia'); // Obtendo os dados salvos no localStorage
  const userInformation = JSON.parse(userData); // Transformando os dados para JSON
  const barbeariaId = userInformation.barbearia[0].id;

  const [isLoading, setIsLoading] = useState (true);
  const [search, setSearch] = useState('');
  const [dataBookings, setDataBookings] = useState([]);

  // Função para buscar os agendamentos
  const getAllBookings = () => {
    axios.get(`${urlApi}/api/v1/totalBookings/${barbeariaId}/${year}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
  console.log(res.data)

      setDataBookings(res.data.totalBookings);
    }).catch(err => {
      console.error('Erro ao buscar agendamentos', err);
    });
  };

  useEffect(() => {
    getAllBookings();
  }, [year]);
  
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

  useEffect(() => {
    scrollToCurrentMonth(); // Executa após a renderização do gráfico
  }, [dataBookings]);
//================= Section list all bookings by month =================
const [bookings, setBookings] = useState([]);
const [expandedCardBooking, setExpandedCardBooking] = useState([]);
const [changedPayload, setChangedPayload] = useState(monthNames[currentMonth]);
const [amountBarbearia, setAmountBarbearia] = useState ([])
const [comissionProfessional, setComissionProfessional] = useState ([])
const [isHiddenSectionStatistic, setIsHiddenSectionStatistic] = useState(true);
const [dropdownYear, setDropdownYear] = useState(false);
const [messagemNotFound, setMessagemNotFound] = useState("");

const CurrentMonthAndYear = `${changedPayload} de ${year}`;

//Function to get all bookings of today
const handleDateClick = () => {
  axios.get(`${urlApi}/api/v1/bookingsByMonth/${barbeariaId}/${CurrentMonthAndYear}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => {
    if(res.status === 200){
      setBookings(res.data.bookings != 0 ? res.data.bookings:[]);
      setIsLoading(false)
      scrollToCurrentMonth()
    }else{
      setBookings(false)
      setIsLoading(false)
      setMessagemNotFound("Sem agendamento por enquanto...")
    }
  })
  .catch(err => console.log(err));
}

// Function to get amount by month and year
const getAmountOfMonth = () =>{
  axios.get(`${urlApi}/api/v1/getAmountOfMonth/${barbeariaId}/${CurrentMonthAndYear}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res =>{
    setAmountBarbearia(res.data.totalAmountBarbearia)
    setComissionProfessional(res.data.comissionByProfessional)
    scrollToCurrentMonth()
  }).catch(err =>{
    console.log(err)
  })
}

useEffect(() =>{
  handleDateClick()
}, [CurrentMonthAndYear])

useEffect(() =>{
  getAmountOfMonth()
}, [CurrentMonthAndYear])

// Function to show the section statistic with grafics
const showSectionStatistic = () =>{
  getAllBookings()
  setSearch('')
  setIsHiddenSectionStatistic(false)
}

// Function to hidden the section statistic with grafics
const hiddenSectionStatistic = () =>{
  getAllBookings()
  setSearch('')
  setIsHiddenSectionStatistic(true)
}

// Function to change the value of year
const handleChangeYear = () =>{
  setYear(year === 2024 ? 2023:2024)
  setDropdownYear(!dropdownYear)
  updateAllData()
}

// Convertendo o valor do search para minúsculo
const searchLowerCase = search.toLowerCase();

// Buscando Barbearia pelo input Search
const bookingSearch = bookings.filter((booking) =>
  booking.booking_date.toLowerCase().includes(searchLowerCase) ||
  booking.service_name.toLowerCase().includes(searchLowerCase) ||
  booking.professional_name.toLowerCase().includes(searchLowerCase) ||
  booking.booking_time.toLowerCase().includes(searchLowerCase)
);

//Function to expanded booking cards
const toggleItem = (itemId) => {
  if (expandedCardBooking.includes(itemId)) {
    setExpandedCardBooking(expandedCardBooking.filter(id => id !== itemId));
  } else {
    setExpandedCardBooking([...expandedCardBooking, itemId]);
  }
};

const CustomTooltip = ({ payload }) => {
  if (payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <hr id='line__tooltip'/>
        <p className="label">{`Agendamentos: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const CustomTooltipGraficBar = ({ payload }) => {
  if (payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <hr id='line__tooltip'/>
        <p className="label">{`${payload[0].payload.name}: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

// Function to handle change the month of grafic area
const handleChangePayload = (payloadSelected) =>{
  setChangedPayload(payloadSelected)
  updateAllData()
}

const handleDropdowYear = () =>{
  setDropdownYear(!dropdownYear)
}

const updateAllData = () =>{
  setIsLoading(true)

  handleDateClick()
  getAmountOfMonth()
  getAllBookings()

  setTimeout(() =>{
      setIsLoading(false)
  }, 2000)
}
//=============================================
  return (
    <div className='container__statistic__barbearia'>
        <div className='section__input__search__statistic__barbearia'>
          <div className='inner__input__search__statistic__barbearia'>
            <div className='tittle__historic tittle__historic__in__statistic__barbearia'>
              <LuGanttChartSquare className='icon__LuGanttChartSquare' />
              <h2>Relatório </h2>
            </div>
            <div className={`Box__input__Search__statistic__barbearia ${!isHiddenSectionStatistic ? 'active__box__input__Search__statistic__barbearia':''}`} onClick={showSectionStatistic}>
              <IoIosSearch className={`lupa__in__statistic__barbearia ${!isHiddenSectionStatistic ? 'active__lupa__in__statistic__barbearia':''}`}/>
              <input
                type="search"
                className={`input__search__statistic__barbearia ${!isHiddenSectionStatistic ? 'active__input__Search__statistic__barbearia':''}`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Buscar por dia, mês, horário, serviço e profissional'
              />
            </div>
          </div>
          
          <button className={` ${isHiddenSectionStatistic ? 'hidden_btn__cancel__search__booking':' btn__cancel__search__booking'}`} onClick={hiddenSectionStatistic}>Cancelar</button>
        </div>


        {isLoading ? (
          <div className='container__loading__in__bookings__history'>
          <div className="loaderCreatingBooking"></div>
        </div>
        ):(
          <>
            {isHiddenSectionStatistic && (
                  <>
                   <div className='inner__details__statistic__barbearia'>
                      <hr className='border__left__details__statistic__barbearia'/>
                      <div className='box__values__details__statistic__barbearia'>
                          <p className='title__details__statistic__barbearia'>Faturamento</p>
                          <h3>{amountBarbearia ? `R$ ${amountBarbearia}`:'R$ 00,00'}</h3>
                          <hr id='line__details__statistic__barbearia'/>
                          {comissionProfessional &&(
                            <>
                              <p className='title__details__statistic__barbearia'>{comissionProfessional.length}</p>
                              {Object.entries(comissionProfessional).map(([professional, comissionFee]) =>(
                                <div key={professional}>
                                  <h3 className='inner__comission__professional__statistic__barbearia'>{professional}<p>R$ {comissionFee}</p></h3>
                                </div>
                              ))}
                            </>
                          )}
                      </div>
                    </div>

                    <div className='dropdown__year__statistic__barbearia' onClick={handleDropdowYear}>
                      <h3 className='box__details__statistic__barbearia'>{year} <IoIosArrowDown className={`arrowYear ${dropdownYear ? 'girar' : ''}`} id='arrow'/></h3>
                    </div>
                    <div className={`another__year__hidden ${dropdownYear ? 'another__year__statistic__barbearia':''}`} onClick={handleChangeYear}>
                        <h3 className='box__details__statistic__barbearia'>{year === 2024 ? 2023:2023}</h3>
                    </div>
                    
                    <div className='container__grafic__statistic__barbearia'>
                      <h3 className='title__grafic____statistic__barbearia'>Agendamentos por mês</h3>
                      <hr />
                      <div className='section__grafic__barbearia' ref={graficRef}>
                        <AreaChart
                          width={550}
                          height={200}
                          data={dataBookings}
                          stackOffset="expand"
                          margin={{
                            top: 20,
                            right: 30,
                            left: 30,
                            bottom: 0,
                          }}>

                          <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                              <stop
                                offset="1%"
                                stopColor="#4a17d5"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="75%"
                                stopColor="#4a17d5"
                                stopOpacity={0.1}
                              />
                            </linearGradient>
                        </defs>
                        <XAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={10}
                          dataKey="month" 
                            tick={({ x, y, payload }) => {
                              const isCurrentMonth = changedPayload === payload.value;
                              return (
                                <text
                                  x={x} 
                                  y={y + 10} 
                                  fill={isCurrentMonth ? '#f6f6f6' : 'gray'} 
                                  textAnchor="middle"
                                  onClick={() => {handleChangePayload(payload.value)}}
                                >
                                  {payload.value}
                                  
                                </text>
                              );
                            }}
                        />
                      
                      <Tooltip
                        content={<CustomTooltip />}
                        
                        />
                        <Area
                          type="basis" 
                          dataKey="Agendamentos" 
                          stroke="#4a17d5"
                          fill="url(#colorUv)"  
                          fillOpacity={0.4}
                        >
                        </Area>
                        </AreaChart>
                      </div>
                    </div>
                      
                    <div className='container__grafic__statistic__barbearia'>
                        
                      <h3 className='title__grafic____statistic__barbearia'>Serviços mais agendados em {changedPayload}</h3>
                      <hr />

                        <ResponsiveContainer width={385} height={270} >
                          <BarChart
                            data={data}
                            margin={{
                              top: 40,
                              bottom: 15
                            }}
                          >
                            <XAxis dataKey="name"
                              tickLine={false}  
                              axisLine={false}
                              tickFormatter={(value) => value.slice(0, 6)}
                              tickMargin={10}/>
                              <Tooltip
                                cursor={false}
                                content={<CustomTooltipGraficBar />}
                            />
                            <Bar dataKey="uv" fill="#4a17d564" radius={10} width={20}>
                              <LabelList dataKey="uv" position="top"
                                offset={12}
                                fontSize={12} />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                    </div>
                  </>
            )}
            {bookings &&(
                        <div className='section__bookings__in__statistic__barbearia'>
                          <h3 className='title__details__statistic__barbearia' style={{marginBottom: '10px'}}>Histórico</h3>
                          {bookingSearch.length > 0 ? (
                            bookingSearch.map((booking, index) => {

                              return(
                                    <div key={index} className='container__booking' onClick={() => toggleItem(booking.booking_id)}>
                                      <div className={`${booking.paymentStatus === "pending" ? 'booking__pending':'booking__in__statistic__barbearia' } ${expandedCardBooking.includes(booking.booking_id) ? 'expandCard__booking__in__statistic__barbearia':''}`}>
                                        
                                        <div className='container__values__booking__in__statistic__barbearia'>
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

                                    </div>
                                );
                            })
                          ):(
                            <div className="message__notFound__statistic__barbearia">
                            <p style={{fontSize:"20px"}}>{messagemNotFound ? messagemNotFound:'Nenhum agendamento encontrado.'}</p>
                          </div>
                          )}
                        </div>
            )}
            {!bookings &&(
              <div className='message__notFound'>
                <BsGraphDownArrow  className='icon__BsGraphDownArrow'/>
                <p>{messagemNotFound}</p>
              </div>
            )}
          </>
        )}
    </div>
  );
}

export default StatisticBarbearia;