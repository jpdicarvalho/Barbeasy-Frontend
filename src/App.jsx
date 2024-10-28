// Importando os componentes e funcionalidades necessários do react-router-dom e prop-types
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GetStartedPage from '../src/Get-Started/getStarted';

import SignIn from '../src/User-Client-Barbearia/SignIn/SignIn';
import SignUp from './User-Client-Barbearia/SignUp/SignUp';//não sei porque essa importação só funciona assim...

import SignInBarbearia from '../src/User-Barbearia/SignIn-Barbearia/SignIn-Barbearia';
import SignUpBarbearia from '../src/User-Barbearia/SignUp-Barbearia/SignUp-Barbearia';

import AccountActivationClient from './User-Client-Barbearia/AccountActivationClient/AccountActivationClient';

import HomeBarbearia from './User-Barbearia/Home/HomeBarbearia';
import ProfileBarbearia from './User-Barbearia/ProfileBarbearia/ProfileBarberia';
import GetAccessToken from './User-Barbearia/ProfileBarbearia/GetAccessToken';
import ProfessionalDetails from './User-Barbearia/ProfessionalDetails/professionalDetails';
import ScheduleBarbearia from './User-Barbearia/ScheduleBarbearia/ScheduleBarbearia';
import StatisticBarbearia from './User-Barbearia/StatisticBarbearia/StatisticBarbearia';

import Home from '../src/User-Client-Barbearia/Home/Home';
import UserProfile from './User-Client-Barbearia/UserProfile/UserProfile';
import BarbeariaDetails from '../src/User-Client-Barbearia/BarbeariaDetails/BarbeariaDetails';
import PaymentScreen from './User-Client-Barbearia/PaymentsScreen/PaymentScreen';
import BookingsHistory from './User-Client-Barbearia/BookingsHistory/BookingsHistory';
import BookingDetails from './User-Client-Barbearia/BookingDetails/BookingDetails';

import HomeProfessional from './User-Professional/Home/HomeProfessional';
import ProfileProfessional from './User-Professional/ProfileProfessional/ProfileProfessional';
import Notification from './User-Professional/Notification/Notification';

import SessionExpired from './SessionExpired/SessionExpired';
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
        <Route path="/" element={<GetStartedPage />} />

        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />

        <Route path="/SignInBarbearia" element={<SignInBarbearia />} />
        <Route path="/SignUpBarbearia" element={<SignUpBarbearia />} />

        <Route path="/AccountActivationClient" element={<AccountActivationClient />} />

        <Route path="/SessionExpired" element={<SessionExpired />} />
        
        <Route path="/HomeBarbearia" element={<PrivateRoute element={<HomeBarbearia />} />} />
        <Route path="/ProfileBarbearia" element={<PrivateRoute element={<ProfileBarbearia />}/>} />
        <Route path="/ProfessionalDetails" element={<PrivateRoute element={<ProfessionalDetails />} />} />
        <Route path="/GetAccessToken" element={<PrivateRoute element={<GetAccessToken />} />} />
        <Route path="/ScheduleBarbearia" element={<PrivateRoute element={<ScheduleBarbearia />} />} />
        <Route path="/StatisticBarbearia" element={<PrivateRoute element={<StatisticBarbearia />} />} />

        <Route path="/HomeProfessional" element={<PrivateRoute element={<HomeProfessional />} />} />
        <Route path="/ProfileProfessional" element={<PrivateRoute element={<ProfileProfessional />} />} />
        <Route path="/Notification" element={<PrivateRoute element={<Notification />} />} />

        <Route path="/Home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/UserProfile" element={<PrivateRoute element={<UserProfile />} />} />
        <Route path="/BarbeariaDetails/profile/:barbearia_id" element={<BarbeariaDetails />} />
        <Route path="/PaymentScreen" element={<PrivateRoute element={<PaymentScreen />} />} />
        <Route path="/BookingsHistory" element={<PrivateRoute element={<BookingsHistory />} />} />
        <Route path="/BookingDetails" element={<PrivateRoute element={<BookingDetails />} />} />

      </Routes>
    </Router>
  );
};

export default App;
