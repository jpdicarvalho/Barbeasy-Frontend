import React, { useState, useEffect } from 'react';
import {motion} from 'framer-motion';
import axios from 'axios';
//Icons
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineBackup } from "react-icons/md";
import { RiRadioButtonLine } from "react-icons/ri";
import { RiStore3Line } from "react-icons/ri";
import { MdOutlineAddBusiness } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdAddRoad } from "react-icons/md";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { GrMapLocation } from "react-icons/gr";
import { IoMdLocate } from "react-icons/io";
import { BsCalendar2Day } from "react-icons/bs";
import { TbClockHour4 } from "react-icons/tb";
import { GiRazor } from "react-icons/gi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { PiPassword } from "react-icons/pi";
import { PiPasswordDuotone } from "react-icons/pi";
import { MdOutlineDone } from "react-icons/md";
import { VscError } from "react-icons/vsc";

import './ProfileBarbearia.css';

function ProfileBarbearia() {

  //Buscando informações do usuário logado
  const userData = localStorage.getItem('dataBarbearia');//Obtendo os dados salvo no localStorage
  const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
  const barbeariaId = userInformation.barbearia[0].id;

/*-----------------------------------*/
  //Constantes de Upload de imagem de usuário
  const [file, setfile] = useState(null);
  const [imageUser, setImageUser] = useState([]);
  const [userImageMessage, setUserImageMessage] = useState('');

  //Upload user image
  const handleFile = (e) => {
    setfile(e.target.files[0])
  }

  //Preparando as imagens selecionadas para serem enviadas ao back-end
  const handleUpload = () => {
    if (!file) {
      console.error("No file selected."); // Caso nenhum arquivo seja selecionado
      return;
    }

    const allowedExtensions = ['jpg', 'jpeg', 'png'];

    const formdata = new FormData();

    // Obtém a extensão do arquivo original
    const fileExtension = file ? file.name.split('.').pop() : '';//operador ternário para garantir que name não seja vazio

    if(fileExtension.length > 0){
      // Verifica se a extensão é permitida
      if (!allowedExtensions.includes(fileExtension)) {
        setUserImageMessage("Extensão de arquivo não permitida. Use imagem 'jpg', 'jpeg' ou 'png'.");
        return;
      }
    }

    // Obtém a data e hora atual
    const currentDateTime = new Date();

    // Formata a data e hora no formato desejado (por exemplo: YYYYMMDD_HHMMSS)
    const formattedDateTime = `${currentDateTime.getFullYear()}${(currentDateTime.getMonth() + 1).toString().padStart(2, '0')}${currentDateTime.getDate().toString().padStart(2, '0')}_${currentDateTime.getHours().toString().padStart(2, '0')}${currentDateTime.getMinutes().toString().padStart(2, '0')}${currentDateTime.getSeconds().toString().padStart(2, '0')}`;
  
    // Renomeia a imagem com o ID do usuário, número aleatório e a data/hora
    const renamedFile = new File([file], `userBarbeariaId_${barbeariaId}_${formattedDateTime}.${fileExtension}`, { type: file.type });
    formdata.append('image', renamedFile);
    formdata.append('barbeariaId', barbeariaId);

    axios.post('https://api-user-barbeasy.up.railway.app/api/upload-image-user-barbearia', formdata)
    .then(res => {
      if(res.data.Status === "Success"){
        setUserImageMessage("Imagem atualizada com sucesso.");
        setTimeout(() => {
          setUserImageMessage(null);
          window.location.reload()
        }, 2000);
      }else{
        setUserImageMessage('Erro ao atualizar a imagem. Tente novamente mais tarde.')
        setTimeout(() => {
          setUserImageMessage(null);
        }, 3000);
      }
    })
    .catch(err => console.log(err));
  }

  //Metodo para mandar as imagens automaticamente para o back-end
  useEffect(() => {
    // Configura um temporizador para esperar 1 segundo após a última mudança no input de arquivo
    const timeout = setTimeout(() => {
      // Executa a função de upload após o período de espera
      handleUpload();
    }, 1000);

    // Limpa o temporizador se o componente for desmontado ou se houver uma nova mudança no input de arquivo
    return () => clearTimeout(timeout);
  }, [file]);

  //Função para obter as imagens cadastradas
  useEffect(() => {
    axios.get('https://api-user-barbeasy.up.railway.app/api/image-user-barbearia', {
      params: {
        barbeariaId: barbeariaId
      }
    })
    .then(res => {
      setImageUser(res.data.url);
    })
    .catch(err => console.log(err));
  }, [barbeariaId]);

/*----------------------------------*/
  //Constantes de Upload de Imagens para o Banner
  const [bannerFiles, setBannerFiles] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerMessage, setBannerMessage] = useState(null);

  //Upload banner images
  const handleBannerImages = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setBannerFiles(selectedFiles);
  }
  //Preparando as imagens selecionadas para serem enviadas ao back-end
  const handleBannerImagesUpload = () => {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'heif', 'HEIF'];

    const bannerFormData = new FormData();

    if(bannerFiles.length > 5){
      setBannerMessage("Selecione no máximo 5 imagens.");
      setTimeout(() => {
        setBannerMessage(null);
      }, 3000);
      return;
    }

    // Itera sobre os arquivos selecionados
    for (let i = 0; i < bannerFiles.length; i++) {
      const file = bannerFiles[i];

      // Obtém a extensão do arquivo original
      const fileExtension = file.name.split('.').pop();

      // Verifica se a extensão é permitida
      if (!allowedExtensions.includes(fileExtension)) {
        setBannerMessage("Extensão de arquivo não permitida. Use imagens 'jpg', 'jpeg' ou 'png'.");
        setTimeout(() => {
          setBannerMessage(null);
          
        }, 3000);
        return;
      }

      // Obtém a data e hora atual
      const currentDateTime = new Date();
      // Formata a data e hora no formato desejado (por exemplo: YYYYMMDD_HHMMSS)
      const formattedDateTime = `${currentDateTime.getFullYear()}${(currentDateTime.getMonth() + 1).toString().padStart(2, '0')}${currentDateTime.getDate().toString().padStart(2, '0')}_${currentDateTime.getHours().toString().padStart(2, '0')}${currentDateTime.getMinutes().toString().padStart(2, '0')}${currentDateTime.getSeconds().toString().padStart(2, '0')}`;
      // Renomeia a imagem com o ID do usuário mantendo a extensão original
      const renamedFile = new File([file], `barbeariaId_${barbeariaId}_banner_${i + 1}_${formattedDateTime}.${fileExtension}`, { type: file.type });

      // Adiciona o arquivo ao FormData
      bannerFormData.append(`images`, renamedFile);
      bannerFormData.append('barbeariaId', barbeariaId);
    }

    axios.post('https://api-user-barbeasy.up.railway.app/api/upload-banners-images', bannerFormData)
      .then(res => {
        if (res.data.Status === "Success") {
          setBannerMessage("Banner alterado com sucesso.");
          setTimeout(() => {
            setBannerMessage(null);
            window.location.reload()
          }, 2000);
        } else {
          setBannerMessage("Erro ao realizar alteração.");
          setTimeout(() => {
            setBannerMessage(null);
            window.location.reload()
          }, 3000);
        }
      })
      .catch(err => console.log(err));
  }

  //Metodo para mandar as imagens automaticamente para o back-end
  useEffect(() => {
    // Configura um temporizador para esperar 1 segundo após a última mudança no input de arquivo
    const timeout = setTimeout(() => {
      // Executa a função de upload após o período de espera
      handleBannerImagesUpload();
    }, 1000);

    // Limpa o temporizador se o componente for desmontado ou se houver uma nova mudança no input de arquivo
    return () => clearTimeout(timeout);
  }, [bannerFiles]);

  //Função para obter as imagens cadastradas
  useEffect(() => {
    axios.get('https://api-user-barbeasy.up.railway.app/api/banner-images', {
      params: {
        barbeariaId: barbeariaId
      }
    })
    .then(result => {
      setBannerImages(result.data.urls);
    })
    .catch(error => console.log(error));
  }, [barbeariaId]);

/*----------------------------------*/
//Constantes para atualizar o status da barbearia
  const [mostrarStatus, setMostrarStatus] = useState(false);
  const [status, setStatus] = useState();

  //Função para mostrar o input de alteração do status
  const alternarStatus = () => {
    setMostrarStatus(!mostrarStatus);
  };
  //Função para atualizar o status da barbearia
  const statusUpdate = () => {
    // Aqui você pode fazer uma solicitação para o backend usando o axios
    axios.post(`https://api-user-barbeasy.up.railway.app/api/status-update/${barbeariaId}`, { Status: status })
    .then(res => {
        if(res.data.Success === 'Success'){
          console.log('Status atualizado!');
        }
      })
      .catch(error => {
        // Lógica a ser executada em caso de erro na solicitação
        console.error('Erro ao atualizar o status:', error);
      });
  };
  //Função para obter o status da barbearia
  useEffect(() => {
    axios.get(`https://api-user-barbeasy.up.railway.app/api/status-barbearia/${barbeariaId}`)
      .then(res => {
        setStatus(res.data.StatusBarbearia)
      })
      .catch(error => console.log(error));
  }, [barbeariaId])
/*----------------------------------*/
  //Constantes para atualizar o nome da Barbearia
  const [mostrarNomeBarbearia, setMostrarNomeBarbearia] = useState(false);
  const [novoNomeBarbearia, setNovoNomeBarbearia] = useState('');
  const [NomeBarbeariaAtual, setNomeBarbeariaAtual] = useState('');
  const [messageNameBarbearia, setMessageNameBarbearia] = useState('');

  //Função para mostrar o input de alteração do nome
  const alternarNomeBarbearia = () => {
    setMostrarNomeBarbearia(!mostrarNomeBarbearia);
  };
  //Função para mandar o novo nome da barbearia
  const alterarNomeBarbearia = () => {
    axios.post(`https://api-user-barbeasy.up.railway.app/api/update-barbearia-name/${barbeariaId}`, {novoNome: novoNomeBarbearia})
    .then(res => {
        if(res.data.Success === 'Success'){
          setMessageNameBarbearia("Nome da Barbearia Alterado com Sucesso!")
            // Limpar a mensagem após 3 segundos (3000 milissegundos)
            setTimeout(() => {
              setMessageNameBarbearia('');
              getNameBarbearia()
            }, 3000);
        }
      })
      .catch(error => {
        setMessageNameBarbearia("Não foi possível alterar o nome da Barbearia.")
            // Limpar a mensagem após 3 segundos (3000 milissegundos)
            setTimeout(() => {
              setMessageNameBarbearia('');
              window.location.reload();
            }, 3000);
        // Lógica a ser executada em caso de erro na solicitação
        console.error('Erro ao atualizar o nome da barbearia:', error);
      });
  };
  //Função para obter o nome atual da barbearia
  const getNameBarbearia = () =>{
    axios.get(`https://api-user-barbeasy.up.railway.app/api/nome-barbearia/${barbeariaId}`)
      .then(res => {
        setNomeBarbeariaAtual(res.data.NomeBarbearia)
      })
      .catch(error => console.log(error));
  }
  useEffect(() => {
    getNameBarbearia()
  }, [barbeariaId])
/*----------------------------------*/
  const [mostrarEndereco, setMostrarEndereco] = useState(false);
  const [messageEndereco, setMessageEndereco] = useState('');
  const [endereco, setEndereco] = useState('');

  //Função para mostrar os inputs de alteração de endereço
  const alternarEndereco = () => {
    setMostrarEndereco(!mostrarEndereco);
  };
  //Obtendo os valores dos inputs
  const [valuesEndereco, setValuesEndereco] = useState({
    street: '',
    number:'',
    neighborhood:'',
    city:''
  });
  //Função para vericicar se há algum input vazio
  const verificarValoresPreenchidos = () => {
    for (const key in valuesEndereco) {
      if (valuesEndereco.hasOwnProperty(key) && !valuesEndereco[key]) {
        return false; // Retorna falso se algum valor não estiver preenchido
      }
    }
    return true; // Retorna verdadeiro se todos os valores estiverem preenchidos
  };
  //Função responsável por enviar os valores ao back-end
  const alterarEndereco = () => {
    if (verificarValoresPreenchidos()) {
      axios.post(`https://api-user-barbeasy.up.railway.app/api/update-endereco/${barbeariaId}`, { Values: valuesEndereco })
        .then(res => {
          if (res.data.Success === 'Success') {
            setMessageEndereco("Endereço Alterado com Sucesso!")
            setTimeout(() => {
              setMessageEndereco('');
              setValuesEndereco({city: ''})
              getAdressBarbearia()
              setMostrarEndereco(!mostrarEndereco);
            }, 3000);
          }
        })
        .catch(error => {
          setMessageEndereco('Erro ao atualizar o endereço.');
          // Limpar a mensagem de erro após 3 segundos (3000 milissegundos)
          setTimeout(() => {
            setMessageEndereco('');
          }, 3000);
          // Lógica a ser executada em caso de erro na solicitação
          console.error('Erro ao atualizar o nome da barbearia:', error);
        });
    } else {
      setMessageEndereco('Altere todos os campos de endereço.');

      setTimeout(() => {
        setMessageEndereco('');
      }, 3000);
    }
  };
  //Função para obter o nome atual da barbearia
  const getAdressBarbearia = () => {
    axios.get(`https://api-user-barbeasy.up.railway.app/api/endereco/${barbeariaId}`)
      .then(res => {
        setEndereco(res.data.Endereco)
      })
      .catch(error => console.log(error));
  }
  useEffect(() => {
    getAdressBarbearia()
  }, [barbeariaId])
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
    axios.post(`https://api-user-barbeasy.up.railway.app/api/update-agenda/${barbeariaId}`, {daysWeek: daysWeekSelected, qntDays: QntDaysSelected})
    .then(res => {
      if(res.data.Success === 'Success'){
        setMessageAgenda("Agenda Atualizada com Sucesso!")
        setTimeout(() => {
          setMessageAgenda('');
          getAgenda()
          setMostrarDiasSemana(!mostrarDiasSemana);
        }, 3000);
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
const [tempoAtendimentoSelected, setTempoAtendimentoSelected] = useState([]);
const [horarioDefinido, setHorarioDefinido] = useState([]);
const [agendaDoDiaSelecionado, setAgendaDoDiaSelecionado] = useState([]);

//Declaração dos array de horários padronizados e de cada dia da semana
const [horariosPadronizados, setHorariosPadronizados] = useState([]);
const [horariosDom, setHorariosDom] = useState([]);
const [horariosSeg, setHorariosSeg] = useState([]);
const [horariosTer, setHorariosTer] = useState([]);
const [horariosQua, setHorariosQua] = useState([]);
const [horariosQui, setHorariosQui] = useState([]);
const [horariosSex, setHorariosSex] = useState([]);
const [horariosSab, setHorariosSab] = useState([]);

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

// Função para definir o tempo de atendimento
const handleAtendimento = (atendimento) => {
  // Verifica se já há um tempo de atendimento selecionado e se o tempo atual não está incluído nele
  if (tempoAtendimentoSelected.length === 1 && !tempoAtendimentoSelected.includes(atendimento)) {
      // Se sim, não faz nada e retorna
      return;
  }

  // Verifica se o tempo de atendimento já está selecionado
  if (tempoAtendimentoSelected.includes(atendimento)) {
      // Se estiver selecionado, remove-o da seleção
      setTempoAtendimentoSelected(tempoAtendimentoSelected.filter(item => item !== atendimento));      
  } else {
      // Se não estiver selecionado, adiciona-o à seleção
      setTempoAtendimentoSelected([...tempoAtendimentoSelected, atendimento]);
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
  if (HorarioFuncionamento && tempoAtendimentoSelected.length > 0) {
      // Extrai o tempo de atendimento do formato 'Xmin' e converte para um número inteiro
      const tempAtendimento = parseInt(tempoAtendimentoSelected[0].split('min')[0]);
      
      // Gera os horários definidos com base no horário de funcionamento, tempo de atendimento e intervalo
      const horariosDefinido = generateHorarios(HorarioFuncionamento[0], HorarioFuncionamento[1], tempAtendimento);
      
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
  
  axios.post(`https://api-user-barbeasy.up.railway.app/api/update-agendaDiaSelecionado/${barbeariaId}`, {StrAgenda: strAgendaDiaSelecionado})
  .then(res => {
    if(res.data.Success === 'Success'){
      setMessageAgendaHorarios("Horários Salvos com Sucesso.")
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessageAgendaHorarios('');
          getHorariosDefinidos()
          setDiaSelecionado(null);
          setHorarioFuncionamento('')
          setTempoAtendimentoSelected('')
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
  axios.get(`https://api-user-barbeasy.up.railway.app/api/agendaDiaSelecionado/${barbeariaId}`)
  .then(res => {
    let arrayHorariosPadrao = res.data.horariosDiaEspecifico;
    let verifyIndexArray;

    if(arrayHorariosPadrao.length > 0 && arrayHorariosPadrao[0] != null || '') {
      verifyIndexArray = arrayHorariosPadrao[0].split(',')
      if(verifyIndexArray[0] === 'horarioPadrao'){
        verifyIndexArray.shift();
        setHorariosPadronizados(verifyIndexArray);
      }
      for(let i=0; i < arrayHorariosPadrao.length; i++){
        verifyIndexArray = arrayHorariosPadrao[i].substring(0, 3)

          if (verifyIndexArray === 'Dom'){
            setHorariosDom (arrayHorariosPadrao[i].split(','));
          }
          if (verifyIndexArray === 'Seg'){
            setHorariosSeg (arrayHorariosPadrao[i].split(','));
          }
          if (verifyIndexArray === 'Ter'){
            setHorariosTer (arrayHorariosPadrao[i].split(','));
          }
          if (verifyIndexArray === 'Qua'){
            setHorariosQua (arrayHorariosPadrao[i].split(','));
          }
          if (verifyIndexArray === 'Qui'){
            setHorariosQui (arrayHorariosPadrao[i].split(','));
          }
          if (verifyIndexArray === 'Sex'){
            setHorariosSex (arrayHorariosPadrao[i].split(','));
          }
          if (verifyIndexArray === 'Sáb'){
            setHorariosSab (arrayHorariosPadrao[i].split(','));
          }
        
      }
      
    }
    
  }).catch(error => {
    console.error('Erro ao buscar informações da agenda da barbearia', error)
  })
}
useEffect(() => {
  getHorariosDefinidos()
}, [])

//Função para salvar os horários definidos para todos os dias
const salvarHorariosTodosOsDias = () =>{
  let arrayEdited = agendaDoDiaSelecionado;
  arrayEdited[0] = 'horarioPadrao';

  let strHorariosTodosOsDias = arrayEdited.join(',');
  
  axios.post(`https://api-user-barbeasy.up.railway.app/api/update-horariosTodosOsDias/${barbeariaId}`, {StrAgenda: strHorariosTodosOsDias})
  .then(res => {
    if(res.data.Success === 'Success'){
      setMessageAgendaHorarios("Horários Salvos com Sucesso.")
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessageAgendaHorarios('');
          getHorariosDefinidos()
          setDiaSelecionado(null);
          setHorarioFuncionamento('')
          setTempoAtendimentoSelected('')
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
}, [HorarioFuncionamento, tempoAtendimentoSelected]);

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
  const horariosPorDia = {
    'Domingo': horariosDom,
    'Segunda-feira': horariosSeg,
    'Terça-feira': horariosTer,
    'Quarta-feira': horariosQua,
    'Quinta-feira': horariosQui,
    'Sexta-feira': horariosSex,
    'Sábado': horariosSab
  };

  const horariosParaRenderizar = horariosPorDia[dia];

  if (horariosParaRenderizar && horariosParaRenderizar.length > 0) {
    return horariosParaRenderizar.map((horario, index) => (
      <div className="horario-item" key={`${dia}-${index}`}>
        <p>{horario}</p>
      </div>
    ));
  } else if (horariosPadronizados.length > 0) {
    return horariosPadronizados.map((horario, index) => (
      <div className="horario-item" key={`padrao-${index}`}>
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
    axios.get(`https://api-user-barbeasy.up.railway.app/api/get-service/${barbeariaId}`)
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
/*===== Section to add a new service ======*/
  const [showAddServico, setShowAddServico] = useState(false);

  const [newNameService, setNewNameService] = useState('');
  const [newPriceService, setNewPriceService] = useState('');
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
        newDuration: newServiceDuration[0]
      };

      axios.post(`https://api-user-barbeasy.up.railway.app/api/add-service/${barbeariaId}`, newServiceData)
          .then(res => {
            if (res.data.Success === "Success") {
              setMessageAddService("Serviço adicionado com sucesso.");
              obterServicos()
              setTimeout(() => {
                setMessageAddService(null);
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
    if (editedServiceName || editedServicePrice || editedServiceDuration[0]) {
      // Cria um objeto com os dados do serviço a serem enviados
      const editedService = {
        editedServiceName,
        editedServicePrice,
        servico_Id: servicoId,
        editedDuration: editedServiceDuration[0]
      };
      axios.post(`https://api-user-barbeasy.up.railway.app/api/update-service/${barbeariaId}`, editedService)
      .then(res => {
        if (res.data.Success === "Success") {
          setMessageEditedService("Serviço alterado com sucesso.");
          obterServicos()
          setTimeout(() => {
            setMessageEditedService(null);
            setEditedServiceName('')
            setEditedServicePrice('')
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
    axios.delete(`https://api-user-barbeasy.up.railway.app/api/delete-service/${barbeariaId}/${servicoId}`)
      .then(res => {
        if (res.data.Success === "Success") {
          setMessageEditedService("Serviço apagado com sucesso.");
          setTimeout(() => {
            setMessageEditedService(null);
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
/*=================================================*/
  const [mostrarNome, setMostrarNome] = useState(false);
  const [novoUserName, setNovoUserName] = useState('');
  const [userNameBarbearia, setUserNameBarbearia] = useState('');
  const [messageUserName, setMessageUserName] = useState('');

  const alternarNome = () => {
      setMostrarNome(!mostrarNome);
  };
  //Função responsável por enviar o novo nome de usuário ao back-end
  const alterarUserName = () => {
    axios.post(`https://api-user-barbeasy.up.railway.app/api/upload-user-name-barbearia/${barbeariaId}`, {newUserName: novoUserName})
      .then(res => {
          if(res.data.Success === 'Success'){
            setMessageUserName("Nome de usuário alterado com sucesso.")
            // Limpar a mensagem após 3 segundos (3000 milissegundos)
            setTimeout(() => {
              setMessageUserName('');
              setNovoUserName('')
              getUserName()
              setMostrarNome(!mostrarNome);
            }, 3000);
          }
        })
        .catch(error => {
          setMessageUserName("Erro ao atualizar o nome de usuário.")
            // Limpar a mensagem após 3 segundos (3000 milissegundos)
            setTimeout(() => {
              setMessageUserName('');
              window.location.reload();
            }, 3000);
          console.error('Erro ao atualizar o nome de usuário:', error);
        });
  };
  //Função para obter o nome de usuário atual da barbearia
  const getUserName = () =>{
    axios.get(`https://api-user-barbeasy.up.railway.app/api/user-name-barbearia/${barbeariaId}`)
      .then(res => {
        setUserNameBarbearia(res.data.UserNameBarbearia)
      })
      .catch(error => console.log(error));
  }
  //Hook para chamar a função getUserName()
  useEffect(() => {
    getUserName()
  }, [barbeariaId])
/*----------------------------------*/
  const [mostrarEmail, setMostrarEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [messageEmail, setMessageEmail] = useState('');

  const alternarEmail = () => {
    setMostrarEmail(!mostrarEmail);
  };

  const alterarEmail = () => {
    axios.post(`https://api-user-barbeasy.up.railway.app/api/upload-email-barbearia/${barbeariaId}`, {NewEmail: newEmail})
    .then(res => {
        if(res.data.Success === 'Success'){
          setMessageEmail("Email alterado com sucesso.")
            // Limpar a mensagem após 3 segundos (3000 milissegundos)
            setTimeout(() => {
              setMessageEmail('');
              setNewEmail('')
              getEmail()
              setMostrarEmail(!mostrarEmail);
            }, 3000);
        }
      })
      .catch(error => {
        setMessageEmail("Erro ao atualizar o email de usuário")
            // Limpar a mensagem após 3 segundos (3000 milissegundos)
            setTimeout(() => {
              setMessageEmail('');
              window.location.reload();
            }, 3000);
        // Lógica a ser executada em caso de erro na solicitação
        console.error('Erro ao atualizar o email de usuário:', error);
      });
  };

  const getEmail = () =>{
    axios.get(`https://api-user-barbeasy.up.railway.app/api/email-barbearia/${barbeariaId}`)
      .then(result => {
        setCurrentEmail(result.data.EmailBarbearia);
      })
      .catch(error => console.log(error));
  }

  useEffect(() => {
    getEmail()
  }, [barbeariaId])
/*----------------------------------*/
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [messagePassword, setMessagePassword] = useState('');

  const alternarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const alterarSenha = () => {
    axios.get('https://api-user-barbeasy.up.railway.app/api/update-password-barbearia', {
      params: {
        barbeariaId: barbeariaId,
        passwordConfirm: passwordConfirm,
        newPassword: newPassword
      }
    }).then(res => {
      if(res.data.Success === 'Success'){
        setMessagePassword("Senha alterada com sucesso.")
          // Limpar a mensagem após 3 segundos (3000 milissegundos)
          setTimeout(() => {
            setMessagePassword('');
            window.location.reload();
          }, 3000);
      }
    }).catch(error => {
      setMessagePassword("Senha atual não confirmada!")
          // Limpar a mensagem após 3 segundos (3000 milissegundos)
          setTimeout(() => {
            setMessagePassword('');
            //window.location.reload();
          }, 5000);
    });
  };
/*----------------------------------*/
  return (
    <>
    
      <div className="container__profile">

        <IoIosArrowDown className='icon_back'/>

              <div className="img__user_edit"> 
                  <label htmlFor="input-file-user" id="drop-area-user">
                  <MdOutlineEdit id="editar"/>
                  <input
                    type="file"
                    accept="image/*"
                    id="input-file-user"
                    hidden
                    onChange={handleFile}
                  />

                  {imageUser.length > 0 ? (
                    <div className="img-view-profile">
                      <img src={imageUser} alt="" id='img-profile' />
                    </div>
                  ) : (
                    <motion.div className="img-view-user">
                     <IoPersonOutline className='icon_user_edit'/>
                    </motion.div>
                  )}

                </label>
              </div>

              <div className="section__userName">
                {userNameBarbearia}
              </div>
              {userImageMessage === "Imagem atualizada com sucesso." ? (
                <div className="mensagem-sucesso">
                <MdOutlineDone className="icon__success"/>
                <p className="text__message">{userImageMessage}</p>
              </div>
              ) : (
                <div className={` ${userImageMessage ? 'mensagem-erro' : ''}`}>
                  <VscError className={`hide_icon__error ${userImageMessage ? 'icon__error' : ''}`}/>
                  <p className="text__message">{userImageMessage}</p>
              </div>
              )}

            {bannerMessage === "Banner alterado com sucesso." ? (
                <div className="mensagem-sucesso">
                  <MdOutlineDone className="icon__success"/>
                  <p className="text__message">{bannerMessage}</p>
                </div>
              ) : (
                <div className={` ${bannerMessage ? 'mensagem-erro' : ''}`}>
                  <VscError className={`hide_icon__error ${bannerMessage ? 'icon__error' : ''}`}/>
                  <p className="text__message">{bannerMessage}</p>
                </div>
              )}
          </div>

        <motion.div  className="banner">
          <motion.div
          className="container__banner"
          whileTap={{cursor:"grabbing"}}
          drag="x"
          dragConstraints={bannerImages.length === 5 ? { right: 0, left: -1600}:
                           bannerImages.length === 4 ? { right: 0, left: -1400}:
                           bannerImages.length === 3 ? { right: 0, left: -1000}:
                           bannerImages.length === 2 ? { right: 0, left: -600}:
                           bannerImages.length === 1 ? { right: 0, left: -200}:{ right: 0, left: 0}}

          >
          {bannerImages.map((image, index) => (
                  <motion.div key={index} className='container-img-upload' whileTap={{cursor:"grabbing"}} >
                    <img src={image} alt="" className='img-uploaded'  />
                  </motion.div>
                ))}
            <label htmlFor="input-file" id='drop-area'>
              <input
                type="file"
                accept="image/*"
                id='input-file'
                onChange={handleBannerImages}
                hidden
                multiple
              />
              <motion.div className="img-view" style={{ width: bannerImages.length > 0 ? '150px' : '380px' }}>
                <MdOutlineBackup className='icon_upload'/>
                <p>Incluir Imagem <br/>da Barbearia</p>
              </motion.div>
            </label>
          </motion.div>
        </motion.div>

        <div className="section_information">       
<hr />
        <div className='tittle_menu'>
            <h3>Barbearia</h3>
            <hr id='sublime'/>
        </div>

        <div className="container__menu">

          <div className="menu__main" onClick={alternarStatus}>
          {status === 'Aberta' ?
            <RiRadioButtonLine className='icon_menu' style={{color: '#1AEE07'}}/>
            :
            <RiRadioButtonLine className='icon_menu'/>
            } Status
            <IoIosArrowDown className={`arrow ${mostrarStatus ? 'girar' : ''}`} id='arrow'/>

          </div>
          

          {mostrarStatus && (
            <div className="divSelected">
              <div className="container__checkBox">
                {status === 'Aberta' ?
                  <span style={{fontWeight: '500', color: '#1AEE07'}}>Aberta</span>
                :
                  <span style={{fontWeight: '500'}}>Aberta</span>
                }
                <input
                  type="checkbox"
                  id='status'
                  checked={status === 'Aberta'} // Marca o input se o status for 'Aberta'
                  onChange={() => {
                    const novoStatus = status === 'Aberta' ? 'Fechada' : 'Aberta'; // Inverte o estado atual
                    setStatus(novoStatus); // Atualiza o estado 'status'
                    statusUpdate(); // Chama a função para atualizar o status no backend
                  }}
                />
                <label htmlFor="status" className='switch'>
                  <span className='slider'></span>
                </label>
              </div>

            </div>
          )}
          
<hr className='hr_menu'/>

        <div className="menu__main" onClick={alternarNomeBarbearia} >
          <RiStore3Line className='icon_menu'/>
            Nome
            <IoIosArrowDown className={`arrow ${mostrarNomeBarbearia ? 'girar' : ''}`} id='arrow'/>
          </div>

          {mostrarNomeBarbearia && (
            <div className="divSelected">
            <p className='information__span'>Altere o nome da Barbearia</p>
                
            {messageNameBarbearia === 'Nome da Barbearia Alterado com Sucesso!' ?(
                <div className="mensagem-sucesso">
                  <MdOutlineDone className="icon__success"/>
                  <p className="text__message">{messageNameBarbearia}</p>
                </div>
              ) : (
                <div className={` ${messageNameBarbearia ? 'mensagem-erro' : ''}`}>
                  <VscError className={`hide_icon__error ${messageNameBarbearia ? 'icon__error' : ''}`}/>
                  <p className="text__message">{messageNameBarbearia}</p>
              </div>
              )}
          
            <div className="inputBox">
            <input
                type="text"
                id="name"
                name="name"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres não alfanuméricos
                  const filteredValue = inputValue.replace(/[^a-zA-ZÀ-ú0-9.\s]/g, '');
                  setNovoNomeBarbearia(filteredValue);
                }}
                placeholder={NomeBarbeariaAtual}
                className="white-placeholder"
                maxLength={30}
                required
              /> <MdOutlineAddBusiness className='icon_input'/>
            </div>
          
            <button className={`button__change ${novoNomeBarbearia ? 'show' : ''}`} onClick={alterarNomeBarbearia}>
              Alterar
            </button>
          </div>          
         
          )}

<hr className='hr_menu' />

        <div className="menu__main" onClick={alternarEndereco} >
            <HiOutlineLocationMarker className='icon_menu'/>
              Endereço
              <IoIosArrowDown className={`arrow ${mostrarEndereco ? 'girar' : ''}`} id='arrow'/>
        </div>

        {mostrarEndereco && (
                    <div className="divSelected">
                      <p className='information__span'>Altere o endereço da Barbearia</p>
                      {messageEndereco === 'Endereço Alterado com Sucesso!' ?(
                        <div className="mensagem-sucesso">
                          <MdOutlineDone className="icon__success"/>
                          <p className="text__message">{messageEndereco}</p>
                        </div>
                      ) : (
                        <div className={` ${messageEndereco ? 'mensagem-erro' : ''}`}>
                          <VscError className={`hide_icon__error ${messageEndereco ? 'icon__error' : ''}`}/>
                          <p className="text__message">{messageEndereco}</p>
                      </div>
                      )}
                      
                      <div className="inputBox">
                        <input
                        type="text"
                        id="street"
                        name="street"
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          // Remover caracteres especiais
                          const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ]/g, '');

                          // Limitar a 50 caracteres
                          const truncatedValue = sanitizedValue.slice(0, 50);
                          setValuesEndereco({ ...valuesEndereco, street: truncatedValue });
                        }}
                        placeholder={endereco[0]}
                        className="white-placeholder"
                        required
                      /> <MdAddRoad className='icon_input'/>

                    <input
                      type="text"
                      id="number"
                      name="number"
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        // Remover caracteres não numéricos
                        const numericValue = inputValue.replace(/\D/g, '');
                        // Limitar a 10 caracteres
                        const truncatedValue = numericValue.slice(0, 5);
                        setValuesEndereco({ ...valuesEndereco, number: truncatedValue });
                      }}
                      placeholder={endereco[1]}
                      className="white-placeholder"
                      required
                    />{' '} <AiOutlineFieldNumber id="icon_street_number"/>
                    
                    <input
                      type="text"
                      id="neighborhood"
                      name="neighborhood"
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        // Remover caracteres especiais
                        const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ]/g, '');
                        // Limitar a 50 caracteres
                        const truncatedValue = sanitizedValue.slice(0, 50);
                        setValuesEndereco({ ...valuesEndereco, neighborhood: truncatedValue });
                      }}
                      placeholder={endereco[2]}
                      className="white-placeholder"
                      required
                    /><GrMapLocation id="icon_input_neighborhood"/>
                    
                    <input
                      type="text"
                      id="city"
                      name="city"
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        // Remover caracteres especiais
                        const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ]/g, '');
                        // Limitar a 50 caracteres
                        const truncatedValue = sanitizedValue.slice(0, 30);
                        setValuesEndereco({ ...valuesEndereco, city: truncatedValue });
                      }}
                      placeholder={endereco[3]}
                      className="white-placeholder"
                      required
                    />{' '} <IoMdLocate id="icon_input_city"/>
                      </div>

                      <button className={`button__change ${valuesEndereco.city ? 'show' : ''}`} onClick={alterarEndereco}>
                        Alterar
                      </button>
                    </div>
                    
        )}
        </div>

        <div className="container__menu">

        <div className="menu__main" onClick={alternarDiasTrabalho}>
          <BsCalendar2Day className='icon_menu'/>
            Definir Dias de Trabalho
            <IoIosArrowDown className={`arrow ${mostrarDiasSemana ? 'girar' : ''}`} id='arrow'/>
        </div>
          
        {mostrarDiasSemana && (
        <div className="divSelected">
          {messageAgenda === 'Agenda Atualizada com Sucesso!' ?(
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
                      <div><p className='information__span'>Defina o tempo de atendimento:</p>
                        <div className="inputs-horarios">
                          {['15min','30min','45min','60min','75min', '90min'].map((atendimento, index) => (
                              <div
                                  key={index}
                                  className={`horario-item ${tempoAtendimentoSelected.includes(atendimento) ? 'Horario-selecionado' : ''}`}
                                  onClick={() => handleAtendimento(atendimento)}
                              >
                                  <p>{atendimento}</p>
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

        </div>

        <div className='tittle_menu'>
            <h3>Usuário</h3>
            <hr id='sublime'/>
        </div>

        <div className="container__menu">

        <div className="menu__main" onClick={alternarNome}>
          <FaRegUser className='icon_menu'/>
            Nome
          <IoIosArrowDown className={`arrow ${mostrarNome ? 'girar' : ''}`} id='arrow'/>
          </div>

          {mostrarNome && (
            <div className="divSelected">
              <p className='information__span'>Alterar Nome de usuário</p>
              {messageUserName === 'Nome de usuário alterado com sucesso.' ?(
                            <div className="mensagem-sucesso">
                              <MdOutlineDone className="icon__success"/>
                              <p className="text__message">{messageUserName}</p>
                            </div>
                            ) : (
                            <div className={` ${messageUserName ? 'mensagem-erro' : ''}`}>
                              <VscError className={`hide_icon__error ${messageUserName ? 'icon__error' : ''}`}/>
                              <p className="text__message">{messageUserName}</p>
                            </div>
                          )}

            <div className="inputBox">
            <input
                type="text"
                id="usuario"
                name="usuario"
                maxLength={30}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres não alfanuméricos
                  const filteredValue = inputValue.replace(/[^a-zA-Z0-9.\s]/g, '');
                  // Limitar a 30 caracteres
                  const userName = filteredValue.slice(0, 30);
                setNovoUserName(userName);
                }}
                placeholder={userNameBarbearia}
                className="white-placeholder"
                required
              />{' '}<FaUserEdit className='icon_input'/>
            </div>

            <button className={`button__change ${novoUserName ? 'show' : ''}`} onClick={alterarUserName}>
              Alterar
            </button>
         </div>
         
          )}
          
<hr className='hr_menu'/>

          <div className="menu__main" onClick={alternarEmail} >
            <MdOutlineEmail className='icon_menu'/>
              Email
            <IoIosArrowDown className={`arrow ${mostrarEmail ? 'girar' : ''}`} id='arrow'/>
          </div>

          {mostrarEmail && (
            <div className="divSelected">
              <p className='information__span'>Alterar Email</p>
              {messageEmail === 'Email alterado com sucesso.' ?(
                            <div className="mensagem-sucesso">
                              <MdOutlineDone className="icon__success"/>
                              <p className="text__message">{messageEmail}</p>
                            </div>
                            ) : (
                            <div className={` ${messageEmail ? 'mensagem-erro' : ''}`}>
                              <VscError className={`hide_icon__error ${messageEmail ? 'icon__error' : ''}`}/>
                              <p className="text__message">{messageEmail}</p>
                            </div>
                          )}
          
            <div className="inputBox">
              <input
                type="email"
                id="email"
                name="email"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Substituir o conteúdo do campo para conter apenas números, letras, "@" e "."
                  const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9@.]/g, '');
                  // Limitar a 50 caracteres
                  const truncatedValue = sanitizedValue.slice(0, 50);

                  // Validar se o valor atende ao formato de email esperado
                  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(truncatedValue);

                  // Atualizar o estado apenas se o email for válido
                  if (isValidEmail) {
                    setNewEmail(truncatedValue);
                  }
                }}
                placeholder={currentEmail}
                className="white-placeholder"
                required
              />{' '}<MdOutlineAlternateEmail className='icon_input'/>
            </div>

            <button className={`button__change ${newEmail ? 'show' : ''}`} onClick={alterarEmail}>
              Alterar
            </button>
         </div>
         
          )}          

<hr className='hr_menu' />

<div className="menu__main" onClick={alternarSenha}>
          <MdPassword className='icon_menu'/>
            Senha
          <IoIosArrowDown className={`arrow ${mostrarSenha ? 'girar' : ''}`} id='arrow'/>
            </div>

          {mostrarSenha && (
            <div className="divSelected">
              <p className='information__span'>Alterar Senha</p>
              {messagePassword === 'Senha alterada com sucesso.' ?(
                            <div className="mensagem-sucesso">
                              <MdOutlineDone className="icon__success"/>
                              <p className="text__message">{messagePassword}</p>
                            </div>
                            ) : (
                            <div className={` ${messagePassword ? 'mensagem-erro' : ''}`}>
                              <VscError className={`hide_icon__error ${messagePassword ? 'icon__error' : ''}`}/>
                              <p className="text__message">{messagePassword}</p>
                            </div>
                          )}

            <div className="inputBox">
              <input
                type="password"
                id="senha"
                name="senha"
                maxlength="10"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Limitar a 10 caracteres
                  const truncatedPasswordConfirm = inputValue.slice(0, 10);
                  setPasswordConfirm(truncatedPasswordConfirm);
                }}
                placeholder="Senha Atual"
                required
                />{' '}<PiPassword className='icon_input'/>
            </div>

            <div className="inputBox">
            <input
                type="password"
                id="NovaSenha"
                name="NovaSenha"
                maxlength="10"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Limitar a 8 caracteres
                  const truncatedValue = inputValue.slice(0, 8);
                  setNewPassword(truncatedValue);
                }}
                placeholder="Nova Senha"
                required
                />{' '} <PiPasswordDuotone className='icon_input'/>
            </div>

            <button className={`button__change ${newPassword ? 'show' : ''}`} onClick={alterarSenha}>
              Alterar
            </button>
         </div>
         
          )}

        </div>

        <div className='Delete_account'>
          Apagar Conta
        </div>

        </div>
  
    </>
  );
}

export default ProfileBarbearia;