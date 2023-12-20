// GetStartedPage.js
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './getStarted.css';
import barberLogo from './barber-logo.png';

const GetStartedPage = () => {
  const [optionUser, setOptionUser] = useState(null);

  const handleOptionUser = (type) => {
    setOptionUser(type);
  };

  return (
    <div className="main">
      <div className="header__container">
        <img id="logoBarbeasy" src={barberLogo} alt="lodo-Barbeasy" />
        <h1>Barbeasy</h1>
        <h3 id="welcome">Seja Bem-Vindo</h3>
      </div>
      <div className="option">
        <div className='tittle__option'>O que deseja fazer?</div>
        <div
          className={`section_option ${optionUser === 'cliente' ? 'selected' : ''}`}
          onClick={() => handleOptionUser('cliente')}
        >
          <p className="tittle__option">Agendar Serviço</p>
          <hr id='hr' />
          <p>Descubra as melhores opções de serviços de barbearias</p>
        </div>

        <div
          className={`section_option ${optionUser === 'barbearia' ? 'selected' : ''}`}
          onClick={() => handleOptionUser('barbearia')}
        >
          <p className="tittle__option">Oferecer Serviço</p>
          <hr id='hr' />
          <p>Ofereça serviços de barbearia e conecte-se com clientes.</p>
        </div>
        <Link to="/SignIn">
          {optionUser === 'cliente' && <button>Iniciar</button>}
        </Link>
        <Link to="/">
          {optionUser === 'barbearia' && <button>Iniciar</button>}
        </Link>
      </div>
    </div>
  );
};

export default GetStartedPage;
