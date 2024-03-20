import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { motion } from 'framer-motion';
import { CiLocationOn } from "react-icons/ci";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { GiSandsOfTime } from "react-icons/gi";

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

import { isToday, isYesterday, differenceInDays, differenceInMonths } from 'date-fns';

//import Calendar from 'react-calendar';
import logoMercadoPago from './logoMercadoPago.png'
import { Calendar } from '../Calendar/Calendar';
import './BarbeariaDetails.css'
//import barbeLogo from './barber-logo.png'
import logoBarbeariaTeste from './logo-barbearia-teste.png'

function BarbeariaDetails() {

const navigate = useNavigate();
const location = useLocation();

const { barbearia } = location.state;
const barbeariaId = barbearia.id;

//buscando informações do usuário logado
const userData = localStorage.getItem('userData');
//trasnformando os dados para JSON
const userInformation = JSON.parse(userData);
//Buscando os dados do usuário
//const userId = userInformation.user[0].id;
const userEmail = userInformation.user[0].email;
const userName = userInformation.user[0].name;
/*=========== Buscandos os nomes dos banners da barbearia selecionada ===========*/
const[banners, setBanners] = useState([]);

useEffect(() =>{
  let namesBanners = barbearia.banners.split(',');
  setBanners(namesBanners)
}, []);

/*=================== Section Menu ===================*/
const [isMenuActive, setMenuActive] = useState(false);

//função para navegarpara página home
const navigateToHome = () =>{
  navigate("/Home");
}
//Função LogOut
const logoutClick = () => {
  ['token', 'userData'].forEach(key => localStorage.removeItem(key));
  navigate("/");
};

/*=================== Section make appointmants ===================*/
const [servicos, setServicos] = useState([]);
const [selectedService, setSelectedService] = useState("");
const [selectedDate, setSelectedDate] = useState(null);
const [timeSelected, setTimeSelected] = useState("");

const [isAgendamentoConfirmed, setAgendamentoConfirmed] = useState(false);
const [url, setUrl] = useState(null);

  //Função para buscar os serviços cadastrados
  const obterServicos = () =>{
    
    axios.get(`https://api-user-barbeasy.up.railway.app/api/list-service/${barbeariaId}`)
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
/*=========================== Get professionals =======================*/
  const [professional, setProfessional] = useState([])

  //Function to get all professionais
  useEffect(() => {
    const getProfessional = () =>{
    axios.get(`https://api-user-barbeasy.up.railway.app/api/professional/${barbeariaId}`)
      .then(res => {
        setProfessional(res.data.Professional)
      })
      .catch(error => console.log(error));
    }
    getProfessional()
  }, [barbeariaId])

  /*================== Get Agenda ======================*/
  //Buscando a quantidade de dias que a agenda vai ficar aberta
  const [QntDaysSelected, setQntDaysSelected] = useState([]);
  const [agenda, setAgenda] = useState([]);

  //Obtendo os dados da agenda da barbearia
  const getAgenda = () =>{
    axios.get(`https://api-user-barbeasy.up.railway.app/api/agenda/${barbeariaId}`)
    .then(res => {
      if(res.status === 200){
        setAgenda(res.data.Agenda)
      }
    }).catch(error => {
      console.error('Erro ao buscar informações da agenda da barbearia', error)
    })
  }
  //Chamando a função para obter os dados da agenda da barbearia
  useEffect(() => {
    getAgenda()
  }, [])

  useEffect(() => {
    if (Array.isArray(agenda) && agenda.length >= 2) {
      setQntDaysSelected(agenda[1].toString());
    }
  }, [agenda]);

//Declaração do array com os horários de cada dia
const [timesDays, setTimesDays] = useState('');

//Função para obter os horários definidos do dia selecionado
const getHorariosDefinidos = () =>{
  axios.get(`https://api-user-barbeasy.up.railway.app/api/agendaDiaSelecionado/${barbeariaId}`)
  .then(res => {
    //Armazenando o objeto com todos os horários definidos
    setTimesDays(res.data.TimesDays)

  }).catch(error => {
    console.error('Erro ao buscar informações da agenda da barbearia', error)
  })
}
//Hook para chamar a função acima
useEffect(() => {
  getHorariosDefinidos()
}, [])
const[serviceProfessional, setServiceProfessional] = useState('')

/*====== Lidando com as seleções do usuário ======*/

const handleServiceProfessional = (professionalId) => {
  setServiceProfessional(professionalId)
};

const handleServiceChange = (servicoId, professionalId) => {
  setSelectedService(servicoId);
};

//Função para selecionar a data escolhida pelo usuário
const handleDateChange = (date) => {
  setSelectedDate(date);
};

//Função para obter o horário de preferência do usuário
const handleTimeSelected = (time) => {
  setTimeSelected(time);
};


//Mandan a requisição para a rota de Pagamento
const pagamento = async () => {
    try {
      // Encontrar o serviço selecionado no array de serviços
      const servicoSelecionado = servicos.find(servico => servico.id === selectedService);
      //Passando o nome da barbearia selecionada para a descrição da compra
      const DescricaoServico = `Agendamento de serviço para a barbearia ${barbearia.name}`;

      const response = await fetch('https://api-user-barbeasy.up.railway.app/api/Checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          DescricaoServico,
          preco: servicoSelecionado.preco,
          nameServico: servicoSelecionado.name,
          userEmail
        }),
        
      });

      const json=await response.json();
      setUrl(json);
      setAgendamentoConfirmed(true);
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
    }
};

//passando a url do mercado pago para abrir em outra aba
const urlMercadoPago = () => {
    window.open(url, 'modal');
};
/*=================== Section Avaliation Barbearia ===================*/
const [avaliacao, setAvaliacao] = useState(0.5);
const [comentario, setComentario] = useState("");
const [AllAvaliation, setAllAvaliation] = useState([]);

//Ativação do menu principal
const handleMenuClick = () => {
  setMenuActive(!isMenuActive);
}

// Cadastrando a avaliação/comentário do usuário do usuário
const enviarAvaliacao = async () => {
    try {
      const response = await fetch('https://api-user-barbeasy.up.railway.app/api/avaliacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          barbeariaId: barbearia.id,
          avaliacao,
          comentario,
          data_avaliacao: new Date(),
          userName
        }),
      });
      const data = await response.json();
      // Recarrega a página após a avaliação ser feita com sucesso
      window.location.reload();
    } catch (error) {
      console.error('Erro ao enviar a avaliação:', error);
    }
};

//Buscar as avaliações da barbearia em especifico
useEffect(() => {
    const SearchAvaliation = async () => {
      try {
        const response = await fetch('https://api-user-barbeasy.up.railway.app/api/SearchAvaliation');
        const data = await response.json();
        setAllAvaliation(data);
      } catch (error) {
        console.error('Erro ao obter os registros:', error);
      }
    };
    SearchAvaliation();
}, []);

//Numero de avaliações no total de cada Barbearia
const totalAvaliacoes = (barbeariaId) =>{
  const avaliacoesDaBarbearia = AllAvaliation.filter(avaliacao => avaliacao.barbearia_id === barbeariaId);
  return avaliacoesDaBarbearia.length;
}

// Calcula a média das avaliações apenas para a barbearia selecionada
const calcularMediaAvaliacoes = () => {
  // Filtra as avaliações apenas para a barbearia selecionada
  const avaliacoesDaBarbearia = AllAvaliation.filter(avaliacao => avaliacao.barbearia_id === barbearia.id);

  if (avaliacoesDaBarbearia.length === 0) {
    return "0,0"; // Retorna "0,0" se não houver avaliações
  }

  const somaNotas = avaliacoesDaBarbearia.reduce((soma, avaliacao) => soma + avaliacao.estrelas, 0);
  const media = somaNotas / avaliacoesDaBarbearia.length;

  return media.toFixed(1).replace('.', ',');
};

//Reviews settings
const reviews = useRef();
const [width, setWidth] = useState(0);
const reviewsWidth = reviews.current?.scrollWidth - reviews.current?.offsetWidth;

useEffect(()=> {
  setWidth(reviewsWidth);
}, [reviewsWidth])
console.log(servicos)
console.log(serviceProfessional)
  return (
    <>
    <div className="Outdoor">
       <Swiper slidesPerView={1} effect={'fade'} modules={[EffectFade]} pagination={{clickable: true}} autoplay={{ delay: 3000 }}>
         {banners.map((item) =>
           <SwiperSlide key={item} className="Slide__Box">
             <img className='slider__image' src={`https://d15o6h0uxpz56g.cloudfront.net/${item}`} alt="Imagem da Barbearia" />
           </SwiperSlide>
         )} 
       </Swiper>
    
   <div className="BarbeariaInformation">
       {barbearia.status === "Aberta" ? <p className="abertoBarbDetails">{barbearia.status}</p> : <p className="fechadoBarbDetails">{barbearia.status}</p>}
       <h3 id="BarbeariaName">{barbearia.name} • {calcularMediaAvaliacoes()} <i className="fa-solid fa-star"/> ({totalAvaliacoes(barbearia.id)})</h3>
       <div className="location">
       <CiLocationOn className="location_icon"/>
         <p>{barbearia.endereco}</p>
       </div>
   </div>
    </div>

    <div className="ContainerMain">      
      <hr />
      <div className="tittle">
        <p>Profissionais({professional.length})</p>
      </div>

      <div className="professionals">
        {professional && (
              professional.map(professional => {
                // Obtendo a primeira letra do nome do profissional
                const firstLetter = professional.name.charAt(0).toUpperCase();
                
                return (
                  <div key={professional.id} onClick={() => handleServiceProfessional(professional.id)} className={`Box__professional ${serviceProfessional === professional.id ? 'professionalSelected' : ''}`}> 
                    <div className="Box__image">
                      <p className='firstLetter'>{firstLetter}</p>
                    </div>
                    <p className='name__professional'>{professional.name}</p>
                  </div>
                );
              })
            )}
      </div>
      <hr />

      <div className="tittle">
        <p>Serviços({serviceProfessional &&(
          servicos.length)})</p>
      </div>

      <div className="Servicos">
      {serviceProfessional ? (
              servicos.filter(servico => servico.professional_id === serviceProfessional)
              .map(servico => (
                <div key={servico.id} onClick={() => handleServiceChange(servico.id)} className={`servicoDiv ${selectedService === servico.id ? 'selected' : ''}`}>
                  <p>{servico.name} • {servico.preco}</p>
                  <p style={{color: 'darkgray'}}><GiSandsOfTime /> • {servico.duracao}</p>
                </div>
                
            ))
            ):(
              <div className="inforService">
              <IoIosInformationCircleOutline className="Icon__info"/>
              <p >Selecione um profissional para visualizar os serviços.</p>
              </div>
              
            )}
        </div>
        <div className="professionals">
          
        </div>
        <hr />

      <div className="tittle">
        Escolha um dia de sua preferência
      </div>
     
        <Calendar onDateChange={handleDateChange} timeSelected={handleTimeSelected} QntDaysSelected={QntDaysSelected} timesDays={timesDays} />
        <hr />

        {selectedService && selectedDate && !isAgendamentoConfirmed && (
          <button
            id="AgendamentoButton"
            onClick={pagamento}
          >
            Continuar
          </button>
        )}
       
       {isAgendamentoConfirmed && (
        <button onClick={urlMercadoPago} className="mercadoPagoButton">
          <img src={logoMercadoPago} alt="logo Mercado Pago" className="mercadoPagoLogo" />
          Pagar com Mercado Pago
        </button>
      )}
        
        <ul className={`Navigation glassmorphism ${isMenuActive ? 'active' : ''}`}>
              <li><a href="#"><i className="fa-solid fa-user"></i></a></li>
              <li><button onClick={navigateToHome}><i className="fa-solid fa-house"></i></button></li>
              <li><button onClick={logoutClick}><i className="fa-solid fa-right-from-bracket"></i></button></li>
              <button onClick={handleMenuClick} className="toggleMenu glassmorphism"></button>
        </ul>

        <hr />
            <div className="AvaliacaoSection">
              <h4>Classificações e Avaliações</h4>
              <div className="Estrelas">
                <span id="span__star">Toque para Classificar:</span>
                {[1, 2, 3, 4, 5].map((estrela) => (
                  <span
                    key={estrela}
                    className={`fa fa-solid fa-star${avaliacao >= estrela ? ' selected' : ''}`}
                    onClick={() => setAvaliacao(estrela)}
                  ></span>
                ))}
              </div>
              <textarea
                placeholder="Deixe seu comentário aqui..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                required
              ></textarea>
              <button id="SendAvaliation" onClick={enviarAvaliacao}>Enviar Avaliação</button>
            </div>

    <hr />

      <div className="tittle">
      Avaliações
      </div>
      <motion.div
        ref={reviews}
        className="reviews"
        whileTap={{ cursor: "grabbing"}}>

      <motion.div
      className="reviews__container"
      drag="x"
      dragConstraints={{ left: -width, right: 0 }}
      >
          {AllAvaliation
            .filter(avaliacoes => avaliacoes.barbearia_id === barbearia.id)
            .sort((a, b) => b.id - a.id) // Ordenar pelo ID de forma decrescente
            .map(avaliacoes => {
              const isTodayReview = isToday(new Date(avaliacoes.data_avaliacao));
              const isYesterdayReview = isYesterday(new Date(avaliacoes.data_avaliacao));
              const differenceDays = differenceInDays(new Date(), new Date(avaliacoes.data_avaliacao));
              const differenceMonths = differenceInMonths(new Date(), new Date(avaliacoes.data_avaliacao));

              let formattedTime = '';

              if (isTodayReview) {
                formattedTime = 'hoje';
              } else if (isYesterdayReview) {
                formattedTime = 'ontem';
              } else if (differenceDays === 0) {
                formattedTime = 'hoje';
              } else if (differenceDays <= 30) {
                formattedTime = `há ${differenceDays} ${differenceDays === 1 ? 'dia' : 'dias'}`;
              } else {
                formattedTime = `há ${differenceMonths} ${differenceMonths === 1 ? 'mês' : 'meses'}`;
              }

              return (
                <motion.div key={avaliacoes.id} className="reviws__section">
                  <motion.div className="HeaderReview">
                    <motion.div className="img_User">
                      <img src={logoBarbeariaTeste} alt="" />
                    </motion.div>
                    <motion.div className="userName__Stars">
                      <p id="userName">{avaliacoes.user_name}</p>
                      <motion.div className="Estrelas">
                        <motion.div id="Star_Unlocked"></motion.div>
                        {[1, 2, 3, 4, 5].map((estrela) => (
                          <span
                            key={estrela}
                            className={`fa fa-solid fa-star${avaliacoes.estrelas >= estrela ? ' selected' : ''}`}
                          ></span>
                        ))}
                      </motion.div>
                    </motion.div>
                    <motion.div className="reviews__day">
                    <p>{formattedTime}</p>
                    </motion.div>
                  </motion.div>
                  {avaliacoes.comentarios}
                </motion.div>
            
              );
            })}
          </motion.div>
      </motion.div>
    </div>
  </>
  );
}

export default BarbeariaDetails