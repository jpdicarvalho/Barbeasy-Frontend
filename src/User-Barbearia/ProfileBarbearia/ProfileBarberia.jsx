import React, { useState } from 'react';
import {motion} from 'framer-motion';
import axios from 'axios';
import './ProfileBarbearia.css';
function ProfileBarbearia() {
  //Constantes de Upload de imagem de usuário
  const [fileUserImage, setFileUserImage] = useState();
  const [messageValidationImage, setMessageValidationImage] = useState('');
  const [uploadedUserImage, setUploadedUserImage] = useState([]);//imagem de usuário atual

  const [uploadedImages, setUploadedImages] = useState([]);

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

  const [mostrarNome, setMostrarNome] = useState(false);
  const [mostrarEmail, setMostrarEmail] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [values, setValues] = useState({
    name: '',
    
  });
  //Buscando informações do usuário logado
  const userData = localStorage.getItem('dataBarbearia');//Obtendo os dados salvo no localStorage
  const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
  const barbeariaId = userInformation.barbearia[0].id;//pegando apenas o ID do usuário logado

  console.log('informações do usuário local...',userData)
console.log('informaçoes do usuário em json:',userInformation)
console.log('id da barbearia',barbeariaId)

  // Função para alternar a visibilidade da div de status
  const alternarStatus = () => {
    setMostrarStatus(!mostrarStatus);
  };

  const alternarNomeBarbearia = () => {
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

  const alternarNome = () => {
    setMostrarNome(!mostrarNome);
  };

  const alternarEmail = () => {
    setMostrarEmail(!mostrarEmail);
  };
  const alternarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  //Upload de imagem de Usuário
  const handleFile = (e) => {
    setFileUserImage(e.target.files[0])
  }

  const handleUpload = () => {
    const allowedExtensions = ['jpg', 'jpeg', 'png'];

    const formdata = new FormData();

    // Obtém a extensão do arquivo original
    const fileExtension = fileUserImage.name.split('.').pop();

    // Verifica se a extensão é permitida
    if (!allowedExtensions.includes(fileExtension)) {
      setMessageValidationImage("Extensão de arquivo não permitida. Use 'jpg', 'jpeg' ou 'png'.");
    return;
  }

    // Renomeia a imagem com o ID do usuário mantendo a extensão original
    const renamedFile = new File([fileUserImage], `userBarbeariaId_${barbeariaId}.${fileExtension}`, { type: fileUserImage.type });
    formdata.append('image', renamedFile);

    axios.post('https://api-user-barbeasy.up.railway.app/api/upload-image-user-barbearia', formdata)
    .then(res => {
      if(res.data.Status === "Success"){
        window.location.reload();
      }else{
        console.log('faled')
      }
    })
    .catch(err => console.log(err));
  }


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
                  <span className='material-symbols-outlined' id="editar">edit</span>
                  <input
                    type="file"
                    accept="image/*"
                    id="input-file-user"
                    hidden
                    onChange={handleFile}
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
              <button onClick={handleUpload}>upload</button>
              
              <div className="section__userName">
                João Pedro
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
            <h3>Barbearia</h3>
            <hr id='sublime'/>
        </div>

        <div className="container__menu">

          <div className="menu__main" onClick={alternarStatus}>
            <span className="material-symbols-outlined icon_menu">radio_button_checked</span>
              Status
            <span className={`material-symbols-outlined arrow ${mostrarStatus ? 'girar' : ''}`} id='arrow'>expand_more</span>
          </div>
          

          {mostrarStatus && (
            <div className="divSelected">
              
              <div className="container__checkBox">
                <span>Aberta</span>
                <input type="checkbox" id='status'/>
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

            <div className="container__tittle">
              <p >Rápido</p>
              <hr id='sublime'/>
            </div>

            <button onClick={handleTodosDiasSemana} className="Dias_Semana">
              Todos os dias da Semana
            </button>

            <button onClick={handleDiasDeSegSab} className="Dias_Semana">
            De Seg à Sáb
            </button>

           <div className="container__tittle">
              <p>Personalizado</p>
              <hr id='sublime'/>
            </div>
              {['Domingo', 'Segunda-feria', 'Terça-feria', 'Quata-feria', 'Quita-feria', 'Sexta-feria', 'Sábado'].map(dia => (
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
            <p className='information__span'>Defina os horários de atendimento para todos os dias definidos anteriormente:</p>
            
            <div style={{textAlign: 'center', fontWeight: 'bold'}}>
              <p >Manhã</p>
            </div>

            {['07:30', '08:00', '08:30'].map(horarioManha => (
              <span key={horarioManha} className='Dias_Trabalho_Rapido'>
                <button className='Dias_Semana'>{horarioManha}</button>
              </span>
            ))}
            
            <div style={{textAlign: 'center', fontWeight: 'bold'}}>
              <p >Tarde</p>
            </div>

            {['13:00', '13:30', '14:00'].map(horarioTarde => (
              <span key={horarioTarde} className='Dias_Trabalho_Rapido'>
                <button className='Dias_Semana'>{horarioTarde}</button>
              </span>
            ))}
            
            <div style={{textAlign: 'center', fontWeight: 'bold'}}>
              <p >Noite </p>
            </div>
            
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
            <h3>Usuário</h3>
            <hr id='sublime'/>
        </div>

        <div className="container__menu">

          <div className="menu__main" onClick={alternarNome}>
          <span className="material-symbols-outlined icon_menu">person</span>
            Nome
            <span className={`material-symbols-outlined arrow ${mostrarStatus ? 'girar' : ''}`} id='arrow'>expand_more</span>
          </div>

          {mostrarNome && (
            <div className="divSelected">
              <p className='information__span'>Alterar Nome de usuário</p>

            <div className="inputBox">
            <input
                type="text"
                id="usuario"
                name="usuario"
                value={values.usuario}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres não alfanuméricos
                  const filteredValue = inputValue.replace(/[^a-zA-Z0-9.\s]/g, '');
                  // Limitar a 30 caracteres
                  const truncatedValue = filteredValue.slice(0, 30);
                setValues({ ...values, usuario: truncatedValue });
                }}
                placeholder="Nome de Usuário"
                required
              />{' '}<span className="material-symbols-outlined icon_input">person_edit</span>
            </div>

            <button className='button__change'>
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
                  setValues({ ...values, email: truncatedValue });
                }}
                placeholder="Email"
                required
              />{' '}<span className="material-symbols-outlined icon_input">alternate_email</span>
            </div>

            <button className='button__change'>
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

            <div className="inputBox">
              <input
                type="password"
                id="senha"
                name="senha"
                value={values.senha}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Limitar a 8 caracteres
                  const truncatedValue = inputValue.slice(0, 8);
                  setValues({ ...values, senha: truncatedValue });
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
                value={values.NovaSenha}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Limitar a 8 caracteres
                  const truncatedValue = inputValue.slice(0, 8);
                  setValues({ ...values, NovaSenha: truncatedValue });
                }}
                placeholder="Nova Senha"
                required
                />{' '} <span className="material-symbols-outlined icon_input">lock_reset</span>
            </div>

            <button className='button__change'>
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