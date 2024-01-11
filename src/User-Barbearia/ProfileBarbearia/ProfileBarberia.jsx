import React, { useState } from 'react';
import {motion} from 'framer-motion';
import './ProfileBarbearia.css';
function ProfileBarbearia() {

  const [uploadedImages, setUploadedImages] = useState([]);

  const [uploadedUserImage, setUploadedUserImage] = useState('');

  const [mostrarStatus, setMostrarStatus] = useState(false);
  const [statusSelecionado, setStatusSelecionado] = useState('');

  const [mostrarNomeBarbearia, setMostrarNomeBarbearia] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  
  const [mostrarEndereco, setMostrarEndereco] = useState(false);
  const [novoEndereco, setNovoEndereco] = useState('');
  
  const [mostrarDiasSemana, setMostrarDiasSemana] = useState(false);
  const [DiasSemanaSelecionado, setDiasSemanaSelecionado] = useState([]);
  const [QntDiasTrabalhoSelecionado, setQntDiasTrabalhoSelecionado] = useState('');

  const [mostrarHorario, setMostrarHorario] = useState(false);
  const [HorarioSelecionadoManha, setHorarioSelecionadoManha] = useState('');
  const [HorarioSelecionadoTarde, setHorarioSelecionadoTarde] = useState('');
  const [HorarioSelecionadoNoite, setHorarioSelecionadoNoite] = useState('');
  const [DuracaoServicoSelecionado, setDuracaoServicoSelecionado] = useState('');

  const [mostrarServico, setMostrarServico] = useState(false);
  
  /*console.log(statusSelecionado)
  console.log(HorarioSelecionadoManha)
  console.log(HorarioSelecionadoTarde)
  console.log(HorarioSelecionadoNoite)
  console.log(DuracaoServicoSelecionado)
  console.log(DiasSemanaSelecionado)
  console.log(QntDiasTrabalhoSelecionado)*/
  const [values, setValues] = useState({
    name: '',
    
  });

  // Função para alternar a visibilidade da div de status
  const alternarStatus = () => {
    setMostrarStatus(!mostrarStatus);
  };

  const alternarNome = () => {
    setMostrarNomeBarbearia(!mostrarNomeBarbearia);
  };

  const alternarEndereco = () => {
    setMostrarEndereco(!mostrarEndereco);
  };

  const alternarDiasTrabalho = () => {
    setMostrarDiasSemana(!mostrarDiasSemana);
  };

  const alternarHorario = () => {
    setMostrarHorario(!mostrarHorario);
  };

  const alternarServico = () => {
    setMostrarServico(!mostrarServico);
  };

  const handleImageBannerUpload = (event) => {
    const files = event.target.files;
    
    // Verifica se o número de imagens excede 5
    if (files.length > 5) {
      alert('Selecione no máximo 5 imagens.');
      window.location.reload()
      return;
    }
    // Atualiza o estado apenas com as primeiras 5 imagens
    const imagesArray = Array.from(files).map((file) => URL.createObjectURL(file)).slice(0, 5);
    setUploadedImages(imagesArray);
  };
 //Pegando a img de usuário
 const handleUserImage = (event) => {
  const file = event.target.files[0];

  if (file) {
    const imageUrl = URL.createObjectURL(file);
    setUploadedUserImage(imageUrl);
  }
};

//pegando o click nas divis

  const handleNomeChange = (event) => {
    setNovoNome(event.target.value);
  };

  const handleEnderecoChange = (event) => {
    setNovoEndereco(event.target.value);
  };

  const handleQntDiasTrabalhoChange = (event) => {
    setQntDiasTrabalhoSelecionado(event.target.value);
  };

  const handleTodosDiasSemana = () => {
    setDiasSemanaSelecionado(['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']);
  };

  const handleDiasDeSegSab = () => {
    setDiasSemanaSelecionado(['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']);
  };

  return (
    <>
    <div className="main-settings">
      <div className="container__profile">
        <span className="material-symbols-outlined icon_back">arrow_back_ios_new</span>
              <div className="img__user_edit"> 
                  <label htmlFor="input-file-user" id="drop-area-user">
                  <input
                    type="file"
                    accept="image/*"
                    id="input-file-user"
                    hidden
                    onChange={handleUserImage}
                  />

                  {uploadedUserImage ? (
                    <div className="img-view-profile">
                      <img src={uploadedUserImage} alt="Imagem de perfil de usuário" id='img-profile' />
                    </div>
                  ) : (
                    <motion.div className="img-view-user">
                    <span className="material-symbols-outlined icon_user_edit">person</span>
                  </motion.div>
                  )}
                </label>
      
              </div>
              <motion.div className="img-view-user">
                    <span id="editar">Editar</span>
                  </motion.div>
              
              <div className="section__userName">
                jp.dicarvalho
              </div>

          </div>

        <motion.div  className="banner">
          <motion.div
          className="container__banner"
          whileTap={{cursor:"grabbing"}}
          drag="x"
          dragConstraints={uploadedImages.length === 5 ? { right: 0, left: -1600}:
                           uploadedImages.length === 4 ? { right: 0, left: -1400}:
                           uploadedImages.length === 3 ? { right: 0, left: -1000}:
                           uploadedImages.length === 2 ? { right: 0, left: -600}:
                           uploadedImages.length === 1 ? { right: 0, left: -200}:{ right: 0, left: 0}}

          >
          {uploadedImages.map((image, index) => (
                  <motion.div key={index} className='container-img-upload' whileTap={{cursor:"grabbing"}}>
                    <img src={image} alt="" className='img-uploaded' />
                  </motion.div>
                ))}
            <label htmlFor="input-file" id='drop-area'>
              <input
                type="file"
                accept="image/*"
                id='input-file'
                hidden
                multiple
                onChange={handleImageBannerUpload}
              />
              <motion.div className="img-view" style={{ width: uploadedImages.length > 0 ? '150px' : '380px' }}>
                <span className="material-symbols-outlined icon_upload">backup</span>
                <p>Incluir Imagem <br/>da Barbearia</p>
              </motion.div>

            </label>
          </motion.div>
          
        </motion.div>

        <div className="section_information">       
<hr />
        <div className='tittle_menu'>
            <h3>Informações da Barbearia</h3>
        </div>

        <div className="container__menu">

          <div className="menu__main" onClick={alternarStatus}>
            <span className="material-symbols-outlined icon_menu">radio_button_checked</span>
              Status
            <span className={`material-symbols-outlined arrow ${mostrarStatus ? 'girar' : ''}`} id='arrow'>expand_more</span>
          </div>
          

          {mostrarStatus && (
            <div className="divSelected">

              <div className="conatiner_button_status">
                <button id='Button_Aberta'>
                  Aberta
                </button>

                <button id='Button_Fechada'>
                  Fechada
                </button>
              </div>

            </div>
          )}
          
<hr className='hr_menu'/>

          <div className="menu__main" onClick={alternarNome} >
          <span className="material-symbols-outlined icon_menu">store</span>
            Nome
            <span className={`material-symbols-outlined arrow ${mostrarNomeBarbearia ? 'girar' : ''}`} id='arrow'>expand_more</span>
          </div>

          {mostrarNomeBarbearia && (
            <div className="divSelected">
              <p className='information__span'>Altere o nome da Barbearia</p>

            <div className="inputBox">
              <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Remover caracteres não alfanuméricos, ponto e espaço
                const filteredValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ.]/g, '');
                // Limitar a 30 caracteres
                const truncatedValue = filteredValue.slice(0, 30);
                setValues({ ...values, name: truncatedValue });
              }}
              placeholder="Nome da Barbearia"
              required
            /> <span class="material-symbols-outlined icon_input">add_business</span>
            </div>

            <button className='button__change'>
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
                        setValues({ ...values, street: truncatedValue });
                      }}
                      placeholder="Rua"
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
                      setValues({ ...values, number: truncatedValue });
                    }}
                    placeholder="Nº"
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
                      setValues({ ...values, neighborhood: truncatedValue });
                    }}
                    placeholder="Bairro"
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
                      setValues({ ...values, city: truncatedValue });
                    }}
                    placeholder="Cidade"
                    required
                  />{' '} <span className="material-symbols-outlined" id="icon_input_city">map</span>
                    </div>

                      <button className='button__change'>
                        Alterar
                      </button>
                  </div>
                  
          )}
        </div>

        <div className="container__menu">

          <div className="menu__main" onClick={alternarDiasTrabalho}>
          <span className="material-symbols-outlined icon_menu">calendar_clock</span>
              Definir Dias de Trabalho
              <span className={`material-symbols-outlined arrow ${mostrarDiasSemana ? 'girar' : ''}`} id='arrow'>expand_more</span>
          </div>
          
          {mostrarDiasSemana && (
            <div className="divSelected">

            <p className='information__span'>Selecione os dias da semana em que deseja trabalhar:</p>
            
            <button onClick={handleTodosDiasSemana} className="Dias_Semana">
              Todos os dias da Semana
            </button>

            <button onClick={handleDiasDeSegSab} className="Dias_Semana">
            De Seg à Sáb
            </button>

              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
                <span key={dia} className='Dias_Trabalho_Rapido'>
                 <button className='Dias_Semana'>{dia}</button>
                </span>
              ))}

              <p className='information__span'>Escolha a quantidade de dias a serem disponibilizados para agendamento:</p>

              {['Próximos 7 dias', 'Próximos 15 dias', 'Próximos 30 dias'].map(dia => (
              <span key={dia} className='Dias_Trabalho_Rapido'>
                <button className='Dias_Semana'>{dia}</button>
              </span>
            ))}

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

            <p className='information__span' style={{ fontWeight: '600' }}>Início do Expediente</p>
            <p className='information__span'>Defina os horários de agendamento para todos os dias definidos anteriormente:</p>
            <span className='tittle_horario'>Manhã</span>

            {['07:30', '08:00', '08:30'].map(horarioManha => (
              <span key={horarioManha} className='Dias_Trabalho_Rapido'>
                <button className='Dias_Semana'>{horarioManha}</button>
              </span>
            ))}
            <span className='tittle_horario'>Tarde</span>
            {['13:00', '13:30', '14:00'].map(horarioTarde => (
              <span key={horarioTarde} className='Dias_Trabalho_Rapido'>
                <button className='Dias_Semana'>{horarioTarde}</button>
              </span>
            ))}
            <span className='tittle_horario'>Noite</span>
            {['19:00', '19:15', '19:30'].map(horarioNoite => (
              <span key={horarioNoite} className='Dias_Trabalho_Rapido'>
                <button className='Dias_Semana'>{horarioNoite}</button>
              </span>
            ))}

            <p className='information__span' style={{ fontWeight: '600' }}>
              Tempo de Atendimento
            </p>
            <p className='information__span'>Defina o tempo de duração do serviço:</p>

            {['15 Minutos', '30 Minutos', '45 Minutos', '1 Hora'].map(duracaoServico => (
              <span key={duracaoServico} className='Dias_Trabalho_Rapido'>
                <button className='Dias_Semana'>{duracaoServico}</button>
              </span>
            ))}
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
            <h3>Informações de Usuário</h3>
        </div>

        <div className="container__menu">

          <div className="menu__main" onClick={alternarStatus}>
          <span className="material-symbols-outlined icon_menu">person</span>
            Nome
            <span className={`material-symbols-outlined arrow ${mostrarStatus ? 'girar' : ''}`} id='arrow'>expand_more</span>
          </div>
          
<hr className='hr_menu'/>

          <div className="menu__main" onClick={alternarNome} >
          <span className="material-symbols-outlined icon_menu">mail</span>
            Email
            <span className={`material-symbols-outlined arrow ${mostrarNomeBarbearia ? 'girar' : ''}`} id='arrow'>expand_more</span>
          </div>

<hr className='hr_menu' />

          <div className="menu__main" >
          <span className="material-symbols-outlined icon_menu">password</span>
            Senha
            <span className={`material-symbols-outlined arrow ${mostrarEndereco ? 'girar' : ''}`} id='arrow'>expand_more</span>
          </div>

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