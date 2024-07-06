import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"

import './BookingsHistory.css'

import { IoArrowBackSharp } from "react-icons/io5";
import { BsFillGridFill } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";

function BookingsHistory (){
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate("/Home");
      };

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
                        <BsFillGridFill className="icon__filter"/>
                    </div>
                </div>
            </div>
        </>
    )
}
export default BookingsHistory