import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {motion} from 'framer-motion';

import axios from 'axios';

import { MdOutlineEdit } from "react-icons/md";
import { VscError } from "react-icons/vsc";

import Notification from '../Notification/Notification';

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
  navigate("/ProfileProfessional");
}
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
    const renamedFile = new File([file], `userBarbeariaId_${barbeariaId}_${formattedDateTime}.${fileExtension}`, { type: file.type });
    formdata.append('image', renamedFile);
    formdata.append('barbeariaId', barbeariaId);

    axios.put(`${urlApi}/api/v1/updateUserImageBarbearia`, formdata, {
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


return (
    <>
    <div className="container__profile__professional">
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
    </div>
    </>
);
}

export default ProfileProfessional;
