//Libary necessárias
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import axios from 'axios';

import CryptoJS from 'crypto-js';

//Arq. de Estilização da página
import './home.css'
//imagens estáticas

import barberLogo from '../../../barber-logo.png';
import { IoIosStar } from "react-icons/io";
import { BsFillGridFill } from "react-icons/bs";
import { BsCalendar2Check } from "react-icons/bs";
import { VscAccount } from "react-icons/vsc";
import { CiImageOn } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { BsSearch } from "react-icons/bs";
import { HomeSkeleton } from "./HomeSkeleton";
import { MdOutlineStar } from "react-icons/md";


function Home() {

const navigate = useNavigate();
const urlApi = 'https://barbeasy.up.railway.app'
const urlCloudFront = 'https://d15o6h0uxpz56g.cloudfront.net/'

// Função para criptografar o id
const encryptId = (id) => {
  const encryptedId = CryptoJS.AES.encrypt(id.toString(), 'abaporujucaiba').toString();
  return encodeURIComponent(encryptedId); // Codifica a URL para evitar caracteres especiais
};

const [saudacao, setSaudacao] = useState('');
const [search, setSearch] = useState('');


//buscando informações do usuário logado
const token = localStorage.getItem('token');
const userData = localStorage.getItem('userData');
//trasnformando os dados para JSON
const userInformation = JSON.parse(userData);
//Fromatando cada letra inicial do nome do usuário para caixa-alta
const userImage = userInformation.user.user_image;
const userName = userInformation.user.name;
const firstLetter = userName.charAt(0).toUpperCase();

const navigateToUserProfile = () =>{
  navigate("/UserProfile");
}

const navigateToBookingsHistory = () =>{
  navigate("/BookingsHistory");
}

//passando os dados da barbearia selecionada
const handleBarbeariaClick = (barbeariaId) => {
  const encryptedId = encryptId(barbeariaId);
  navigate(`/BarbeariaDetails/profile/${encryptedId}`);
};

//Função LogOut
const logoutClick = () => {
  ['token', 'userData'].forEach(key => localStorage.removeItem(key));
  navigate("/");
};

//pegando a hora para saudar o usuário
useEffect(() => {
  const obterSaudacao = () => {
  const horaAtual = new Date().getHours();
    if (horaAtual >= 5 && horaAtual < 12) {
        setSaudacao('Bom dia!');
    } else if (horaAtual >= 12 && horaAtual < 18) {
        setSaudacao('Boa tarde!');
    } else {
        setSaudacao('Boa noite!');
    }
  }
obterSaudacao();
}, []);

//Função para pegar a rolagem do Scroll
const [scrollPosition, setScrollPosition] = useState(0);

useEffect(() => {
  const handleScroll = () => {
    const position = window.scrollY;
    setScrollPosition(position);
  };

  window.addEventListener('scroll', handleScroll);

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);

/*===============================================================*/
//listando as barbearias e seus respectivos serviços
const [barbearias, setBarbearias] = useState([]);

//listando as barbearias cadastradas
useEffect(() => {
  axios.get(`${urlApi}/api/v1/getAllBarbearias`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res =>{
      setBarbearias(res.data.barbearias)
  }).catch(err =>{
    if(err.response.status === 403){
      return navigate("/SessionExpired")
    }
    console.log("Error: ", err)
  })  
}, []);

// Convertendo o valor do search para minúsculo
const searchLowerCase = search.toLowerCase();

// Buscando Barbearia pelo input Search
const barbeariaSearch = barbearias.filter((barbearia) => {
  // Convertendo todos os campos relevantes para lowercase para facilitar a busca case insensitive
  const nameMatch = barbearia.nameBarbearia.toLowerCase().includes(searchLowerCase);
  const statusMatch = barbearia.statusBarbearia.toLowerCase().includes(searchLowerCase);
  const averageMatch = barbearia.averageAvaliationsBarbearia ? barbearia.averageAvaliationsBarbearia.toLowerCase().includes(searchLowerCase):null;
  
  // Verifica se algum dos serviços tem o nome que corresponde ao termo de busca
  const servicoMatch = barbearia.servicos.some(servico => servico.name.toLowerCase().includes(searchLowerCase));
  
  // Retorna true se qualquer uma das condições for verdadeira
  return nameMatch || statusMatch || averageMatch || servicoMatch;
});

return (
  <>
    <div className={`header ${scrollPosition > 200 ? 'scrolled' : ''}`}>
      <div className={`imgBoxSectionUser ${scrollPosition > 200 ? 'hideDiv' : ''}`} onClick={navigateToUserProfile}>
        {userImage != 'default.jpg' ? (
          <img 
            className="img__user__in__home__page"
            src={urlCloudFront + userImage} 
            alt="foto de perfil do usuário" 
            translate="no"
          />
        ) : (
          <div className="box__first__letter__user">
            <p className='firstLetter__professional' translate="no">{firstLetter}</p>
          </div>
        )}
        <div className="spanUser">
          <p className="nameUser" translate="no">Olá, {userName}</p>
          <p className="saudacao" translate="no">{saudacao}</p>
        </div>
      </div>
      <div className={`Barbeasy ${scrollPosition > 200 ? 'hideDiv' : ''}`} translate="no">
        <img 
          id="logoBarbeasy" 
          src={barberLogo} 
          alt="logo-Barbeasy" 
          translate="no" 
        />
        <h1 translate="no">Barbeasy</h1>
      </div>
      <div className={`containerSearch ${scrollPosition > 200 ? 'header__Search' : ''}`}>
        <div className="inputBoxSearch">
          <i className="fa-solid fa-magnifying-glass lupa"></i>
          <input 
            type="search" 
            id="inputSearch" 
            name="name" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Buscar por nome, serviço, aberta..." 
            translate="no"
          />
          <BsFillGridFill className="icon__filter" translate="no" />
        </div>
      </div>
    </div>

    <div className="containerHome">
      <div className="container__text__topBarbearias">
        <p>#Top 15 Barbearias </p>
      </div>
      
      {barbearias.length > 0 ? (
        barbeariaSearch.length > 0 ? (
          barbeariaSearch.map((barbearia, index) => (
            <div 
              key={index} 
              className="containerBarbearia" 
              onClick={() => handleBarbeariaClick(barbearia.barbearia_id)}
              translate="no"
            >
              <div className="imgBoxSection">
                {barbearia.bannerBarbearia === "banner_main" ? (
                  <CiImageOn className="icon__CiImageOn" translate="no" />
                ) : (
                  <img 
                    src={urlCloudFront + barbearia.bannerBarbearia} 
                    alt="Imagem de capa da barbearia" 
                    translate="no" 
                  />
                )}
              </div>
              <div className="section">
                <div className="box__logo__barbeasy">
                  <div className="inner__img__logo__barbeasy">
                    <img 
                      src={barberLogo} 
                      className="img__logo__barbeasy" 
                      translate="no" 
                    />
                  </div>
                </div>
                <div className="Barbearias">
                  <h2 translate="no">{barbearia.nameBarbearia}</h2>
                </div>
                <div className="endereco">
                  <p translate="no">
                    {barbearia.ruaBarbearia}, Nº {barbearia.NruaBarbearia}, {barbearia.bairroBarbearia}, {barbearia.cidadeBarbearia}
                  </p>
                </div>
                <div className="section__status">
                  {barbearia.statusBarbearia === "Aberta" ? (
                    <p className="aberto" translate="no">{barbearia.statusBarbearia}</p>
                  ) : (
                    <p className="fechado" translate="no">{barbearia.statusBarbearia}</p>
                  )}
                  <div className="section__star">
                    <IoIosStar className="icon__star" translate="no" /> 
                    <p translate="no">
                      {barbearia.averageAvaliationsBarbearia ? barbearia.averageAvaliationsBarbearia : 0} • ({barbearia.totalAvaliationsBarbearia ? barbearia.totalAvaliationsBarbearia : 0})
                    </p>
                  </div>
                </div>
              </div>
              <button className="agendar" translate="no">Ver barbearia</button>
            </div>
          ))
        ) : (
          <div className="box__message__no__bookings__history in__home__barbearia">
            <BsSearch className="icon__LuSearchX" translate="no" />
            <h3 className="message__barbearia__not__found" translate="no">Nenhuma barbearia encontrada para "{search}"</h3>
          </div>
        )
      ) : (
        <div className="container__skeletons">
          <HomeSkeleton />
          <HomeSkeleton />
        </div>
      )}
      <ul className="Navigation active">
        <li>
          <button onClick={logoutClick}>
            <CiLogout translate="no" />
          </button>
        </li>
        <li>
          <button onClick={navigateToUserProfile}>
            <VscAccount className="color__icon__menu__navigate" translate="no" />
          </button>
        </li>
        <li>
          <button>
            <BsCalendar2Check onClick={navigateToBookingsHistory} translate="no" />
          </button>
        </li>
      </ul>
    </div>
  </>
);
}
export default Home  
