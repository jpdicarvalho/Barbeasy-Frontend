import React, { useState } from 'react';
import './ProfileBarbearia.css';
function ProfileBarbearia() {

  const [mostrarStatus, setMostrarStatus] = useState(false);
  const [mostrarNome, setMostrarNome] = useState(false);
  const [novoNome, setNovoNome] = useState('');

  // Estado para armazenar o valor selecionado do input de rádio
  const [statusSelecionado, setStatusSelecionado] = useState('');

  // Função para alternar a visibilidade da div de status
  const alternarStatus = () => {
    setMostrarStatus(!mostrarStatus);
  };

  const alternarNome = () => {
    setMostrarNome(!mostrarNome);
  };
//pegando o click nas divis
  const handleStatusChange = (event) => {
    setStatusSelecionado(event.target.value);
  };

  const handleNomeChange = (event) => {
    setNovoNome(event.target.value);
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

          <div className="menu__main" onClick={alternarStatus}>
            Status
          </div>

      {mostrarStatus && (
        <div className="divSelected">
          <label>
            <input
              className='label'
              type="radio"
              value="aberto"
              checked={statusSelecionado === 'aberto'}
              onChange={handleStatusChange}
            />
            Aberto
          </label>

          <label>
            <input
              className='label'
              type="radio"
              value="fechado"
              checked={statusSelecionado === 'fechado'}
              onChange={handleStatusChange}
            />
            Fechado
          </label>
        </div>
      )}

      <div className="menu__main" onClick={alternarNome} >
        Nome
      </div>

      {mostrarNome && (
        <div className="divSelected">
          <p className='information__span'>Altere o nome da Barbearia</p>
            <input
            id='input__name'
              type="text"
              value={novoNome}
              onChange={handleNomeChange}
              placeholder='Nome da Barbearia'
            />
            <button>
              Alterar
            </button>
         </div>
         
      )}
        </div>

        </div>
    </div>
    </>
  );
}

export default ProfileBarbearia;