import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';

import './BookingsHistory.css'

import { IoArrowBackSharp } from "react-icons/io5";
import { BsFillGridFill } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";

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

    const getAllBookings = () =>{
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
    }, [])

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
            </div>
        </>
    )
}
export default BookingsHistory