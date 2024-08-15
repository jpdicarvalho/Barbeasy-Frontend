import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom"
import axios from 'axios';

import './ScheduleBarbearia.css';

const months = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

const daysOfWeek = [
  'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
];

function ScheduleBarbearia() {

  const urlApi = 'https://barbeasy.up.railway.app'
  const urlCloudFront = "https://d15o6h0uxpz56g.cloudfront.net/"


return (
    <div className="container__main__home__barbearia">
        
        
        
        
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
);
}

export default ScheduleBarbearia;
