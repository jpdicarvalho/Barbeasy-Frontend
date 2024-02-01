import React, { useState, useEffect } from 'react';
import {motion} from 'framer-motion';
import axios from 'axios';
import './ProfileBarbearia.css';
function ProfileBarbearia() {

  //Buscando informações do usuário logado
  const userData = localStorage.getItem('dataBarbearia');//Obtendo os dados salvo no localStorage
  const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
  const barbeariaId = userInformation.barbearia[0].id;

  const [mostrarServico, setMostrarServico] = useState(false);
  
  const alternarServico = () => {
    setMostrarServico(!mostrarServico);
  };

/*-----------------------------------*/
  //Constantes de Upload de imagem de usuário
  const [file, setfile] = useState();
  const [imageUser, setImageUser] = useState([]);
  const [message, setMessage] = useState('');

  //Upload user image
  const handleFile = (e) => {
    setfile(e.target.files[0])
  }
  //Preparando as imagens selecionadas para serem enviadas ao back-end
  const handleUpload = () => {
    const allowedExtensions = ['jpg', 'jpeg', 'png'];

    const formdata = new FormData();

    // Obtém a extensão do arquivo original
    const fileExtension = file ? file.name.split('.').pop() : '';//operador ternário para garantir que name não seja vazio

    // Verifica se a extensão é permitida
    if (!allowedExtensions.includes(fileExtension)) {
      setMessage("Extensão de arquivo não permitida. Use 'jpg', 'jpeg' ou 'png'.");
      return;
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
        console.log('Succeded')
        window.location.reload();
      }else{
        console.log('faled')
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
  const [bannerMessage, setBannerMessage] = useState('');

  //Upload banner images
  const handleBannerImages = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setBannerFiles(selectedFiles);
  }
  //Preparando as imagens selecionadas para serem enviadas ao back-end
  const handleBannerImagesUpload = () => {
    const allowedExtensions = ['jpg', 'jpeg', 'png'];

    const bannerFormData = new FormData();

    if (bannerFiles.length === 0) {
      setBannerMessage("Selecione pelo menos uma imagem.");
      return;
    }
    if(bannerFiles.length > 5){
      setBannerMessage("Selecione apenas 5 imagens");
      return;
    }

    // Itera sobre os arquivos selecionados
    for (let i = 0; i < bannerFiles.length; i++) {
      const file = bannerFiles[i];

      // Obtém a extensão do arquivo original
      const fileExtension = file.name.split('.').pop();

      // Verifica se a extensão é permitida
      if (!allowedExtensions.includes(fileExtension)) {
        setBannerMessage("Extensão de arquivo não permitida. Use 'jpg', 'jpeg' ou 'png'.");
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
          window.location.reload();
        } else {
          console.log('Banner Images Upload Failed');
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
              window.location.reload();
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
  useEffect(() => {
    axios.get(`https://api-user-barbeasy.up.railway.app/api/nome-barbearia/${barbeariaId}`)
      .then(res => {
        setNomeBarbeariaAtual(res.data.NomeBarbearia)
      })
      .catch(error => console.log(error));
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
            // Limpar a mensagem após 3 segundos (3000 milissegundos)
            setTimeout(() => {
              setMessageEndereco('');
              window.location.reload();
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
  useEffect(() => {
    axios.get(`https://api-user-barbeasy.up.railway.app/api/endereco/${barbeariaId}`)
      .then(res => {
        setEndereco(res.data.Endereco)
      })
      .catch(error => console.log(error));
  }, [barbeariaId])
/*----------------------------------*/
  const [mostrarDiasSemana, setMostrarDiasSemana] = useState(false);
  const [daysWeekSelected, setDaysWeekSelected] = useState([]);
  const [QntDaysSelected, setQntDaysSelected] = useState([]);
  const [agenda, setAgenda] = useState([]);
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
          className="days-switch" // Adicione a classe aqui
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
        // Limpar a mensagem após 3 segundos (3000 milissegundos)
        setTimeout(() => {
          setMessageAgenda('');
          window.location.reload();
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
  useEffect(() => {
    axios.get(`https://api-user-barbeasy.up.railway.app/api/agenda/${barbeariaId}`)
    .then(res => {
      if(res.status === 200){
        setAgenda(res.data.Agenda)
      }
    }).catch(error => {
      console.error('Erro ao buscar informações da agenda da barbearia', error)
    })
  }, [barbeariaId])
  //Iniciando os inputs Checked com os valores cadastrados na agenda
  useEffect(() => {
    if (Array.isArray(agenda) && agenda.length >= 2) {
      setDaysFromAgenda(agenda[0].split(','));// Separando o array com os dias da semana por dias
      setDaysWeekSelected(daysFromAgenda);//Iniciando a variável dos inputs dias da semana
      setQntDaysSelected(agenda[1].toString());//Iniciando a variável do input quantidade de dias
    }
  }, [agenda]);  
/*----------------------------------*/
  const [mostrarHorario, setMostrarHorario] = useState(false);
  const [daysFromAgenda, setDaysFromAgenda] = useState([]);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [HorarioFuncionamento, setHorarioFuncionamento] = useState([]);
  const [tempoAtendimentoSelected, setTempoAtendimentoSelected] = useState([]);
  const [horarioDefinido, setHorarioDefinido] = useState([]);

  //Função para mostra as opções de dias definidos
  const alternarHorario = () => {
    setMostrarHorario(!mostrarHorario);
  };
  //Função para mostrar as opções de definição de horário
  const handleDiaClick = (dia) => {
    setDiaSelecionado(dia);
  };
  //Função para gerar as opções de horários
  function generateHorarios(inicio, termino, intervalo) {
    const horarios = [];
    let horaAtual = inicio;

    while (horaAtual <= termino) {
      horarios.push(horaAtual);

      const totalMinutos = parseInt(horaAtual.substring(0, 2)) * 60 + parseInt(horaAtual.substring(3)) + intervalo;
      const novaHora = Math.floor(totalMinutos / 60).toString().padStart(2, '0');
      const novosMinutos = (totalMinutos % 60).toString().padStart(2, '0');
      horaAtual = `${novaHora}:${novosMinutos}`;
    }
    return horarios;
  }
  const horarios = generateHorarios('07:30', '22:30', 15);
  // Função para lidar com a seleção de um horário
  const handleHorarioFuncionamento = (horario) => {
      if (HorarioFuncionamento.length === 2 && !HorarioFuncionamento.includes(horario)) {
          // Já existem dois horários selecionados e o horário clicado não está entre eles
          return;
      }
      // Verifica se o horário já está selecionado
      if (HorarioFuncionamento.includes(horario)) {
          // Remove o horário da seleção
          setHorarioFuncionamento(HorarioFuncionamento.filter(item => item !== horario));
      } else {
          // Adiciona o horário à seleção
          setHorarioFuncionamento([...HorarioFuncionamento, horario]);
      }
  };
  // Função para lidar com a seleção de um horário
  const handleIntervalo = (horario) => {
    if (horarioDefinido.includes(horario)) {
      // Remove o horário da seleção
      const novosIntervalos = horarioDefinido.filter(item => item !== horario);
      setHorarioDefinido(novosIntervalos);
    } else {
      // Adiciona o horário à seleção
      setHorarioDefinido([...horarioDefinido, horario]);
    }
  };
  // Função para lidar com a seleção de um horário
  const handleAtendimento = (atendimento) => {
    if (tempoAtendimentoSelected.length === 1 && !tempoAtendimentoSelected.includes(atendimento)) {
        return;
    }
    // Verifica se o horário já está selecionado
    if (tempoAtendimentoSelected.includes(atendimento)) {
        setTempoAtendimentoSelected(tempoAtendimentoSelected.filter(item => item !== atendimento));      
    } else {
        setTempoAtendimentoSelected([...tempoAtendimentoSelected, atendimento]);
    }
  };
  //Função para gerar o período de funcionamento
  const handleHorariosDefinidos = () => {
    if(HorarioFuncionamento && tempoAtendimentoSelected.length > 0){
      const tempAtendimento = parseInt(tempoAtendimentoSelected[0].split('min')[0]);
      const horariosDefinido = generateHorarios(HorarioFuncionamento[0], HorarioFuncionamento[1], tempAtendimento);
      return setHorarioDefinido(horariosDefinido)
    }
  }
  //Função para gerar automaticamente os horários de funcionamento
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleHorariosDefinidos();
    }, 1000);
    return () => clearTimeout(timeout);

  }, [HorarioFuncionamento, tempoAtendimentoSelected]);
/*----------------------------------*/
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
            setMessageUserName("Nome de Usuário Alterado com Sucesso!")
            // Limpar a mensagem após 3 segundos (3000 milissegundos)
            setTimeout(() => {
              setMessageUserName('');
              window.location.reload();
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
  useEffect(() => {
    axios.get(`https://api-user-barbeasy.up.railway.app/api/user-name-barbearia/${barbeariaId}`)
      .then(res => {
        setUserNameBarbearia(res.data.UserNameBarbearia)
      })
      .catch(error => console.log(error));
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
          setMessageEmail("Email Alterado com Sucesso!")
            // Limpar a mensagem após 3 segundos (3000 milissegundos)
            setTimeout(() => {
              setMessageEmail('');
              window.location.reload();
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
  useEffect(() => {
    axios.get(`https://api-user-barbeasy.up.railway.app/api/email-barbearia/${barbeariaId}`)
      .then(result => {
        setCurrentEmail(result.data.EmailBarbearia);
      })
      .catch(error => console.log(error));
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
        setMessagePassword("Senha Alterada com Sucesso!")
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
    <div className="main-settings">
      <div className="container__profile">

        <span className="material-symbols-outlined icon_back">arrow_back_ios_new</span>

              <div className="img__user_edit"> 
                  <label htmlFor="input-file-user" id="drop-area-user">
                  <span className='material-symbols-outlined' id="editar">edit</span>
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
                      <span className="material-symbols-outlined icon_user_edit">person</span>
                    </motion.div>
                  )}

                </label>
              </div>

              <div className="section__userName">
                {userNameBarbearia}
              </div>

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
                <span className="material-symbols-outlined icon_upload">backup</span>
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
            <span className="material-symbols-outlined icon_menu" style={{color: '#1AEE07'}}>radio_button_checked</span>
            :
            <span className="material-symbols-outlined icon_menu">radio_button_checked</span>
            } Status
            <span className={`material-symbols-outlined arrow ${mostrarStatus ? 'girar' : ''}`} id='arrow'>expand_more</span>
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
          <span className="material-symbols-outlined icon_menu">store</span>
            Nome
            <span className={`material-symbols-outlined arrow ${mostrarNomeBarbearia ? 'girar' : ''}`} id='arrow'>expand_more</span>
          </div>

          {mostrarNomeBarbearia && (
            <div className="divSelected">
            <p className='information__span'>Altere o nome da Barbearia</p>
            {messageNameBarbearia === 'Nome da Barbearia Alterado com Sucesso!' ?
                        <p className="mensagem-sucesso">{messageNameBarbearia}</p>
                        :
                        <p className="mensagem-erro">{messageNameBarbearia}</p>
                      }
          
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
              /> <span className="material-symbols-outlined icon_input">add_business</span>
            </div>
          
            <button className={`button__change ${novoNomeBarbearia ? 'show' : ''}`} onClick={alterarNomeBarbearia}>
              Alterar
            </button>
          </div>          
         
          )}

<hr className='hr_menu' />

        <div className="menu__main" onClick={alternarEndereco} >
            <span className="material-symbols-outlined icon_menu">pin_drop</span>
              Endereço
              <span className={`material-symbols-outlined arrow ${mostrarEndereco ? 'girar' : ''}`} id='arrow'>expand_more</span>
        </div>

        {mostrarEndereco && (
                    <div className="divSelected">
                      <p className='information__span'>Altere o endereço da Barbearia</p>

                      {messageEndereco === 'Endereço Alterado com Sucesso!' ?
                        <p className="mensagem-sucesso">{messageEndereco}</p>
                        :
                        <p className="mensagem-erro">{messageEndereco}</p>
                      }
                      
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
                      /> <span className="material-symbols-outlined icon_input">add_road</span>

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
                    />{' '} <span className="material-symbols-outlined" id="icon_street_number">home_pin</span>
                    
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
                    /><span className="material-symbols-outlined" id="icon_input_neighborhood">route</span>
                    
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
                    />{' '} <span className="material-symbols-outlined" id="icon_input_city">map</span>
                      </div>

                      <button className={`button__change ${valuesEndereco.city ? 'show' : ''}`} onClick={alterarEndereco}>
                        Alterar
                      </button>
                    </div>
                    
        )}
        </div>

        <div className="container__menu">

        <div className="menu__main" onClick={alternarDiasTrabalho}>
          <span className="material-symbols-outlined icon_menu">calendar_clock</span>
            Definir Dias de Trabalho
          <span className={`material-symbols-outlined arrow`} id='arrow'>expand_more</span>
        </div>
          
        {mostrarDiasSemana && (
        <div className="divSelected">
          {messageAgenda === 'Agenda Atualizada com Sucesso!' ?
                <p className="mensagem-sucesso">{messageAgenda}</p>
                  :
                <p className="mensagem-erro">{messageAgenda}</p>
              }
        <p className='information__span'>Selecione os dias da semana em que deseja trabalhar:</p>
        {diasSemana.map((dia, index) => (
          <div className="container__checkBox" key={index}>
            <span>{dia}</span>
            <Checkbox dia={dia} />
          </div>
        ))}

        <p className='information__span'>Escolha a quantidade de dias a serem disponibilizados para agendamento:</p>
        <div className="container__checkBox">
          <span>Próximos 7 dias</span>
          <CheckboxQntDias value="7" />
        </div>
        <div className="container__checkBox">
          <span>Próximos 15 dias</span>
          <CheckboxQntDias value="15" />
        </div>
        <div className="container__checkBox">
          <span>Próximos 30 dias</span>
          <CheckboxQntDias value="30" />
        </div>
        <button className={`button__change ${QntDaysSelected.length > 0 && daysWeekSelected.length > 0 ? 'show' : ''}`} onClick={updateAgenda}>
          Alterar
        </button>

      </div>
      )}

<hr className='hr_menu'/>

      <div className="menu__main" onClick={alternarHorario}>
          <span className="material-symbols-outlined icon_menu">schedule</span>
              Definir Horários de Trabalho
              <span className={`material-symbols-outlined arrow ${mostrarHorario ? 'girar' : ''}`} id='arrow'>expand_more</span>
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
                      {diaSelecionado === day && horarioDefinido.length > 0 && (
                        <div>
                          <p className='information__span'>Deseja remover algum horário?</p>
                          <div className="inputs-horarios">
                            {horarioDefinido.map((horario, index) => (
                              <div
                                key={index}
                                className={`horario-item ${horarioDefinido.includes(horario) ? 'Horario-selecionado' : ''}`}
                                onClick={() => handleIntervalo(horario)}
                              >
                                <p>{horario}</p>
                              </div>
                            ))}
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
          <span className="material-symbols-outlined icon_menu">cut</span>
              Definir Serviços
              <span className={`material-symbols-outlined arrow ${mostrarServico ? 'girar' : ''}`} id='arrow'>expand_more</span>
          </div>

          {mostrarServico && (
            <div className="divSelected">

              <div className='container__servicos'>
                Nenhum Serviço Cadastrado
              </div>

              <div className='add_Service'>
              <span className="material-symbols-outlined">add</span>
                Adicionar Serviço
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
          <span className="material-symbols-outlined icon_menu">person</span>
            Nome
            <span className={`material-symbols-outlined arrow ${mostrarNome ? 'girar' : ''}`} id='arrow'>expand_more</span>
          </div>

          {mostrarNome && (
            <div className="divSelected">
              <p className='information__span'>Alterar Nome de usuário</p>
              <p className="mensagem-sucesso">{messageUserName}</p>

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
                setNovoUserName({userName});
                }}
                placeholder={userNameBarbearia}
                className="white-placeholder"
                required
              />{' '}<span className="material-symbols-outlined icon_input">person_edit</span>
            </div>

            <button className={`button__change ${novoUserName ? 'show' : ''}`} onClick={alterarUserName}>
              Alterar
            </button>
         </div>
         
          )}
          
<hr className='hr_menu'/>

          <div className="menu__main" onClick={alternarEmail} >
            <span className="material-symbols-outlined icon_menu">mail</span>
              Email
            <span className={`material-symbols-outlined arrow ${mostrarEmail ? 'girar' : ''}`} id='arrow'>expand_more</span>
          </div>

          {mostrarEmail && (
            <div className="divSelected">
              <p className='information__span'>Alterar Email</p>
              {messageEmail === 'Email Alterado com Sucesso!' ?
                <p className="mensagem-sucesso">{messageEmail}</p>
                  :
                <p className="mensagem-erro">{messageEmail}</p>
            }

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
              />{' '}<span className="material-symbols-outlined icon_input">alternate_email</span>
            </div>

            <button className={`button__change ${newEmail ? 'show' : ''}`} onClick={alterarEmail}>
              Alterar
            </button>
         </div>
         
          )}          

<hr className='hr_menu' />

<div className="menu__main" onClick={alternarSenha}>
          <span className="material-symbols-outlined icon_menu">password</span>
            Senha
            <span className={`material-symbols-outlined arrow ${mostrarSenha ? 'girar' : ''}`} id='arrow'>expand_more</span>
          </div>

          {mostrarSenha && (
            <div className="divSelected">
              <p className='information__span'>Alterar Senha</p>
              {messagePassword === 'Senha Alterada com Sucesso!' ?
                <p className="mensagem-sucesso">{messagePassword}</p>
                  :
                <p className="mensagem-erro">{messagePassword}</p>
              }

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
                />{' '} <span className="material-symbols-outlined icon_input">lock</span>
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
                />{' '} <span className="material-symbols-outlined icon_input">lock_reset</span>
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
    </div>
    </>
  );
}

export default ProfileBarbearia;