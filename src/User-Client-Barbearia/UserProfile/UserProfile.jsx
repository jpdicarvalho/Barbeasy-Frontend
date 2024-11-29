import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import axios from 'axios';

import { MdOutlineEdit } from "react-icons/md";
import { VscError } from "react-icons/vsc";
import { MdOutlineDone } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { PiPassword } from "react-icons/pi";
import { FaUserEdit } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { PiPasswordDuotone } from "react-icons/pi";
import { FaWhatsapp } from "react-icons/fa6";
import { MdNumbers } from "react-icons/md";
import { BsCalendar2Check } from "react-icons/bs";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";

import './UserProfile.css';


function UserProfile() {

  const urlApi = 'https://barbeasy.up.railway.app'

  const navigate = useNavigate();

  //Buscando informações do usuário logado
  const token = localStorage.getItem('token');
  const userDataFromLocalStorage = localStorage.getItem('userData');//Obtendo os dados salvo no localStorage
  const userInformation = JSON.parse(userDataFromLocalStorage);//trasnformando os dados para JSON
  const userId = userInformation.user.id;

const navigateToHome = () =>{
    navigate("/Home");
}
const navigateToBookingsHistory = () =>{
  navigate("/BookingsHistory");
}
//Função LogOut
const logoutClick = () => {
    ['token', 'userData'].forEach(key => localStorage.removeItem(key));
    navigate("/");
};

const [confirmPassword, setConfirmPassword] = useState('');
const [isLoading, setIsLoading] = useState(false) 

//==========GET USER IMAGE PROFESSIONAL==========
const [userImage, setUserImage] = useState([]);

//Função para obter as imagens cadastradas
useEffect(() => {
  axios.get(`${urlApi}/api/v1/userImage`, {
    params: {
        userId: userId
    },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => {
    setUserImage(res.data.url);
  })
  .catch(err => {
    if(err.response.status === 403){
      return navigate("/SessionExpired")
    }
    console.log(err)
  });
}, [userId]);

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
    setIsLoading(true)
    const fileExtension = file ? file.name.split('.').pop() : '';
    
    // Renomeia a imagem com o ID do usuário, número aleatório e a data/hora
    const renamedFile = new File([file], `userClient_${userId}_${formattedDateTime}.${fileExtension}`, { type: file.type });
    formdata.append('image', renamedFile);
    formdata.append('userId', userId);
    formdata.append('password', confirmPassword);
    formdata.append('formattedDateTime', formattedDateTime);

    axios.put(`${urlApi}/api/v1/updateUserImage`, formdata, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      setIsLoading(false)
        setfile(false)
        setUserImageMessage("Imagem atualizada com sucesso.");
        setConfirmPassword('')
        setTimeout(() => {
          setUserImageMessage(null);
          window.location.reload()
        }, 2000);
    })
    .catch(err => {
      console.log(err)
      setIsLoading(false)
      if(err.response.status === 401){
        setUserImageMessage("Verifique a senha informada e tente novamente.");
        return setTimeout(() => {
          setUserImageMessage(null);
          setConfirmPassword('')
          window.location.reload()
        }, 3000);
      }else if(err.response.status === 403){
        return navigate("/SessionExpired")
      }
      setUserImageMessage('Erro ao atualizar a imagem. Tente novamente mais tarde.')
        setConfirmPassword('')
        setTimeout(() => {
          setUserImageMessage(null);
        }, 3000);
    });
  }
/*=================================================*/
const [mostrarNome, setMostrarNome] = useState(false);
const [mostrarCelular, setMostrarCelular] = useState(false);
const [mostrarEmail, setMostrarEmail] = useState(false);
const [newName, setNewName] = useState('');
const [nameUser, setNameUser] = useState('');
const [newEmail, setNewEmail] = useState('');
const [newPhoneNumber, setNewPhoneNumber] = useState('');
const [userData, setUserData] = useState('');
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

//Função para obter o nome de usuário atual da barbearia
const getUserData = () =>{
    axios.get(`${urlApi}/api/v1/getUserData/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setUserData(res.data.User)
        setNameUser(res.data.User[0].name)
      })
      .catch(error => {
        if(error.response.status === 403){
          return navigate("/SessionExpired")
        }
        console.log(error)
      });
}
//Função responsável por enviar o novo nome de usuário ao back-end
const alterUserData = () => {
  setIsLoading(true)

  let validedNumber;

  if(newPhoneNumber.length === 11){//Ex.:93 9 94455445
    validedNumber = newPhoneNumber.slice(0, 3) + newPhoneNumber.slice(3 + 1);//Number formatted: 93 94455445
  }

  if(newPhoneNumber.length === 10){//Ex.:93 94455445
    validedNumber = newPhoneNumber
  }

  const valuesUserData = {
    newName,
    newEmail,
    newPhoneNumber: validedNumber,
    confirmPassword,
    userId
  }

  axios.put(`${urlApi}/api/v1/updateUserData`, valuesUserData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
          setMessage("Alteração realizada com sucesso.")
          setConfirmPassword('')
          setIsLoading(false)
          // Limpar a mensagem após 3 segundos (3000 milissegundos)
          setTimeout(() => {
            setMessage(false);
            setNewName(false)
            setNewEmail(false)
            setNewPhoneNumber(false)
            getUserData()
          }, 3000);
    })
    .catch(error => {
      console.error('Erro ao realizar alteração:', error);
      if(error.response.status === 400){
        setIsLoading(false)
        setMessage(error.response.data.message)
        return setTimeout(() => {
            setMessage('');
          }, 3000);
      }
      if(error.response.status === 401){
        setIsLoading(false)
        setMessage("Verifique a senha informada e tente novamente.");
        return setTimeout(() => {
          setMessage('');
        }, 3000);
      }
      if(error.response.status === 403){
        return navigate("/SessionExpired")
      }
      if(error.response.status === 404){
        setIsLoading(false)
        setMessage("Erro ao atualizar cadastro. Não foi possível localizar o usuário.")
        return setTimeout(() => {
            setMessage('');
          }, 3000);
      }
      setIsLoading(false)
      setMessage("Erro ao realizar alteração.")
      setConfirmPassword('')
        setTimeout(() => {
          setMessage('');
        }, 3000);
    });
};

//Hook para chamar a função getUserData()
useEffect(() => {
  getUserData()
}, [userId]) 

/*----------------------------------*/
const [mostrarSenha, setMostrarSenha] = useState(false);
const [passwordConfirm, setPasswordConfirm] = useState('');
const [newPassword, setNewPassword] = useState('');
const [messagePassword, setMessagePassword] = useState('');

const alternarSenha = () => {
  setMostrarSenha(!mostrarSenha);
};

const alterarSenha = () => {
  setIsLoading(true)

  const valuesToUpdateUserPassword = {
    userId: userId,
    passwordConfirm: passwordConfirm,
    newPassword: newPassword
  }

  axios.put(`${urlApi}/api/v1/updateUserPassword`, valuesToUpdateUserPassword, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => {
      setMessagePassword("Senha alterada com sucesso.")
      setIsLoading(false)
        setTimeout(() => {
          setMessagePassword('');
          setPasswordConfirm('');
          setNewPassword('');
          setMostrarSenha(false)
        }, 3000);
  }).catch(error => {
        console.log(error)
        setIsLoading(false)
        if(error.response.status === 403){
          return navigate("/SessionExpired")
        }
        setMessagePassword(error.response.data.message)
        setTimeout(() => {
          setMessagePassword('');
        }, 3000);
  });
};

return (
    <>
    <div className="container__profile__professional" style={{paddingBottom: '70px'}} translate="no">
        <div className='section__image__profile' translate="no">
            <div className="img__user_edit" translate="no"> 
                <label htmlFor="input-file-user" id="drop-area-user">
                    <MdOutlineEdit id="editar"/>
                    <input
                        type="file"
                        accept="image/*"
                        id="input-file-user"
                        hidden
                        onChange={handleFile}
                    />

                    {userImage.length > 49 ? (
                        <div className="img-view-profile">
                            <img src={userImage} alt="" id='img-profile' />
                        </div>
                    ) : (
                        <div className="Box__image  Box__first__letter" translate="no">
                            <p className='firstLetter__professional'>{nameUser.charAt(0).toUpperCase()}</p>
                        </div>
                    )}
                </label>
            </div>
        <div className="section__userName" translate="no">
            {nameUser}
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

        {file &&(
            file.name.length > 0 &&
            <div style={{paddingLeft: '10px'}}>
              {isLoading ? (
                  <div className="loaderCreatingBooking"></div>
                ):(
                  <div style={{width:'385px'}} className="form__change__data">
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
                              //regex to valided password
                              const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9@.#%]/g, '');
                              // Limitar a 10 caracteres
                              const truncatedPasswordConfirm = sanitizedValue.slice(0, 8);
                              setConfirmPassword(truncatedPasswordConfirm);
                          }}
                          placeholder="Senha atual"
                          maxLength={8}
                          required
                          /><PiPassword className='icon__input__change__data'/>
                          <button className={`Btn__confirm__changes ${confirmPassword ? 'Btn__valided':''}`} onClick={handleUpload}>
                              Confirmar
                          </button>
                  </div>
                  </div>
                )}
            </div>
        )}
        </div>

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

    <div className="container__menu" translate="no">
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
                    const filteredValue = inputValue.replace(/[^a-zA-Z\sçéúíóáõãèòìàêôâ.]/g, '');
                    // Limitar a 30 caracteres
                    const userName = filteredValue.slice(0, 30);
                    setNewName(userName);
                    }}
                    placeholder={userData[0].name}
                    className="white-placeholder"
                    required
                />{' '}<FaUserEdit className='icon_input'/>
                </div>

                {newName.length > 0 &&(
                <div style={{paddingLeft: '10px'}} className='center__form'>
                  {isLoading ? (
                    <div className="loaderCreatingBooking"></div>
                  ):(
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
                            <button className={`Btn__confirm__changes ${confirmPassword ? 'Btn__valided':''}`} onClick={alterUserData}>
                                Confirmar
                            </button>
                    </div>
                    </div>
                  )}
                </div>
                )}
            </div>
        
        )}

    <hr className='hr_menu' />

    <div className="menu__main" onClick={alternarCelular} translate="no">
        <FaWhatsapp className='icon_menu'/>
        WhatsApp
        <IoIosArrowDown className={`arrow ${mostrarCelular ? 'girar' : ''}`} id='arrow'/>
    </div>

        {mostrarCelular && (
        <div className="divSelected">
            <p className='information__span'>Alterar número de contato</p>
            <div className="inputBox">
                <input
                type="tel"
                id="celular"
                name="celular"
                onChange={(e) => {
                    const inputValue = e.target.value;
                    //regex to valided password
                    const sanitizedValue = inputValue.replace(/[^0-9]/g, '');
                    // Limitar a 10 caracteres
                    const truncatedPasswordConfirm = sanitizedValue.slice(0, 11);
                    setNewPhoneNumber(truncatedPasswordConfirm);
                }}
                placeholder={userData[0].celular}
                maxLength={11}
                required
                />{' '}<MdNumbers  className='icon_input'/>
            </div>

            {newPhoneNumber.length >= 10 &&(
                <div style={{paddingLeft: '10px'}} className='center__form'>
                {isLoading ? (
                  <div className="loaderCreatingBooking"></div>
                ):(
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
                          <button className={`Btn__confirm__changes ${confirmPassword ? 'Btn__valided':''}`} onClick={alterUserData}>
                              Confirmar
                          </button>
                      </div>
                  </div>
                )}
                </div>
            )}
        </div>
        )}

    <hr className='hr_menu'/>

    <div className="menu__main" onClick={alternarEmail} translate="no" >
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
            placeholder={userData[0].email[0] + "..." + userData[0].email.split('@')[1]}
            className="white-placeholder"
            maxLength={50}
            required
        />{' '}<MdOutlineAlternateEmail className='icon_input'/>
        </div>

        {newEmail.length > 0 &&(
          <div style={{paddingLeft: '10px'}} className='center__form'>
          {isLoading ? (
            <div className="loaderCreatingBooking"></div>
          ):(
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
                      <button className={`Btn__confirm__changes ${confirmPassword ? 'Btn__valided':''}`} onClick={alterUserData}>
                          Confirmar
                      </button>
              </div>
              </div>
          )}
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
        
        {isLoading && newPassword ? (
          <div className='center__form'>
            <div className="loaderCreatingBooking"></div>
          </div>
        ):(
          <button className={`button__change ${newPassword ? 'show' : ''}`} onClick={alterarSenha}>
            Alterar
          </button>
        )}
    </div>
    
    )}
    </div>
    
    </div>
      <ul className="Navigation active in__user__profile">
        <li>
          <button onClick={navigateToHome}>
              <IoHomeOutline />
          </button>
        </li>
        <li>
          <button>
            <BsCalendar2Check onClick={navigateToBookingsHistory}/>
          </button>
        </li>
        <li>
          <button onClick={logoutClick}>
            <MdOutlineLogout />
          </button>
        </li>
      </ul>
    </>
);
}

export default UserProfile;