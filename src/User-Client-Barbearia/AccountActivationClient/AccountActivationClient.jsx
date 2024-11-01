import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import './AccountActivationClient.css';

import barberLogo from '../../../barber-logo.png';
import { MdOutlineEdit } from "react-icons/md";


function AccountActivationClient (){
  
  const urlApi = 'https://barbeasy.up.railway.app'
  
  const location = useLocation();
              //navigate('/SignIn')

  const { objectNewAccount } = location.state;
//================= Handle edit number ================
const [editNumber, setEditNumber] = useState(false);
const [numberEdited, setNumberEdited] = useState(objectNewAccount.phoneNumber.slice(0,12));


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
const [message, setMessage] = useState(null);

const verifyCodeActivation = () =>{
    const values = {
      //email: objectNewAccount.email,
      phoneNumber: objectNewAccount.celular,
      message: 'teste from my frontend!'
      //code: code.join('')
    }
    axios.post(`${urlApi}/api/v1/sendCodeWhatsapp`, values)
    .then(res =>{
      if(res.status === 201){
        setMessage('Sua conta foi ativada com sucesso!')
      }
    })
    .catch(err =>{
      console.log('Erro ao ativar a conta', err)
      setMessage('Erro ao ativar a conta')

    })
  /*if(code.join('').length === 5){

  }else{
    return setMessage('Preencha todos os campos.')
  }*/
}
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

const [seconds, setSeconds] = useState(calculateTimeDifference(objectNewAccount.data_request));
const formattedTime = formatTime(seconds);

// Hook para contagem regressiva
useEffect(() => {
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
}, []);

return (
    <>
      <div className="container__in__AccountActivationClient">
        <div className="imgBox">
          <img src={barberLogo} alt="" />
        </div>

        <h2 id="HeaderSignUp">Barbeasy</h2>

        <div className="Box__cadastro__barbearia">
          <h3 style={{color: '#f6f6fc'}}>Verificação de WhatsApp</h3>
        </div>

        <div className="information__in__AccountActivationClient">
          {!editNumber && (
            <>
              <p>Enviamos um código de ativação para o número {objectNewAccount.phoneNumber.slice(0,12)}<MdOutlineEdit className="icon__edit__number" onClick={() => setEditNumber(!editNumber)}/>  </p>
            </>
          )}
          {editNumber && (
            <>
              <p>Enviamos um código de ativação para o número {!editNumber ? objectNewAccount.phoneNumber.slice(0,12):''}{}</p>
              <div className="Box__edit__number">
                <input
                type="text"
                className="input__number__edit"
                value={numberEdited} 
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const filteredValue = inputValue.replace(/[^0-9]/g, '');
                  // Limitar a 11 caracteres
                  const truncatedValue = filteredValue.slice(0, 11);
                  setNumberEdited(truncatedValue)
                }}/>
                <MdOutlineEdit className="icon__edit__number" onClick={() => setEditNumber(!editNumber)}/>
              </div>
            </>
          )}
          
        </div>
        {message}
        <div className="form__in__AccountActivationClient" onClick={verifyCodeActivation}>
          <div className="box__input__in__AccountActivationClient">
            {code.map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={code[index]}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => inputRefs.current[index] = el}  // Referenciar o input
                className="input__code__verification"
              />
            ))}
          </div>

          <input type="submit" value="Ativar conta" className="input__submit__code__verification"/>
        </div>
        {formattedTime === '00:00' ? (
          <div className="resend__code__verification">
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