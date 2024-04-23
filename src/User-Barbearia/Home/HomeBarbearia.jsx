import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import './HomeBarbearia.css';


function HomeBarbearia() {
  const navigate = useNavigate();

  //Buscando informações do usuário logado
  const userData = localStorage.getItem('dataBarbearia');//Obtendo os dados salvo no localStorage
  const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
  const barbeariaId = userInformation.barbearia[0].id;

const navigateToProfileBarbearia = () =>{
  navigate("/ProfileBarbearia");
}

  return (
      <div className="header_main">
        <div className='header_container'>

          <div className="img__user">
            <img src="" alt="" />
          </div>

          <div className="user__name">
            <p>Barbearia Blinders</p>
            <p>Boa tarde, jp.dicarvalho</p>
          </div>

          <div className="settings" onClick={navigateToProfileBarbearia}>
            set
          </div>
        </div>

        <div className='agendamentos'>
        <p className='information__span'>Dias Agendados</p>
        
          <div className='Dia__agendado'>
            <p>Sáb</p>
            <p>7</p>
            <p>ABR</p>
          </div>
        </div>
      </div>
  );
}

export default HomeBarbearia;
