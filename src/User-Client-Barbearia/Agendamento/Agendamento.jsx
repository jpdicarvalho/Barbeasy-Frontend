import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import axios from 'axios';

import './Agendamento.css';

import PropTypes from 'prop-types';
import { MdOutlineDone } from "react-icons/md";
import { VscError } from "react-icons/vsc";
import { BsCalendar2Check } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { GiSandsOfTime } from "react-icons/gi";

const monthNames = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

const weekNames = [
  'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
];

export default function Agendamento({
  accessTokenBarbearia,
  barbeariaId,
  professionalId,
  serviceId,
  barbeariaName,
  professionalName,
  imageProfessional,
  serviceName,
  servicePrice,
  serviceDuration,
  openModal,
  closeModal }) {
  
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('userData');

  //trasnformando os dados para JSON
  const userInformation = JSON.parse(userData);  

  //buscando informações do usuário logado
  const userId = userInformation.user.id;
  const userEmail = userInformation.user.email;
  const userType = userInformation.user.userType;


  const date = new Date();
  
  const options = { weekday: 'short', locale: 'pt-BR' };
  let dayOfWeek = date.toLocaleDateString('pt-BR', options);
  dayOfWeek = dayOfWeek.slice(0, -1);
  dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  
  //Buscando a quantidade de dias que a agenda vai ficar aberta
  const [year, setYear] = useState(date.getFullYear());
  const [horariosDiaSelecionado, setHorariosDiaSelecionado] = useState([]);
  const [QntDaysSelected, setQntDaysSelected] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [timesDays, setTimesDays] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [timeSelected, setTimeSelected] = useState("");
  const [messageConfirmedBooking, setMessageConfirmedBooking] = useState(false);

  const urlApi = 'https://barbeasy.up.railway.app'
  const cloudFrontUrl = 'https://d15o6h0uxpz56g.cloudfront.net/'

  
  const currentDate = new Date(date);
  const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}-${currentDate.getHours()}:${currentDate.getMinutes()}`;

  //Function to get booking policeis of barbearia

  const [bookingWithPayment, setBookingWithPayment] = useState(false);
  const [servicePercentageStored, setServicePercentageStored] = useState('');
  const [isLoading, setIsLoading] = useState(false) 

  const getBookingPoliceis = () =>{
    axios.get(`${urlApi}/api/v1/bookingPoliceis/${barbeariaId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
     }
    }).then(res =>{
        if(res.status === 200){
          setBookingWithPayment(res.data.bookingPoliceis.booking_with_payment)
          setServicePercentageStored(res.data.bookingPoliceis.service_percentage === "false" ? '':res.data.bookingPoliceis.service_percentage)        
        }
    }).catch(err =>{
      console.log(err)
    })
  }
  
  useEffect(() =>{
    getBookingPoliceis()
  }, [])
  
  //Object to send for paymentScreen
  const serviceValues = {
    barbeariaName,
    professionalName,
    serviceName,
    servicePrice,
    serviceDuration,
    selectedDay,
    timeSelected
  }

  //Function to get current time
  function getCurrentTime(){
    // get default current time
    const currentTime = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const currentTimeStr = String(currentTime).padStart(2, '0');
    const currentMinuteStr = String(currentMinute).padStart(2, '0');
    const fullCurrentTime = Number(`${currentTimeStr}${currentMinuteStr}`);
    return fullCurrentTime;
  }

  //Função para pegar os dias da semana
  function getWeeks() {
    const arrayWeeks = [];
    const startIndex = weekNames.indexOf(dayOfWeek);
    const lastDayToShow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + QntDaysSelected);

    for (let i = 0; i < QntDaysSelected; i++) {
      const currentDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + i);
      const index = (startIndex + i) % 7;
      const nameWeek = weekNames[index];

      if (currentDay <= lastDayToShow) {
        arrayWeeks.push(nameWeek);
      }
    }

    return arrayWeeks;
  }

  //Função para gerar a quantidade de dias que a agenda vai ficar aberta
  function getNumber() {
    const numbersWeek = [];
    const lastDayToShow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + QntDaysSelected);
  
    for (let i = 0; i < QntDaysSelected; i++) {
      const currentDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + i);
      const numberWeek = currentDay.getDate();
      const isCurrentDay = currentDay.toDateString() === date.toDateString();
      const month = monthNames[currentDay.getMonth()]; // Obtém o nome do mês
  
      if (currentDay <= lastDayToShow) {
        numbersWeek.push({
          number: numberWeek,
          isCurrentDay: isCurrentDay,
          month: month, // Adiciona o nome do mês ao objeto
        });
      }
    }
  
    return numbersWeek;
  }

  // Function to get current day in format: [Sex, 12 de Abr de 2024]
  function getCurrentDayOfWeek(){
    const currentDayOfWeek = weekNames[date.getDay()];//Dia atual da semana
    const currentDayOfMonth = date.getDate();//Dia atua do mês
    const currentNameMonth = monthNames[date.getMonth()];//Mês atual  
    let currentDay = `${currentDayOfWeek}, ${currentDayOfMonth} de ${currentNameMonth} de ${year}`;// Monta a data no formato do dia selecionado
    return currentDay;
  }

  //Função para filtrar os horários menores que o horário atual
  function filterTimesShorterCurrentTime (arrayWithTimes, currentTime) {

    let arrayClear = []
    // Filtra os horários que são maiores ou iguais ao horário atual
    const arrayFiltaredTimes = arrayWithTimes.filter(horario => {
      // Divide o horário em hora e minuto
      const [hora, minuto] = horario.split(':');
      // Calcula o horário completo em formato de número para facilitar a comparação
      let horarioCompleto = Number(`${hora}${minuto}`);
      // Retorna verdadeiro se o horário completo for maior ou igual ao horário atual
      return horarioCompleto >= currentTime;
    });
    return arrayClear = arrayFiltaredTimes;
  }

  const weekDays = getWeeks();
  const numberDays = getNumber();
  const currentDay = getCurrentDayOfWeek()
  const currentTime = getCurrentTime()
  
  //Function to convert data selected
  function converterData(dataStr) {
    const meses = {
      'Jan': 1,
      'Fev': 2,
      'Mar': 3,
      'Abr': 4,
      'Mai': 5,
      'Jun': 6,
      'Jul': 7,
      'Ago': 8,
      'Set': 9,
      'Out': 10,
      'Nov': 11,
      'Dez': 12
    };
  
    // Remover o nome do dia da semana
    const partes = dataStr.split(', ')[1].split(' ');
  
    const dia = partes[0];
    const mes = meses[partes[2]];
    const ano = partes[4];
  
    return `${ano}-${mes}-${dia}`;
  }
  
  // Function to get all booking
  const handleDateClick = (dayOfWeek, day, month, year) => {
    
  setSelectedDay(`${dayOfWeek}, ${day} de ${month} de ${year}`)
  let selectedDate = `${dayOfWeek}, ${day} de ${month} de ${year}`;
  console.log(year)
  
  let timesOfDaySelected = timesDays[dayOfWeek]; //Passa o índice do objeto, correspondente ao dia selecionado
  timesOfDaySelected = timesOfDaySelected.split(',');//Separa os horários que estão concatenados

    axios.get(`${urlApi}/api/v1/bookingsTimes/${barbeariaId}/${professionalId}/${selectedDate}`)
    .then(res =>{
      if(res.data.Message === 'true'){//Verifica se a consulta realizada, possuí algum registro
        let bookings = res.data.timesLocked;//passando os registros obtidos na consulta
        if (dayOfWeek in timesDays) {// Verifica se o dia selecionado está no objeto 'timesDays' que contém os horários dos dias definidos

          if(selectedDate === currentDay){//Condição par verificar se o dia selecionado e o mesmo do dia atual
            if(timesOfDaySelected[0].length === 5){//Condição par verificar se o primeiro elemento do array é um horário
              const timesLockedStr = Object.values(bookings).map(item => item.timesLocked.split(','));//Separa os horários obtidos na consulta, já que eles são salvos concatenados
              
              //Function to remove all bookings
              timesOfDaySelected = timesOfDaySelected.filter(time => {
                // Verifica se o horário atual não está presente em bookingsTimesSplit
                return !timesLockedStr.some(bookedTimes => bookedTimes.includes(time));
              });

              // Chamando a função que filtra os horários menores que o horário atual
              const horariosFiltrados = filterTimesShorterCurrentTime(timesOfDaySelected, currentTime)

              if(horariosFiltrados.length > 0){
                setHorariosDiaSelecionado(horariosFiltrados);
              }else{
                setHorariosDiaSelecionado(['Não há horários disponíveis para esse dia']);
              }

            }else{
              setHorariosDiaSelecionado(['Não há horários disponíveis para esse dia']);
            }

          }else{
            //Condição par verificar se o primeiro elemento do array é um horário
            if(timesOfDaySelected[0].length === 5){

              const timesLockedStr = Object.values(bookings).map(item => item.timesLocked.split(','));
              
              //Function to remove all bookings
              timesOfDaySelected = timesOfDaySelected.filter(time => {
                // Verifica se o horário atual não está presente em bookingsTimesSplit
                return !timesLockedStr.some(bookedTimes => bookedTimes.includes(time));
              });

              setHorariosDiaSelecionado(timesOfDaySelected);

            }else{
              setHorariosDiaSelecionado(['Não há horários disponíveis para esse dia']);
            }
          }
        }
      }else{
        if (dayOfWeek in timesDays) {

          if(selectedDate === currentDay){//Condição par verificar se o dia selecionado e o mesmo do dia atual
            if(timesOfDaySelected[0].length === 5){//Condição par verificar se o primeiro elemento do array é um horário
              
              // Chamando a função que filtra os horários menores que o horário atual
              const horariosFiltrados = filterTimesShorterCurrentTime(timesOfDaySelected, currentTime)

              if(horariosFiltrados.length > 0){
                setHorariosDiaSelecionado(horariosFiltrados);
              }else{
                setHorariosDiaSelecionado(['Não há horários disponíveis para esse dia']);
              }

            }else{
              setHorariosDiaSelecionado(['Não há horários disponíveis para esse dia']);
            }
          }else{
            //Condição par verificar se o primeiro elemento do array é um horário
            if(timesOfDaySelected[0].length === 5){         
                   
              setHorariosDiaSelecionado(timesOfDaySelected);
            }else{
              setHorariosDiaSelecionado(['Não há horários disponíveis para esse dia']);
            }
          }
        }
      }
    }).catch(err =>{
      console.error('Não há horários agendado/fechado para esse dia', err);
    })
  }

  //Obtendo os dados da agenda do profissional da barbearia
  const getAgenda = () =>{
    if(barbeariaId && professionalId){
      axios.get(`${urlApi}/api/v1/agenda/${barbeariaId}/${professionalId}`)
      .then(res => {
        if(res.status === 200){
          setAgenda(res.data.Agenda)
        }
      }).catch(error => {
        console.error('Erro ao buscar informações da agenda da barbearia', error)
      })
    }
  }
 
  //Chamando a função para obter os dados da agenda da barbearia
  useEffect(() => {
    getAgenda()
  }, [professionalId, serviceId])

  useEffect(() => {
    if (Array.isArray(agenda) && agenda.length >= 2) {
      setQntDaysSelected(agenda[1].toString());
    }
  }, [professionalId, serviceId, selectedDay]);
  
  //Função para obter os horários definidos do dia selecionado
  const getHorariosDefinidos = () =>{
    axios.get(`${urlApi}/api/v1/agendaDiaSelecionado/${barbeariaId}/${professionalId}`)
    .then(res => {
      //Armazenando o objeto com todos os horários definidos
      setTimesDays(res.data.TimesDays)

    }).catch(error => {
      console.error('Erro ao buscar informações da agenda da barbearia', error)
    })
  }

  //Hook para chamar a função 'getHorariosDefinidos'
  useEffect(() => {
    getHorariosDefinidos()
  }, [professionalId, serviceId, selectedDay])

  //Função para calcular a quantidade de horários que serão ocupados, com base no serviço selecionado
  function reservationTimes (timeSelected){
    //Verifica se um horário foi selecionado
    if(timeSelected){
      //Verifica se o serviço selecionado tem um tempo de duração maior que 15min
      if(serviceDuration > 15){
        //Divide a duração do serviço por 15, para obter a quantidade de vezes que vamos gerar horários que serão ocupados
        const cont = serviceDuration/15;

        let [time, minute] = timeSelected.split(':');//divide a string do horário selecionado em horas e minutos
        let newHour= Number(time);//horas
        let newMinute = Number(minute);//minutos

        //Array para armazenar os horários que serão o cupados pelo serviço
        const timesBusy = []

        //loop para calcular os horarios que serão ocupados pelo serviço selecionado
        for(let i=0; i < cont; i++){
          //Soma 15min nos minutos do horário selecionado
          newMinute = newMinute + 15;
          //Verifica se os minutos do horário gerado é maior ou igual a 60
          if(newMinute >= 60){          
              newHour = newHour + 1;//Se for, soma mais 1 hora
              newMinute = newMinute - 60;//E zera os respectivos minutos
              let newTime = Number(`${newHour}${newMinute}${0}`);//Concatena o novo horário
              timesBusy.push(newTime)//Adiciona o novo horário no array
          }else{
            let newTime = Number(`${newHour}${newMinute}`);//Como os minutos são menores que 60, apenas concatena o horário gerado com 15min a mais
            timesBusy.push(newTime)//Adiciona o novo horário no array
          }
        }

        //João, esse array está armazenando os horários no seguinte formato string ("00:00") que o serviço vai ocupar.
        const busyTimesFormated = []

        for(let i=0; i<timesBusy.length; i++){
          //Aqui você está passando o primeiro elemento do array 'timesBusy' que contém os horários em tipo inteiro, que o serviço vai ocupar.
          let timesIntFormat = timesBusy[i].toString();
          //Verificação se o horário contido em timesBusy é (800), ou seja, 8h da manhã
          if(timesIntFormat.length === 3){
            //Se for, você adiciona um '0' a esquerda (hhahahahhaha) para ficar no formato do array princpal de horários. Sendo assim, possibilitando a remoção desse horário do array principal.
            timesIntFormat = '0' + timesIntFormat;
            let hours = timesIntFormat.substring(0, 2);//Pegando os dois primeiros elementos da hora
            let minutes =  timesIntFormat.substring(timesIntFormat.length - 2);//Pegando os dois primeiros elementos do minuto
            let timeFormated = `${hours}:${minutes}`;// formatando
            busyTimesFormated.push(timeFormated);//Adicionando ao array
          }else{
            //Caso o horário contido no array timesBusy tenha dois elementos, ou seja, 1315 (13:15)
            let hours = timesIntFormat.substring(0, 2);//Pegando os dois primeiros elementos da hora
            let minutes =  timesIntFormat.substring(timesIntFormat.length - 2);//Pegando os dois primeiros elementos do minuto
            let timeFormated = `${hours}:${minutes}`;// formatando
            busyTimesFormated.push(timeFormated);//Adicionando ao array
          }
        }
        busyTimesFormated.pop();//Excluindo o último horário da lista, pois ele tem que ser disponibilizado para agendamento
        busyTimesFormated.unshift(timeSelected)//Adicionando o horário selecionado, finalizando então, o mapeamento de todos os horários a serem ocupados pelo serviço selecionado.

        return busyTimesFormated;
      }
      if(serviceDuration === 15){
        return timeSelected
      }
    }
  }

  const timesBusyByService = reservationTimes(timeSelected)

  //Função para pegar o horário selecionado pelo usuário
  const hendleTimeClick = (time) => {
      setTimeSelected(time);
  }

  //Hook para resetar sa variáveis caso o usuário selecione outro profissional
  useEffect(() =>{
    setSelectedDay('')
    setTimeSelected('')
    setHorariosDiaSelecionado(null)
  }, [professionalId])

  //Function to render all times defined
  const renderHorariosDiaSelecionado = () => {

    return (
      <>
       
            {horariosDiaSelecionado ? (
              horariosDiaSelecionado.map(index => (
                <div key={index} className={`horarios ${timeSelected === index ? 'selectedDay':''}`} onClick={() => hendleTimeClick(index)}>
                  <p>{index}</p>
                </div>
              ))
            ):(
              <p style={{width: '100%', textAlign: 'center', color:'gray', fontSize: '14px', marginTop: '20px'}}>
                Nenhum dia selecionado
              </p>
            )}
      </>
    );
  };

//============================== Section Create Payment AND Pre-Booking ==============================
  const [preBookingAndPaymentCreated, setPreBookingAndPaymentCreated] = useState(false)
  //Function to navigate for payment screen with paymentObject, serviceValues and accessTokenBarbearia  
  const navigateToPaymentScreen = (paymentObject) =>{
    navigate("/PaymentScreen", { state: { paymentObject, serviceValues, accessTokenBarbearia } });
  } 

  //Function to Create payment
  const createPayment = () => {
    setPreBookingAndPaymentCreated(true)
    let priceFormated = servicePrice.replace(/R\$ (\d+),(\d{2})/, '$1.$2');
    let finalServicePrice = Number(priceFormated) * Number(servicePercentageStored)
    
    const values = {
      accessTokenBarbearia,
      transaction_amount: finalServicePrice,
      description: serviceName,
      paymentMethodId: 'pix',
      email: userEmail,
      identificationType: 'CPF',
      number: '52094597059',
      userId,
      barbeariaId,
      professionalId,
      serviceId,
    }

    axios.post(`${urlApi}/api/v1/createPayment`, values, {
      headers: {
        'Authorization': `Bearer ${token}`  
      }
    })
    .then(res => {
      if(res.data.Success === true){
        createPreBooking(res.data.payment_id, res.data.fullResponse)
      }
    })
    .catch(err => {
      if(err.response.status === 403){
        return navigate("/SessionExpired")
      }
      console.log(err)
    })
    
  };


  //Function to create pre-booking
  const createPreBooking = (payment_id, paymentObject) =>{
    if(userId && barbeariaId && professionalId && serviceId && selectedDay && timeSelected && formattedDate && payment_id && paymentObject){
        
        //All times that will be busy by the selected service
        let timeSelected = timesBusyByService[0].length > 1 ? timesBusyByService.join(','):timesBusyByService;
        let selectedDayFormated = converterData(selectedDay)

        //Object to agroup all informations to make a new booking
        const newBooking = {
            userId,
            barbeariaId,
            professionalId,
            serviceId,
            payment_id,
            selectedDay,
            timeSelected,
            formattedDate,
            selectedDayFormated
        }

        axios.post(`${urlApi}/api/v1/createBookingWithPayment/`, newBooking, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            if(res.data.Success === 'Success'){
                setTimeout(() => {
                  navigateToPaymentScreen(paymentObject)
                }, 3000);
            }

        }).catch(error => {
          console.error('Erro ao criar pré-reserva', error)

          if(error.response.status === 403){
            return navigate("/SessionExpired")
          }

          if(error.response.status === 401){
            setPreBookingAndPaymentCreated(false)
            setIsBookingCreated(false)

              setMessageConfirmedBooking(`Os horários ${error.response.data.timesMach} já estão oculpados. Selecione outro horário ou um serviço com menor duração.`)
              return setTimeout(() => {
                setMessageConfirmedBooking('')
              }, 8000);
          }
          setPreBookingAndPaymentCreated(false)
          setMessageConfirmedBooking("Houve um erro ao criar sua pré-reserva. Tente novamente mais tarde.")
          setTimeout(() => {
            setMessageConfirmedBooking('');
          }, 3000);
        })
    }
  }
//============================== Section Create Booking without payment ==============================
const [isBookingCreated, setIsBookingCreated] = useState(false)

  //Function to create pre-booking
  const createBookingWithoutPayment = () =>{
    
    if(userId && barbeariaId && professionalId && serviceId && selectedDay && timeSelected && formattedDate){
        
        setIsBookingCreated(true)

        //All times that will be busy by the selected service
        let timeSelected = timesBusyByService[0].length > 1 ? timesBusyByService.join(','):timesBusyByService;
        let selectedDayFormated = converterData(selectedDay)

        //Object to agroup all informations to make a new booking
        const newBooking = {
            userId,
            barbeariaId,
            professionalId,
            serviceId,
            payment_id: 0,
            selectedDay,
            timeSelected,
            formattedDate,
            selectedDayFormated
        }

        axios.post(`${urlApi}/api/v1/createBookingWithoutPayment/`, newBooking, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
                setIsBookingCreated(false)
                setMessageConfirmedBooking(res.data.message)
                return setTimeout(() => {
                   navigate("/BookingsHistory")
                }, 3000);
        }).catch(error => {
          console.error('Erro ao criar agendamento', error)
          
          if(error.response.status === 403){
            return navigate("/SessionExpired")
          }

          if(error.response.status === 401){
            setIsBookingCreated(false)

              setMessageConfirmedBooking(`Os horários ${error.response.data.timesMach} já estão oculpados. Selecione outro horário ou um serviço com menor duração.`)
              return setTimeout(() => {
                setMessageConfirmedBooking('')
              }, 8000);
          }
          
          setIsBookingCreated(false)
          setMessageConfirmedBooking(error.response.data.message)
          return setTimeout(() => {
            setMessageConfirmedBooking('');
          }, 3000);
        })
    }
  }
//============================== Section propTypes ==============================
  Agendamento.propTypes = {
    userId: PropTypes.number,
    barbeariaId: PropTypes.number,
    professionalId: PropTypes.number,
    serviceId: PropTypes.number,
    serviceDuration: PropTypes.number
  };

useEffect(() =>{
  setIsLoading(true)

  setTimeout(() =>{
    setIsLoading(false)
  }, 1000)
}, [selectedDay])

  return (
  <>
    <div className={` ${openModal ? 'container__background__agendamento':'hiden__agendamento'}`}>
        <div  className={` ${openModal ? 'container__agendamento':'hiden__agendamento'}`}>
        
        <div className="container__preview__booking">
          <div className="header__preview__booking">
            <h3>Detalhes do agendamento </h3>
            <IoClose className="icon__IoIosCloseCircleOutline" onClick={closeModal}/>
          </div>
          
          
          <div className="inner__preview__booking">
              <div className="Box__professional__barbearia__details"> 
                <div className="img__professional__barbearia__details">
                  {imageProfessional != 'default.png' ?(
                    <img src={cloudFrontUrl + imageProfessional} className="user__img__box__comment" alt="" />
                  ):(
                    <p className='firstLetter' style={{color: '#fff', fontSize: '40px'}}>{professionalName.charAt(0).toUpperCase()}</p>
                  )}
                </div>
                <p className="name__professional__in__barbearia__details" style={{color: '#fff', fontSize: '14px'}}>{professionalName}</p>

              </div>
              <div className='box__service__preview'>
                <p>{serviceName} • {servicePrice} </p>
                <p style={{color: 'darkgray'}}><GiSandsOfTime /> • {serviceDuration}min</p>
              </div>
          </div>
        
        </div>
            <div className='container__Calendar' translate="no">
                <p className="text__total__professional__and__service">Escolha um dia de sua preferência</p>

              <div className='sectionCalendar' translate="no">
                <div className="list__Names__Week__And__Day" translate="no">
                {weekDays.map((dayOfWeek, index) => {
                  /*logic to handle de next year
                    let yearOfselectedDay = year;
                    if (numberDays[index].month === 'Jan') {
                      yearOfselectedDay = date.getFullYear() + 1;
                    }*/

                    return (
                      <div key={`weekDay-${index}`} className="list__name__Week">
                        <div
                          className={`dayWeekCurrent ${selectedDay === `${dayOfWeek}, ${numberDays[index].number} de ${numberDays[index].month} de ${year}` ? 'selectedDay' : ''} ${numberDays[index].isCurrentDay ? 'currentDay' : ''}`}
                          onClick={() => {
                            handleDateClick(dayOfWeek, numberDays[index].number, numberDays[index].month, year);
                          }}
                        >
                          <p className='Box__day'>{dayOfWeek}</p>
                          <p className='Box__NumDay'>{numberDays[index].number}</p>
                          <p className='Box__month'>{numberDays[index].month}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="tittle" translate="no">
              <div style={{marginTop: '15px'}}>
                Horários Disponíveis
              </div>
            </div>

            <div className="container__horarios" translate="no">
                {isLoading ? (
                  <div className="loading__times">
                    <div className="loaderCreatingBooking"></div>
                  </div>
                    
                ):(
                   <>
                    {renderHorariosDiaSelecionado()}
                   </>
                )}
            </div>
          

            {userType != "visitante" &&(
              
              <div className="container__btn__create__booking__and__payment" translate="no">

                {messageConfirmedBooking === "Agendamento realizado com sucesso!" ? (
                  <div className="mensagem-sucesso">
                    <MdOutlineDone className="icon__success"/>
                    <p className="text__message">{messageConfirmedBooking}</p>
                  </div>
                ) : (
                  <div className={` ${messageConfirmedBooking ? 'mensagem-erro' : ''}`} style={{textAlign: 'justify'}}>
                    <VscError className={`hide_icon__error ${messageConfirmedBooking ? 'icon__error' : ''}`}/>
                    <p className="text__message">{messageConfirmedBooking}</p>
                  </div>
                )}

                {bookingWithPayment === 'enabled' ?(
                  <>
                    {!preBookingAndPaymentCreated ?(
                      <button onClick={createPayment} className={`Btn__ocult ${serviceId && selectedDay && timeSelected ? 'Btn__create__preBooking':''}`}>
                        Realizar pagamento
                      </button>
                    ):(
                      <button className="createPreBookingAndPayment">
                        Criando pagamento
                      </button>
                    )}
                  </>
                ):(
                  <button onClick={createBookingWithoutPayment} className={`Btn__ocult ${serviceId && selectedDay && timeSelected  && !messageConfirmedBooking ? 'Btn__create__preBooking':''}`}>

                    {isBookingCreated ? (
                      <div className="loaderCreatingBooking"></div>
                    ):(
                      <p>Realizar agendamento</p>
                    )}
                  </button>
                )}
                
              </div>
            )}
        </div>
    </div>
  </>
  );
}
