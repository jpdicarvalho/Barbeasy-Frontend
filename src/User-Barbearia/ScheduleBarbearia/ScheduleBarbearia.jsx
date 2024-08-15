import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom"
import axios from 'axios';

import './ScheduleBarbearia.css';
import { GiRazorBlade } from "react-icons/gi";
import { TfiTime } from "react-icons/tfi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import { RiExchangeFundsLine } from "react-icons/ri";
import { SlGraph } from "react-icons/sl";
import { IoNotificationsOutline } from "react-icons/io5";
import { BsGraphDownArrow } from "react-icons/bs";
import { HiArrowPath } from "react-icons/hi2";
import { BsCalendar2Check } from "react-icons/bs";
import { GrAppsRounded } from "react-icons/gr";
import { CiLogout } from "react-icons/ci";
import { IoHomeOutline } from "react-icons/io5";

import { SlLayers } from "react-icons/sl";
const months = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

const daysOfWeek = [
  'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
];

function ScheduleBarbearia() {

  const urlApi = 'https://barbeasy.up.railway.app'
  const urlCloudFront = "https://d15o6h0uxpz56g.cloudfront.net/"


const navigateToProfileBarbearia = () =>{
    navigate("/ProfileBarbearia");
}

const navigateToScheduleBarbearia = () =>{
    navigate("/ScheduleBarbearia");
}

//Função LogOut
const logoutClick = () => {
    ['token', 'dataBarbearia', 'code_verifier', 'AmountVisibility'].forEach(key => localStorage.removeItem(key));
    navigate("/");
};

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
                <IoHomeOutline className='icon__RiExchangeFundsLine'/>
            </button>
            <p className='label__button__header'>Home</p>
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
