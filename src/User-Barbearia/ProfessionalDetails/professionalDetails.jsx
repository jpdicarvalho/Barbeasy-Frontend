import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import axios from 'axios';
import { AddNewService } from "../AddNewService/addNewService";
import './professionalDetails.css';

//Icons
import { IoArrowBackSharp } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { BsCalendar2Day } from "react-icons/bs";
import { TbClockHour4 } from "react-icons/tb";
import { MdOutlineDone } from "react-icons/md";
import { VscError } from "react-icons/vsc";
import { CiAlarmOff } from "react-icons/ci";

const monthNames = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Aug', 'Set', 'Out', 'Nov', 'Dez'
];

const weekNames = [
  'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
];

function ProfessionalDetails (){

const urlApi = 'https://barbeasy.up.railway.app'

const navigate = useNavigate();
const location = useLocation();

const token = localStorage.getItem('token');

const { professional } = location.state;
const professionalId = professional.id;
const firstLetter = professional.name.charAt(0).toUpperCase();

//Buscando informações da Barbearia logada
const userData = localStorage.getItem('dataBarbearia');//Obtendo os dados salvo no localStorage
const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
const barbeariaId = userInformation.barbearia[0].id;

//passando os dados do profissional selecionado
const handleBackClick = () => {
  navigate("/ProfileBarbearia");
};

/*----------------------------------*/
const [mostrarDiasSemana, setMostrarDiasSemana] = useState(false);
const [daysWeekSelected, setDaysWeekSelected] = useState([]);
const [QntDaysSelected, setQntDaysSelected] = useState([]);
const [agenda, setAgenda] = useState([]);
const [fullAgenda, setFullAgenda] = useState([]);
const [daysFromAgenda, setDaysFromAgenda] = useState([]);
const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const [messageAgenda, setMessageAgenda] = useState('');

  //function to get full professional agenda
  //Obtendo os dados da agenda do barbearia atual e do profissional selecionado
  const getFullAgenda = () =>{
    axios.get(`${urlApi}/api/v1/allProfessionalAgenda/${barbeariaId}/${professionalId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if(res.status === 200){
        setFullAgenda(res.data.Agenda)
      }
    }).catch(error => {
      console.error('Erro ao buscar informações da agenda da barbearia', error)
    })
  }

  //Chamando a função para obter os dados da agenda da barbearia
  useEffect(() => {
    getFullAgenda()
  }, [barbeariaId, professionalId])
  // Função para remover todos os dias definidos por outras barbearias, da lista de definição de dias de trabalho da barbearia atual
  const filterDaysFullAgenda = (fullAgenda) => {
    // Usando um Set para armazenar dias únicos
    const uniqueDaysSet = new Set();
    
    // Iterando sobre cada objeto dentro de fullAgenda
    fullAgenda.forEach(item => {
        // Separando os dias por vírgula e adicionando ao Set
        item.dias.split(',').forEach(dia => uniqueDaysSet.add(dia.trim()));
    });

    // Convertendo o Set de dias únicos para um array
    const daysFromFullAgenda = Array.from(uniqueDaysSet);
    const daysFiltreded = diasSemana.filter(elemento => !daysFromFullAgenda.includes(elemento));
    
    return daysFiltreded;
  }
  const daysCurrentBarbearia = filterDaysFullAgenda(fullAgenda);

  //Função para obter os dias definidos por outras barbearias
  const filterDaysFromAnotherBarbearias = (fullAgenda) => {
    // Usando um Set para armazenar dias únicos
    const uniqueDaysSet = new Set();
    
    // Iterando sobre cada objeto dentro de fullAgenda
    fullAgenda.forEach(item => {
        // Separando os dias por vírgula e adicionando ao Set
        item.dias.split(',').forEach(dia => uniqueDaysSet.add(dia.trim()));
    });

    // Convertendo o Set de dias únicos para um array
    const daysFromFullAgenda = Array.from(uniqueDaysSet);    
    return daysFromFullAgenda;
  }
  const daysAnotherBarbearia = filterDaysFromAnotherBarbearias(fullAgenda);

  //Mostrando a div com os inputs Cheked
  const alternarDiasTrabalho = () => {
    setMostrarDiasSemana(!mostrarDiasSemana);
  };

  //Obtendo os valores selecionados pelo usuário
  const handleCheckboxChange = (dia) => {
    if (daysWeekSelected.includes(dia)) {
      // Se o dia já estiver selecionado, remova-o
      setDaysWeekSelected(daysWeekSelected.filter((selectedDia) => selectedDia !== dia));
    } else {
      // Se o dia não estiver selecionado, adicione-o
      setDaysWeekSelected([...daysWeekSelected, dia]);
    }
  };


  //Passando os valores para o input Dias da Semanas
  const Checkbox = ({ dia }) => {
    return (
      <>
        <input
          type="checkbox"
          id={dia}
          checked={daysWeekSelected.includes(dia)}
          onChange={() => handleCheckboxChange(dia)}
          className="days-switch" 
        />
        <label htmlFor={dia} className="switch">
          <span className="slider"></span>
        </label>
      </>
    );
  };

  //Passando os valores para o input Quantidade de dias
  const CheckboxQntDias = ({ value }) => {
    return (
      <>
        <input
          type="checkbox"
          id={value}
          checked={QntDaysSelected === value}
          onChange={() => {
            if (QntDaysSelected === value) {
              // Se a opção já estiver selecionada, desmarque-a
              setQntDaysSelected('');
            } else {
              // Caso contrário, selecione a opção
              setQntDaysSelected(value);
            }
          }}
          className="days-switch"
        />
        <label htmlFor={value} className="switch">
          <span className="slider"></span>
        </label>
      </>
    );
  };

  //Cadastrando os valores na agenda da barbearia
  const updateAgenda = () =>{
    axios.put(`${urlApi}/api/v1/updateAgenda/${barbeariaId}/${professionalId}`, {daysWeek: daysWeekSelected, qntDays: QntDaysSelected}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if(res.data.Success === 'Success'){
        setMessageAgenda("Sua agenda foi atualizada! Lembre-se de ajustar seus horários de trabalho.")
        setTimeout(() => {
          setMessageAgenda('');
          getAgenda()
          setMostrarDiasSemana(!mostrarDiasSemana);
        }, 5000);
      }
    }).catch(error => {
      setMessageAgenda("Não foi possível atualizar sua agenda.")
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessageAgenda('');
          window.location.reload();
        }, 3000);
      console.error('erro ao atualizar a agenda', error)
    })
  }
  
  //Obtendo os dados da agenda do barbearia atual e do profissional selecionado
  const getAgenda = () =>{
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

  //Chamando a função para obter os dados da agenda da barbearia
  useEffect(() => {
    getAgenda()
  }, [barbeariaId, professionalId])

  useEffect(() => {
    if (Array.isArray(agenda) && agenda.length >= 2) {
      setDaysFromAgenda(agenda[0].split(','));
      setQntDaysSelected(agenda[1].toString());
    }
  }, [agenda]);
  
  useEffect(() => {
    setDaysWeekSelected(daysFromAgenda);
  }, [daysFromAgenda]);
  
/*-------------------------------------------*/
const [mostrarHorario, setMostrarHorario] = useState(false);
const [diaSelecionado, setDiaSelecionado] = useState(null);
const [HorarioFuncionamento, setHorarioFuncionamento] = useState([]);
const [horarioDefinido, setHorarioDefinido] = useState([]);
const [agendaDoDiaSelecionado, setAgendaDoDiaSelecionado] = useState([]);

//Array to storage de days from agenda formated
const newArray = [];

//Declaração do array de horários padronizados
const [timesDays, setTimesDays] = useState('');

const [messageAgendaHorarios, setMessageAgendaHorarios] = useState('');

//Função para alternar o estado de 'mostrarHorario' (variável booleana), responsável por mostrar os horários a serem definidos
const alternarHorario = () => {
  setMostrarHorario(!mostrarHorario);
};

//Função responsável por atualizar o estado 'diaSelecionado' com o dia que foi selecionado.
const handleDiaClick = (dia) => {
  setDiaSelecionado(dia);
};

// Função responsável por gerar uma lista de horários com base no horário de início, término e intervalo fornecidos como parâmetros.
function generateHorarios(inicio, termino, intervalo) {
  // Array para armazenar os horários gerados
  const horarios = [];
  // Inicializa a hora atual com o horário de início
  let horaAtual = inicio;

  // Loop para gerar os horários até alcançar o horário de término
  while (horaAtual <= termino) {
      // Adiciona o horário atual ao array de horários
      horarios.push(horaAtual);

      // Calcula o total de minutos
      const totalMinutos = parseInt(horaAtual.substring(0, 2)) * 60 + parseInt(horaAtual.substring(3)) + intervalo;
      // Calcula a nova hora e os novos minutos com base no total de minutos
      const novaHora = Math.floor(totalMinutos / 60).toString().padStart(2, '0');
      const novosMinutos = (totalMinutos % 60).toString().padStart(2, '0');
      // Atualiza a hora atual para o próximo horário
      horaAtual = `${novaHora}:${novosMinutos}`;
  }
  // Retorna a lista de horários gerados
  return horarios;
}

//Esta linha gera os horários com base nos parâmetros fornecidos
const horarios = generateHorarios('07:30', '22:30', 15);

// Função responsável por adicionar ou remover o horário selecionado
const handleHorarioFuncionamento = (horario) => {
  // Verifica se já existem dois horários selecionados e se o horário clicado não está entre eles
  if (HorarioFuncionamento.length === 2 && !HorarioFuncionamento.includes(horario)) {
      // Caso positivo, não faz nada e retorna
      return;
  }
  
  // Verifica se o horário já está selecionado
  if (HorarioFuncionamento.includes(horario)) {
      // Se o horário já estiver selecionado, remove-o da seleção
      setHorarioFuncionamento(HorarioFuncionamento.filter(item => item !== horario));
  } else {
      // Se o horário não estiver selecionado, adiciona-o à seleção
      setHorarioFuncionamento([...HorarioFuncionamento, horario]);
  }
};

// Função para remover horários do array horarioDefinido
const handleIntervalo = (horario) => {
  // Verifica se o horário já está presente no array horarioDefinido
  if (horarioDefinido.includes(horario)) {
      // Se estiver presente, remove-o da seleção
      const novosIntervalos = horarioDefinido.filter(item => item !== horario);
      setHorarioDefinido(novosIntervalos);
  } else {
      // Se não estiver presente, adiciona-o à seleção
      setHorarioDefinido([...horarioDefinido, horario]);
  }
};

// Função para gerar o período de funcionamento
const handleHorariosDefinidos = () => {
  // Verifica se os horários de funcionamento e o tempo de atendimento estão definidos
  if (HorarioFuncionamento) {      
      // Gera os horários definidos com base no horário de funcionamento, tempo de atendimento e intervalo
      const horariosDefinido = generateHorarios(HorarioFuncionamento[0], HorarioFuncionamento[1], 15);
      
      // Define os horários definidos
      return setHorarioDefinido(horariosDefinido);
  }
};

//Função para adicionar o dia selecionado e o horario definido a um novo array
const diaSelecionadoFormat = () => {
  //Adicionando o dia da semana selecionado no array de horários
  horarioDefinido.unshift(diaSelecionado);
  
  // Filtra o array horarioDefinido para remover duplicatas e armazena o resultado em uniqueArray
  let uniqueArray = horarioDefinido.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });

  //Função para formatar o nome do dia da semana
  if(uniqueArray[0]){
    uniqueArray[0] = uniqueArray[0].substring(0, 3); // Limita a string para três letras
    uniqueArray[0] = uniqueArray[0].charAt(0).toUpperCase() + uniqueArray[0].slice(1); // Transforma a primeira letra em maiúscula
    return setAgendaDoDiaSelecionado(uniqueArray);
  }
};

//Função para configurar a agenda de horários do dia selecionado
const configAgendaDiaSelecionado = () => {
  if (agendaDoDiaSelecionado && agendaDoDiaSelecionado.length > 1) {
    for (let i = 0; i < agendaDoDiaSelecionado.length; i++) {
      if (agendaDoDiaSelecionado[i] && agendaDoDiaSelecionado[i].length > 5) {
          let arrayClear = agendaDoDiaSelecionado.splice(agendaDoDiaSelecionado[i], 1);
          return setAgendaDoDiaSelecionado(arrayClear);
      }
    }
  }
};

//Função para salvar os horários definidos para o dia selecionado
const salvarHorariosDiaSelecionado = () =>{
  let strAgendaDiaSelecionado = agendaDoDiaSelecionado.join(',');
  
  axios.put(`${urlApi}/api/v1/updateAgendaDiaSelecionado/${barbeariaId}/${professionalId}`, {StrAgenda: strAgendaDiaSelecionado}, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
  })
  .then(res => {
    if(res.data.Success === 'Success'){
      setMessageAgendaHorarios("Horários Salvos com Sucesso.")
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessageAgendaHorarios('');
          getHorariosDefinidos()
          setDiaSelecionado(null);
          setHorarioFuncionamento('')
        }, 3000);
    }
  }).catch(error => {
    setMessageAgendaHorarios("Erro ao Salvar Horários, tente novamente mais tarde.")
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessageAgendaHorarios('');
          window.location.reload();
        }, 3000);
  })
}

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

useEffect(() => {
  getHorariosDefinidos()
}, [timesDays])

//Function to format days from Agenda
const functionFormatDaysFromAgenda = () => {
  let newIndex = '';
  for(let i=0; i < daysFromAgenda.length; i++){
    newIndex = daysFromAgenda[i].substring(0, 3);
    newIndex = newIndex.toLowerCase();
    if(newIndex === 'sáb'){
      newIndex = 'sab'
    }
    newArray.push(newIndex);
  }
  return newArray;
}

//Função para salvar os horários definidos para todos os dias
const salvarHorariosTodosOsDias = () =>{
  //função que executa a formatação dos dias a serem padronizados
  functionFormatDaysFromAgenda();
  
  //removing the index from the array as it contains the name of the selected day
  agendaDoDiaSelecionado.shift();
  let strHorariosTodosOsDias = agendaDoDiaSelecionado.join(',');

  axios.put(`${urlApi}/api/v1/updateHorariosTodosOsDias/${barbeariaId}/${professionalId}`, {StrAgenda: strHorariosTodosOsDias, NamesDaysFormated: newArray}, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
  })
  .then(res => {
    if(res.data.Success === 'Success'){
      setMessageAgendaHorarios("Horários Salvos com Sucesso.")
        // Limpar a mensagem após 3 segundos (2000 milissegundos)
        setTimeout(() => {
          setMessageAgendaHorarios('');
          getHorariosDefinidos()
          setDiaSelecionado(null);
          setHorarioFuncionamento('')
        
        }, 2000);
    }
  }).catch(error => {
    setMessageAgendaHorarios("Erro ao Salvar Horários, tente novamente mais tarde.")
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessageAgendaHorarios('');
          window.location.reload()
        }, 3000);
  })
}

// useEffect para gerar automaticamente os horários de funcionamento
useEffect(() => {
  // Configura um timeout para executar handleHorariosDefinidos após 1 segundo
  const timeout = setTimeout(() => {
      handleHorariosDefinidos();
  }, 1000);
  
  // Retorna uma função de limpeza para limpar o timeout
  return () => clearTimeout(timeout);
}, [HorarioFuncionamento]);

// useEffect para configurar a agenda do dia selecionado
useEffect(() => {
  // Executa diaSelecionadoFormat sempre que horarioDefinido ou diaSelecionado mudarem
  diaSelecionadoFormat();
}, [horarioDefinido, diaSelecionado]);

// useEffect para configurar a agenda do dia selecionado
useEffect(() => {
  // Executa diaSelecionadoFormat sempre que horarioDefinido ou diaSelecionado mudarem
  configAgendaDiaSelecionado();
}, [agendaDoDiaSelecionado]);

//Função para renderizar os horários definidos do dia selecionado
const getHorariosPorDia = (dia) => {
  //Deixando apenas as três primeiras letras do dia selecionado
  let nameDayFormated = dia.substring(0, 3);
  //Buscando no objeto, os horários do dia selecionado
  let arrayWithTimes = timesDays[nameDayFormated]
  //separando a string de horários por vírgula
  arrayWithTimes = arrayWithTimes.split(',');

  //Renderizando o horário do dia selecionado
  if (arrayWithTimes && arrayWithTimes.length > 0) {
    return arrayWithTimes.map((horario, index) => (
      <div className="horario-item" key={`${dia}-${index}`}>
        <p>{horario}</p>
      </div>
    ));
  } else {
    return <p>Não há horários definidos para este dia.</p>;
  }
};


// Função para remover os horários de trabalho dos dias de outras barbearias
const freeTimeFromOtherDays = (diaSelecionado, horarios, fullAgenda) => {
  // Formatar o nome do dia selecionado
  let nameDayFormated = diaSelecionado.substring(0, 3).toLowerCase();

  // Conjunto para armazenar horários a serem removidos
  let timesToRemove = new Set();

  // Iterar sobre cada objeto na fullAgenda
  fullAgenda.forEach(item => {
      if (item[nameDayFormated]) {
          // Separar horários por vírgula e adicionar ao conjunto
          item[nameDayFormated].split(',').forEach(time => timesToRemove.add(time.trim()));
      }
  });

  // Filtrar os horários removendo aqueles que estão no conjunto
  let availableTimes = horarios.filter(horario => !timesToRemove.has(horario));
  //availableTimes
  return availableTimes.map((horario, index) => (
    <div className="horario-item" key={`${diaSelecionado}-${index}`}>
      <p>{horario}</p>
    </div>
  ));
};

/*======================Calendário===========================*/
const [showCalendar, setShowCalendar] = useState(false);
const [showButtonSaveDayOff, setButtonSaveDayOff] = useState(false);
const [selectedDay, setSelectedDay] = useState(null);
const [horariosDiaSelecionado, setHorariosDiaSelecionado] = useState([]); // Estado para os horários do dia selecionado
const [timesLockedByProfessional, setTimesLockedByProfessional] = useState([]);

const [messageSaveDayOff, setMessageSaveDayOff] = useState('');

const date = new Date();
const options = { weekday: 'short', locale: 'pt-BR' };
let dayOfWeek = date.toLocaleDateString('pt-BR', options);
dayOfWeek = dayOfWeek.slice(0, -1);
dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
const year = date.getFullYear();

//Função para mostra calendario
const alternarCalendar = () => {
  setShowCalendar(!showCalendar);
};
//Função para mostra calendario
const closeButtonSaveDayOff = () => {
  setButtonSaveDayOff(false);
};

//Função para mostra calendario
const openButtonSaveDayOff = () => {
  setButtonSaveDayOff(true);
};

//Função para pegar os dias da semana
function getWeeks() {
  const arrayWeeks = [];
  const startIndex = weekNames.indexOf(dayOfWeek);
  const lastDayToShow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 30);

  for (let i = 0; i < 30; i++) {
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
  const lastDayToShow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 30);

  for (let i = 0; i < 30; i++) {
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

// Função para criar um array com os horários fechados pelo usuário
const handleDayOff = (time) => {
  // Verifica se o horário já está presente no array horarioDefinido
  if (timesLockedByProfessional.includes(time)) {
      // Se estiver presente, remove-o da seleção
      const novosIntervalos = timesLockedByProfessional.filter(item => item !== time);
      setTimesLockedByProfessional(novosIntervalos);
  } else {
      // Se não estiver presente, adiciona-o à seleção
      setTimesLockedByProfessional([...timesLockedByProfessional, time]);
  }
};

//Function close all times of especific day
const closeAllTimes = () => {
  setTimesLockedByProfessional(horariosDiaSelecionado)
}
//Function to render all times defined
const renderHorariosDiaSelecionado = () => {
  return (
    <>
        {horariosDiaSelecionado && (
          horariosDiaSelecionado.map(index => (
            <div key={index} className={`horarios ${timesLockedByProfessional.includes(index) ? 'selectedDay':''}`} onClick={() =>{ handleDayOff(index); closeButtonSaveDayOff();}}>
               <p>{index}</p>
            </div>
          ))
        )}
      </>
  );
};

//Função para salvar o folga do profissional
const saveDayOff = () =>{
  if(barbeariaId && professionalId && selectedDay && timesLockedByProfessional){
    let timesLocked = timesLockedByProfessional.join(',');
    const objectDayOff = {
      selectedDay,
      timesLocked
    }
    axios.put(`${urlApi}/api/v1/updateDayOff/${barbeariaId}/${professionalId}`, objectDayOff, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res =>{
      if(res.data.Success === 'Success'){
        setMessageSaveDayOff("Folga salva com sucesso!")
        setTimeout(() => {
          setMessageSaveDayOff(null);
          setTimesLockedByProfessional([])
          setSelectedDay(null)
          window.location.reload()
        }, 2000);
      }
    }).catch(err =>{
      console.error("Error ao salva folga", err)
    })
  }
} 
return (
    <div className="main__professional">
    <div className="container__professional">
        <div key={professional.id} className="header__professional">
          <div className="back" onClick={handleBackClick}>
          <IoArrowBackSharp className="Icon__Back"/>
          </div>

            <div className="Box__image  Box__first__letter">
                <p className='firstLetter__professional'>{firstLetter}</p>
            </div>
            <p className='name__professional'>{professional.name}</p>
        </div>

        <div className="container__menu">
        <div className="menu__main" onClick={alternarDiasTrabalho}>
          <BsCalendar2Day className='icon_menu'/>
            Definir Dias de Trabalho
            <IoIosArrowDown className={`arrow ${mostrarDiasSemana ? 'girar' : ''}`} id='arrow'/>
        </div>
          
        {mostrarDiasSemana && (
        <div className="divSelected">
          {messageAgenda === 'Sua agenda foi atualizada! Lembre-se de ajustar seus horários de trabalho.' ?(
            <div className="mensagem-sucesso">
              <MdOutlineDone className="icon__success"/>
              <p className="text__message">{messageAgenda}</p>
            </div>
            ) : (
            <div className={` ${messageAgenda ? 'mensagem-erro' : ''}`}>
              <VscError className={`hide_icon__error ${messageAgenda ? 'icon__error' : ''}`}/>
              <p className="text__message">{messageAgenda}</p>
            </div>
            )}
  
        <p className='information__span'>Selecione os dias da semana em que deseja trabalhar:</p>
        {daysCurrentBarbearia.map((dia, index) => (
          <div className="container__checkBox" key={index}>
            <span className={daysWeekSelected.includes(dia) ? 'defined__day' : ''}>{dia}</span>
            <Checkbox dia={dia} />
          </div>
        ))}

        <p className='information__span'>Escolha a quantidade de dias a serem disponibilizados para agendamento:</p>
        <div className="container__checkBox">
          <span className={QntDaysSelected === '7' ? 'selectedOption' : ''}>Próximos 7 dias</span>
          <CheckboxQntDias value="7" />
        </div>
        <div className="container__checkBox">
          <span className={QntDaysSelected === '15' ? 'selectedOption' : ''}>Próximos 15 dias</span>
          <CheckboxQntDias value="15" />
        </div>
        <div className="container__checkBox">
          <span className={QntDaysSelected === '30' ? 'selectedOption' : ''}>Próximos 30 dias</span>
          <CheckboxQntDias value="30" />
        </div>
        <button className={`button__change ${QntDaysSelected.length > 0 && daysWeekSelected.length > 0 ? 'show' : ''}`} onClick={updateAgenda}>
          Alterar
        </button>

      </div>
        )}

<hr className='hr_menu'/>

      <div className="menu__main" onClick={alternarHorario}>
          <TbClockHour4 className='icon_menu'/>
            Definir Horários de Trabalho
          <IoIosArrowDown className={`arrow ${mostrarHorario ? 'girar' : ''}`} id='arrow'/>
      </div>

      {mostrarHorario && (
            <div className="divSelected">
              <p className='information__span'>Defina seus horários de funcionamento para cada dia definido anteriormente:</p>
              {daysFromAgenda.length === 0 ? (
                <p style={{textAlign: 'center', marginTop: '10px'}}>Nenhum dia selecionado</p>
              ) : (
                daysFromAgenda.map(day => (
                  <div key={day} className='Dias_Trabalho_Rapido'>
                    <div className='Dias_Semana' onClick={() => handleDiaClick(day)}>{day}
                      {diaSelecionado === day && (
                        <div><p className='information__span'>Defina o seu horário de funcionamento:</p>
                          <div className="inputs-horarios">
                            {horarios.map((horario, index) => (
                                <div
                                    key={index}
                                    className={`horario-item ${HorarioFuncionamento.includes(horario) ? 'Horario-selecionado' : ''}`}
                                    onClick={() => handleHorarioFuncionamento(horario)}
                                >
                                    <p>{horario}</p>
                                </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {diaSelecionado === day && (
                          <div>
                              <p className='information__span'>Horários já definidos para esse dia:</p>
                              <div className="inputs-horarios">
                                  {getHorariosPorDia(day)}
                              </div>
                          </div>
                      )}
                      {diaSelecionado === day && agendaDoDiaSelecionado.length > 2 && (
                        <div>
                          <p className='information__span'>Deseja remover algum horário?</p>
                          <div className="inputs-horarios">
                              {agendaDoDiaSelecionado.map((value, index) => (
                              // Comece a partir do índice 1
                                index > 0 && (
                                  <div
                                      key={index}
                                      className={`horario-item ${agendaDoDiaSelecionado.includes(value) ? 'Horario-selecionado' : ''}`}
                                      onClick={() => handleIntervalo(value)}
                                  >
                                      <p>{value}</p>
                                      
                                  </div>
                                )
                              ))}
                          </div>

                          {messageAgendaHorarios === 'Horários Salvos com Sucesso.' ?(
                            <div className="mensagem-sucesso">
                              <MdOutlineDone className="icon__success"/>
                              <p className="text__message">{messageAgendaHorarios}</p>
                            </div>
                            ) : (
                            <div className={` ${messageAgendaHorarios ? 'mensagem-erro' : ''}`}>
                              <VscError className={`hide_icon__error ${messageAgendaHorarios ? 'icon__error' : ''}`}/>
                              <p className="text__message">{messageAgendaHorarios}</p>
                            </div>
                          )}
          
                          <div className="container_button">
                            <button className="add_Service" onClick={salvarHorariosDiaSelecionado}>Salvar</button>
                            <button className="add_Service" onClick={salvarHorariosTodosOsDias}>Salvar para todos os outros dias</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div>
                <p className='information__span'>Dias definidos por outras barbearias com horários disponíveis::</p>
                {daysAnotherBarbearia.map(day => (
                  <div key={day} className='Dias_Trabalho_Rapido'>
                    <div className='Dias_Semana' onClick={() => handleDiaClick(day)}>{day}
                      {diaSelecionado === day && (
                        <div><p className='information__span'>Defina o seu horário de funcionamento:</p>
                          <div className="inputs-horarios">
                            {freeTimeFromOtherDays(diaSelecionado, horarios, fullAgenda)}
                          </div>
                        </div>
                      )}
                      {diaSelecionado === day && (
                          <div>
                              <p className='information__span'>Horários já definidos para esse dia:</p>
                              <div className="inputs-horarios">
                                  {getHorariosPorDia(day)}
                              </div>
                          </div>
                      )}
                      {diaSelecionado === day && agendaDoDiaSelecionado.length > 2 && (
                        <div>
                          <p className='information__span'>Deseja remover algum horário?</p>
                          <div className="inputs-horarios">
                              {agendaDoDiaSelecionado.map((value, index) => (
                              // Comece a partir do índice 1
                                index > 0 && (
                                  <div
                                      key={index}
                                      className={`horario-item ${agendaDoDiaSelecionado.includes(value) ? 'Horario-selecionado' : ''}`}
                                      onClick={() => handleIntervalo(value)}
                                  >
                                      <p>{value}</p>
                                      
                                  </div>
                                )
                              ))}
                          </div>

                          {messageAgendaHorarios === 'Horários Salvos com Sucesso.' ?(
                            <div className="mensagem-sucesso">
                              <MdOutlineDone className="icon__success"/>
                              <p className="text__message">{messageAgendaHorarios}</p>
                            </div>
                            ) : (
                            <div className={` ${messageAgendaHorarios ? 'mensagem-erro' : ''}`}>
                              <VscError className={`hide_icon__error ${messageAgendaHorarios ? 'icon__error' : ''}`}/>
                              <p className="text__message">{messageAgendaHorarios}</p>
                            </div>
                          )}
          
                          <div className="container_button">
                            <button className="add_Service" onClick={salvarHorariosDiaSelecionado}>Salvar</button>
                            <button className="add_Service" onClick={salvarHorariosTodosOsDias}>Salvar para todos os outros dias</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
      )}

<hr className='hr_menu'/>

          <AddNewService professionalId={professionalId}/>

<hr className='hr_menu'/>

          <div className="menu__main" onClick={alternarCalendar} style={{marginBottom: '15px'}}>
            <CiAlarmOff className='icon_menu'/>
              Definir Folga
            <IoIosArrowDown className={`arrow ${showCalendar ? 'girar' : ''}`} id='arrow'/>
          </div>

          {showCalendar && (
            <p className="information__span">Selecione o dia que deseja folgar:</p>
          )}

          {showCalendar &&(
            <div className='container__Calendar'>
            <div className='sectionCalendar'>
                <div className="list__Names__Week__And__Day">
                {weekDays.map((dayOfWeek, index) => (
                    <div key={`weekDay-${index}`} className="list__name__Week">
                      <div
                        className={`dayWeekCurrent ${selectedDay === `${dayOfWeek}, ${numberDays[index].number} de ${numberDays[index].month} de ${year}` ? 'selectedDay' : ''} ${numberDays[index].isCurrentDay ? 'currentDay' : ''}`}
                        onClick={() => {handleDateClick(dayOfWeek, numberDays[index].number, numberDays[index].month, year); closeButtonSaveDayOff()}}
                      >
                        <p className='Box__day'>{dayOfWeek}</p>
                        <p className='Box__NumDay'>{numberDays[index].number}</p>
                        <p className='Box__month'>{numberDays[index].month}</p>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
            <div className="times">
              {selectedDay && (
                <div className="tesste">
                  <p className="information__span">Selecione os horários que deseja fechar:</p>
                </div>
              )}

              {selectedDay && (
                <div className="section__times">
                  {renderHorariosDiaSelecionado()}
                </div>
              )}
            </div>
            {messageSaveDayOff === "Folga salva com sucesso!" ? (
                    <div className="mensagem-sucesso">
                      <MdOutlineDone className="icon__success"/>
                      <p className="text__message">{messageSaveDayOff}</p>
                    </div>
                      ) : (
                      <div className={` ${messageSaveDayOff ? 'mensagem-erro' : ''}`}>
                        <VscError className={`hide_icon__error ${messageSaveDayOff ? 'icon__error' : ''}`}/>
                        <p className="text__message">{messageSaveDayOff}</p>
                    </div>
              )}
              {selectedDay && (
                <button className={`button__change ${showButtonSaveDayOff === false ? 'show':''}`} onClick={closeAllTimes}>Fechar todos os horários</button>
              )}
              <button className={`button__change ${timesLockedByProfessional.length >= 1 && showButtonSaveDayOff === false ? 'show':''}`} onClick={openButtonSaveDayOff}>Continuar</button>
              <button className={`button__change ${showButtonSaveDayOff === true ? 'show':''}`} onClick={saveDayOff}>Salvar</button>

            </div>
          )}
        </div>
        
    </div>
  </div>
    )
}
export default ProfessionalDetails
