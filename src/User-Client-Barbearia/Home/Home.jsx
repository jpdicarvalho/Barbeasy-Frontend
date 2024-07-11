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
const [AllAvaliation, setAllAvaliation] = useState([]);
const [search, setSearch] = useState('');


//buscando informações do usuário logado
const token = localStorage.getItem('token');
const userData = localStorage.getItem('userData');
//trasnformando os dados para JSON
const userInformation = JSON.parse(userData);
//Fromatando cada letra inicial do nome do usuário para caixa-alta
const userName = userInformation.user[0].name;
const userImage = userInformation.user[0].user_image;


const navigateToUserProfile = () =>{
  navigate("/UserProfile");
}
const navigateToBookingsHistory = () =>{
  navigate("/BookingsHistory");
}

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
const [services, setServices] = useState('')

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
        setServices(data.services);

    } catch (error) {
      console.error('Erro ao obter os registros:', error);
    }
  };

  fetchData();
},[]);

//hook para eecultar a função que junta a barbearia com seu respectivo serviço
useEffect(() =>{
  const barbeariaWithService = () =>{
    if(barbearias && services){
      // Percorra cada barbearia
      for (const indexBarbearia of barbearias) {
        // Filtrar os serviços que correspondem à barbearia atual
        const servicosDaBarbearia = services
            .filter(servico => servico.barbearia_id === indexBarbearia.id)
            .map(servico => servico.name); // Pegar apenas o nome do serviço
        
        // Adicionar os nomes dos serviços à barbearia atual
        indexBarbearia.servicos = servicosDaBarbearia;
      }
    }
  };
  barbeariaWithService()
}, [barbearias])

// Convertendo o valor do search para minúsculo
const searchLowerCase = search.toLowerCase();

// Buscando Barbearia pelo input Search
const barbeariaSearch = barbearias.filter((barbearia) =>
  barbearia.name.toLowerCase().includes(searchLowerCase) ||
  barbearia.status.toLowerCase().includes(searchLowerCase) ||
  barbearia.servicos.some((servico) => servico.toLowerCase().includes(searchLowerCase))
);

//passando os dados da barbearia selecionada
const handleBarbeariaClick = (barbearia) => {
  navigate("/BarbeariaDetails", { state: { barbearia } });
};

//verificando se o menu está ativado
const handleMenuClick = () => {
  setMenuActive(!isMenuActive);
}

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

//Buscar as avaliações da barbearia em especifico
useEffect(() => {
  const SearchAvaliation = async () => {
    try {
      const response = await fetch(`${urlApi}/api/v1/SearchAvaliation`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setAllAvaliation(data);
    } catch (error) {
      console.error('Erro ao obter os registros:', error);
    }
  };
  SearchAvaliation();
}, []);

return (
  <>
            <div className={`header ${scrollPosition > 200 ? 'scrolled' : ''}`}>
                <div className={`imgBoxSectionUser ${scrollPosition > 200 ? 'hideDiv' : ''}`}>
                  <img src={urlCloudFront + userImage} alt="foto de perfil do usuário" />
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
                      <img src={urlCloudFront + barbearia.banner_main} alt="Imagem de capa da barbearia" />
                    </div>
                    
                  <div className="section">
                      <div className="box__logo__barbeasy">
                          <img src={barberLogo} className="img__logo__barbeasy"/>
                      </div>

                      <div className="Barbearias">
                        <h2>
                          {barbearia.name}
                        </h2>
                      </div>

                      <div className="endereco">
                        <p>{barbearia.rua}, Nº {barbearia.N}, {barbearia.bairro}, {barbearia.cidade}</p>
                      </div>

                      <div className="section__status">
                        {barbearia.status === "Aberta" ? (
                          <p className="aberto"> {barbearia.status}</p>
                          ) : (
                          <p className="fechado">{barbearia.status}</p>
                        )}
                        <div className="section__star">
                          <IoIosStar className="icon__star" /> 
                          <p>4,5 • (100)</p>
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
