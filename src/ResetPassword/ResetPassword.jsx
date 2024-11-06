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

const [methodSendCode, setMethodSendCode] = useState('');
const [email, setEmail] = useState('');  
const [whatsApp, setWhatsApp] = useState('');

const sendCodeAutentication = () =>{
    if(methodSendCode === 'email'){
        
        axios.post(`${urlAuth}/api/v1/resetPassword`, {email: email})
        .then(res =>{
            console.log(res)
        })
        .catch(err =>{
            console.log(err)
        })
    }

    if(methodSendCode === 'whatsApp'){
        axios.post(`${urlAuth}/api/v1/resetPassword`, {whatsApp: whatsApp})
        .then(res =>{
            console.log(res)
        })
        .catch(err =>{
            console.log(err)
        })
    }
}


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
                <p style={{textAlign: 'justify', color: 'gray', fontSize: '14px', paddingLeft: '10px', paddingRight: '10px'}}>Como deseja recerber o código de recuperação de conta?</p>

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
                {methodSendCode === 'email' &&(
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
                    <button className="input__submit__code__verification">
                        Enviar código
                    </button>
                    </div>
                )}

                {methodSendCode === 'whatsApp' && (
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
                        if(truncatedValue.length === 11){//Ex.:93 9 94455445
                          let numberWhithoutNine = truncatedValue.slice(0, 3) + truncatedValue.slice(3 + 1);//Number formatted: 93 94455445
                          return setWhatsApp(numberWhithoutNine)
                        }
                        setWhatsApp(numberWhithoutNine)
                      }}
                      placeholder="WhatsApp da conta de usuário"
                      maxLength={11}
                      required
                    />
                    <button className="input__submit__code__verification">
                        Enviar código
                    </button>
                    </div>
                )}
                
            
            </div>
        </>

    )
}
export default ResetPassword