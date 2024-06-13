import { useState, useEffect, useRef } from "react";
import axios from "axios";
import './addNewProfessional.css'
import Loader from "../../Loader/Loader";

//Icons
import { IoClose } from "react-icons/io5";
import { MdOutlineDone } from "react-icons/md";
import { VscError } from "react-icons/vsc";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { BsSearch } from "react-icons/bs";

export default function AddNewProfessional ({ openModal, setCloseModal }){

//Buscando informações da Barbearia logada
const token = localStorage.getItem('token');
const userData = localStorage.getItem('dataBarbearia');//Obtendo os dados salvo no localStorage
const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
const barbeariaId = userInformation.barbearia[0].id;

const urlApi = 'https://barbeasy.up.railway.app'

// ===== Function to create a new professional =====
const [expandedCardBooking, setExpandedCardBooking] = useState([]);
const [showForm, setShowForm] = useState(false);
const [showSearchProfessional, setShowSearchProfessional] = useState(true);

const [newNameProfessional, setNewNameProfessional] = useState('');
const [newPhoneProfessional, setNewPhoneProfessional] = useState('');
const [newEmailProfessional, setNewEmailProfessional] = useState('');
const [newPasswordProfessional, setNewPasswordProfessional] = useState('');
const [messageAddProfessional, setMessageAddProfessional] = useState('');

const alternarShowForm = () =>{
  setShowForm(!showForm)
  setShowSearchProfessional(!showSearchProfessional)
}

const handleNameChange = (e) => {
  const value = e.target.value;
  const regex = /^[a-zA-Z]*$/;
  if (regex.test(value) && value.length <= 30) {
    setNewNameProfessional(value);
  }
};

const handlePhoneChange = (e) => {
  const value = e.target.value;
  const regex = /^[0-9]*$/;
  if (regex.test(value) && value.length <= 11) {
    setNewPhoneProfessional(value);
  }
};

const handlePasswordChange = (e) => {
  const value = e.target.value;
  const regex = /^[a-zA-Z0-9@.#%]*$/;
  if (regex.test(value) && value.length <= 8) {
    setNewPasswordProfessional(value);
  }
};

console.log(newNameProfessional, newPhoneProfessional, newEmailProfessional, newPasswordProfessional)

const createNewProfessional = () =>{

  if(newNameProfessional && newPhoneProfessional && newEmailProfessional && newPasswordProfessional){
    const newProfessional = {
      newNameProfessional,
      newPhoneProfessional,
      newEmailProfessional,
      newPasswordProfessional
    }

    axios.post(`${urlApi}/api/v1/createProfessional/${barbeariaId}`, newProfessional, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
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
          setNewNameProfessional('');
          setNewPhoneProfessional('');
          setNewEmailProfessional('');
          setNewPasswordProfessional('');
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

//===== Function to get all professional =====
const [professional, setProfessional] = useState([]);
const [professionalId, setProfessionalId] = useState('');
const [searchProfessional, setSearchProfessional] = useState('');
const [messagemSearchProfessional, setMessagemSearchProfessional] = useState('');
const [messagemRequestProfessional, setMessagemRequestProfessional] = useState('');

const handleSearchChange = (e) => {
  const value = e.target.value;
  const regex = /^[a-zA-Z]*$/;
  if (regex.test(value) && value.length <= 30) {
    setSearchProfessional(value);
  }
};
console.log(searchProfessional)
//Function to get all professionais
const getProfessional = () => {
  axios.get(`${urlApi}/api/v1/listProfessional/${searchProfessional}`, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      if(res.data.Message === "True"){
        setProfessional(res.data.Professional)
      }else{
        setProfessional(res.data.Professional)
        setMessagemSearchProfessional("Nenhum profissional encontrado")
      }
    })
    .catch(error => console.log(error));
}

//Function to expanded booking cards
const toggleItem = (itemId) => {
  setProfessionalId(itemId)
  if (expandedCardBooking.includes(itemId)) {
    setExpandedCardBooking(expandedCardBooking.filter(id => id !== itemId));
  } else {
    setExpandedCardBooking([...expandedCardBooking, itemId]);
  }
};

//===== Section link between barbearia and professional =====
const [removeLoader, setRemoveLoader] = useState(false);

const getAllRequestOfLink = (professional_id) =>{
  if(barbeariaId && professional_id){
    axios.get(`${urlApi}/api/v1/allSolicitation/${barbeariaId}/${professional_id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if(res.data.Success === "true"){
        setRemoveLoader(true)
      }else{
        setRemoveLoader(false)
      }
    })
    .catch(error => console.log(error));
  }
}

//Function to send request of link between barbearia and professional
const sendRequesToProfessional = () =>{
  if(professionalId && barbeariaId){

    const textRequest = 'solicitação de tabalho'
    const values = {
      professionalId,
      barbeariaId,
      textRequest
    }

    axios.post('${urlApi}/api/v1/sendSolicitation', values, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if(res.data.Message === "True"){
        setMessagemRequestProfessional("Solicitação enviada com sucesso!");
        setTimeout(() => {
          setMessagemRequestProfessional("");
          window.location.reload();
        }, 2000);
      }
    })
    .catch(error => {
      console.log(error)
      setMessagemRequestProfessional("Não foi possível enviar a solicitação! Tente novamente mais tarde.")
    });

  }else{
    setMessagemRequestProfessional("Não foi possível enviar a solicitação! Verifique os paramêtros informados.")
    setTimeout(() => {
      setMessagemRequestProfessional("")
    }, 2000);
  }
}

if(openModal){
    return (
        <>
        <div className="container__form">
            <div className="section_professional">
            <div className="tittle__search__professional">
                  <p>Adicionar Profissional</p>
                  <button className="Btn__closeModal" onClick={setCloseModal}>
                    <IoClose className="icon_close"/>
                  </button>
                </div>
              {showSearchProfessional &&(
                <div className="section_search_professional">
                    <div className="inputBox__search">
                      <IoSearchOutline className="icon__lupa"/>
                      
                      <input
                        type="search"
                        className="inputSearch"
                        value={searchProfessional}
                        onChange={handleSearchChange}
                        placeholder="Digite o nome do profissional"
                      />
                      {searchProfessional.length > 0 &&(
                        <IoMdClose className="icon__ClearInput"/>
                      )}
                    </div>
                    <div className="container__search__professional">
                        {messagemRequestProfessional === 'Solicitação enviada com sucesso!' ?(
                          <div className="mensagem-sucesso" style={{width: "100%"}}>
                            <MdOutlineDone className="icon__success"/>
                            <p className="text__message">{messagemRequestProfessional}</p>
                          </div>
                          ) : (
                          <div className={` ${messagemRequestProfessional ? 'mensagem-erro' : ''}`}>
                            <VscError className={`hide_icon__error ${messagemRequestProfessional ? 'icon__error' : ''}`}/>
                            <p className="text__message">{messagemRequestProfessional}</p>
                          </div>
                              )
                        }
                      {professional.length > 0 ?(
                          professional.map(professional => { 
                            // Obtendo a primeira letra do nome do profissional
                            const firstLetter = professional.name.charAt(0).toUpperCase();
                            
                            return (
                                  <div key={professional.id} onClick={() => getAllRequestOfLink(professional.id)} className="Box__search__professional">
                                      <div className="header__searched__professional" onClick={() => toggleItem(professional.id)} >
                                        <div className="Box__image" style={{marginRight: '10px'}}>
                                          <p className='firstLetter'>{firstLetter}</p>
                                        </div>
                                        <p className='name__professional'>{professional.name}</p>
                                      </div>

                                      <div className={`teeesste ${expandedCardBooking.includes(professional.id) ? 'expand__Search__Professional':''}`}>
                                        {removeLoader ?(
                                          <div className="container__send__request">
                                            <Loader/>
                                              <div className="box__waiting__response__professional">
                                                Aguardando resposta do profissional.
                                              </div>
                                          </div>
                                        ):(
                                          <div className="container__send__request">
                                            <button className="button__request_professional" onClick={sendRequesToProfessional}>
                                              Solicitar vínculo
                                            </button>
                                          </div>
                                        )}
                                       
                                      </div>
                                    </div>
                                    
                                );
                          })
                      ):(
                        <div className="message__professional">
                          {messagemSearchProfessional ? (
                            <div>
                              <p>{messagemSearchProfessional}</p>
                              <p style={{fontSize:"30px"}}>:(</p>
                            </div>
                          ):(
                            <div className="message__search__professional">
                              <p>Encontrar profissional </p>
                              <BsSearch style={{margin:"5px", fontSize:"25px"}}/>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {searchProfessional ? (
                      <button className="button__addNewProfessional" onClick={getProfessional}>
                        Buscar
                      </button>
                    ):(
                      <button className="button__Salve__Service" onClick={alternarShowForm}>
                        Cadastrar
                      </button>
                    )}
                </div>
                
              )}
              
              {showForm && (
                <div className="section__form">
                              <div className="coolinput">
                              <label htmlFor="professionalName" className="text">Name:</label>
                              <input
                                className="input"
                                type="text"
                                id="professionalName"
                                name="professionalName"
                                value={newNameProfessional}
                                maxLength={30}
                                pattern="[a-zA-Z]+"
                                onChange={handleNameChange}
                                placeholder="Ex. Marvin"
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
                                maxLength={11}
                                onChange={handlePhoneChange}
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
                                maxLength={50}
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
                                maxLength={8}
                                onChange={handlePasswordChange}
                                placeholder="********"
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
                              <div className="Box__Button">
                                  <button className="button__back__search" onClick={alternarShowForm}>
                                      <IoIosArrowBack />
                                  </button>
                                  <button className="button__Salve__Service" onClick={createNewProfessional}>
                                        Cadastrar
                                  </button>
                              </div>
                            </div>
              )}
            </div>
        </div>
        </>
    )
}
return null
 
}
