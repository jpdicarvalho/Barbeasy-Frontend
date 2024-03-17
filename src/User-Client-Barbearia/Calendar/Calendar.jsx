import './Calendar.css';
import { useState } from 'react';
import PropTypes from 'prop-types';

const monthNames = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Aug', 'Set', 'Out', 'Nov', 'Dez'
];

const weekNames = [
  'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
];

export function Calendar({ onDateChange, timeSelected, QntDaysSelected, timesDays }) {
  const [timeclicked, setTimeclicked] = useState(null);
  const [selectedDateInfo, setSelectedDateInfo] = useState('');
  const [horariosDiaSelecionado, setHorariosDiaSelecionado] = useState([]); // Estado para os horários do dia selecionado

  const date = new Date();
  const options = { weekday: 'short', locale: 'pt-BR' };
  let dayOfWeek = date.toLocaleDateString('pt-BR', options);
  dayOfWeek = dayOfWeek.slice(0, -1);
  dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  const year = date.getFullYear();
 

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
    setSelectedDateInfo(`${dayOfWeek}, ${day} de ${month} de ${year}`);
    if (onDateChange) {
      onDateChange(`${dayOfWeek}, ${day} de ${month} de ${year}`);
    }
  
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

  return (
  <>
    <div className='container__Calendar'>

      <div className='sectionCalendar'>
        <div className="list__Names__Week__And__Day">
        {weekDays.map((dayOfWeek, index) => (
            <div key={`weekDay-${index}`} className="list__name__Week">
              <div
                className={`dayWeekCurrent ${selectedDateInfo === `${dayOfWeek}, ${numberDays[index].number} de ${numberDays[index].month} de ${year}` ? 'selectedDay' : ''} ${numberDays[index].isCurrentDay ? 'currentDay' : ''}`}
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
    {selectedDateInfo &&(
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