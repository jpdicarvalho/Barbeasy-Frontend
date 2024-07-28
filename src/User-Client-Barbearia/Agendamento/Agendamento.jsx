import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import axios from 'axios';

import './Agendamento.css';

import PropTypes from 'prop-types';
import { MdOutlineDone } from "react-icons/md";
import { VscError } from "react-icons/vsc";

const monthNames = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Aug', 'Set', 'Out', 'Nov', 'Dez'
];

const weekNames = [
  'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
];

export function Agendamento({
  userId,
  barbeariaId,
  professionalId,
  serviceId,
  barbeariaName,
  professionalName,
  serviceName,
  servicePrice,
  serviceDuration }) {
  
  const navigate = useNavigate();

  const userData = localStorage.getItem('userData');
  //trasnformando os dados para JSON
  const userInformation = JSON.parse(userData);
  //Fromatando cada letra inicial do nome do usuário para caixa-alta
  const userEmail = userInformation.user[0].email;


  const date = new Date();
  
  const options = { weekday: 'short', locale: 'pt-BR' };
  let dayOfWeek = date.toLocaleDateString('pt-BR', options);
  dayOfWeek = dayOfWeek.slice(0, -1);
  dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  const year = date.getFullYear();

  const token = localStorage.getItem('token');
  
  //Buscando a quantidade de dias que a agenda vai ficar aberta
  const [horariosDiaSelecionado, setHorariosDiaSelecionado] = useState([]);
  const [QntDaysSelected, setQntDaysSelected] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [timesDays, setTimesDays] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [timeSelected, setTimeSelected] = useState("");
  const [messageConfirmedBooking, setMessageConfirmedBooking] = useState('');

  const urlApi = 'https://barbeasy.up.railway.app'
  
  const currentDate = new Date(date);
  const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}-${currentDate.getHours()}:${currentDate.getMinutes()}`;

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

  // Function to get all booking
  const handleDateClick = (dayOfWeek, day, month, year) => {
  setSelectedDay(`${dayOfWeek}, ${day} de ${month} de ${year}`)
  let selectedDate = `${dayOfWeek}, ${day} de ${month} de ${year}`;
  
  let timesOfDaySelected = timesDays[dayOfWeek]; //Passa o índice do objeto, correspondente ao dia selecionado
  timesOfDaySelected = timesOfDaySelected.split(',');//Separa os horários que estão concatenados

    axios.get(`${urlApi}/api/v1/bookingsTimes/${barbeariaId}/${professionalId}/${selectedDate}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
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
      axios.get(`${urlApi}/api/v1/agenda/${barbeariaId}/${professionalId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
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
    axios.get(`${urlApi}/api/v1/agendaDiaSelecionado/${barbeariaId}/${professionalId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
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
        {horariosDiaSelecionado && (
          horariosDiaSelecionado.map(index => (
            <div key={index} className={`horarios ${timeSelected === index ? 'selectedDay':''}`} onClick={() => hendleTimeClick(index)}>
              <p>{index}</p>
            </div>
          ))
        )}
      </>
    );
  };

//============================== Section Create Payment AND Pre-Booking ==============================
  const [accessTokenBarbearia, setAccessTokenBarbearia] = useState('');

  //Function to navigate for payment screen with paymentObject, serviceValues and accessTokenBarbearia  
  const navigateToPaymentScreen = (paymentObject, identificationToken) =>{
    navigate("/PaymentScreen", { state: { paymentObject, identificationToken, serviceValues, accessTokenBarbearia } });
  }

  //Function to get access token of barbearia. That access token will be used to send the payment for it
  const getAccessTokenBarbearia = () =>{
    axios.get(`${urlApi}/api/v1/accessTokenBarbearia/${barbeariaId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      if(res.data.Success === true){
        setAccessTokenBarbearia(res.data.AccessToken);
      }else{
        setAccessTokenBarbearia(false);
      }
    }).catch(err => {
      setAccessTokenBarbearia(false)
      console.error('Erro ao obter os registros:', err);
    })
  }

  //Hook o call getAccessTokenBarbearia
  useEffect(()=>{
    getAccessTokenBarbearia()
  }, [selectedDay])  

  //Function to Create payment
  const createPayment = () => {

    let priceFormated = servicePrice.replace(/R\$ (\d+),(\d{2})/, '$1.$2');
    
    const values = {
      accessTokenBarbearia,
      transaction_amount: priceFormated,
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

    axios.post(`${urlApi}/api/v1/payment`, values, {
      headers: {
        'Authorization': `Bearer ${token}`  
      }
    })
    .then(res => {
      if(res.data.Success === true){

        let timeSelected = timesBusyByService.join(',');//All times that will be busy by the selected service

        //Object to create an identification token for the pre-booked appointment. it will be used to change the payment status of this pre-booking
        const valuesToIdentificationToken = [
          userId,
          barbeariaId,
          professionalId,
          serviceId,
          selectedDay,
          timeSelected,
        ]
        
        const createdIdentificationToken = valuesToIdentificationToken.join('-');
        return navigateToPaymentScreen(res.data.fullResponse, createdIdentificationToken)
      }
    })
    .catch(err => {
      console.log(err)
    })
    
  };

  //Function to create pre-booking
  const createPreBooking = () =>{
    if(userId && barbeariaId && professionalId && serviceId && selectedDay && timeSelected && formattedDate){
        
        let timeSelected = timesBusyByService.join(',');//All times that will be busy by the selected service

        const initialPaymentStatus = "pending";

        //Object to agroup all informations to make a new booking
        const newBooking = {
            userId,
            barbeariaId,
            professionalId,
            serviceId,
            selectedDay,
            timeSelected,
            initialPaymentStatus,
            formattedDate
        }

        axios.post(`${urlApi}/api/v1/createBooking/`, newBooking, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => {
            if(res.data.Success === 'Success'){
                setMessageConfirmedBooking("Seu agendamento foi pré-reservado. Efetue o pagamento para finalizar!")
                setTimeout(() => {
                setMessageConfirmedBooking('');
                createPayment()
                }, 3000);
            }

        }).catch(error => {
          console.error('Erro ao criar pré-reserva', error)
          setMessageConfirmedBooking("Houve um erro ao criar sua pré-reserva. Tente novamente mais tarde.")
          setTimeout(() => {
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

  return (
  <>
    <div className='container__Calendar'>

      <div className='sectionCalendar'>
        <div className="list__Names__Week__And__Day">
        {weekDays.map((dayOfWeek, index) => (
            <div key={`weekDay-${index}`} className="list__name__Week">
              <div
                className={`dayWeekCurrent ${selectedDay === `${dayOfWeek}, ${numberDays[index].number} de ${numberDays[index].month} de ${year}` ? 'selectedDay' : ''} ${numberDays[index].isCurrentDay ? 'currentDay' : ''}`}
                onClick={() => handleDateClick(dayOfWeek, numberDays[index].number, numberDays[index].month, year)}
              >
                <p className='Box__day'>{dayOfWeek}</p>
                <p className='Box__NumDay'>{numberDays[index].number}</p>
                <p className='Box__month'>{numberDays[index].month}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {selectedDay &&(
    <div className="tittle">
       <div style={{marginTop: '15px'}}>
        Horários Disponíveis
      </div>
    </div>
    )} 

    <div className="container__horarios">
      {renderHorariosDiaSelecionado()}
    </div>

    {messageConfirmedBooking === 'Seu agendamento foi pré-reservado. Efetue o pagamento para finalizar!' ?(
      <div className="mensagem-sucesso">
        <MdOutlineDone className="icon__success"/>
        <p className="text__message">{messageConfirmedBooking}</p>
      </div>
      ) : (
      <div className={` ${messageConfirmedBooking ? 'mensagem-erro' : ''}`}>
        <VscError className={`hide_icon__error ${messageConfirmedBooking ? 'icon__error' : ''}`}/>
        <p className="text__message">{messageConfirmedBooking}</p>
      </div>
    )}

    <button onClick={createPreBooking} className={`Btn__ocult ${serviceId && selectedDay && timeSelected ? 'AgendamentoButton': ''}`}>Continuar</button>
   
  </>
  );
}
