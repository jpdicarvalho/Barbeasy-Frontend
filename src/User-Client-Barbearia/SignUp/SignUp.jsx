import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSpring, animated } from "react-spring";
import './style.css';

import barberLogo from '../../../barber-logo.png';

import { VscAccount } from "react-icons/vsc";
import {QRCodeSVG} from 'qrcode.react';

function SignUp() {

  const urlApi = 'https://barbeasy.up.railway.app'
  const urlAuth = 'https://barbeasy-authenticators.up.railway.app'

  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: '',
    email: '',
    celular: '',
    senha: ''
  });

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState(null);
  const [step, setStep] = useState(1);

  const props = useSpring({
    opacity: 1,
    transform: step === 1 ? "translateX(0%)" : `translateX(-${(step - 1) * 0}%)`,
    from: { opacity: 0, transform: "translateX(-100%)" }
  });

 //=================== Request to send code verification =========================
  const sendCodeAutentication = (numberWhatsapp, email) => {
    console.log(numberWhatsapp)

    let numberWhithoutNine;

    if(numberWhatsapp.length === 11){//Ex.:93 9 94455445
      numberWhithoutNine = numberWhatsapp.slice(0, 3) + numberWhatsapp.slice(3 + 1);//Number formatted: 93 94455445
    }

    if(numberWhatsapp.length === 10){//Ex.:93 94455445
      numberWhithoutNine = numberWhatsapp
    }

    //Object with values to save and send code verification
    const valuesAutentication = {
       phoneNumberToSendMessage: `55${numberWhithoutNine}@c.us`,
       email
    }

    axios.post(`${urlAuth}/api/v1/sendCodeWhatsapp`, valuesAutentication)
    .then(res =>{
      console.log('enviado', res)
    })
    .catch(err =>{
      console.log(err)
    })

  }

//================== Submit form ==============================
const [pendingActivation, setPendingActivation] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true)

    if (step === 3) {
      axios.post(`${urlApi}/api/v1/SignUp`, values)
        .then(res => {
          if (res.status === 201) {
            //Object to Account Activation
            const objectNewAccountForActivation = {
              phoneNumber: values.celular,
              email: values.email,
              data_request: Date.now() + 50 * 1000
            }
            setIsLoading(false)
            sendCodeAutentication(objectNewAccountForActivation.phoneNumber, values.email)
            navigate('/AccountActivationClient', { state: { objectNewAccountForActivation } });
          }
        })
        .catch(err => {
          if(err.response.status === 302){
            setIsLoading(false)
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
            console.error(err);
          }
        });
    } else {
      setStep(step + 1);
    }
  };
  const nextStep = () => {
    setStep(step + 1);
  };
//================ send code to whatsApp e redirect user to recover account =============
const sendCodeAndRedirectUser = () =>{
  //Object to Recover Account
  const objectNewAccountForActivation = {
    phoneNumber: values.celular,
    email: values.email,
    data_request: Date.now() + 50 * 1000
  }
  sendCodeAutentication(objectNewAccountForActivation.phoneNumber, objectNewAccountForActivation.email)
  navigate('/RecoverAccount', { state: { objectNewAccountForActivation } });
}
const valuesNoEmpty = values.name && values.email && values.celular && values.senha;

  return (
    <>
     <div className="container__default">
      <form onSubmit={handleSubmit} className="container">
        <div className="imgBox">
          <img src={barberLogo} alt="" />
        </div>

        <h2 id="HeaderSignUp">Barbeasy</h2>
        <div className="Box__cadastro__barbearia">
          <VscAccount className='icon__IoStorefrontOutline'/>
          <h3 style={{color: '#f6f6fc'}}>Cadastro de usuário</h3>
        </div>

        {message && (
          message.length > 35 ? (
            <p className="success">{message}</p>
          ) : (
            <p className={message ? 'error':''}>{message}</p>
          )
        )}
        {!pendingActivation ? (
          <animated.div style={props} className="inputContainer">
          <div className="inputBox">
          <input
            type="text"
            id="name"
            name="name"
            value={values.name}
            maxLength={50}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Remover caracteres não alfanuméricos, ponto e espaço
              const filteredValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ.]/g, '');
              // Limitar a 30 caracteres
              const truncatedValue = filteredValue.slice(0, 30);
              setValues({ ...values, name: truncatedValue });
            }}
            placeholder="Nome"
            required
          /> 


          <input
            type="email"
            id="email"
            name="email"
            onChange={(e) => {
              const inputValue = e.target.value;
              // Remover caracteres não permitidos no e-mail
              const filteredValue = inputValue.replace(/[^a-zA-Z0-9@.]/g, '');
              setValues({ ...values, email: filteredValue });
            }}
            placeholder="Email"
            maxLength={100}
            required
          /> 
          </div>

          {step >= 2 && (
            <div className="inputBox">
              <input
                type="tel"
                id="celular"
                name="celular"
                value={values.celular}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const filteredValue = inputValue.replace(/[^0-9]/g, '');
                  // Limitar a 11 caracteres
                  const truncatedValue = filteredValue.slice(0, 11);
                  setValues({ ...values, celular: truncatedValue })
                }}
                placeholder="WhatsApp"
                maxLength={16}
                required
              /> 
              <input
                type="password"
                id="senha"
                name="senha"
                value={values.senha}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  //regex to valided password
                  const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9@.#%]/g, '');
                  // Limitar a 8 caracteres
                  const truncatedValue = sanitizedValue.slice(0, 8);
                  setValues({ ...values, senha: truncatedValue });
                }}
                placeholder="Password"
                maxLength={8}
                required
              /> 
            </div>
          )}
          {step < 3 && (
            <div className='inputBox'>
              <button type="button" onClick={nextStep} id="button_next">Continuar</button>
            </div>
          )}

          {step === 3 && (
            <div className='inputBox'>
              {valuesNoEmpty ?(
                <div className="inputBox__inner__cadastrar">
                  {isLoading ? (
                    <div className="loaderCreatingBooking"></div>
                  ):(
                    <input type="submit" value="Cadastrar" />
                  )}
                </div>
              ):(
                <button type="button" id="button_next">Preencha todos os campos</button>
              )}
            </div>
          )}
        </animated.div>
        ):(
          <div className="box__recover__account">
            <p className="text__information__recover__account">Já existe uma conta com ativação pendente para esse email ou senha informado. Deseja recuperá-la?</p>
            <button type="button" id="button_next" onClick={sendCodeAndRedirectUser}>Recuperar conta</button>
          </div>
          
          
        )}
        

        <div className="link__login">
          <p>Você já tem uma conta?</p><Link className="link" to="/SignIn">Login</Link>
        </div>
      </form>
    </div>
    </>
    
  );
}

export default SignUp;
