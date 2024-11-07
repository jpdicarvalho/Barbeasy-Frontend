import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import './ResetPassword.css'

import {QRCodeSVG} from 'qrcode.react';

import barberLogo from '../../barber-logo.png';
import { MdOutlineEdit } from "react-icons/md";
import { MdCancel } from "react-icons/md";

function ResetPassword () {

const urlApi = 'https://barbeasy.up.railway.app'
const urlAuth = 'https://barbeasy-authenticators.up.railway.app'

//================== Section cronometro ====================

const navigate = useNavigate();
const location = useLocation();

const [isLoading, setIsLoading] = useState(false)
const [methodSendCode, setMethodSendCode] = useState('');
const [email, setEmail] = useState('');  
const [whatsApp, setWhatsApp] = useState('');
const [codeSend, setCodeSend] = useState(false);

const [message, setMessage] = useState('');   

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

//Function to send a code autentication
const sendCodeToResetPassword = () =>{
    setIsLoading(true)
    
    if(methodSendCode === 'email'){
        //Basics Validations
        if(!email){
            setMessage('Informe um e-mail válido.')
            setTimeout(() => {
                setIsLoading(false)
                setMessage(null)
            }, 2000);

            return false
        }
        axios.put(`${urlAuth}/api/v1/sendCodeEmail`, {email: email})
        .then(res =>{
            if(res.status === 204){
                setMessage('E-mail de usuário não encontrado.')
                return setTimeout(() => {
                    setIsLoading(false)
                    setMessage(null)
                }, 3000);
            }
            if(res.status === 200){
                setIsLoading(false)
                setCodeSend(true)
            }  
        })
        .catch(err =>{
            setMessage('Houve um erro ao enviar o código. Tente novamente mais tarde..')
            console.log(err)
                return setTimeout(() => {
                    setIsLoading(false)
                    setEmail('')
                    setMessage(null)
                }, 3000);
        })
    }

    if(methodSendCode === 'whatsApp'){
        const validedNumber = formatPhoneNumber(whatsApp)

        if(validedNumber) {
            //Object with values to send a new password
            const valuesToSendPassword = {
                phoneNumberToSendMessage: `55${validedNumber}@c.us`,
                phoneNumberToFindUser: validedNumber
            }

            axios.put(`${urlAuth}/api/v1/sendCodeWhatsapp`, valuesToSendPassword)
            .then(res =>{
                if(res.status === 204){
                    setMessage('Número de WhatsApp não encontrado.')
                    return setTimeout(() => {
                        setIsLoading(false)
                        setMessage(null)
                    }, 3000);
                }
                if(res.status === 200){
                    setIsLoading(false)
                    setCodeSend(true)
                }  
            })
            .catch(err =>{
                setMessage('Houve um erro ao enviar o código. Tente novamente mais tarde..')
                console.log(err)
                return setTimeout(() => {
                    setIsLoading(false)
                    setWhatsApp('')
                    setMessage(null)
                }, 3000);
            })
        }
    }
}

const verifyCodeToResetPassword = () => {
    setIsLoading(true)

    const codeString = code.join('');

    if (codeString.length !== 5) {
        setMessage('Preencha todos os campos.');
        return setTimeout(() => setMessage(null), 2000);
    }

    let objectToResetPassword = null;

    if (email) {
        objectToResetPassword = {
            methodSendCode: { type: 'email' },
            valueToFindUser: email,
            code: codeString
        };
    } else if (whatsApp) {
        const validedNumber = formatPhoneNumber(whatsApp);
        objectToResetPassword = {
            methodSendCode: {
                type: 'WhatsApp',
                value: `55${validedNumber}@c.us`
            },
            valueToFindUser: validedNumber,
            code: codeString
        };
    }

    if (objectToResetPassword) {
        axios.put(`${urlAuth}/api/v1/resetPassword`, objectToResetPassword)
            .then(res => {
                if (res.status === 201) {
                    setMessage('Excelente! Enviamos uma nova senha de acesso para esse contato verificado.');
                    return setTimeout(() => {
                        setMessage(null);
                        setIsLoading(false)
                        navigate("/SignIn");
                    }, 4000);
                } else if (res.status === 204) {
                    setMessage('Código de ativação incorreto.');
                    setIsLoading(false)
                    return setTimeout(() => setMessage(null), 3000);
                }
            })
            .catch(err => {
                setIsLoading(false)
                console.error('Erro ao ativar a conta:', err);
                setMessage('Erro ao ativar a conta. Tente novamente mais tarde.');
            });
    }
};
//<QRCodeSVG value=""/>

return(
        <>
            <div className="container__in__AccountActivationClient">
                <div className="imgBox">
                <img src={barberLogo} alt="" />
                </div>

                <h2 id="HeaderSignUp">Barbeasy</h2>
                <div className="Box__cadastro__barbearia">
                    <h3 style={{color: '#f6f6fc'}}>Redefinição de Senha</h3>
                </div>

                {message === 'Excelente! Enviamos uma nova senha de acesso para esse contato verificado.' ? (
                    <p className="success">{message}</p>
                ) : (
                    <p className={message ? 'error':''}>{message}</p>
                )}

                {codeSend ? (
                    <>
                    <p style={{textAlign: 'center', color: 'gray', fontSize: '14px', paddingLeft: '10px', paddingRight: '10px'}}>
                        Enviamos um código de verificação para o 
                        {methodSendCode === 'email' ? ` e-mail ${email}`:methodSendCode === 'whatsApp' ? ` WhatsApp ${whatsApp}`:''}
                    </p>

                        <div className="form__in__AccountActivationClient">
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
                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', margin: '10px'}}>
                                    <div className="loaderCreatingBooking"></div>
                                </div>
                            ):(
                                <button className="input__submit__code__verification" onClick={verifyCodeToResetPassword}>
                                    Verificar código
                                </button>
                            )}
                        </div>
                    </>
                ):(
                    <>
                    <p style={{textAlign: 'left', color: 'gray', fontSize: '14px', paddingLeft: '10px', paddingRight: '10px'}}>Por onde você prefere recerber o código de verificação?</p>
                    
                    <div className="container__method__receive__code">
                        
                        <div className="Box__method__email" onClick={() => {setMethodSendCode("email")}}>
                            <label className="cyberpunk-checkbox-label">
                            <input
                                type="checkbox"
                                className="cyberpunk-checkbox"
                                checked={methodSendCode === 'email'}
                            />
                                E-mail
                            </label>
                        </div>

                        <div className="Box__method__email" onClick={() => {setMethodSendCode("whatsApp")}}>
                            <label className="cyberpunk-checkbox-label">
                            <input
                                type="checkbox"    
                                className="cyberpunk-checkbox"
                                checked={methodSendCode === 'whatsApp'}                            
                                />
                                WhatsApp
                            </label>
                        </div>
                    
                    </div>
                    </>

                )}
                

                {methodSendCode === 'email' && !codeSend &&(
                    <div className="inputBox__in__reset__password">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      className="input__reset__password"
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        // Substituir o conteúdo do campo para conter apenas números, letras, "@" e "."
                        const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9@.]/g, '');
                        // Limitar a 50 caracteres
                        const truncatedValue = sanitizedValue.slice(0, 50);
                        setEmail(truncatedValue);
                      }}
                      placeholder="Email de usuário"
                      maxLength={100}
                      required
                    />
                    {isLoading ? (
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', margin: '10px'}}>
                            <div className="loaderCreatingBooking"></div>
                        </div>
                    ):(
                        <button className="input__submit__code__verification" onClick={sendCodeToResetPassword}>
                            Enviar código de verificação
                        </button>
                    )}
                    </div>
                )}

                {methodSendCode === 'whatsApp' && !codeSend &&(
                    <div className="inputBox__in__reset__password">
                    <input
                      type="tel"
                      id="whatsApp"
                      name="whatsApp"
                      value={whatsApp}
                      className="input__reset__password"
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const filteredValue = inputValue.replace(/[^0-9]/g, '');
                        // Limitar a 11 caracteres
                        const truncatedValue = filteredValue.slice(0, 11);
                        setWhatsApp(truncatedValue)
                      }}
                      placeholder="WhatsApp da conta de usuário"
                      maxLength={11}
                      required
                    />
                    {isLoading ? (
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', margin: '10px'}}>
                            <div className="loaderCreatingBooking"></div>
                        </div>
                    ):(
                        <button className="input__submit__code__verification" onClick={sendCodeToResetPassword}>
                            Enviar código de verificação
                        </button>
                    )}
                    
                    </div>
                )}
                
            
            </div>
        </>

    )
}
export default ResetPassword