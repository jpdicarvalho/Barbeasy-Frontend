import { useState, useEffect, useRef } from "react";
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

export function Agendamento({ userId, barbeariaId, professionalId, serviceId, serviceDuration }) {

  const [horariosDiaSelecionado, setHorariosDiaSelecionado] = useState([]); // Estado para os horários do dia selecionado

  const date = new Date();
  const options = { weekday: 'short', locale: 'pt-BR' };
  let dayOfWeek = date.toLocaleDateString('pt-BR', options);
  dayOfWeek = dayOfWeek.slice(0, -1);
  dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  const year = date.getFullYear();

  //Buscando a quantidade de dias que a agenda vai ficar aberta
  const [QntDaysSelected, setQntDaysSelected] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSelected, setTimeSelected] = useState("");

  const currentDay = new Date(date);
  const formattedDate = `${currentDay.getDate()}-${currentDay.getMonth() + 1}-${currentDay.getFullYear()}-${currentDay.getHours()}:${currentDay.getMinutes()}`;

  // Function to get all booking
  const [bookings, setBookings] = useState ([]);
  const getAllBookings = () =>{
    axios.get(`https://api-user-barbeasy.up.railway.app/api/bookings/${barbeariaId}`)
    .then(res =>{
      if(res.data.Success === 'Success'){
        setBookings(res.data.allBookings);
      }
    }).catch(err =>{
      console.error('Erro ao buscar agendamentos', err);
    })
  }
  useEffect(() =>{
    getAllBookings()
  }, [barbeariaId, professionalId, selectedDate])

  //Obtendo os dados da agenda do profissional da barbearia
  const getAgenda = () =>{
    if(barbeariaId && professionalId){
      axios.get(`https://api-user-barbeasy.up.railway.app/api/agenda/${barbeariaId}/${professionalId}`)
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
  }, [barbeariaId, professionalId, serviceId])

  useEffect(() => {
    if (Array.isArray(agenda) && agenda.length >= 2) {
      setQntDaysSelected(agenda[1].toString());
    }
  }, [barbeariaId, professionalId, serviceId, selectedDate]);
  
  //Declaração do array com os horários de cada dia
  const [timesDays, setTimesDays] = useState('');

  //Função para obter os horários definidos do dia selecionado
  const getHorariosDefinidos = () =>{
    axios.get(`https://api-user-barbeasy.up.railway.app/api/agendaDiaSelecionado/${barbeariaId}/${professionalId}`)
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
  }, [barbeariaId, professionalId, serviceId, QntDaysSelected])

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

  const weekDays = getWeeks();
  const numberDays = getNumber();
/*=============================================================== Don't Forget ===============================================================
João, lembra de buscar apenas os agendamento da data atual para frente!! 
Pois essa consulta abaixo, está puxando todos os agendamento feitos na históriaa!!
==============================================================================================================================================*/
//Função para buscar os agendamento do profissional selecionado
function getBookingOfProfessional (){
  let arrayBookingProfessional = bookings.filter(bookings => bookings.professional_id === professionalId);
  return arrayBookingProfessional;
}
const bookingProfessional = getBookingOfProfessional()

//Função para buscar a lista de horários disponíveis para agendamento, do dia selecionado
const handleDateClick = (dayOfWeek, day, month, year) => {
  setSelectedDate(`${dayOfWeek}, ${day} de ${month} de ${year}`);//dia selecionado para registrar o agendamento
  let selectedDay = `${dayOfWeek}, ${day} de ${month} de ${year}`;//dia selecionado para filtrar array de horários

  const currentDayOfWeek = weekNames[date.getDay()];//Dia atual da semana
  const currentDayOfMonth = date.getDate();//Dia atua do mês
  const currentNameMonth = monthNames[date.getMonth()];//Mês atual  
  let currentDay = `${currentDayOfWeek}, ${currentDayOfMonth} de ${currentNameMonth} de ${year}`;// Monta a data no formato do dia selecionado

  // Verifica se o dia selecionado está no objeto
  if (dayOfWeek in timesDays) {
    //Passa o índice do objeto, correspondente ao dia selecionado
    let timesOfDaySelected = timesDays[dayOfWeek];
    //Separa os horários que estão concatenados
    timesOfDaySelected = timesOfDaySelected.split(',');
    
    // Obter a hora atual
    const horaAtual = new Date().getHours();
    const minutoAtual = new Date().getMinutes();
    const horaAtualString = String(horaAtual).padStart(2, '0');
    const minutoAtualString = String(minutoAtual).padStart(2, '0');
    const horaAtualCompleta = Number(`${horaAtualString}${minutoAtualString}`);

    if(selectedDay === currentDay){
      if(timesOfDaySelected[0].length === 5){
        const bookinOfDaySelected = bookingProfessional.filter(horarios => horarios.booking_date === selectedDay);
        const bookingsTimes = Object.values(bookinOfDaySelected).map(item => item.booking_time);
        const bookingsTimesSplit = bookingsTimes.map(timeString => timeString.split(','));
        
        timesOfDaySelected = timesOfDaySelected.filter(time => {
          // Verifica se o horário atual não está presente em bookingsTimesSplit
          return !bookingsTimesSplit.some(bookedTimes => bookedTimes.includes(time));
        });

        // Converta os horários agendados para o mesmo formato dos horários disponíveis
        const bookingsTimesFormated = bookingsTimes.map(times => {
          const [time, minute] = times.split(':');
          return Number(`${time}${minute}`);
        });

        // Remova os horários agendados do array de horários disponíveis
        timesOfDaySelected = timesOfDaySelected.filter(times => {
          const [time, minute] = times.split(':');
          const fullTime = Number(`${time}${minute}`);
          return !bookingsTimesFormated.includes(fullTime);
        });
        

        // Filtra os horários que são maiores ou iguais ao horário atual
        const horariosFiltrados = timesOfDaySelected.filter(horario => {
          // Divide o horário em hora e minuto
          const [hora, minuto] = horario.split(':');
          // Calcula o horário completo em formato de número para facilitar a comparação
          const horarioCompleto = Number(`${hora}${minuto}`);
          // Retorna verdadeiro se o horário completo for maior ou igual ao horário atual
          return horarioCompleto >= horaAtualCompleta;
        });
        setHorariosDiaSelecionado(horariosFiltrados);

      }else{
        setHorariosDiaSelecionado(['Não há horários disponíveis para esse dia']);
      }
    
    }else{
      const bookinOfDaySelected = bookingProfessional.filter(horarios => horarios.booking_date === selectedDay);
      const bookingsTimes = Object.values(bookinOfDaySelected).map(item => item.booking_time);
      const bookingsTimesSplit = bookingsTimes.map(timeString => timeString.split(','));
      console.log('asasasa',bookingsTimesSplit)
        timesOfDaySelected = timesOfDaySelected.filter(time => {
          // Verifica se o horário atual não está presente em bookingsTimesSplit
          return !bookingsTimesSplit.some(bookedTimes => bookedTimes.includes(time));
        });

        // Converta os horários agendados para o mesmo formato dos horários disponíveis
        const bookingsTimesFormated = bookingsTimes.map(times => {
          const [time, minute] = times.split(':');
          return Number(`${time}${minute}`);
        });

        // Remova os horários agendados do array de horários disponíveis
        timesOfDaySelected = timesOfDaySelected.filter(times => {
          const [time, minute] = times.split(':');
          const fullTime = Number(`${time}${minute}`);
          return !bookingsTimesFormated.includes(fullTime);
        });

        let arrayfiltered = timesOfDaySelected.filter(nameDay => nameDay.length != 3);
        
        setHorariosDiaSelecionado(arrayfiltered);
    }
  } else {
    setHorariosDiaSelecionado(['null']); // Define como null se o dia selecionado não estiver no objeto
  }
};

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
    setSelectedDate('')
    setTimeSelected('')
    setHorariosDiaSelecionado(null)
  },[professionalId])

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

//=================== Function to make booking ===================
const [messageConfirmedBooking, setMessageConfirmedBooking] = useState('');

const makeBooking = () =>{
  if(userId && barbeariaId && professionalId && serviceId && selectedDate && timeSelected && formattedDate){
    //Passando todos os horários que serão ocupados pelo serviço selecionado
    let timeSelected = timesBusyByService.join(',');
    //Object to agroup all informations to make a new booking
    const newBooking = {
      userId,
      barbeariaId,
      professionalId,
      serviceId,
      selectedDate,
      timeSelected,
      formattedDate
    }

    axios.post('https://api-user-barbeasy.up.railway.app/api/create-booking/', newBooking)
    .then(res => {
      if(res.data.Success === 'Success'){
        setMessageConfirmedBooking("Seu agendamento foi realizado com sucesso!")
        setTimeout(() => {
          setMessageConfirmedBooking('');
          window.location.reload()
        }, 3000);
      }

    }).catch(error => {
      console.error('Erro ao buscar informações da agenda da barbearia', error)
    })
  }
}
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
                className={`dayWeekCurrent ${selectedDate === `${dayOfWeek}, ${numberDays[index].number} de ${numberDays[index].month} de ${year}` ? 'selectedDay' : ''} ${numberDays[index].isCurrentDay ? 'currentDay' : ''}`}
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
    {selectedDate &&(
    <div className="tittle">
       <div style={{marginTop: '15px'}}>
        Horários Disponíveis
      </div>
    </div>
      
    )}
    <div className="container__horarios">
      {renderHorariosDiaSelecionado()}
    </div>
    {messageConfirmedBooking === 'Seu agendamento foi realizado com sucesso!' ?(
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
    <button onClick={makeBooking} className={`Btn__ocult ${serviceId && selectedDate && timeSelected ? 'AgendamentoButton': ''}`}>Finalizar Agendamento</button>
  </>
  );
}