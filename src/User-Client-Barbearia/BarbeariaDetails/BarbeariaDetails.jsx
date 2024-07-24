import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import axios from 'axios';

import { CiLocationOn } from "react-icons/ci";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { GiSandsOfTime } from "react-icons/gi";
import { IoHomeOutline } from "react-icons/io5";
import { VscAccount } from "react-icons/vsc";
import { BsCalendar2Check } from "react-icons/bs";
import { MdOutlineLogout } from "react-icons/md";
import { IoStarSharp } from "react-icons/io5";
import { MdOutlineDone } from "react-icons/md";
import { VscError } from "react-icons/vsc";

//Import for slide
import { register } from 'swiper/element/bundle';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { Swiper, SwiperSlide } from "swiper/react";
register();

// import required modules
import { EffectFade } from 'swiper/modules';

import { differenceInDays, parse } from 'date-fns';


//import Agendamento from 'react-Agendamento';
import { Agendamento } from "../Agendamento/Agendamento";

import './BarbeariaDetails.css'

function BarbeariaDetails() {

const navigate = useNavigate();
const location = useLocation();

const urlApi = 'https://barbeasy.up.railway.app'
  
const { barbearia } = location.state;
const barbeariaId = barbearia.barbearia_id;

//buscando informações do usuário logado
const token = localStorage.getItem('token');
const userData = localStorage.getItem('userData');
  
//trasnformando os dados para JSON
const userInformation = JSON.parse(userData);
  
//Buscando os dados do usuário
const userId = userInformation.user[0].id;
const userEmail = userInformation.user[0].email;

const cloudFrontUrl = 'https://d15o6h0uxpz56g.cloudfront.net/'

const currentDate = new Date();

/*=========== Buscandos os nomes dos banners da barbearia selecionada ===========*/
const[banners, setBanners] = useState([]);

useEffect(() =>{
  let namesBanners = barbearia.bannerBarbearia.split(',');
  setBanners(namesBanners)
}, []);

/*=================== Section Menu ===================*/
const [isMenuActive, setMenuActive] = useState(false);

//função para navegarpara página home
const navigateToHome = () =>{
  navigate("/Home");
}
const navigateToUserProfile = () =>{
  navigate("/UserProfile");
}
const navigateToBookingsHistory = () =>{
  navigate("/BookingsHistory");
}
//Ativação do menu principal
const handleMenuClick = () => {
  setMenuActive(!isMenuActive);
}
//Função LogOut
const logoutClick = () => {
  ['token', 'userData'].forEach(key => localStorage.removeItem(key));
  navigate("/");
};

/*=========================== Get professionals =======================*/
  const [professional, setProfessional] = useState([])
  const[serviceProfessional, setServiceProfessional] = useState()

  //Function to get all professionais
  useEffect(() => {
    const getProfessional = () =>{
    axios.get(`${urlApi}/api/v1/listProfessionalToBarbearia/${barbeariaId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setProfessional(res.data.Professional)
      })
      .catch(error => console.log(error));
    }
    getProfessional()
  }, [barbeariaId])


const handleServiceProfessional = (professionalId) => {
  setServiceProfessional(professionalId)
};

// ====== Section get serivce ========
const [servicos, setServicos] = useState([]);
const [selectedService, setSelectedService] = useState();
const [serviceName, setServiceName] = useState();
const [servicePrice, setServicePrice] = useState();

const [serviceDuration, setServiceDuration] = useState();

  //Função para buscar os serviços cadastrados
  const obterServicos = () =>{
    
    axios.get(`${urlApi}/api/v1/listService/${barbeariaId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (res.data.Success === "Success") {
        setServicos(res.data.result);
      }
    })
    .catch(err => {
      console.error("Erro ao buscar serviços!", err);
    });
    }

  //hook para chamar a função de obtersServiço
  useEffect(() => {
    obterServicos()
  }, []);

const handleServiceChange = (servicoId, name, price, duration) => {
  let priceFormated = price.replace(/R\$ (\d+),(\d{2})/, '$1.$2');
  setSelectedService(servicoId);
  setServiceName(name)
  setServicePrice(priceFormated)
  let number = duration.substring(0, 2)
  number = parseInt(number)
  setServiceDuration(number)
};

/*================== Section to get access token of barbearia ======================*/



/*=================== Section Avaliation Barbearia ===================*/
const [avaliation, setAvaliation] = useState();
const [averageAvaliation, setAverageAvaliation] = useState();
const [comment, setComment] = useState("");
const [showTextArea, setShowTextArea] = useState(false);
const [AllAvaliation, setAllAvaliation] = useState([]);
const [messageConfirmAvaliation, setMessageConfirmAvaliation] = useState("");

const handleShowTextAreaClick = () =>{
  setShowTextArea(true)
}

const handleCancelClick = () =>{
  setAvaliation('')
  setShowTextArea(false)
}

const SearchAvaliation = () => {
  axios.get(`${urlApi}/api/v1/allAvaliation/${barbeariaId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => {
    setAllAvaliation(res.data.AllAvaliation);
    setAverageAvaliation(res.data.AverageAvaliation)
  }).catch(err => {
    console.error('Erro ao obter os registros:', err);
  })
};

//Buscar as avaliações da barbearia em especifico
useEffect(() => {
    SearchAvaliation();
}, []);

// Cadastrando a avaliação/comentário do usuário do usuário
const enviarAvaliacao = () => {
    const valuesAvaliation = {
      user_id: userId,
      comment,
      barbeariaId,
      avaliation,
      currentDate
    }
    axios.post(`${urlApi}/api/v1/saveAvaliation`, valuesAvaliation, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res =>{
      if(res.data.Success === 'true'){
        SearchAvaliation();
        setAvaliation('')
        setComment('')
        setShowTextArea(false)
        setMessageConfirmAvaliation('Avaliação realizada com sucesso!')
        setTimeout(() => {
          setMessageConfirmAvaliation('');
        }, 3000);
      }
    }).catch(err =>{
      console.error('Erro ao enviar a avaliação:', err);
    })    
};

//Mine component to render number's star of avaliation
const renderStarComponent = (numStarInString) => {
  // Transformar `numStarInString` em um número inteiro
  const bunStart = parseInt(numStarInString, 10);

  return (
    <div>
      {Array.from({ length: bunStart }, (_, index) => (
        <IoStarSharp key={index} className="Star__comment__selected" />
      ))}
    </div>
  );
};

//Mini component to calcule the date the comment was made
const formatarDataComentario = (dataComentario) => {
  const hoje = new Date();
  const data = new Date(dataComentario);
  const diferencaDias = differenceInDays(hoje, data);

  if (diferencaDias === 0) {
    return 'hoje';
  } else if (diferencaDias === 1) {
    return 'ontem';
  } else {
    return `há ${diferencaDias} dias`;
  }
};

//========================================================
//Reviews settings
const reviews = useRef();
const [width, setWidth] = useState(0);
const reviewsWidth = reviews.current?.scrollWidth - reviews.current?.offsetWidth;

useEffect(()=> {
  setWidth(reviewsWidth);
}, [reviewsWidth])

//================== widget ===================
const buttonWidth = 80;
const tabWidth = 395;

const tabHeaders = ["Serviço", "Avaliação", "Detalhes"];
const [activeIndex, setActiveIndex] = useState(0);

return (
    <>
    <div className="Outdoor">
       <Swiper slidesPerView={1} effect={'fade'} modules={[EffectFade]} autoplay={{ delay: 3000 }}>
         {banners.map((item) =>
           <SwiperSlide key={item} className="Slide__Box">
             <img className='slider__image' src={`${cloudFrontUrl}${item}`} alt="Imagem da Barbearia" />
           </SwiperSlide>
         )}
       </Swiper>
       <div className="BarbeariaInformation">
            {barbearia.statusBarbearia === "Aberta" ? <p className="abertoBarbDetails">{barbearia.statusBarbearia}</p> : <p className="fechadoBarbDetails">{barbearia.statusBarbearia}</p>}
            <h2 id="BarbeariaName">{barbearia.nameBarbearia} • {averageAvaliation ? averageAvaliation.toFixed(1):0} <IoStarSharp className="icon__start__in__BarbeariaInformation"/> ({AllAvaliation.length})</h2>
            <div className="location">
              <CiLocationOn className="location_icon"/>
              <p>{barbearia.ruaBarbearia}, Nº {barbearia.NruaBarbearia}, {barbearia.bairroBarbearia}, {barbearia.cidadeBarbearia}</p>
            </div>
        </div>
    </div>

    <div className="container__main__barbearia__details">

    <div className="container__widget">
      <header className="header__widget">
        {tabHeaders.map((tab, index) => (
          <button
            key={tab}
            className={`tab-button ${
              activeIndex === index ? "active" : ""
            }`}
            onClick={() => setActiveIndex(index)}
          >
            {tab}
          </button>
        ))}
        <div
          className="underline"
          style={{
            transform: `translate(${activeIndex * buttonWidth}px, 0)`,
          }}
        ></div>
      </header>

      <div className="content">
        <div className="content-inner" style={{transform: `translate(-${activeIndex * tabWidth}px, 0)`,}}>
          
            <div  className="tab-content">
                  <div className="tittle">
                      {professional.length <= 1 ?(
                        <p>Profissional</p>
                      ):(
                        <p>Profissionais ({professional.length})</p>
                      )}
                  </div>
                  <div className="professionals">
                    {professional.length > 0 ? (
                          professional.map(professional => {
                            // Obtendo a primeira letra do nome do profissional
                            const firstLetter = professional.name.charAt(0).toUpperCase();
                            
                            return (
                              <div key={professional.id} onClick={() => handleServiceProfessional(professional.id)} className={`Box__professional__barbearia__details ${serviceProfessional === professional.id ? 'professionalSelected' : ''}`}> 
                                <div className="img__professional__barbearia__details">
                                  {professional.user_image != 'default.png' ?(
                                    <img src={cloudFrontUrl + professional.user_image} className="user__img__box__comment" alt="" />
                                  ):(
                                    <p className='firstLetter' style={{color: '#fff', fontSize: '40px'}}>{firstLetter}</p>
                                  )}
                                </div>
                                <p style={{color: '#fff', fontSize: '16px'}}>{professional.name}</p>

                              </div>
                              
                            );
                          })
                        ):(
                          <div className="inforService">
                          <IoIosInformationCircleOutline className="Icon__info"/>
                          <p >Nenhum profissional cadastrado</p>
                        </div>
                        )}
                  </div>

                  <hr />

                  <div className="tittle">
                    {serviceProfessional && servicos && (
                      <p>Serviços ({servicos.filter(servico => servico.professional_id === serviceProfessional).length})</p>
                    )}
                  </div>

                  <div className="Servicos">
                {serviceProfessional ? (
                  servicos.filter(servico => servico.professional_id === serviceProfessional)  
                        .map(servico => (
                          <div key={servico.id} onClick={() => handleServiceChange(servico.id, servico.name, servico.preco, servico.duracao)} className={`servicoDiv ${selectedService === servico.id ? 'selected' : ''}`}>
                            <p>{servico.name} • {servico.preco} </p>
                            <p style={{color: 'darkgray'}}><GiSandsOfTime /> • {servico.duracao}</p>
                          </div>
                          
                      ))
                      ):(
                        <>
                        {professional.length > 0 &&(
                          <div className="inforService">
                              <IoIosInformationCircleOutline className="Icon__info"/>
                              <p >Selecione um profissional para visualizar os serviços.</p>
                          </div>
                        )}
                        </>
                      )}
                  </div>

                  {selectedService &&(
                    <div className="tittle">
                    Escolha um dia de sua preferência
                  </div>
                  )}

                  <Agendamento 
                    userId={userId}
                    barbeariaId={barbeariaId}
                    professionalId={serviceProfessional}
                    serviceId={selectedService}
                    serviceName={serviceName}
                    servicePrice={servicePrice}
                    serviceDuration={serviceDuration}
                  />

            </div>
            
            <div className="tab-content">
                {messageConfirmAvaliation === 'Avaliação realizada com sucesso!' ?(
                  <div className="mensagem-sucesso">
                    <MdOutlineDone className="icon__success"/>
                    <p className="text__message">{messageConfirmAvaliation}</p>
                  </div>
                  ) : (
                  <div className={` ${messageConfirmAvaliation ? 'mensagem-erro' : ''}`}>
                    <VscError className={`hide_icon__error ${messageConfirmAvaliation ? 'icon__error' : ''}`}/>
                    <p className="text__message">{messageConfirmAvaliation}</p>
                  </div>
                )}
                <div className="AvaliacaoSection">
                    <div className="Estrelas" onClick={handleShowTextAreaClick}>
                    <h3>Toque para Classificar:</h3>
                      {[1, 2, 3, 4, 5].map((estrela) => (
                        <IoStarSharp
                        key={estrela}
                        className={`fa fa-solid fa-star${avaliation >= estrela ? ' selected' : ''}`}
                        onClick={() => setAvaliation(estrela)}

                      />
                    ))}
                  </div>
                    <div className="section__send__avaliation">
                      <div>
                        <textarea
                          className={`ocult__element ${showTextArea ? 'multilineText':''}`}
                          id="multilineText"
                          name="multilineText"
                          rows="4"
                          cols="50"
                          value={comment}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            // Remover caracteres não alfanuméricos, ponto e espaço
                            const filteredValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ.!?]/g, '');
                            // Limitar a 30 caracteres
                            const truncatedValue = filteredValue.slice(0, 200);
                            setComment(truncatedValue );
                          }}
                          placeholder="Comentário até 200 caracteres">
                        </textarea>
                      </div>
                      <div className="conteiner__box__add__comment">
                          <button className={`ocult__element ${showTextArea ? 'box__add__comment':''}`} onClick={handleCancelClick}>
                            Cancelar
                          </button>
                          <button className={`ocult__element ${showTextArea ? 'box__add__comment':''}`} onClick={enviarAvaliacao}>
                            Avaliar
                          </button>
                      </div>
                        
                    </div>
                  
                </div>
                <div className="section__comments">
                  {AllAvaliation.length > 0 ?(
                    AllAvaliation.filter(avaliationWithComment => avaliationWithComment.comentarios.length > 0)
                      .map(allAvaliations => (
                          <div className="box__comment" key={allAvaliations.id}>
                              <div className="header__box__comment">
                                <div className="box__user__img__comment">
                                  {allAvaliations.userImage != 'default.jpg' ?(
                                    <img src={cloudFrontUrl + allAvaliations.userImage} className="user__img__box__comment" alt="" />
                                  ):(
                                    <div className="box__first__letter__user__box__comment">
                                        <p className='firstLetter__professional'>{allAvaliations.userName[0].charAt(0).toUpperCase()}</p>
                                    </div>
                                  )}
                                </div>
                                <div className="box__user__information__comment">
                                    <p>{allAvaliations.userName}</p>
                                    {renderStarComponent(allAvaliations.estrelas)}
                                </div>
                                <div className="box__date__comment">
                                  {formatarDataComentario(allAvaliations.data_avaliacao)}
                                </div>
                              </div>
                              <div>
                                <p className="text__comment">{allAvaliations.comentarios}</p>
                              </div>  
                          </div>
                      ))
                  ):(
                    <div className="section__no__avaliations">
                          <h3 >Nenhum comentário realizado</h3>
                        </div>
                  )}
                  
                </div>
            </div>
       </div>
      </div>
    </div>

        <ul className={`Navigation ${isMenuActive ? 'active' : ''}`}>
              <li>
                <button onClick={navigateToUserProfile}>
                  <VscAccount className="color__icon__menu__navigate"/>
                </button>
              </li>
              <li>
                <button onClick={navigateToHome}>
                  <IoHomeOutline className="color__icon__menu__navigate"/>
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
  );
}

export default BarbeariaDetails
