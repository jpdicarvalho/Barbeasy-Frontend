import React, { useState } from 'react';
import './ProfileBarbearia.css';
function ProfileBarbearia() {

  const [mostrarStatus, setMostrarStatus] = useState(false);

  const [mostrarNome, setMostrarNome] = useState(false);
  const [novoNome, setNovoNome] = useState('');

  const [mostrarEndereco, setMostrarEndereco] = useState(false);
  const [novoEndereco, setNovoEndereco] = useState('');

  // Estado para armazenar o valor selecionado do input de rádio
  const [statusSelecionado, setStatusSelecionado] = useState('');

  const [values, setValues] = useState({
    name: ''
  });

  // Função para alternar a visibilidade da div de status
  const alternarStatus = () => {
    setMostrarStatus(!mostrarStatus);
  };

  const alternarNome = () => {
    setMostrarNome(!mostrarNome);
  };

  const alternarEndereco = () => {
    setMostrarEndereco(!mostrarEndereco);
  };

//pegando o click nas divis
  const handleStatusChange = (event) => {
    setStatusSelecionado(event.target.value);
  };

  const handleNomeChange = (event) => {
    setNovoNome(event.target.value);
  };

  const handleEnderecoChange = (event) => {
    setNovoEndereco(event.target.value);
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
            <span className={`material-symbols-outlined arrow ${mostrarStatus ? 'girar' : ''}`} id='arrow'>expand_more</span>
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
        <span className={`material-symbols-outlined arrow ${mostrarNome ? 'girar' : ''}`} id='arrow'>expand_more</span>
      </div>

      {mostrarNome && (
        <div className="divSelected">
          <p className='information__span'>Altere o nome da Barbearia</p>

          <div className="inputBox">
            <input
            type="text"
            id="name"
            name="name"
            value={values.name}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Remover caracteres não alfanuméricos, ponto e espaço
              const filteredValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ.]/g, '');
              // Limitar a 30 caracteres
              const truncatedValue = filteredValue.slice(0, 30);
              setValues({ ...values, name: truncatedValue });
            }}
            placeholder="Nome da Barbearia"
            required
          /> <span className="material-symbols-outlined icon_input">store</span>
          </div>

            <button className='button__change'>
              Alterar
            </button>
         </div>
         
      )}

      <div className="menu__main" onClick={alternarEndereco} >
        Endereço
        <span className={`material-symbols-outlined arrow ${mostrarEndereco ? 'girar' : ''}`} id='arrow'>expand_more</span>
      </div>

      {mostrarEndereco && (
              <div className="divSelected">
                <p className='information__span'>Altere o endereço da Barbearia</p>

                <div className="inputBox">
                  <input
                  type="text"
                  id="street"
                  name="street"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Remover caracteres especiais
                    const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ]/g, '');

                    // Limitar a 50 caracteres
                    const truncatedValue = sanitizedValue.slice(0, 50);
                    setValues({ ...values, street: truncatedValue });
                  }}
                  placeholder="Rua"
                  required
                /> <span className="material-symbols-outlined icon_input">add_road</span>

              <input
                type="text"
                id="number"
                name="number"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres não numéricos
                  const numericValue = inputValue.replace(/\D/g, '');
                  // Limitar a 10 caracteres
                  const truncatedValue = numericValue.slice(0, 5);
                  setValues({ ...values, number: truncatedValue });
                }}
                placeholder="Nº"
                required
              />{' '} <span className="material-symbols-outlined" id="icon_street_number">home_pin</span>
              
              <input
                type="text"
                id="neighborhood"
                name="neighborhood"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres especiais
                  const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ]/g, '');
                  // Limitar a 50 caracteres
                  const truncatedValue = sanitizedValue.slice(0, 50);
                  setValues({ ...values, neighborhood: truncatedValue });
                }}
                placeholder="Bairro"
                required
              /><span className="material-symbols-outlined" id="icon_input_neighborhood">route</span>
              
              <input
                type="text"
                id="city"
                name="city"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres especiais
                  const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ]/g, '');
                  // Limitar a 50 caracteres
                  const truncatedValue = sanitizedValue.slice(0, 30);
                  setValues({ ...values, city: truncatedValue });
                }}
                placeholder="Cidade"
                required
              />{' '} <span className="material-symbols-outlined" id="icon_input_city">map</span>
                </div>

                  <button className='button__change'>
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