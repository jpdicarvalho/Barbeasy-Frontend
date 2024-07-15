import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {motion} from 'framer-motion';

import axios from 'axios';

import { MdOutlineEdit } from "react-icons/md";
import { VscError } from "react-icons/vsc";
import { MdOutlineDone } from "react-icons/md";
import { IoArrowBackSharp } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { PiPassword } from "react-icons/pi";
import { FaUserEdit } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { PiPasswordDuotone } from "react-icons/pi";
import { MdOutlinePhonelinkRing } from "react-icons/md";
import { MdNumbers } from "react-icons/md";

import './ProfileProfessional.css';


const monthNames = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Aug', 'Set', 'Out', 'Nov', 'Dez'
];

const weekNames = [
  'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'
];

function ProfileProfessional() {

  const urlApi = 'https://barbeasy.up.railway.app'

  const navigate = useNavigate();

  //Buscando informações do usuário logado
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('dataprofessional');//Obtendo os dados salvo no localStorage
  const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
  const professionalId = userInformation.professional[0].id;
  const professionalUserName = userInformation.professional[0].name;
  const firstLetter = professionalUserName.charAt(0).toUpperCase();

const navigateToProfileProfessional = () =>{
  navigate("/HomeProfessional");
}

const [confirmPassword, setConfirmPassword] = useState('');

//==========GET USER IMAGE PROFESSIONAL==========
const [imageUser, setImageUser] = useState([]);

//Função para obter as imagens cadastradas
useEffect(() => {
  axios.get(`${urlApi}/api/v1/userImageProfessional`, {
    params: {
        professionalId: professionalId
    },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => {
    setImageUser(res.data.url);
  })
  .catch(err => console.log(err));
}, [professionalId]);

//================UPDATE USER IMAGE================
  //Constantes de Upload de imagem de usuário
  const [file, setfile] = useState(null);
  const [userImageMessage, setUserImageMessage] = useState('');

  const allowedExtensions = ['jpg', 'jpeg', 'png'];

  const currentDateTime = new Date();
  const formdata = new FormData();

  // Formata a data e hora no formato desejado (por exemplo: YYYYMMDD_HHMMSS)
  const formattedDateTime = `${currentDateTime.getFullYear()}${(currentDateTime.getMonth() + 1).toString().padStart(2, '0')}${currentDateTime.getDate().toString().padStart(2, '0')}_${currentDateTime.getHours().toString().padStart(2, '0')}${currentDateTime.getMinutes().toString().padStart(2, '0')}${currentDateTime.getSeconds().toString().padStart(2, '0')}`;

  //Upload user image
  const handleFile = (e) => {
    
    const selectedUseImage = e.target.files[0];
    // Obtém a extensão do arquivo original
    const fileExtension = selectedUseImage ? selectedUseImage.name.split('.').pop() : '';//operador ternário para garantir que name não seja vazio

    if(fileExtension.length > 0){
      // Verifica se a extensão é permitida
      if (!allowedExtensions.includes(fileExtension)) {
        setUserImageMessage("Erro: Use extensões 'jpg', 'jpeg' ou 'png'.");
        setfile(null)
        setTimeout(() => {
          setUserImageMessage('');
        }, 3000);
        return
      }
      setfile(e.target.files[0])
    }
  }

  //Preparando as imagens selecionadas para serem enviadas ao back-end
  const handleUpload = () => {
    const fileExtension = file ? file.name.split('.').pop() : '';
    
    // Renomeia a imagem com o ID do usuário, número aleatório e a data/hora
    const renamedFile = new File([file], `userBarbeariaId_${professionalId}_${formattedDateTime}.${fileExtension}`, { type: file.type });
    formdata.append('image', renamedFile);
    formdata.append('professionalId', professionalId);

    axios.put(`${urlApi}/api/v1/updateUserImageProfessional`, formdata, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
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

  //Method to send images automatically
  useEffect(() => {
    // Configura um temporizador para esperar 1 segundo após a última mudança no input de arquivo
    const timeout = setTimeout(() => {
      // Executa a função de upload após o período de espera
      if(file){
        handleUpload();
      }
      
    }, 1000);

    // Limpa o temporizador se o componente for desmontado ou se houver uma nova mudança no input de arquivo
    return () => clearTimeout(timeout);
  }, [file]);

/*=================================================*/
const [mostrarNome, setMostrarNome] = useState(false);
const [mostrarCelular, setMostrarCelular] = useState(false);
const [mostrarEmail, setMostrarEmail] = useState(false);
const [newName, setNewName] = useState('');
const [newEmail, setNewEmail] = useState('');
const [newPhoneNumber, setNewPhoneNumber] = useState('');
const [dataProfessional, setDataProfessional] = useState('');
const [message, setMessage] = useState('');

const alternarNome = () => {
    setMostrarNome(!mostrarNome);
};

const alternarCelular = () => {
  setMostrarCelular(!mostrarCelular);
};

//Funtion to show input chanege email
const alternarEmail = () => {
  setMostrarEmail(!mostrarEmail);
};

//Função responsável por enviar o novo nome de usuário ao back-end
const alterarDataProfessional = () => {

  const valuesDataProfessional = {
    newName,
    newEmail,
    newPhoneNumber,
    confirmPassword,
    professionalId
  }

  axios.put(`${urlApi}/api/v1/updateDataProfessional`, valuesDataProfessional, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
        if(res.data.Success === 'Success'){
          setMessage("Alteração realizada com sucesso.")
          setConfirmPassword('')
          // Limpar a mensagem após 3 segundos (3000 milissegundos)
          setTimeout(() => {
            setMessage('');
            setNewName('')
            setNewEmail('')
            setNewPhoneNumber('')
            getDataProfessional()
          }, 3000);
        }
      })
      .catch(error => {
        setMessage("Erro ao atualizar o nome de usuário.")
        setConfirmPassword('')

          // Limpar a mensagem após 3 segundos (3000 milissegundos)
          setTimeout(() => {
            setMessage('');
            window.location.reload();
          }, 3000);
        console.error('Erro ao atualizar o nome de usuário:', error);
      });
};

//Função para obter o nome de usuário atual da barbearia
const getDataProfessional = () =>{
  axios.get(`${urlApi}/api/v1/getDataProfessional/${professionalId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      setDataProfessional(res.data.data_professional)
    })
    .catch(error => console.log(error));
}

//Hook para chamar a função getDataProfessional()
useEffect(() => {
  getDataProfessional()
}, [professionalId]) 

/*----------------------------------*/
const [mostrarSenha, setMostrarSenha] = useState(false);
const [passwordConfirm, setPasswordConfirm] = useState('');
const [newPassword, setNewPassword] = useState('');
const [messagePassword, setMessagePassword] = useState('');

const alternarSenha = () => {
  setMostrarSenha(!mostrarSenha);
};

const alterarSenha = () => {
  axios.get(`${urlApi}/api/v1/updatePasswordProfessional  `, {
    params: {
      professionalId: professionalId,
      passwordConfirm: passwordConfirm,
      newPassword: newPassword
    },
    headers: {
      'Authorization': `Bearer ${token}`
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

return (
    <>
    <div className="container__profile__professional">
        <div className="back" onClick={navigateToProfileProfessional}>
          <IoArrowBackSharp className="Icon__Back"/>
        </div>
        <div className='section__image__profile'>
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

                    {imageUser.length > 49 ? (
                        <div className="img-view-profile">
                            <img src={imageUser} alt="" id='img-profile' />
                        </div>
                    ) : (
                        <div className="Box__image  Box__first__letter">
                            <p className='firstLetter__professional'>{firstLetter}</p>
                        </div>
                    )}
                </label>
            </div>
        <div className="section__userName">
            {professionalUserName}
        </div>
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

{message === 'Alteração realizada com sucesso.' ?(
            <div className="mensagem-sucesso">
              <MdOutlineDone className="icon__success"/>
              <p className="text__message">{message}</p>
            </div>
        ) : (
            <div className={` ${message ? 'mensagem-erro' : ''}`}>
              <VscError className={`hide_icon__error ${message ? 'icon__error' : ''}`}/>
              <p className="text__message">{message}</p>
            </div>
        )}

<div className="container__menu">

<div className="menu__main" onClick={alternarNome}>
  <FaRegUser className='icon_menu'/>
    Nome
  <IoIosArrowDown className={`arrow ${mostrarNome ? 'girar' : ''}`} id='arrow'/>
  </div>

  {mostrarNome && (
    <div className="divSelected">
      <p className='information__span'>Alterar Nome de usuário</p>
        
    <div className="inputBox">
    <input
        type="text"
        id="usuario"
        name="usuario"
        maxLength={30}
        onChange={(e) => {
          const inputValue = e.target.value;
          // Remover caracteres não alfanuméricos
          const filteredValue = inputValue.replace(/[^a-zA-Z\s]/g, '');
          // Limitar a 30 caracteres
          const userName = filteredValue.slice(0, 30);
        setNewName(userName);
        }}
        placeholder={dataProfessional[0].name}
        className="white-placeholder"
        required
      />{' '}<FaUserEdit className='icon_input'/>
    </div>

    {newName.length > 0 &&(
      <div style={{paddingLeft: '10px'}}>
        <div className="form__change__data">
            <div className='container__text__change__data'>
                Digite sua senha para confirmar a alteração
            </div>

          <div className='container__form__change__data'>
            <input
                type="password"
                id="senha"
                name="senha"
                value={confirmPassword}
                className={`input__change__data ${confirmPassword ? 'input__valided':''}`}
                onChange={(e) => {
                    const inputValue = e.target.value;
                    // Limitar a 10 caracteres
                    const truncatedPasswordConfirm = inputValue.slice(0, 10);
                    setConfirmPassword(truncatedPasswordConfirm);
                }}
                placeholder="Senha atual"
                maxLength={8}
                required
                /><PiPassword className='icon__input__change__data'/>
                <button className={`Btn__confirm__changes ${confirmPassword ? 'Btn__valided':''}`} onClick={alterarDataProfessional}>
                    Confirmar
                </button>
          </div>
        </div>
      </div>
    )}
 </div>
 
  )}

<hr className='hr_menu' />

  <div className="menu__main" onClick={alternarCelular}>
    <MdOutlinePhonelinkRing className='icon_menu'/>
      Celular
    <IoIosArrowDown className={`arrow ${mostrarCelular ? 'girar' : ''}`} id='arrow'/>
  </div>

    {mostrarCelular && (
      <div className="divSelected">
        <p className='information__span'>Alterar número de contato</p>

          <div className="inputBox">
            <input
              type="text"
              id="text"
              name="text"
              onChange={(e) => {
                const inputValue = e.target.value;
                //regex to valided password
                const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9]/g, '');
                // Limitar a 10 caracteres
                const truncatedPasswordConfirm = sanitizedValue.slice(0, 11);
                setNewPhoneNumber(truncatedPasswordConfirm);
              }}
              placeholder={dataProfessional[0].cell_phone}
              maxLength={11}
              required
              />{' '}<MdNumbers  className='icon_input'/>
          </div>

          {newPhoneNumber.length > 10 &&(
            <div style={{paddingLeft: '10px'}}>
              <div className="form__change__data">
                  <div className='container__text__change__data'>
                      Digite sua senha para confirmar a alteração
                  </div>

                <div className='container__form__change__data'>
                  <input
                      type="password"
                      id="senha"
                      name="senha"
                      value={confirmPassword}
                      className={`input__change__data ${confirmPassword ? 'input__valided':''}`}
                      onChange={(e) => {
                          const inputValue = e.target.value;
                          // Limitar a 10 caracteres
                          const truncatedPasswordConfirm = inputValue.slice(0, 10);
                          setConfirmPassword(truncatedPasswordConfirm);
                      }}
                      placeholder="Senha atual"
                      maxLength={8}
                      required
                      /><PiPassword className='icon__input__change__data'/>
                      <button className={`Btn__confirm__changes ${confirmPassword ? 'Btn__valided':''}`} onClick={alterardataProfessional}>
                          Confirmar
                      </button>
                </div>
              </div>
            </div>
          )}
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
          }else{
            setNewEmail('')
          }
        }}
        placeholder={dataProfessional[0].email[0] + "..." + dataProfessional[0].email.split('@')[1]}
        className="white-placeholder"
        maxLength={50}
        required
      />{' '}<MdOutlineAlternateEmail className='icon_input'/>
    </div>

    {newEmail.length > 0 &&(
      <div style={{paddingLeft: '10px'}}>
        <div className="form__change__data">
            <div className='container__text__change__data'>
                Digite sua senha para confirmar a alteração
            </div>

          <div className='container__form__change__data'>
            <input
                type="password"
                id="senha"
                name="senha"
                value={confirmPassword}
                className={`input__change__data ${confirmPassword ? 'input__valided':''}`}
                onChange={(e) => {
                    const inputValue = e.target.value;
                    // Limitar a 10 caracteres
                    const truncatedPasswordConfirm = inputValue.slice(0, 10);
                    setConfirmPassword(truncatedPasswordConfirm);
                }}
                placeholder="Senha atual"
                maxLength={8}
                required
                /><PiPassword className='icon__input__change__data'/>
                <button className={`Btn__confirm__changes ${confirmPassword ? 'Btn__valided':''}`} onClick={alterardataProfessional}>
                    Confirmar
                </button>
          </div>
        </div>
      </div>
    )}
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
        onChange={(e) => {
          const inputValue = e.target.value;
          //regex to valided password
          const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9@.#%]/g, '');
          // Limitar a 10 caracteres
          const truncatedPasswordConfirm = sanitizedValue.slice(0, 8);
          setPasswordConfirm(truncatedPasswordConfirm);
        }}
        placeholder="Senha Atual"
        maxLength={8}
        required
        />{' '}<PiPassword className='icon_input'/>
    </div>

    <div className="inputBox">
    <input
        type="password"
        id="NovaSenha"
        name="NovaSenha"
        onChange={(e) => {
          const inputValue = e.target.value;
          //regex to valided password
          const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9@.#%]/g, '');
          // Limitar a 8 caracteres
          const truncatedValue = sanitizedValue.slice(0, 8);
          setNewPassword(truncatedValue);
        }}
        placeholder="Nova Senha"
        maxLength={8}
        required
        />{' '} <PiPasswordDuotone className='icon_input'/>
    </div>

    <button className={`button__change ${newPassword ? 'show' : ''}`} onClick={alterarSenha}>
      Alterar
    </button>
 </div>
 
  )}

</div>
    </div>
    </>
);
}

export default ProfileProfessional;
