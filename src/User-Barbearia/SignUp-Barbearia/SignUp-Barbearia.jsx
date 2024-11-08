import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSpring, animated } from "react-spring";

import './style.css';

import { IoStorefrontOutline } from "react-icons/io5";
import { CiLocationArrow1 } from "react-icons/ci";
import { VscAccount } from "react-icons/vsc";
import {QRCodeSVG} from 'qrcode.react';


import barberLogo from '../../../barber-logo.png';

function SignUpBarbearia() {

  const urlApi = 'https://barbeasy.up.railway.app'
  const urlAuth = 'https://barbeasy-authenticators.up.railway.app'

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [celular, setCelular] = useState('');
  const [emailStored, setEmailStored] = useState('');
  const [phoneNumberStored, setPhoneNumberStored] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState(null);
  const [pendingActivation, setPendingActivation] = useState(false)

  const props = useSpring({
    opacity: 1,
    transform: "translateX(0%)",
    from: { opacity: 0, transform: "translateX(-100%)" }
  });
  //Function to farmated whatsApp number
  function formatPhoneNumber (whatsApp) {
    //Basics Validations
    if(whatsApp.length < 10){
        setMessage('Informe um número válido.')
        setTimeout(() => {
            setIsLoading(false)
            setMessage(null)
        }, 2000);

        return false
    }

    let validedNumber;

    if(whatsApp.length === 11){//Ex.:93 9 94455445
        validedNumber = whatsApp.slice(0, 3) + whatsApp.slice(3 + 1);//Number formatted: 93 94455445
    }

    if(whatsApp.length === 10){//Ex.:93 94455445
        validedNumber = whatsApp
    }

    return validedNumber;
  }

  //=================== Request to send code verification =========================
  const sendCodeAutentication = (numberWhatsapp, email) => {

    const numberWhithoutNine = formatPhoneNumber(numberWhatsapp)

    //Object with values to save and send code verification
    const valuesAutentication = {
       phoneNumberToSendMessage: `55${numberWhithoutNine}@c.us`,
       email,
       type: 'barbearia'
    }

    axios.put(`${urlAuth}/api/v1/sendCodeWhatsapp`, valuesAutentication)
    .then(res =>{
      console.log('Código de autenticação enviado')
    })
    .catch(err =>{
      console.log(err)
    })

  }

  const handleSubmit = (event) => {
    event.preventDefault();//impede o navegador de recaregar a página ao enviar o formulário

    setIsLoading(true)
    const numberWhithoutNine = formatPhoneNumber(celular);

    const values = {
      name,
      street,
      number,
      neighborhood,
      city,
      usuario,
      email,
      senha,
      celular: numberWhithoutNine
    };
    
    const objectIsValid = name && street && number && neighborhood && city && usuario && email && senha && celular;

    if (objectIsValid){
      
      axios.post(`${urlApi}/api/v1/SignUpBarbearia`, values)
      .then(res => {
        if (res.status === 201) {
            //Object to Account Activation
            const objectNewAccountForActivation = {
              type: 'barbearia',
              phoneNumber: numberWhithoutNine,
              email: email,
              data_request: Date.now() + 50 * 1000
            }
            setIsLoading(false)
            sendCodeAutentication(objectNewAccountForActivation.phoneNumber, email)
            navigate('/AccountActivationClient', { state: { objectNewAccountForActivation } });          
        } else {
          setIsLoading(false)
          setMessage('Erro ao realizar o cadastro!');
          setTimeout(() => {
            setMessage(null);
          }, 3000);
        }
      })
      .catch(err => {
        console.error(err);
        if(err.response.status === 302){
          setIsLoading(false)
          setEmailStored(err.response.data.userPending.email)
          setPhoneNumberStored(err.response.data.userPending.celular)
          return setPendingActivation(true)
        }
        if (err.response.status === 400) {
          setIsLoading(false)
          setMessage('E-mail ou celular já cadastrados.');
          return setTimeout(() => {
            setMessage(null);
          }, 3000);
        } else {
          setIsLoading(false)
          setMessage('Erro ao realizar o cadastro. Tente novamente mais tarde.');
        }
      });
    }else{
      setIsLoading(false)
      setMessage('Preencha todos os campos.')
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };
  //================ send code to whatsApp e redirect user to recover account =============
  const sendCodeAndRedirectUser = () =>{
    //Object to Recover Account
    const objectNewAccountForActivation = {
      type: 'barbearia',
      phoneNumber: phoneNumberStored,
      email: emailStored,
      data_request: Date.now() + 50 * 1000,
      
    }
    sendCodeAutentication(objectNewAccountForActivation.phoneNumber, objectNewAccountForActivation.email)
    navigate('/RecoverAccount', { state: { objectNewAccountForActivation } });
  }
    
  return (
    <>
    <div className="container__default">
        <form onSubmit={handleSubmit} className="container">
            <div className="imgBox">
              <img src={barberLogo} alt="" />
            </div>

            <h2 id="HeaderSignUp">Barbeasy</h2>
            
            <div className="Box__cadastro__barbearia">
              <IoStorefrontOutline className='icon__IoStorefrontOutline'/>
              <h3 style={{color: '#f6f6fc'}}>Cadastro de Barbearia</h3>
            </div>

            {message === "Cadastro realizado!" ? (
              <p className="success">{message}</p>
              ) : (
              <p className={message ? 'error':''}>{message}</p>
            )}

            {!pendingActivation ? (
              <animated.div style={props}>
              {step >= 1 && (
              <div className="inputBox">
                <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres não alfanuméricos, ponto e espaço
                  const filteredValue = inputValue.replace(/[^a-zA-Z\sçéúíóáõãèòìàêôâ]/g, '');
                  // Limitar a 30 caracteres
                  const truncatedValue = filteredValue.slice(0, 30);
                  setName(truncatedValue);
                }}
                placeholder="Nome da Barbearia"
                maxLength={50}
                required
              /> 

              <input
                type="tel"
                id="celular"
                name="celular"
                value={celular}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const filteredValue = inputValue.replace(/[^0-9]/g, '');
                  // Limitar a 11 caracteres
                  const truncatedValue = filteredValue.slice(0, 11);
                  setCelular(truncatedValue)
                }}
                placeholder="WhatsApp"
                maxLength={16}
                required
              /> 
              </div>
              )}

              {step >= 2 && (
                <div className="inputBox">
                  <div style={{marginTop: '10px'}} className="Box__endereco__barbearia">
                    <CiLocationArrow1 className='icon__GrMapLocation'/>
                    <p id="tittle_p">Endereço</p>
                  </div>
                  
                  <input
                  type="text"
                  id="street"
                  name="street"
                  value={street}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Remover caracteres especiais
                    const filteredValue = inputValue.replace(/[^a-zA-Z\sçéúíóáõãèòìàêôâ]/g, '');
                    // Limitar a 50 caracteres
                    const truncatedValue = filteredValue.slice(0, 30);
                    setStreet(truncatedValue);
                  }}
                  placeholder="Rua"
                  maxLength={30}
                  required
                />

                  <input
                    type="tel"
                    id="number"
                    name="number"
                    value={number}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      // Remover caracteres não numéricos
                      const numericValue = inputValue.replace(/\D/g, '');
                      // Limitar a 5 caracteres
                      const truncatedValue = numericValue.slice(0, 5);
                      setNumber(truncatedValue);
                    }}
                    placeholder="Nº"
                    maxLength={5}
                    required
                  />
                  
                  <input
                    type="text"
                    id="neighborhood"
                    name="neighborhood"
                    value={neighborhood}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      // Remover caracteres especiais
                      const sanitizedValue = inputValue.replace(/[^a-zA-Z\sçéúíóáõãèòìàêôâ]/g, '');
                      // Limitar a 50 caracteres
                      const truncatedValue = sanitizedValue.slice(0, 30);
                      setNeighborhood(truncatedValue);
                    }}
                    placeholder="Bairro"
                    maxLength={20}
                    required
                  />
                  
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={city}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      // Remover caracteres especiais
                      const sanitizedValue = inputValue.replace(/[^a-zA-Z\sçéúíóáõãèòìàêôâ]/g, '');
                      // Limitar a 50 caracteres
                      const truncatedValue = sanitizedValue.slice(0, 30);
                      setCity(truncatedValue);
                    }}
                    placeholder="Cidade"
                    maxLength={20}
                    required
                  />
                </div>
              )}

              {step >= 3 && (
                <div className="inputBox">

                  <div style={{marginTop: '10px'}} className="Box__endereco__barbearia">
                    <VscAccount className='icon__GrMapLocation'/>
                    <p id="tittle_p">Informações de login</p>
                  </div>

                  <input
                    type="text"
                    id="usuario"
                    name="usuario"
                    value={usuario}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      // Remover caracteres não alfanuméricos
                      const filteredValue = inputValue.replace(/[^a-zA-Z\s]/g, '');
                      // Limitar a 30 caracteres
                      const truncatedValue = filteredValue.slice(0, 20);
                    setUsuario(truncatedValue);
                    }}
                    placeholder="Nome de Usuário"
                    maxLength={15}
                    required
                  />

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      // Substituir o conteúdo do campo para conter apenas números, letras, "@" e "."
                      const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9@.]/g, '');
                      // Limitar a 50 caracteres
                      const truncatedValue = sanitizedValue.slice(0, 50);
                      // Validar se o valor atende ao formato de email esperado
                        setEmail(truncatedValue);
                    }}
                    placeholder="Email"
                    maxLength={50}
                    required
                  />

                  <input
                    type="password"
                    id="senha"
                    name="senha"
                    value={senha}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      
                      // Limitar a 8 caracteres
                      const truncatedValue = inputValue.slice(0, 8);
                      setSenha(truncatedValue);
                    }}
                    placeholder="Password"
                    maxLength={8}
                    required
                    />
                </div>
              )}

              {step < 4 && (
                <div className='inputBox'>
                  <button type="submit" onClick={nextStep} id="button_next">Continuar</button>
                </div>
              )}

              {step === 4 && (
                <div className='inputBox'>
                  <div className="inputBox__inner__cadastrar">
                      {isLoading ? (
                        <div className="loaderCreatingBooking"></div>
                      ):(
                        <input type="submit" value="Cadastrar" />
                      )}
                    </div>
                  
                </div>
              )}
              </animated.div>
            ):(
              <div className="box__recover__account">
                <p className="text__information__recover__account">Já existe uma conta com ativação pendente para esse email ou celular informado. Deseja recuperá-la?</p>
                <button type="button" id="button_next" onClick={sendCodeAndRedirectUser}>Recuperar conta</button>
              </div>
            )}

            <div className="link__login">
              <p>Você já tem uma conta?</p><Link className="link" to="/SignInBarbearia">Login</Link>
            </div>
        </form>
      </div>
      
    </>
  );
}

export default SignUpBarbearia;
