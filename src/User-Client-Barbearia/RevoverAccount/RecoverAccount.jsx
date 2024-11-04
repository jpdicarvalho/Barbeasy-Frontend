import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { QRCodeSVG } from 'qrcode.react';

import axios from "axios";

import barberLogo from '../../../barber-logo.png';

import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

function RecoverAccount () {

const urlAuth = 'https://barbeasy-authenticators.up.railway.app'

const navigate = useNavigate();
const location = useLocation();

const [step, setStep] = useState(1);
const [phoneNumber, setPhoneNumber] = useState(false);           
const [objectNewAccount, setObjectNewAccount] = useState(null);
const [seconds, setSeconds] = useState(0);               
const [message, setMessage] = useState('');                    
const [code, setCode] = useState(new Array(5).fill(""));
const [whatsAppVerified, setWhatsAppVerified] = useState(false);                    

const props = useSpring({
    opacity: 1,
    transform: step === 1 ? "translateX(0%)" : `translateX(-${(step - 1) * 0}%)`,
    from: { opacity: 0, transform: "translateX(-100%)" }
});

// Referências para os inputs
const inputRefs = useRef([]);
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

const getDataToAuthUser = () =>{
    axios.get(`${urlAuth}/api/v1/dataToAuth/${objectNewAccount.email}`)
    .then(res =>{
        setPhoneNumber(res.data.phone[0].celular)
    }).catch(err =>{
      console.log(err)
    })
}
// Função para formatar o tempo
const formattedTime = formatTime(seconds);

useEffect(() => {
    if (!location.state) {
      navigate("/SignIn");
    } else {
      const { objectNewAccountForActivation } = location.state;
      setObjectNewAccount(objectNewAccountForActivation);
    }
}, [location, navigate]);

useEffect(() => {
    if (objectNewAccount) {
        getDataToAuthUser()
        setSeconds(calculateTimeDifference(objectNewAccount.data_request || ''));
    }
}, [objectNewAccount]);

// Hook para contagem regressiva
useEffect(() => {
    cronometro()
}, []);
//================= Handle code from input ================

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
//================= resend code ================

const resendCodeAutentication = () => {
  
    let validedNumber;
  
    if(phoneNumber.length === 11){//Ex.:93 9 94455445
      validedNumber = phoneNumber.slice(0, 3) + phoneNumber.slice(3 + 1);//Number formatted: 93 94455445
    }
    
    if(phoneNumber.length === 10){//Ex.:93 94455445
      validedNumber = phoneNumber
    }
  
    //Object with values to save and resend code verification
    const valuesAutentication = {
      phoneNumberToSendMessage: `55${validedNumber}@c.us`,
      phoneNumberToSotorage: validedNumber,
      email: objectNewAccount.email
   }
   
    axios.post(`${urlAuth}/api/v1/resendCodeWhatsapp`, valuesAutentication)
    .then(() =>{
      const newDataRequest = Date.now() + 59 * 1000
      setSeconds(calculateTimeDifference(newDataRequest))
      cronometro()
      getDataToAuthUser()
    })
    .catch(err =>{
      console.log(err)
    })
}
//==================== Section verify code activation =================
const nextStep = () => {
    setStep(step + 1);
};
console.log(code)
const verifyCodeActivation = () =>{
    if(code.join('').length === 5){
      //Object to Auth user
      const values = {
        phoneNumber: phoneNumber,
        email: objectNewAccount.email,
        code: code.join('')
      }
      axios.put(`${urlAuth}/api/v1/verifyUserCode-WhatsApp`, values)
      .then(res =>{
        if(res.status === 201){
          setMessage('Número validado com sucesso!')
           return setTimeout(() => {
            setMessage(null)
            setWhatsAppVerified(true)
            setCode(new Array(5).fill(""))
          }, 2000);
        }
        if(res.status === 204){
          setMessage('Código de ativação incorreto.')
          return setTimeout(() => {
            setMessage(null)
          }, 3000);
        }
      })
      .catch(err =>{
        console.log('Erro ao ativar a conta', err)
        return setMessage('Erro ao ativar a conta.Ttente novamente mais tarde.')
      })
    }else{
      setMessage('Preencha todos os campos.')
      return setTimeout(() => {
        setMessage(null)
      }, 2000);
      
    }
}
//<QRCodeSVG value=""/>

return(
    <>
        <div className="container__in__AccountActivationClient">
            <div className="imgBox">
                <img src={barberLogo} alt="" />
            </div>

            <h2 id="HeaderSignUp">Barbeasy</h2>

            <div className="Box__cadastro__barbearia">
                <h3 style={{color: '#f6f6fc'}}>Recuperação de Conta</h3>
            </div>
            
            <animated.div style={props} className="inputContainer">
                {!whatsAppVerified ? (
                    <div className="information__in__AccountActivationClient">
                
                        <p>Enviamos um código de verificação para o número de WhatsApp {phoneNumber.slice(0,4)}...{phoneNumber[9]} </p>
                        <div className="container__steppers">
                            <div className="inner__steppers">
                                <FaWhatsapp className="icon__steppers"/>
                            </div>
                            <hr  className="inner__way__steppers__no__active" />
                            <div className="inner__steppers__no__done" >
                                <MdOutlineEmail className="icon__steppers__no__active"/>
                            </div>
                        </div>
                        <div className="form__in__AccountActivationClient">
                        {message === 'Número validado com sucesso!' ? (
                        <p className="success">{message}</p>
                        ) : (
                            <p className={message ? 'error':''}>{message}</p>
                        )}
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
                            <button className="input__submit__code__verification" onClick={verifyCodeActivation}>
                                Continuar
                            </button>
                        </div>
                    </div>
                ):(
                    <div className="information__in__AccountActivationClient">
                    
                        <p>Enviamos um código de verificação para o e-mail {objectNewAccount ? objectNewAccount.email:''}</p>
                        <div className="container__steppers">
                            <div className="inner__steppers">
                                <FaCheck className="icon__steppers"/>
                            </div>
                            <hr  className="inner__way__steppers" />
                            <div className="inner__steppers" >
                                <MdOutlineEmail className="icon__steppers"/>
                            </div>
                        </div>
                        
                        <div className="form__in__AccountActivationClient">
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
                            <button className="input__submit__code__verification">
                                Continuar
                            </button>
                        </div>
                    </div>
                )}
            </animated.div>
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
)
}

export default RecoverAccount;