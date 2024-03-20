import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import './Calendar.css';
import PropTypes from 'prop-types';

const monthNames = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Aug', 'Set', 'Out', 'Nov', 'Dez'
];

const weekNames = [
  'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
];

export function Calendar({ barbeariaId, professionalId }) {
  const [timeclicked, setTimeclicked] = useState(null);
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



  //Obtendo os dados da agenda da barbearia
  const getAgenda = () =>{
    axios.get(`https://api-user-barbeasy.up.railway.app/api/agenda/${barbeariaId}/${professionalId}`)
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
  }, [professionalId])

  useEffect(() => {
    if (Array.isArray(agenda) && agenda.length >= 2) {
      setQntDaysSelected(agenda[1].toString());
    }
  }, [agenda]);
  
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
}, [agenda, selectedDate])

//Função para selecionar a data escolhida pelo usuário
const handleDateChange = (date) => {
  setSelectedDate(date);
};

//Função para obter o horário de preferência do usuário
const handleTimeSelected = (time) => {
  setTimeSelected(time);
};
 

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

  //Function to get and format selected day from user
  const handleDateClick = (dayOfWeek, day, month, year) => {
    setSelectedDate(`${dayOfWeek}, ${day} de ${month} de ${year}`);
  
    // Verifica se o dia selecionado está no objeto
    if (dayOfWeek in timesDays) {
      let timesOfDaySelected = timesDays[dayOfWeek];
      timesOfDaySelected = timesOfDaySelected.split(',');
      let arrayfiltered = timesOfDaySelected.filter(nameDay => nameDay.length != 3)
      setHorariosDiaSelecionado(arrayfiltered);
    } else {
      setHorariosDiaSelecionado(null); // Define como null se o dia selecionado não estiver no objeto
    }
  };

  const hendleTimeClick = (time) => {
    if (timeSelected) {
      timeSelected(time);
      setTimeclicked(time)
    }
  }
  const renderHorariosDiaSelecionado = () => {
    return (
      <>
        {horariosDiaSelecionado && (
          horariosDiaSelecionado.map(index => (
            <div key={index} className={`horarios ${timeclicked === index ? 'selectedDay':''}`} onClick={() => hendleTimeClick(index)}>
              <p>{index}</p>
            </div>
          ))
        )}
      </>
    );
  };

  Calendar.propTypes = {
    onDateChange: PropTypes.func,
  };
console.log(selectedDate)
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
       <hr />
       <div >
        Horários Disponíveis
      </div>
    </div>
      
    )}
    <div className="container__horarios">
    {renderHorariosDiaSelecionado()}
    </div>
    
  </>
  );
}