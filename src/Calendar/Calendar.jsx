import './Calendar.css';
import { useState } from 'react';
import PropTypes from 'prop-types';

const monthNames = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Aug', 'Set', 'Out', 'Nov', 'Dez'
];

const weekNames = [
  'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
];

export function Calendar({ onDateChange }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDateInfo, setSelectedDateInfo] = useState('');

  const date = new Date();
  const options = { weekday: 'short', locale: 'pt-BR' };
  let dayOfWeek = date.toLocaleDateString('pt-BR', options);
  dayOfWeek = dayOfWeek.slice(0, -1);
  dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  const year = date.getFullYear();
  const month = date.getMonth();
  const nameMonth = monthNames[month];

  function getWeeks() {
    const arrayWeeks = [];
    const startIndex = weekNames.indexOf(dayOfWeek);
    const lastDayToShow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 15);

    for (let i = 0; i < 15; i++) {
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
    const lastDayToShow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 15);

    for (let i = 0; i < 15; i++) {
      const currentDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + i);

      if (currentDay <= lastDayToShow) {
        const numberWeek = currentDay.getDate();
        const isCurrentDay = currentDay.toDateString() === date.toDateString();

        numbersWeek.push({
          number: numberWeek,
          isCurrentDay: isCurrentDay,
        });
      }
    }

    return numbersWeek;
  }

  const weekDays = getWeeks();
  const numberDays = getNumber();

  const handleDateClick = (day, dayOfWeek) => {
    setSelectedDay(day);
    setSelectedDateInfo(`${dayOfWeek}, ${day}`);
    if (onDateChange) {
      onDateChange(`${dayOfWeek}, ${day}`);
    }
  };

  Calendar.propTypes = {
    onDateChange: PropTypes.func,
  };

  return (
    <div className='container__Calendar'>
      <h1 className="month">{nameMonth}</h1>
      <h2 className="year">{year}</h2>

      <div className='sectionCalendar'>
        <div className="list__Names__Week__And__Day">
          {weekDays.map((dayOfWeek, index) => (
            <div key={`weekDay-${index}`} className="list__name__Week">
              <p
                className={`dayWeekCurrent ${selectedDateInfo === `${dayOfWeek}, ${numberDays[index].number}` ? 'selectedDay' : ''} ${numberDays[index].isCurrentDay ? 'currentDay' : ''}`}
                onClick={() => handleDateClick(numberDays[index].number, dayOfWeek)}
              >
                {`${dayOfWeek} ${numberDays[index].number}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
