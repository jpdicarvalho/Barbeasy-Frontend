import { useState, useEffect, useRef } from "react";
import axios from "axios";
import './addNewProfessional.css'

//Icons
import { IoClose } from "react-icons/io5";
import { MdOutlineDone } from "react-icons/md";
import { VscError } from "react-icons/vsc";


export default function AddNewProfessional ({ openModal, setCloseModal }){

//Buscando informações da Barbearia logada
const userData = localStorage.getItem('dataBarbearia');//Obtendo os dados salvo no localStorage
const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
const barbeariaId = userInformation.barbearia[0].id;

// ===== Function to create a new professional ===== 
const [newNameProfessional, setNewNameProfessional] = useState('');
const [newPhoneProfessional, setNewPhoneProfessional] = useState('');
const [newEmailProfessional, setNewEmailProfessional] = useState('');
const [newPasswordProfessional, setNewPasswordProfessional] = useState('');
const [messageAddProfessional, setMessageAddProfessional] = useState('');

const createNewProfessional = () =>{

  if(newNameProfessional && newPhoneProfessional && newEmailProfessional && newPasswordProfessional){

    const newProfessional = {
      newNameProfessional,
      newPhoneProfessional,
      newEmailProfessional,
      newPasswordProfessional
    }

    axios.post(`https://api-user-barbeasy.up.railway.app/api/create-professional/${barbeariaId}`, newProfessional)
    .then(res => {
      console.log(res)
      if(res.data.Success === "Success"){
        setMessageAddProfessional("Profissional criado com sucesso.")
        setTimeout(() => {
          setMessageAddProfessional(null);
          setNewNameProfessional('');
          setNewPhoneProfessional('');
          setNewEmailProfessional('');
          setNewPasswordProfessional('');
        }, 2000);
      }
    })
    .catch(err => {
      setMessageAddProfessional('Erro ao cadastrar profissional. Verifique o email digitado e tente novamente.')
      setTimeout(() => {
        setMessageAddProfessional(null);
        setNewEmailProfessional('')
      }, 3000);
      console.log(err)
    });
    }else{
      setMessageAddProfessional('Preencha todos os campos.')
      setTimeout(() => {
        setMessageAddProfessional(null);
      }, 3000);
    }
}

/*
//Metodo para mandar as imagens automaticamente para o back-end
useEffect(() => {
  // Configura um temporizador para esperar 1 segundo após a última mudança no input de arquivo
  const timeout = setTimeout(() => {
    // Executa a função de upload após o período de espera
    handleUpload();
  }, 1000);

  // Limpa o temporizador se o componente for desmontado ou se houver uma nova mudança no input de arquivo
  return () => clearTimeout(timeout);
}, [file]);*/

if(openModal){
    return (
        <>
        <div className="container__form">
            <div className="section__form">

                <div className="closeModal">
                    <button className="Btn__closeModal" onClick={setCloseModal}>
                        <IoClose className="icon_close"/>
                    </button>
                </div>

                <div className="coolinput">
                <label htmlFor="professionalName" className="text">Name:</label>
                <input
                className="input"
                type="text"
                id="professionalName"
                name="professionalName"
                value={newNameProfessional}
                maxLength={100}
                onChange={(e) => setNewNameProfessional(e.target.value)}
                placeholder='Ex. João Pedro'
                />
                </div>

                <div className="coolinput">
                <label htmlFor="celularProfessional" className="text">Celular:</label>
                <input
                type="text"
                id="celularProfessional"
                name="celularProfessional"
                value={newPhoneProfessional}
                className="input"
                onChange={(e) => setNewPhoneProfessional(e.target.value)}
                placeholder="Ex. 93 991121212"
                />
                </div>

                <div className="coolinput">
                <label htmlFor="email" className="text">Email:</label>
                <input
                type="email"
                id="email"
                name="email"
                value={newEmailProfessional}
                className="input"
                maxLength={120}
                onChange={(e) => {
                    const inputValue = e.target.value;
                    // Substituir o conteúdo do campo para conter apenas números, letras, "@" e "."
                    const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9@.]/g, '');
                    // Limitar a 50 caracteres
                    const truncatedValue = sanitizedValue.slice(0, 50);
                    setNewEmailProfessional( truncatedValue );
                }}
                placeholder="email.exemplo@gmail.com"
                required
                />
                </div>

                <div className="coolinput">
                <label htmlFor="passwordProfessional" className="text">Senha:</label>
                <input
                className="input"
                type="password"
                id="passwordProfessional"
                name="passwordProfessional"
                value={newPasswordProfessional}
                maxLength={10}
                onChange={(e) => setNewPasswordProfessional(e.target.value)}
                placeholder='********'
                />
                </div>

              {messageAddProfessional === "Profissional criado com sucesso." ? (
                <div className="mensagem-sucesso">
                  <MdOutlineDone className="icon__success"/>
                  <p className="text__message">{messageAddProfessional}</p>
                </div>
              ) : (
                <div className={` ${messageAddProfessional ? 'mensagem-erro' : ''}`}>
                  <VscError className={`hide_icon__error ${messageAddProfessional ? 'icon__error' : ''}`}/>
                  <p className="text__message">{messageAddProfessional}</p>
                </div>
              )}
            <button className="button__Salve__Service" onClick={createNewProfessional}>
                Cadastrar
            </button>

            </div>
        </div>
            
        </>
    )
}
return null
 
}