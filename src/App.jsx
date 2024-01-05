// Importando os componentes e funcionalidades necessários do react-router-dom e prop-types
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GetStartedPage from '../src/Get-Started/getStarted';

import SignIn from '../src/User-Client-Barbearia/SignIn/SignIn';
import SignUp from './User-Client-Barbearia/SignUp/SignUp';//não sei porque essa importação só funciona assim...

import SignInBarbearia from '../src/User-Barbearia/SignIn-Barbearia/SignIn-Barbearia';
import SignUpBarbearia from '../src/User-Barbearia/SignUp-Barbearia/SignUp-Barbearia';

import Home from '../src/User-Client-Barbearia/Home/Home';
import HomeBarbearia from './User-Barbearia/Home/HomeBarbearia';

import BarbeariaDetails from '../src/User-Client-Barbearia/BarbeariaDetails/BarbeariaDetails';
import ProfileBarbearia from './User-Barbearia/ProfileBarbearia/ProfileBarberia';

import Checkout from './Checkout';
import Widget from './Widget';
import PropTypes from 'prop-types';

// Função para verificar se o usuário está autenticado (baseado na existência de um token no localStorage)
const isUserAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token ? true : false;
};

// Componente PrivateRoute: uma rota privada que redireciona para a página de login se o usuário não estiver autenticado
const PrivateRoute = ({ element, ...props }) => {
  return isUserAuthenticated() ? (
    element
  ) : (
    <Navigate to="/" replace state={{ from: props.location }} />
  );
};

// Definindo propTypes para o componente PrivateRoute para validar as propriedades necessárias
PrivateRoute.propTypes = {
  element: PropTypes.node.isRequired,
  location: PropTypes.object,
  // ... outras propriedades que você pode ter
};

// Componente principal App: definindo as rotas da aplicação
const App = () => {
  return (
    <Router>
      <Routes>

      <Route path="/HomeBarbearia" element={<HomeBarbearia />} />
      <Route path="/ProfileBarbearia" element={<ProfileBarbearia />} />

        <Route path="/" element={<GetStartedPage />} />
        
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />

        <Route path="/SignInBarbearia" element={<SignInBarbearia />} />
        <Route path="/SignUpBarbearia" element={<SignUpBarbearia />} />

        <Route path="/Home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/BarbeariaDetails" element={<PrivateRoute element={<BarbeariaDetails />} />} />
        <Route path="/Checkout" element={<PrivateRoute element={<Checkout />} />} />
        <Route path="/Widget" element={<PrivateRoute element={<Widget />} />} />
      </Routes>
    </Router>
  );
};

export default App;
