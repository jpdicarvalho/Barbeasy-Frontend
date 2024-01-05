import React, { useState } from 'react';
import './ProfileBarbearia.css';
function ProfileBarbearia() {

// Estado para controlar a visibilidade da div de status
  const [mostrarStatus, setMostrarStatus] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Estado para armazenar o valor selecionado do input de rádio
  const [statusSelecionado, setStatusSelecionado] = useState('');

  // Função para alternar a visibilidade da div de status
  const alternarStatus = () => {
    setMostrarStatus(!mostrarStatus);
    // Girar 180 graus quando a div 'status' for clicada
    setRotation(rotation + 180);
  };

  // Função para lidar com a seleção do input de rádio
  const handleStatusChange = (event) => {
    setStatusSelecionado(event.target.value);
  };
  return (
    <>
    <div className="main">

        <div className="banners">
            <h1>Banners</h1>
        </div>

        <div className="section_information">

        <div className="img__user_edit">
          <img src="" alt="" />
        </div>

        <div className='tittle_menu'>
            <h3>Informações da Barbearia</h3>
        </div>

        <div className="container__menu__one">
        <div className="status" onClick={alternarStatus}>
        Status
      </div>

      {mostrarStatus && (
        <div className="divStatus">
          <label>
            <input
              type="radio"
              value="aberto"
              checked={statusSelecionado === 'aberto'}
              onChange={handleStatusChange}
            />
            Aberto
          </label>

          <label>
            <input
              type="radio"
              value="fechado"
              checked={statusSelecionado === 'fechado'}
              onChange={handleStatusChange}
            />
            Fechado
          </label>
        </div>
      )}
        </div>

        </div>
    </div>
    </>
  );
}

export default ProfileBarbearia;