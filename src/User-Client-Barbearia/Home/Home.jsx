//Libary necessárias
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

//Arq. de Estilização da página
import './home.css'
//imagens estáticas

import barberLogo from '../../../barber-logo.png';

import { IoIosStar } from "react-icons/io";
import { BsFillGridFill } from "react-icons/bs";
import { BsCalendar2Check } from "react-icons/bs";
import { VscAccount } from "react-icons/vsc";
import { MdOutlineLogout } from "react-icons/md";


function Home() {

const navigate = useNavigate();
const urlApi = 'https://barbeasy.up.railway.app'
const urlCloudFront = 'https://d15o6h0uxpz56g.cloudfront.net/'

const [isMenuActive, setMenuActive] = useState(false);
const [saudacao, setSaudacao] = useState('');
const [search, setSearch] = useState('');


//buscando informações do usuário logado
const token = localStorage.getItem('token');
const userData = localStorage.getItem('userData');
//trasnformando os dados para JSON
const userInformation = JSON.parse(userData);
//Fromatando cada letra inicial do nome do usuário para caixa-alta
const userImage = userInformation.user[0].user_image;
const userName = userInformation.user[0].name;
const firstLetter = userName.charAt(0).toUpperCase();

const navigateToUserProfile = () =>{
  navigate("/UserProfile");
}
const navigateToBookingsHistory = () =>{
  navigate("/BookingsHistory");
}

//passando os dados da barbearia selecionada
const handleBarbeariaClick = (barbearia) => {
  navigate("/BarbeariaDetails", { state: { barbearia } });
};

//Função LogOut
const logoutClick = () => {
  ['token', 'userData'].forEach(key => localStorage.removeItem(key));
  navigate("/");
};

//verificando se o menu está ativado
const handleMenuClick = () => {
  setMenuActive(!isMenuActive);
}

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
  const fetchData = async () => {
    try {
        const response = await fetch(`${urlApi}/api/v1/getAllBarbearias`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        //Armazenando a resposta da requisição
        const data = await response.json();

        setBarbearias(data.barbearias);

    } catch (error) {
      console.error('Erro ao obter os registros:', error);
    }
  };

  fetchData();
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
                <div className={`imgBoxSectionUser ${scrollPosition > 200 ? 'hideDiv' : ''}`}>
                  {userImage != 'default.jpg' ?(
                    <img className="img__user__in__home__page"src={urlCloudFront + userImage} alt="foto de perfil do usuário" />

                    ):(
                      <div className="box__first__letter__user">
                            <p className='firstLetter__professional'>{firstLetter}</p>
                        </div>
                    )}
                  <div className="spanUser">
                    <p className="nameUser">Olá, {userName}</p>
                    <p className="saudacao">{saudacao}</p>
                    
                  </div>
                  
                </div>
                <div className={`Barbeasy ${scrollPosition > 200 ? 'hideDiv' : ''}`}>
                  <img id="logoBarbeasy" src={barberLogo} alt="lodo-Barbeasy"/>
                  <h1>Barbeasy</h1>
                </div>
                <div className={`containerSearch ${scrollPosition > 200 ? 'header__Search' : ''}`}>
                  <div className="inputBoxSearch">
                    <i className="fa-solid fa-magnifying-glass lupa"></i>
                    <input type="search" id="inputSearch" name="name" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Buscar'/>
                    <BsFillGridFill className="icon__filter"/>
                  </div>
                </div> 
          </div>
          
          <div className="containerHome">
              {barbeariaSearch.map((barbearia, index) => (
                
                <div key={index} className="containerBarbearia" onClick={() => handleBarbeariaClick(barbearia)}>
                     
                    <div className="imgBoxSection">
                      <img src={urlCloudFront + barbearia.bannerBarbearia} alt="Imagem de capa da barbearia" />
                    </div>
                    
                  <div className="section">
                      <div className="box__logo__barbeasy">
                          <img src={barberLogo} className="img__logo__barbeasy"/>
                      </div>

                      <div className="Barbearias">
                        <h2>
                          {barbearia.nameBarbearia}
                        </h2>
                      </div>

                      <div className="endereco">
                        <p>{barbearia.ruaBarbearia}, Nº {barbearia.NruaBarbearia}, {barbearia.bairroBarbearia}, {barbearia.cidadeBarbearia}</p>
                      </div>

                      <div className="section__status">
                        {barbearia.statusBarbearia === "Aberta" ? (
                          <p className="aberto"> {barbearia.statusBarbearia}</p>
                          ) : (
                          <p className="fechado">{barbearia.statusBarbearia}</p>
                        )}
                        <div className="section__star">
                          <IoIosStar className="icon__star" /> 
                          <p>{barbearia.averageAvaliationsBarbearia ? barbearia.averageAvaliationsBarbearia:0} • ({barbearia.totalAvaliationsBarbearia ? barbearia.totalAvaliationsBarbearia:0})</p>
                      </div>
                      </div>
                      
                  </div>
                  <button className="agendar">Ver barbearia</button>
                
                </div>
              ))}
            <ul className={`Navigation ${isMenuActive ? 'active' : ''}`}>
              <li>
                <button onClick={navigateToUserProfile}>
                  <VscAccount className="color__icon__menu__navigate"/>
                </button>
              </li>
              <li>
                <button>
                  <BsCalendar2Check onClick={navigateToBookingsHistory}/>
                </button>
              </li>
              <li>
                <button onClick={logoutClick}>
                  <MdOutlineLogout />
                </button>
              </li>
              <button onClick={handleMenuClick} className="toggleMenu glassmorphism"></button>
            </ul>
          </div>
    </>
    )
}
export default Home  
