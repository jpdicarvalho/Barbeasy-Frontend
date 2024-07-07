import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';

import './BookingsHistory.css'

import { IoArrowBackSharp } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { PiTimerLight } from "react-icons/pi";
import { CiCalendar } from "react-icons/ci";

function BookingsHistory (){
    const urlApi = 'https://barbeasy.up.railway.app'

    const navigate = useNavigate();

    //Buscando informações do usuário logado
    const token = localStorage.getItem('token');
    const userDataFromLocalStorage = localStorage.getItem('userData');//Obtendo os dados salvo no localStorage
    const userInformation = JSON.parse(userDataFromLocalStorage);//trasnformando os dados para JSON
    const userId = userInformation.user[0].id;

    const handleBackClick = () => {
        navigate("/Home");
      };

    const [allBookings, setAllBookings] = useState ([]);
    const [message, setMessage] = useState ('');

    /*const getAllBookings = () =>{
        axios.get(`${urlApi}/api/v1/bookingsOfUser/:userId`, {
            headers: {
                'Authorization': `Bearer ${token}`
              }
        }).then(res =>{
            if(res.data.Success === 'Success'){
                setAllBookings(res.data.Bookings)
            }else{
                setMessage('Nenhum agendamento encontrado.')
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            }
        }).catch(err =>{
            console.error('Erro ao buscar agendamentos', err)
        })
    }

    useEffect(() =>{
        getAllBookings()
    }, [])*/

    return(
        <>
            <div className="container__profile__professional">
                <div className="header__bookings__history">
                    <div className="back">
                        <IoArrowBackSharp className="Icon__Back" onClick={handleBackClick}/>
                    </div>
                    <div className='tittle__historic'>
                        <h2>Histórico</h2>
                    </div>
                    <div className='Box__input__Search'>
                        <IoIosSearch id='lupa__in__bookings__history'/>
                        <input type="search" className='Inner__input__search' placeholder='Buscar agendamento'/>
                    </div>
                </div>
                <div className='section__bookings__history'>
                    <div className='Box__bookings__history'>
                        <div className='box__banner__main__bookings__history'>
                            <img className='banner__main__barbearia__bookings__history' src="https://d15o6h0uxpz56g.cloudfront.net/barbeariaId_4_banner_1_20240629_092030.jpg" alt="" />
                        </div>

                        <div className='body__bookings__history'>
                            <p className='date__bookings__history'>
                                <CiCalendar style={{fontSize: '18px', marginRight: '3px'}}/>
                                Sáb, 29 de Jun de 2024
                            </p>
                            <div className='innner__bookings__history'>
                                <p>Corte Navalhado</p>
                                <div className='time__bookings__history'>
                                    <p className='price__service__bookings__history'>R$30,00 | </p>
                                    <PiTimerLight className='icon__PiTimerLight'/>
                                    <p>09:30 - 10:15 pm</p>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className='Box__bookings__history'>
                        <div className='box__banner__main__bookings__history'>
                            <img className='banner__main__barbearia__bookings__history' src="https://d15o6h0uxpz56g.cloudfront.net/barbeariaId_4_banner_1_20240629_092030.jpg" alt="" />
                        </div>

                        <div className='body__bookings__history'>
                            <p className='date__bookings__history'>
                                <CiCalendar style={{fontSize: '18px', marginRight: '3px'}}/>
                                Sáb, 29 de Jun de 2024
                            </p>
                            <div className='innner__bookings__history'>
                                <p>Corte Navalhado</p>
                                <div className='time__bookings__history'>
                                    <p className='price__service__bookings__history'>R$30,00 | </p>
                                    <PiTimerLight className='icon__PiTimerLight'/>
                                    <p>09:30 - 10:15 pm</p>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className='Box__bookings__history'>
                        <div className='box__banner__main__bookings__history'>
                            <img className='banner__main__barbearia__bookings__history' src="https://d15o6h0uxpz56g.cloudfront.net/barbeariaId_4_banner_1_20240629_092030.jpg" alt="" />
                        </div>

                        <div className='body__bookings__history'>
                            <p className='date__bookings__history'>
                                <CiCalendar style={{fontSize: '18px', marginRight: '3px'}}/>
                                Sáb, 29 de Jun de 2024
                            </p>
                            <div className='innner__bookings__history'>
                                <p>Corte Navalhado</p>
                                <div className='time__bookings__history'>
                                    <p className='price__service__bookings__history'>R$30,00 | </p>
                                    <PiTimerLight className='icon__PiTimerLight'/>
                                    <p>09:30 - 10:15 pm</p>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className='Box__bookings__history'>
                        <div className='box__banner__main__bookings__history'>
                            <img className='banner__main__barbearia__bookings__history' src="https://d15o6h0uxpz56g.cloudfront.net/barbeariaId_4_banner_1_20240629_092030.jpg" alt="" />
                        </div>

                        <div className='body__bookings__history'>
                            <p className='date__bookings__history'>
                                <CiCalendar style={{fontSize: '18px', marginRight: '3px'}}/>
                                Sáb, 29 de Jun de 2024
                            </p>
                            <div className='innner__bookings__history'>
                                <p>Corte Navalhado</p>
                                <div className='time__bookings__history'>
                                    <p className='price__service__bookings__history'>R$30,00 | </p>
                                    <PiTimerLight className='icon__PiTimerLight'/>
                                    <p>09:30 - 10:15 pm</p>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className='Box__bookings__history'>
                        <div className='box__banner__main__bookings__history'>
                            <img className='banner__main__barbearia__bookings__history' src="https://d15o6h0uxpz56g.cloudfront.net/barbeariaId_4_banner_1_20240629_092030.jpg" alt="" />
                        </div>

                        <div className='body__bookings__history'>
                            <p className='date__bookings__history'>
                                <CiCalendar style={{fontSize: '18px', marginRight: '3px'}}/>
                                Sáb, 29 de Jun de 2024
                            </p>
                            <div className='innner__bookings__history'>
                                <p>Corte Navalhado</p>
                                <div className='time__bookings__history'>
                                    <p className='price__service__bookings__history'>R$30,00 | </p>
                                    <PiTimerLight className='icon__PiTimerLight'/>
                                    <p>09:30 - 10:15 pm</p>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className='Box__bookings__history'>
                        <div className='box__banner__main__bookings__history'>
                            <img className='banner__main__barbearia__bookings__history' src="https://d15o6h0uxpz56g.cloudfront.net/barbeariaId_4_banner_1_20240629_092030.jpg" alt="" />
                        </div>

                        <div className='body__bookings__history'>
                            <p className='date__bookings__history'>
                                <CiCalendar style={{fontSize: '18px', marginRight: '3px'}}/>
                                Sáb, 29 de Jun de 2024
                            </p>
                            <div className='innner__bookings__history'>
                                <p>Corte Navalhado</p>
                                <div className='time__bookings__history'>
                                    <p className='price__service__bookings__history'>R$30,00 | </p>
                                    <PiTimerLight className='icon__PiTimerLight'/>
                                    <p>09:30 - 10:15 pm</p>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className='Box__bookings__history'>
                        <div className='box__banner__main__bookings__history'>
                            <img className='banner__main__barbearia__bookings__history' src="https://d15o6h0uxpz56g.cloudfront.net/barbeariaId_4_banner_1_20240629_092030.jpg" alt="" />
                        </div>

                        <div className='body__bookings__history'>
                            <p className='date__bookings__history'>
                                <CiCalendar style={{fontSize: '18px', marginRight: '3px'}}/>
                                Sáb, 29 de Jun de 2024
                            </p>
                            <div className='innner__bookings__history'>
                                <p>Corte Navalhado</p>
                                <div className='time__bookings__history'>
                                    <p className='price__service__bookings__history'>R$30,00 | </p>
                                    <PiTimerLight className='icon__PiTimerLight'/>
                                    <p>09:30 - 10:15 pm</p>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className='Box__bookings__history'>
                        <div className='box__banner__main__bookings__history'>
                            <img className='banner__main__barbearia__bookings__history' src="https://d15o6h0uxpz56g.cloudfront.net/barbeariaId_4_banner_1_20240629_092030.jpg" alt="" />
                        </div>

                        <div className='body__bookings__history'>
                            <p className='date__bookings__history'>
                                <CiCalendar style={{fontSize: '18px', marginRight: '3px'}}/>
                                Sáb, 29 de Jun de 2024
                            </p>
                            <div className='innner__bookings__history'>
                                <p>Corte Navalhado</p>
                                <div className='time__bookings__history'>
                                    <p className='price__service__bookings__history'>R$30,00 | </p>
                                    <PiTimerLight className='icon__PiTimerLight'/>
                                    <p>09:30 - 10:15 pm</p>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className='Box__bookings__history'>
                        <div className='box__banner__main__bookings__history'>
                            <img className='banner__main__barbearia__bookings__history' src="https://d15o6h0uxpz56g.cloudfront.net/barbeariaId_4_banner_1_20240629_092030.jpg" alt="" />
                        </div>

                        <div className='body__bookings__history'>
                            <p className='date__bookings__history'>
                                <CiCalendar style={{fontSize: '18px', marginRight: '3px'}}/>
                                Sáb, 29 de Jun de 2024
                            </p>
                            <div className='innner__bookings__history'>
                                <p>Corte Navalhado</p>
                                <div className='time__bookings__history'>
                                    <p className='price__service__bookings__history'>R$30,00 | </p>
                                    <PiTimerLight className='icon__PiTimerLight'/>
                                    <p>09:30 - 10:15 pm</p>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className='Box__bookings__history'>
                        <div className='box__banner__main__bookings__history'>
                            <img className='banner__main__barbearia__bookings__history' src="https://d15o6h0uxpz56g.cloudfront.net/barbeariaId_4_banner_1_20240629_092030.jpg" alt="" />
                        </div>

                        <div className='body__bookings__history'>
                            <p className='date__bookings__history'>
                                <CiCalendar style={{fontSize: '18px', marginRight: '3px'}}/>
                                Sáb, 29 de Jun de 2024
                            </p>
                            <div className='innner__bookings__history'>
                                <p>Corte Navalhado</p>
                                <div className='time__bookings__history'>
                                    <p className='price__service__bookings__history'>R$30,00 | </p>
                                    <PiTimerLight className='icon__PiTimerLight'/>
                                    <p>09:30 - 10:15 pm</p>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className='Box__bookings__history'>
                        <div className='box__banner__main__bookings__history'>
                            <img className='banner__main__barbearia__bookings__history' src="https://d15o6h0uxpz56g.cloudfront.net/barbeariaId_4_banner_1_20240629_092030.jpg" alt="" />
                        </div>

                        <div className='body__bookings__history'>
                            <p className='date__bookings__history'>
                                <CiCalendar style={{fontSize: '18px', marginRight: '3px'}}/>
                                Sáb, 29 de Jun de 2024
                            </p>
                            <div className='innner__bookings__history'>
                                <p>Corte Navalhado</p>
                                <div className='time__bookings__history'>
                                    <p className='price__service__bookings__history'>R$30,00 | </p>
                                    <PiTimerLight className='icon__PiTimerLight'/>
                                    <p>09:30 - 10:15 pm</p>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className='Box__bookings__history'>
                        <div className='box__banner__main__bookings__history'>
                            <img className='banner__main__barbearia__bookings__history' src="https://d15o6h0uxpz56g.cloudfront.net/barbeariaId_4_banner_1_20240629_092030.jpg" alt="" />
                        </div>

                        <div className='body__bookings__history'>
                            <p className='date__bookings__history'>
                                <CiCalendar style={{fontSize: '18px', marginRight: '3px'}}/>
                                Sáb, 29 de Jun de 2024
                            </p>
                            <div className='innner__bookings__history'>
                                <p>Corte Navalhado</p>
                                <div className='time__bookings__history'>
                                    <p className='price__service__bookings__history'>R$30,00 | </p>
                                    <PiTimerLight className='icon__PiTimerLight'/>
                                    <p>09:30 - 10:15 pm</p>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className='Box__bookings__history'>
                        <div className='box__banner__main__bookings__history'>
                            <img className='banner__main__barbearia__bookings__history' src="https://d15o6h0uxpz56g.cloudfront.net/barbeariaId_4_banner_1_20240629_092030.jpg" alt="" />
                        </div>

                        <div className='body__bookings__history'>
                            <p className='date__bookings__history'>
                                <CiCalendar style={{fontSize: '18px', marginRight: '3px'}}/>
                                Sáb, 29 de Jun de 2024
                            </p>
                            <div className='innner__bookings__history'>
                                <p>Corte Navalhado</p>
                                <div className='time__bookings__history'>
                                    <p className='price__service__bookings__history'>R$30,00 | </p>
                                    <PiTimerLight className='icon__PiTimerLight'/>
                                    <p>09:30 - 10:15 pm</p>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className='Box__bookings__history'>
                        <div className='box__banner__main__bookings__history'>
                            <img className='banner__main__barbearia__bookings__history' src="https://d15o6h0uxpz56g.cloudfront.net/barbeariaId_4_banner_1_20240629_092030.jpg" alt="" />
                        </div>

                        <div className='body__bookings__history'>
                            <p className='date__bookings__history'>
                                <CiCalendar style={{fontSize: '18px', marginRight: '3px'}}/>
                                Sáb, 29 de Jun de 2024
                            </p>
                            <div className='innner__bookings__history'>
                                <p>Corte Navalhado</p>
                                <div className='time__bookings__history'>
                                    <p className='price__service__bookings__history'>R$30,00 | </p>
                                    <PiTimerLight className='icon__PiTimerLight'/>
                                    <p>09:30 - 10:15 pm</p>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className='Box__bookings__history'>
                        <div className='box__banner__main__bookings__history'>
                            <img className='banner__main__barbearia__bookings__history' src="https://d15o6h0uxpz56g.cloudfront.net/barbeariaId_4_banner_1_20240629_092030.jpg" alt="" />
                        </div>

                        <div className='body__bookings__history'>
                            <p className='date__bookings__history'>
                                <CiCalendar style={{fontSize: '18px', marginRight: '3px'}}/>
                                Sáb, 29 de Jun de 2024
                            </p>
                            <div className='innner__bookings__history'>
                                <p>Corte Navalhado</p>
                                <div className='time__bookings__history'>
                                    <p className='price__service__bookings__history'>R$30,00 | </p>
                                    <PiTimerLight className='icon__PiTimerLight'/>
                                    <p>09:30 - 10:15 pm</p>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}
export default BookingsHistory