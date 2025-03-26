import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import './AccountActivationClient.css';

import barberLogo from '../../barber-logo.png';
import { MdOutlineEdit } from "react-icons/md";
import { MdCancel } from "react-icons/md";

//import {QRCodeSVG} from 'qrcode.react';

function AccountActivationClient (){
  
const urlAuth = 'https://barbeasy-authenticators.up.railway.app'

//================== Section cronometro ====================
const calculateTimeDifference = (data_request) => {
  const expirationDate = new Date(data_request).getTime();
  const currentDate = Date.now();
  const differenceInMilliseconds = expirationDate - currentDate;

  if (differenceInMilliseconds <= 0) {
    return 0; // Retorna 0 segundos se já expirou
  }

  const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
  return differenceInSeconds;
};

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  // Formatar minutos e segundos com dois dígitos
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}`;
};

function cronometro () {
  const timer = setInterval(() => {
    setSeconds((prevSeconds) => {
      if (prevSeconds <= 0) {
        clearInterval(timer);
        return 0;
      }
      return prevSeconds - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}

const navigate = useNavigate();
const location = useLocation();

const [isLoading, setIsLoading] = useState(false) 

const [objectNewAccount, setObjectNewAccount] = useState(null);
const [numberCodeSended, setNumberCodeSended] = useState('');  
const [editNumber, setEditNumber] = useState(false);           
const [numberEdited, setNumberEdited] = useState('');          
const [message, setMessage] = useState('');                    
const [seconds, setSeconds] = useState(0);               


// Função para formatar o tempo
const formattedTime = formatTime(seconds);
//================= dados from db =========================
const getDataToAuthUser = () =>{
  axios.get(`${urlAuth}/api/v1/dataToAuth/${objectNewAccount.email}/${objectNewAccount.type}`)
  .then(res =>{
    console.log(res)
    setNumberCodeSended(res.data.phone[0].celular)
  }).catch(err =>{
    console.log(err)
  })
}
//============================= Initialize Variables =========================
useEffect(() => {
  if (!location.state) {
    navigate("/SignIn");
  } else {
    const { objectNewAccountForActivation } = location.state;
    setObjectNewAccount(objectNewAccountForActivation);
  }
}, [location, navigate]);

// Segundo useEffect: Atualiza dados relacionados a objectNewAccount
useEffect(() => {
  if (objectNewAccount) {
      getDataToAuthUser()
      setSeconds(calculateTimeDifference(objectNewAccount.data_request || ''));
      setNumberEdited(objectNewAccount.phoneNumber);
  }
}, [objectNewAccount]);

// Hook para contagem regressiva
useEffect(() => {
  cronometro()
}, []);

//================= resend code ================

const resendCodeAutentication = () => {

  //Basics Validations
  if(numberEdited.length < 10){
    setMessage('Informe um número válido.')
    return setTimeout(() => {
      setMessage(null)
    }, 3000);
  }

  let validedNumber;

  if(numberEdited.length === 11){//Ex.:93 9 94455445
    validedNumber = numberEdited.slice(0, 2) + numberEdited.slice(2 + 1);//Number formatted: 93 94455445
  }
  
  if(numberEdited.length === 10){//Ex.:93 94455445
    validedNumber = numberEdited
  }

  //Object with values to save and resend code verification
  const valuesAutentication = {
    phoneNumberToSendMessage: `55${validedNumber}@c.us`,
    phoneNumberToSotorage: validedNumber,
    email: objectNewAccount.email,
    type: objectNewAccount.type
  }
 
  axios.post(`${urlAuth}/api/v1/resendCodeWhatsapp`, valuesAutentication)
  .then(() =>{
    const newDataRequest = Date.now() + 59 * 1000
    setSeconds(calculateTimeDifference(newDataRequest))
    cronometro()
    getDataToAuthUser()
    setEditNumber(false)
  })
  .catch(err =>{
    console.log(err)
  })
}

//================= Handle code from input ================
  // Estado que armazena os valores digitados
  const [code, setCode] = useState(new Array(5).fill(""));
  // Referências para os inputs
  const inputRefs = useRef([]);

  // Função que lida com as mudanças no input
  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/^[0-9]$/.test(value)) {  // Aceitar apenas números
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value !== "" && index < 4) {  // Avançar para o próximo input, se não estiver no último
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Função que lida com o comportamento ao pressionar teclas
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault(); // Evitar o comportamento padrão do Backspace

      const newCode = [...code];
      if (newCode[index] !== "") {  // Se o campo atual não está vazio, limpa-o
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {  // Se o campo está vazio, move o foco para o anterior
        inputRefs.current[index - 1].focus();
        newCode[index - 1] = "";  // Limpar o valor do campo anterior
        setCode(newCode);
      }
    }
  };

//==================== Section verify code activation =================
const verifyCodeActivation = () =>{
  setIsLoading(true)
  if(code.join('').length === 5){
    //Object to Auth user
    const values = {
      phoneNumber: numberCodeSended,
      email: objectNewAccount.email,
      code: code.join(''),
      type: objectNewAccount.type
    }
    axios.put(`${urlAuth}/api/v1/verifyUserCode-WhatsApp`, values)
    .then(res =>{
      if(res.status === 201){
        setIsLoading(false)
        setMessage('Sua conta foi ativada com sucesso!')
         return setTimeout(() => {
          setMessage(null)
          if(objectNewAccount.type === 'barbearia'){
            navigate("/SignInBarbearia");
          }
          if(objectNewAccount.type === 'client'){
            navigate("/SignIn");
          }
        }, 2000);
      }
      if(res.status === 204){
        setIsLoading(false)
        setMessage('Código de ativação incorreto.')
        return setTimeout(() => {
          setMessage(null)
        }, 3000);
      }
    })
    .catch(err =>{
      setIsLoading(false)
      console.log('Erro ao ativar a conta', err)
      return setMessage('Erro ao ativar a conta.Ttente novamente mais tarde.')
    })
  }else{
    setIsLoading(false)
    setMessage('Preencha todos os campos.')
    return setTimeout(() => {
      setMessage(null)
    }, 2000);
    
  }
}
//<QRCodeSVG value=""/>

return (
    <>
      <div className="container__in__AccountActivationClient" translate="no">
        <div className="imgBox">
          <img src={barberLogo} alt="" />
        </div>

        <h2 id="HeaderSignUp">Barbeasy</h2>
        <div className="Box__cadastro__barbearia">
          <h3 style={{color: '#f6f6fc'}}>Verificação de WhatsApp</h3>
        </div>

        <div className="information__in__AccountActivationClient" translate="no">
          {!editNumber && (
            <>
              <p>Enviamos um código de ativação para o número {numberCodeSended}<MdOutlineEdit className="icon__edit__number" onClick={() => setEditNumber(!editNumber)}/>  </p>
            </>
          )}
          {editNumber && (
            <>
              <p>Enviaremos um código de ativação para o número {!editNumber ? objectNewAccount.phoneNumber.slice(0,12):''}{}</p>
              <div className="Box__edit__number">
                <input
                type="tel"
                className="input__number__edit"
                value={numberEdited} 
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const filteredValue = inputValue.replace(/[^0-9]/g, '');
                  // Limitar a 11 caracteres
                  const truncatedValue = filteredValue.slice(0, 11);
                  setNumberEdited(truncatedValue)
                }}/>
                <MdCancel className="icon__CiSquareCheck__number" onClick={() => setEditNumber(!editNumber)}/>

              </div>
            </>
          )}
          
        </div>
          {message === 'Sua conta foi ativada com sucesso!' ? (
            <p className="success">{message}</p>
          ) : (
            <p className={message ? 'error':''}>{message}</p>
          )}
        
        <div className="form__in__AccountActivationClient" translate="no">
          <div className="box__input__in__AccountActivationClient">
            {code.map((_, index) => (
              <input
                key={index}
                type="tel"
                maxLength="1"
                value={code[index]}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => inputRefs.current[index] = el}  // Referenciar o input
                className="input__code__verification"
              />
            ))}
          </div>

          {isLoading ? (
            <div className='center__form'>
              <div className="loaderCreatingBooking"></div>
            </div>
          ):(
            <button className="input__submit__code__verification" onClick={verifyCodeActivation}>
              Ativar conta
            </button>
          )}
          

        </div>
        {formattedTime === '00:00' ? (
          <div className="resend__code__verification" onClick={resendCodeAutentication}>
            Reenviar código
          </div>
        ):(
          <div className="time__resend__code__verification">
            Reenviar código em {formattedTime}
          </div>
        )}
        
      </div>
      
    </>
  );
}

export default AccountActivationClient;
