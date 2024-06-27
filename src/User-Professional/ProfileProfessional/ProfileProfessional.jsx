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

const [isPasswordVerified, setIsPasswordVerified] = useState(false);

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

//Function to expanded booking cards
const toggleItem = (itemId) => {
    if (expandedCardBooking.includes(itemId)) {
      setExpandedCardBooking(expandedCardBooking.filter(id => id !== itemId));
    } else {
      setExpandedCardBooking([...expandedCardBooking, itemId]);
    }
};

/*=================================================*/
const [mostrarNome, setMostrarNome] = useState(false);
const [novoUserName, setNovoUserName] = useState('');
const [contactProfessional, setContactProfessional] = useState('');
const [messageUserName, setMessageUserName] = useState('');

const alternarNome = () => {
    setMostrarNome(!mostrarNome);
};
//Função responsável por enviar o novo nome de usuário ao back-end
const alterarUserName = () => {
  axios.put(`${urlApi}/api/v1/updateUserNameProfessional/${professionalId}`, {newUserName: novoUserName}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
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
  axios.get(`${urlApi}/api/v1/getContactProfessional/${professionalId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      setContactProfessional(res.data.data_professional)
    })
    .catch(error => console.log(error));
}
//Hook para chamar a função getUserName()
useEffect(() => {
  getUserName()
}, [professionalId]) 
console.log(contactProfessional) 
/*----------------------------------*/
const [mostrarEmail, setMostrarEmail] = useState(false);
const [newEmail, setNewEmail] = useState('');
const [currentEmail, setCurrentEmail] = useState('');
const [messageEmail, setMessageEmail] = useState('');

//Funtion to show input chanege email
const alternarEmail = () => {
  setMostrarEmail(!mostrarEmail);
};

//Function to update email
const alterarEmail = () => {
  axios.put(`${urlApi}/api/v1/updateEmailProfessional/${professionalId}`, {NewEmail: newEmail}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
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

//Condition to execute alterarEmail
if(isPasswordVerified && newEmail){
  alterarEmail()
}

//Function to get email
const getEmail = () =>{
  axios.get(`${urlApi}/api/v1/emailProfessional/${professionalId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(result => {
      setCurrentEmail(result.data.EmailProfessional);
    })
    .catch(error => console.log(error));
}

useEffect(() => {
  getEmail()
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

                    {imageUser.length > 48 ? (
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
          const filteredValue = inputValue.replace(/[^a-zA-Z\s]/g, '');
          // Limitar a 30 caracteres
          const userName = filteredValue.slice(0, 30);
        setNovoUserName(userName);
        }}
        placeholder={userNameProfessional}
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
        placeholder={currentEmail[0] + "..." + currentEmail.split('@')[1]}
        className="white-placeholder"
        maxLength={50}
        required
      />{' '}<MdOutlineAlternateEmail className='icon_input'/>
    </div>

    {newEmail && newEmail.length > 4 &&(
      <div>
        <AuthToUpdateData onPasswordVerify={setIsPasswordVerified}/>
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
