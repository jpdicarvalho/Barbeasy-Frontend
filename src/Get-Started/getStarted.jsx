// GetStartedPage.js
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './getStarted.css';
import barberLogo from '../../barber-logo.png';

const GetStartedPage = () => {
  const [optionUser, setOptionUser] = useState(null);

  const handleOptionUser = (type) => {
    setOptionUser(type);
  };

  return (
    <div className="main__get__started" translate="no">
      <div className="header__container">
        <img id="logoBarbeasy" src={barberLogo} alt="lodo-Barbeasy" />
        <h1>Barbeasy</h1>
        <h3 id="welcome">Seja Bem-Vindo</h3>
      </div>
      <div className="option">
        <div
          className={`section_option ${optionUser === 'cliente' ? 'selected' : ''}`}
          onClick={() => handleOptionUser('cliente')}
        >
          <p className="tittle__option">Agendar Serviço</p>
          <hr className={`hr__in__get__started ${optionUser === 'cliente' ? 'hr__selected' : ''}`}/>
          <p style={{fontSize: '12px'}}>Descubra as melhores opções de serviços de barbearias.</p>
        </div>

        <div
          className={`section_option ${optionUser === 'barbearia' ? 'selected' : ''}`}
          onClick={() => handleOptionUser('barbearia')}
        >
          <p className="tittle__option">Oferecer Serviço</p>
          <hr className={`hr__in__get__started ${optionUser === 'barbearia' ? 'hr__selected' : ''}`}/>
          <p style={{fontSize: '12px'}}>Ofereça serviços de barbearia e conecte-se com clientes.</p>
        </div>
        <Link to="/SignIn">
          {optionUser === 'cliente' && <button className='button__link'>Iniciar</button>}
        </Link>
        <Link to="SignInBarbearia">
          {optionUser === 'barbearia' && <button className='button__link'>Iniciar</button>}
        </Link>
      </div>
      <footer className="footer">
        <div className="footer-links">
          <Link to="/TermsOfUse" className="footer-link">
            Termos de Uso
          </Link>
          <span className="footer-divider">|</span>
          <Link to="/PrivacyPolicies" className="footer-link">
            Políticas de Privacidade
          </Link>
        </div>
        <p className="copyright-text">
          © 2024 Barbeasy. Todos os direitos reservados.
        </p>
      </footer>

    </div>
  );
};

export default GetStartedPage;
