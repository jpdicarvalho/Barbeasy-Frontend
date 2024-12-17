import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { QRCodeSVG } from 'qrcode.react';

import axios from "axios";

import barberLogo from '../../barber-logo.png';

import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

function RecoverAccount () {

const urlAuth = 'https://barbeasy-authenticators.up.railway.app'

const navigate = useNavigate();
const location = useLocation();

const [isLoading, setIsLoading] = useState(false)
const [step, setStep] = useState(1);
const [phoneNumber, setPhoneNumber] = useState(false);           
const [objectNewAccount, setObjectNewAccount] = useState(null);
const [seconds, setSeconds] = useState(0);               
const [message, setMessage] = useState('');                    
const [code, setCode] = useState(new Array(5).fill(""));
const [whatsAppVerified, setWhatsAppVerified] = useState(false);     
const [emailVerified, setEmailVerified] = useState(false);                    


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
    axios.get(`${urlAuth}/api/v1/dataToAuth/${objectNewAccount.email}/${objectNewAccount.type}`)
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
//================= Recover Account by WhatsApp ================
//resend code to whatsApp
const resendCodeAutenticationToWhatsApp = () => {
  
    let validedNumber;
  
    if(phoneNumber.length === 11){//Ex.:93 9 94455445
      validedNumber = phoneNumber.slice(0, 2) + phoneNumber.slice(2 + 1);//Number formatted: 93 94455445
    }
    
    if(phoneNumber.length === 10){//Ex.:93 94455445
      validedNumber = phoneNumber
    }
  
    //Object with values to save and resend code verification
    const valuesAutentication = {
      phoneNumberToSendMessage: `55${validedNumber}@c.us`,
      phoneNumberToSotorage: validedNumber,
      email: objectNewAccount.email,
      type: objectNewAccount.type,
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

//verify code activation from whatsApp
const verifyCodeActivationFromWhatsApp = () =>{
    if(code.join('').length === 5){
      //Object to Auth user
      const values = {
        type: objectNewAccount.type,
        phoneNumber: phoneNumber,
        email: objectNewAccount.email,
        code: code.join('')
      }
    
      setIsLoading(true)

      axios.put(`${urlAuth}/api/v1/verifyUserCode-WhatsApp`, values)
      .then(res =>{
        if(res.status === 201){
          setMessage('Número validado com sucesso!')
           return setTimeout(() => {
            setIsLoading(false)
            setMessage(null)
            setWhatsAppVerified(true)
            setCode(new Array(5).fill(""))
            setSeconds(0)
            sendCodeAutenticationToEmail()
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
        return setMessage('Erro ao ativar a conta.Tente novamente mais tarde.')
      })
    }else{
      setIsLoading(false)
      setMessage('Preencha todos os campos.')
      return setTimeout(() => {
        setMessage(null)
      }, 2000);
      
    }
}

//=================== Recover Account by Email=========================
const sendCodeAutenticationToEmail = () => {

    axios.put(`${urlAuth}/api/v1/sendCodeEmail`, { type: objectNewAccount.type, email: objectNewAccount.email })
    .then(() =>{
      return
    })
    .catch(err =>{
      console.log(err)
    })

}

//resend code autentication to email
const resendCodeAutenticationToEmail = () => {
   
    axios.put(`${urlAuth}/api/v1/sendCodeEmail`, { type: objectNewAccount.type, email: objectNewAccount.email })
    .then(() =>{
      const newDataRequest = Date.now() + 59 * 1000
      setSeconds(calculateTimeDifference(newDataRequest))
      cronometro()
    })
    .catch(err =>{
      console.log('Erro ao reenviar o email.',err)
    })
  
}

const verifyCodeActivationFromEmail = () =>{
    //Conditional to verify if all codes will typed
    if(code.join('').length === 5){
      //Object to Auth user
      const values = {
        type: objectNewAccount.type,
        email: objectNewAccount.email,
        code: code.join('')
      }

      setIsLoading(true)

      axios.put(`${urlAuth}/api/v1/verifyUserCode-Email`, values)
      .then(res =>{
        if(res.status === 201){
          setMessage('E-mail validado com sucesso!')
           return setTimeout(() => {
            setIsLoading(false)
            setMessage(null)
            setSeconds(0)
            setEmailVerified(true)
            sendNewPasswordToEmail()
          }, 2000);
        }
        if(res.status === 204){
          setMessage('Código de ativação incorreto.')
          return setTimeout(() => {
            setIsLoading(false)
            setMessage(null)
          }, 3000);
        }
      })
      .catch(err =>{
        setIsLoading(false)
        console.log('Erro ao ativar a conta - Email', err)
        return setMessage('Erro ao ativar a conta. Tente novamente mais tarde.')
      })
    }else{
      setMessage('Preencha todos os campos.')
      return setTimeout(() => {
        setIsLoading(false)
        setMessage(null)
      }, 2000);
      
    }
}

const sendNewPasswordToEmail = () => {

    if(objectNewAccount){
        const values = {
            type: objectNewAccount.type,
            email: objectNewAccount.email,
            phoneNumber: objectNewAccount.phoneNumber
        }
        axios.put(`${urlAuth}/api/v1/sendPasswordToEmail`, values)
        .then(() =>{
          return
        })
        .catch(err =>{
          console.log(err)
        })
    }
}

//<QRCodeSVG value=""/>

return(
    <>
        <div className="container__in__AccountActivationClient" translate="no">
            {!emailVerified ? (
                <>
                    <div className="imgBox">
                        <img src={barberLogo} alt="" />
                    </div>

                    <h2 id="HeaderSignUp">Barbeasy</h2>

                    <div className="Box__cadastro__barbearia">
                        <h3 style={{color: '#f6f6fc'}}>Recuperação de Conta</h3>
                    </div>
                    <animated.div style={props} className="inputContainer" translate="no">
                        {!whatsAppVerified ? (
                            <div className="information__in__AccountActivationClient">
                        
                                <p>Enviamos um código de verificação para o número de WhatsApp {phoneNumber ? `${phoneNumber.slice(0,4)}...${phoneNumber[9]}`:''} </p>
                                
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
                                        <div className="loaderCreatingBooking"></div>
                                    ):(
                                        <button className="input__submit__code__verification" onClick={verifyCodeActivationFromWhatsApp}>
                                            Continuar
                                        </button>
                                    )}
                                    
                                </div>
                                {formattedTime === '00:00' ? (
                                    <div className="resend__code__verification" onClick={resendCodeAutenticationToWhatsApp}>
                                        Reenviar código
                                    </div>
                                ):(
                                    <div className="time__resend__code__verification">
                                        Reenviar código em {formattedTime}
                                    </div>
                                )}
                            </div>
                        ):(
                            <div className="information__in__AccountActivationClient">
                            
                                <p>Enviamos um código de verificação para o e-mail {phoneNumber ? `${objectNewAccount.email.slice(0,3)}...${objectNewAccount.email.split('@')[1]}`:''}</p>
                                
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

                                    {message === 'E-mail validado com sucesso!' ? (
                                        <p className="success">{message}</p>
                                    ) : (
                                        <p className={message ? 'error':''}>{message}</p>
                                    )}

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
                                        <div className="loaderCreatingBooking"></div>
                                    ):(
                                        <button className="input__submit__code__verification" onClick={verifyCodeActivationFromEmail}>
                                            Continuar
                                        </button>
                                    )}
                                    
                                </div>
                                {formattedTime === '00:00' ? (
                                    <div className="resend__code__verification" onClick={resendCodeAutenticationToEmail}>
                                        Reenviar código
                                    </div>
                                ):(
                                    <div className="time__resend__code__verification">
                                        Reenviar código em {formattedTime}
                                    </div>
                                )}
                            </div>
                        )}
                    </animated.div>
                </>
            ):(
                <div className="container__payment__approved" translate="no">
                    <IoIosCheckmarkCircleOutline className="icon__CheckmarkCircleOutline"/>
                    <p className="text__one__conection__succesfuly">Sua conta foi recuperada!</p>
                    <p className="text__two__conection__succesfuly">Enviamos uma senha provisória para seu e-mail! Lembre-se de troca-lá após fazer login.</p>
                    <div className="Box__btn__back__Booking__Details" onClick={() => {objectNewAccount.type === 'client' ? navigate("/SignIn"):navigate("/SignInBarbearia")}}>
                        <button className="Btn__back__Booking__Details" >
                            Login
                        </button>
                    </div>
                </div>
            )}
            
            
        </div>
    </>
)
}

export default RecoverAccount;
