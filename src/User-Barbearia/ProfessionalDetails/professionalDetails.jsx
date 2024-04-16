import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import { Agendamento } from "../../User-Client-Barbearia/Agendamento/Agendamento";
import './professionalDetails.css';

//Icons
import { IoArrowBackSharp } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { BsCalendar2Day } from "react-icons/bs";
import { TbClockHour4 } from "react-icons/tb";
import { GiRazor } from "react-icons/gi";
import { RiDeleteBin6Line } from "react-icons/ri";
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

const navigate = useNavigate();
const location = useLocation();

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
const [daysFromAgenda, setDaysFromAgenda] = useState([]);
const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const [messageAgenda, setMessageAgenda] = useState('');

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
    axios.post(`https://api-user-barbeasy.up.railway.app/api/update-agenda/${barbeariaId}/${professionalId}`, {daysWeek: daysWeekSelected, qntDays: QntDaysSelected})
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
  }, [])

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
  
  axios.post(`https://api-user-barbeasy.up.railway.app/api/update-agendaDiaSelecionado/${barbeariaId}/${professionalId}`, {StrAgenda: strAgendaDiaSelecionado})
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
  axios.get(`https://api-user-barbeasy.up.railway.app/api/agendaDiaSelecionado/${barbeariaId}/${professionalId}`)
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

  axios.post(`https://api-user-barbeasy.up.railway.app/api/update-horariosTodosOsDias/${barbeariaId}/${professionalId}`, {StrAgenda: strHorariosTodosOsDias, NamesDaysFormated: newArray})
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

/*===== Functions for all functions ======*/
//Função para mostar o menu Serviço
const [mostrarServico, setMostrarServico] = useState(false);
const [servicos, setServicos] = useState([]);

  //Função para mostra os serviços cadastrados
  const alternarServico = () => {
    setMostrarServico(!mostrarServico);
  };

  //Função para buscar os serviços cadastrados
  const obterServicos = () =>{
    axios.get(`https://api-user-barbeasy.up.railway.app/api/get-service/${barbeariaId}/${professionalId}`)
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

//Função para formartar o preço do serviço
const formatarPreco = (valor) => {
  const numero = valor.replace(/\D/g, ''); // Remove caracteres não numéricos
  const valorFormatado = (Number(numero) / 100).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  return `R$ ${valorFormatado}`;
};
//Função para formartar a taxa de comissão do serviço
const formatarPorcentagem = (valor) => {
  const numero = valor.replace(/\D/g, ''); // Remove caracteres não numéricos
  const valorFormatado = (Number(numero) / 10).toFixed(1).replace('.', ',');
  return `${valorFormatado}%`;
};
/*===== Section to add a new service ======*/
  const [showAddServico, setShowAddServico] = useState(false);

  const [newNameService, setNewNameService] = useState('');
  const [newPriceService, setNewPriceService] = useState('');
  const [newCommissionFee, setNewCommissionFee] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState([]);

  const [messageAddService, setMessageAddService] = useState('');

  //Função para mostar o menu Adicionar Serviço
  
  const ShowAddService = () => {
    setShowAddServico(true);
  };
  
  //Função para fechar o menu Adicionar Serviço
  const fecharExpandir = () => {
    setShowAddServico(false);
  };

  //Função para adicionar o valor do serviço a variável definida
  const AddNewPriceService = (event) => {
    const valor = event.target.value;
    // Filtrar apenas os números
    const numero = valor.replace(/\D/g, '');//Regex para aceitar apenas números no input
    setNewPriceService(formatarPreco(numero));
  };

  //Função para adicionar a taxa de comissão do serviço a variável definida
  const AddNewCommissionFee = (event) =>{
    const valor = event.target.value;
    const numero = valor.replace(/\D/g, '');
    setNewCommissionFee(formatarPorcentagem(numero))
  }

  // Função responsável por adicionar ou remover o novo tempo de duração do serviço a ser cadastrado
  const handleNewServiceDuration = (tempo) => {
  // Verifica se já existem dois tempos selecionados e se o tempo clicado não está entre eles
  if (newServiceDuration.length === 1 && !newServiceDuration.includes(tempo)) {
      // Caso positivo, não faz nada e retorna
      return;
    }

      // Verifica se o tempo já está selecionado
    if (newServiceDuration.includes(tempo)) {
      // Se o tempo já estiver selecionado, remove-o da seleção
      setNewServiceDuration(newServiceDuration.filter(item => item !== tempo));
    } else {
        // Se o tempo não estiver selecionado, adiciona-o à seleção
        setNewServiceDuration([...newServiceDuration, tempo]);
    }
  }

  //Função para cadastrar um novo serviço
  const addNewService = () => {
    // Verifica se os campos obrigatórios estão preenchidos
    if(newNameService && newPriceService && newServiceDuration[0]){
      // Cria um objeto com os dados do serviço a serem enviados
      const newServiceData = {
        newNameService,
        newPriceService,
        newCommissionFee,
        newDuration: newServiceDuration[0]
      };
      let firstService = servicos.length;
      axios.post(`https://api-user-barbeasy.up.railway.app/api/add-service/${barbeariaId}/${professionalId}`, newServiceData)
          .then(res => {
            if (res.data.Success === "Success") {
              setMessageAddService("Serviço adicionado com sucesso.");
              obterServicos()
              setTimeout(() => {
                setMessageAddService(null);
                if(firstService === 0){
                  window.location.reload()
                }
                setNewNameService('')
                setNewPriceService('')
                setNewServiceDuration('')
                fecharExpandir()
              }, 2000);
              
            }
          })
          .catch(err => {
            setMessageAddService("Erro ao adicionar serviço!");

            setTimeout(() => {
              setMessageAddService(null);
              setShowAddServico(false);
              }, 3000);
            console.error(err);
          });
    }else{
      setMessageAddService("Preencha todos os campos.");
        setTimeout(() => {
          setMessageAddService(null);
        }, 3000);
    }
  };

  // Adiciona um event listener para detectar cliques fora da div expandir
  useEffect(() => {
    const handleOutsideClick = (event) => {
      const expandirDiv = document.querySelector('.expandir');

      if (expandirDiv && !expandirDiv.contains(event.target)){
        fecharExpandir();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    // Remove o event listener quando o componente é desmontado
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

/*===== Section to edit a current service ======*/
//Função para mostar o menu de edição de um serviço
  const [selectedService, setSelectedService] = useState(null);

  const [editedServiceName, setEditedServiceName] = useState('');
  const [editedServicePrice, setEditedServicePrice] = useState('');
  const [editedCommissionFee, setEditedCommissionFee] = useState('');
  const [editedServiceDuration, setEditedServiceDuration] = useState([]);

  const [messageEditedService, setMessageEditedService] = useState('');

  //Função para mostrar o menu de edição de um serviço selecionado
  const ShowServiceEditMenu = (index) => {
    setSelectedService(index);
  }; 

  //Função para adicionar o preço editado do serviço, a variável definida
  const handleEditedServicePrice = (event) => {
    const valor = event.target.value;
    // Filtrar apenas os números
    const numero = valor.replace(/\D/g, '');//Regex para aceitar apenas números no input
    setEditedServicePrice(formatarPreco(numero));
  };

  //Função para adicionar a taxa de comissão editada do serviço, a variável definida
  const handleEditedCommissionFee = (event) => {
    const valor = event.target.value;
    // Filtrar apenas os números
    const numero = valor.replace(/\D/g, '');//Regex para aceitar apenas números no input
    setEditedCommissionFee(formatarPorcentagem(numero));
  };

  // Função responsável por adicionar ou remover o tempo de duração selecionado, no menu de edição do serviço
  const handleEditedServiceDuration = (timeDurationEdited) => {
    // Verifica se já existem dois tempos selecionados e se o tempo clicado não está entre eles
    if (editedServiceDuration.length === 1 && !editedServiceDuration.includes(timeDurationEdited)) {
        // Caso positivo, não faz nada e retorna
        return;
      }

        // Verifica se o tempo já está selecionado
      if (editedServiceDuration.includes(timeDurationEdited)) {
        // Se o tempo já estiver selecionado, remove-o da seleção
        setEditedServiceDuration(editedServiceDuration.filter(item => item !== timeDurationEdited));
      } else {
          // Se o tempo não estiver selecionado, adiciona-o à seleção
          setEditedServiceDuration([...editedServiceDuration, timeDurationEdited]);
      }
  }
  //Função para enviar as informações do serviço alterado
  const changeServiceData = (servicoId) => {
    // Verifica se os campos obrigatórios estão preenchidos
    if (editedServiceName || editedServicePrice || editedCommissionFee || editedServiceDuration[0]) {
      // Cria um objeto com os dados do serviço a serem enviados
      const editedService = {
        editedServiceName,
        editedServicePrice,
        editedCommissionFee,
        servico_Id: servicoId,
        editedDuration: editedServiceDuration[0]
      };
      axios.post(`https://api-user-barbeasy.up.railway.app/api/update-service/${barbeariaId}/${professionalId}`, editedService)
      .then(res => {
        if (res.data.Success === "Success") {
          setMessageEditedService("Serviço alterado com sucesso.");
          obterServicos()
          setTimeout(() => {
            setMessageEditedService(null);
            setEditedServiceName('')
            setEditedServicePrice('')
            setEditedCommissionFee('')
            setEditedServiceDuration('')
            setSelectedService(null)
          }, 2000);
        }
      })
      .catch(err => {
        console.log("Erro ao alterar informação do serviço.", err);
      });
  } else {
    setMessageEditedService("Nenhuma alteração identificada.");
    setTimeout(() => {
       setMessageEditedService(null);
    }, 2000);
  }
  }

/*===== Section to delete a current service ======*/
  const [confirmDeleteServico, setConfirmDeleteServico] = useState(false);

  //Função para alterar o estado da variável que mostra o botão ConfirmDelete
  const showConfirmDeleteService = () => {
    setConfirmDeleteServico(!confirmDeleteServico);
  };

  //Função para alterar o estado da variável que oculta o botão ConfirmDelete
  const hideConfirmDeleteService = () => {
    setConfirmDeleteServico(!confirmDeleteServico);
  };

  //Função para apagar um serviço
  const deleteServico = (servicoId) => {
    let lastService = servicos.length;
    axios.delete(`https://api-user-barbeasy.up.railway.app/api/delete-service/${barbeariaId}/${professionalId}/${servicoId}`)
      .then(res => {
        if (res.data.Success === "Success") {
          setMessageEditedService("Serviço apagado com sucesso.");
          setTimeout(() => {
            setMessageEditedService(null);
            if(lastService === 1){
              window.location.reload()
            }
            obterServicos()
            setConfirmDeleteServico(false);
            setSelectedService(null)
          }, 2000);
        }
      })
      .catch(err => {
        console.log("Erro ao apagar o serviço.", err);
        setMessageEditedService("Erro ao apagar o serviço.");
        setTimeout(() => {
          setMessageEditedService(null);
        }, 2000);
      });
  }
/*======================Calendário===========================*/
const [showCalendar, setShowCalendar] = useState(false);
const [showButtonSaveDayOff, setButtonSaveDayOff] = useState(false);
const [selectedDate, setSelectedDate] = useState(null);
const [bookings, setBookings] = useState ([]);
const [daysOff, setDaysOff] = useState ([]);
const [horariosDiaSelecionado, setHorariosDiaSelecionado] = useState([]); // Estado para os horários do dia selecionado
const[timesLockedByProfessional, setTimesLockedByProfessional] = useState([]);


const [messageSaveDayOff, setMessageSaveDayOff] = useState('');

const date = new Date();
const options = { weekday: 'short', locale: 'pt-BR' };
let dayOfWeek = date.toLocaleDateString('pt-BR', options);
dayOfWeek = dayOfWeek.slice(0, -1);
dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
const year = date.getFullYear();

const currentDate = new Date(date);

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

const weekDays = getWeeks();
const numberDays = getNumber();
const currentDay = getCurrentDayOfWeek()
const currentTime = getCurrentTime()

// Function to get all booking
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

// Function to get all booking
const getAllDaysOffProfessional = () =>{
  axios.get(`https://api-user-barbeasy.up.railway.app/api/daysOff/${barbeariaId}/${professionalId}`, selectedDate)
  .then(res =>{
    if(res.data.Success === 'Success'){
      setDaysOff(res.data.allDaysOff);
    }
  }).catch(err =>{
    console.error('Error to get days off from professional', err);
  })
}

useEffect(() =>{
  getAllBookings()
  getAllDaysOffProfessional()
}, [selectedDate, barbeariaId, professionalId])
console.log(daysOff)
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

  // Verifica se o dia selecionado está no objeto
  if (dayOfWeek in timesDays) {
    //Passa o índice do objeto, correspondente ao dia selecionado
    let timesOfDaySelected = timesDays[dayOfWeek];
    //Separa os horários que estão concatenados
    timesOfDaySelected = timesOfDaySelected.split(',');
    console.log(timesOfDaySelected)

    if(selectedDay === currentDay){
      if(timesOfDaySelected[0].length === 5){
        const bookinOfDaySelected = bookingProfessional.filter(horarios => horarios.booking_date === selectedDay);
        const bookingsTimes = Object.values(bookinOfDaySelected).map(item => item.booking_time);
        const bookingsTimesSplit = bookingsTimes.map(timeString => timeString.split(','));

        timesOfDaySelected = timesOfDaySelected.filter(time => {
          return !bookingsTimesSplit.some(bookedTimes => bookedTimes.includes(time));
        });
        
        // Filtra os horários que são maiores ou iguais ao horário atual
        const horariosFiltrados = timesOfDaySelected.filter(horario => {
          // Divide o horário em hora e minuto
          const [hora, minuto] = horario.split(':');
          // Calcula o horário completo em formato de número para facilitar a comparação
          const horarioCompleto = Number(`${hora}${minuto}`);
          // Retorna verdadeiro se o horário completo for maior ou igual ao horário atual
          return horarioCompleto >= currentTime;
        });
        setHorariosDiaSelecionado(horariosFiltrados);

      }else{
        setHorariosDiaSelecionado(['Não há horários disponíveis para esse dia']);
      }
    
    }else{
      const bookinOfDaySelected = bookingProfessional.filter(horarios => horarios.booking_date === selectedDay);
      const bookingsTimes = Object.values(bookinOfDaySelected).map(item => item.booking_time);
      const bookingsTimesSplit = bookingsTimes.map(timeString => timeString.split(','));
        
      timesOfDaySelected = timesOfDaySelected.filter(time => {
        return !bookingsTimesSplit.some(bookedTimes => bookedTimes.includes(time));
      });

      setHorariosDiaSelecionado(timesOfDaySelected);
    }
  } else {
    setHorariosDiaSelecionado(['null']); // Define como null se o dia selecionado não estiver no objeto
  }
};

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

const saveDayOff = () =>{
  if(barbeariaId && professionalId && selectedDate && timesLockedByProfessional){
    const objectDayOff = {
      selectedDate,
      timesLockedByProfessional
    }
    axios.post(`https://api-user-barbeasy.up.railway.app/api/update-dayOff/${barbeariaId}/${professionalId}`, objectDayOff)
    .then(res =>{
      if(res.data.Success === 'Success'){
        setMessageSaveDayOff("Folga salva com sucesso!")
        setTimeout(() => {
          setMessageSaveDayOff(null);
          setTimesLockedByProfessional([])
          setSelectedDate(null)
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
        {diasSemana.map((dia, index) => (
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
                                  {/* Renderizar o array de horários correspondente */}
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
            </div>
      )}

<hr className='hr_menu'/>

          <div className="menu__main" onClick={alternarServico}>
            <GiRazor className='icon_menu'/>
              Definir Serviços
            <IoIosArrowDown className={`arrow ${mostrarServico ? 'girar' : ''}`} id='arrow'/>
            
          </div>

          {mostrarServico && (
         <div className={`${showAddServico ? 'expandir' : ''}`}>
          {showAddServico &&(
            <div className="input_Container">

                  <p>Qual o nome do serviço?</p>
                  <input
                  className="input_AddService"
                  type="text"
                  id="serviceName"
                  name="serviceName"
                  maxLength={30}
                  onChange={e => setNewNameService(e.target.value)}
                  placeholder='Ex. Corte Social'
                  />

                  <p>Quanto vai custar?</p>
                  <input
                  className="input_AddService"
                  type="text"
                  id="precoServico"
                  name="precoServico"
                  value={newPriceService}
                  onChange={AddNewPriceService}
                  maxLength={9}
                  placeholder="R$ 00,00"
                  required
                />
                <p>Qual a taxa de comissão para esse profissional?</p>
                  <input
                  className="input_AddService"
                  type="text"
                  id="commissionFee"
                  name="commissionFee"
                  value={newCommissionFee}
                  onChange={AddNewCommissionFee}
                  maxLength={6}
                  placeholder="00,0%"
                  required
                />

                  <p style={{marginTop: '10px'}}>Qual o tempo de duração?</p>
                  <div className="inputs-horarios">
                    {['15min','30min','45min','60min','75min', '90min'].map((tempo, index) => (
                      <div
                        key={index}
                        className={`horario-item ${newServiceDuration.includes(tempo) ? 'Horario-selecionado' : ''}`}
                        onClick={() => handleNewServiceDuration(tempo)}
                      >
                        <p>{tempo}</p>
                      </div>
                    ))}
                  </div>
                  {messageAddService === "Serviço adicionado com sucesso." ? (
                    <div className="mensagem-sucesso">
                      <MdOutlineDone className="icon__success"/>
                      <p className="text__message">{messageAddService}</p>
                    </div>
                      ) : (
                      <div className={` ${messageAddService ? 'mensagem-erro' : ''}`}>
                        <VscError className={`hide_icon__error ${messageAddService ? 'icon__error' : ''}`}/>
                        <p className="text__message">{messageAddService}</p>
                    </div>
                  )}
                    <button className="button__Salve__Service" onClick={addNewService}>
                    Adicionar Serviço
                  </button>
            </div>
          )}

          <div className="divSelected">
            <div className='container__servicos'>
              <div className='section__service'>
              {servicos.length > 0 ?
                servicos.map((servico, index) => (
                  <div 
                  key={index}
                  className={`box__service ${selectedService === index ? 'expandir__Service' : ''}`}
                  onClick={() => ShowServiceEditMenu(index)}
                >
                  <p style={{marginBottom: '10px', width: '100%'}}>{servico.name}</p>

                  <p>Deseja alterar o nome do serviço?</p>
                  <input
                  className="input_AddService"
                  type="text"
                  id="EditedServiceName"
                  name="EditedServiceName"
                  maxLength={30}
                  onChange={e => setEditedServiceName(e.target.value)}
                  placeholder={servico.name}
                  />

                  <p>Deseja alterar o preço do serviço?</p>
                  <input
                  className="input_AddService"
                  type="text"
                  id="EditedServicePrice"
                  name="EditedServicePrice"
                  value={editedServicePrice}
                  onChange={handleEditedServicePrice}
                  maxLength={9}
                  placeholder={servico.preco}
                />

                  <p>Deseja alterar a taxa de comissão do serviço?</p>
                  <input
                  className="input_AddService"
                  type="text"
                  id="EditedCommissionFee"
                  name="EditedCommissionFee"
                  value={editedCommissionFee}
                  onChange={handleEditedCommissionFee}
                  maxLength={6}
                  placeholder={servico.commission_fee}
                />

                <p style={{marginTop: '10px'}}>Deseja alterar o tempo de duração?</p>
                  <div className="inputs-horarios">
                    {['15min','30min','45min','60min','75min', '90min'].map((timeDurationEdited, index) => (
                      <div
                        key={index}
                        className={`horario-item ${editedServiceDuration.includes(timeDurationEdited) ? 'Horario-selecionado' : ''}`}
                        onClick={() => handleEditedServiceDuration(timeDurationEdited)}
                      >
                        <p>{timeDurationEdited}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{marginTop: '10px'}}>Duração Atual • {servico.duracao}</p>
                  {messageEditedService === "Nenhuma alteração identificada." ? (
                    <div className={` ${messageEditedService ? 'mensagem-erro' : ''}`}>
                      <VscError className={`hide_icon__error ${messageEditedService ? 'icon__error' : ''}`}/>
                      <p className="text__message">{messageEditedService}</p>
                    </div>
                      ) : (
                      <div className={`hide__message ${messageEditedService ? 'mensagem-sucesso' : ''}`}>
                        <MdOutlineDone className="icon__success"/>
                        <p className="text__message">{messageEditedService}</p>
                      </div>
                  )}
                
                  <div className="section__service__button">
                    <button className={`button_ocult ${confirmDeleteServico ? 'section__confirm__delete' : ''}`} onClick={() => deleteServico(servico.id)}>
                      Confirmar
                    </button>

                    <button className={`buttonChange__service ${confirmDeleteServico ? 'button_ocult' : ''}`} onClick={() => changeServiceData(servico.id)}>
                      Alterar
                    </button>

                    <button className={`delete__Service ${confirmDeleteServico ? 'button_ocult' : ''}`} onClick={showConfirmDeleteService}>
                      <RiDeleteBin6Line/>
                    </button>

                    <button className={`button_ocult ${confirmDeleteServico ? 'section__cancel' : ''}`} onClick={hideConfirmDeleteService}>
                      Cancelar
                    </button>

                  </div>

                </div>
                )):
                <p>Nenhum serviço cadastrado</p>
              }
              </div>
            </div>

            <button className="button__Salve__Service" onClick={ShowAddService}>
                    Adicionar Serviço
            </button>
          </div>
        </div>
          )}

<hr className='hr_menu'/>

          <div className="menu__main" onClick={alternarCalendar} style={{marginBottom: '15px'}}>
            <CiAlarmOff className='icon_menu'/>
              Definir Folga
            <IoIosArrowDown className={`arrow ${mostrarServico ? 'girar' : ''}`} id='arrow'/>
          </div>

          {selectedDate && (
            <p className="information__span">Selecione o dia que deseja folgar:</p>
          )}

          {showCalendar &&(
            <div className='container__Calendar'>
            <div className='sectionCalendar'>
                <div className="list__Names__Week__And__Day">
                {weekDays.map((dayOfWeek, index) => (
                    <div key={`weekDay-${index}`} className="list__name__Week">
                      <div
                        className={`dayWeekCurrent ${selectedDate === `${dayOfWeek}, ${numberDays[index].number} de ${numberDays[index].month} de ${year}` ? 'selectedDay' : ''} ${numberDays[index].isCurrentDay ? 'currentDay' : ''}`}
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
              {selectedDate && (
                <p className="information__span">Selecione os horários que deseja fechar:</p>
              )}

              {selectedDate && (
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