import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSpring, animated } from "react-spring";
import { useGoogleLogin } from '@react-oauth/google';
import TurnstileComponent from "../../TurnstileCloudFlare/TurnstileComponent";

import './style.css';

import barberLogo from '../../../barber-logo.png';

import { VscAccount } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";
import { VscEye } from "react-icons/vsc";

function SignUp() {

  const urlApi = 'https://barbeasy.up.railway.app'
  const urlAuth = 'https://barbeasy-authenticators.up.railway.app'

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(false)
  const [celular, setCelular] = useState('');

  const [emailStored, setEmailStored] = useState('');
  const [phoneNumberStored, setPhoneNumberStored] = useState('');

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState(null);
  const [step, setStep] = useState(1);

  const [tokenCloudFlare, setTokenCloudFlare] = useState('');
  const [captchaKey, setCaptchaKey] = useState(0);

  const props = useSpring({
    opacity: 1,
    transform: step === 1 ? "translateX(0%)" : `translateX(-${(step - 1) * 0}%)`,
    from: { opacity: 0, transform: "translateX(-100%)" }
  });

  const handleTokenVerification = (token) => {
    setTokenCloudFlare(token);
  };

 //=================== Request to send code verification =========================
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

  const sendCodeAutentication = (numberWhatsapp, email) => {

    const numberWhithoutNine = formatPhoneNumber(numberWhatsapp)

    //Object with values to save and send code verification
    const valuesAutentication = {
       phoneNumberToSendMessage: `55${numberWhithoutNine}@c.us`,
       email,
       type: 'client'
    }

    axios.put(`${urlAuth}/api/v1/sendCodeWhatsapp`, valuesAutentication)
    .then(res =>{
      console.log('Código de autenticação enviado')
    })
    .catch(err =>{
      console.log(err)
    })

  }

//================== Submit form ==============================
const [pendingActivation, setPendingActivation] = useState(false)
const valuesNoEmpty = name && email && celular && senha;

  const handleSubmit = (event) => {
    event.preventDefault();
    
    setIsLoading(true)
    const numberWhithoutNine = formatPhoneNumber(celular);

    const values = {
      name,
      email,
      senha,
      celular: numberWhithoutNine,
      token_cloudflare: tokenCloudFlare
    };

    if (step === 3) {
      axios.post(`${urlApi}/api/v1/SignUp`, values)
        .then(res => {
          if (res.status === 201) {
            //Object to Account Activation
            const objectNewAccountForActivation = {
              type: 'client',
              phoneNumber: numberWhithoutNine,
              email: email,
              data_request: Date.now() + 50 * 1000
            }
            setIsLoading(false)
            sendCodeAutentication(objectNewAccountForActivation.phoneNumber, email)
            navigate('/AccountActivationClient', { state: { objectNewAccountForActivation } });
          }
        })
        .catch(err => {
          console.log(err)
          setCaptchaKey(prev => prev + 1); // Reiniciar o turnstile caso haja erro
          if(err.response.status === 302){
            setIsLoading(false)
            setEmailStored(err.response.data.userPending.email)
            setPhoneNumberStored(err.response.data.userPending.celular)
            return setPendingActivation(true)
          }
          if(err.response.status === 403){
            setMessage('Falha na verificação de autenticação humana. Por favor, tente novamente.');
            return setTimeout(() => {
              setIsLoading(false)
              setMessage(null);
            }, 2000);
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
          console.log(err)
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
    type: 'client',
    phoneNumber: phoneNumberStored,
    email: emailStored,
    data_request: Date.now() + 50 * 1000
  }
  sendCodeAutentication(objectNewAccountForActivation.phoneNumber, objectNewAccountForActivation.email)
  navigate('/RecoverAccount', { state: { objectNewAccountForActivation } });
}
//=============== SignUp With Google =========================
const sendTokenToGoogle = (accessToken) =>{
  if(accessToken){
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`)
      .then(res => {
        setName(`${res.data.given_name} ${res.data.family_name}`)
        setEmail(res.data.email)
        setSenha(res.data.id)
        setStep(3);
      }).catch(err =>{
        console.log(err)
      })
  }
}

const login = useGoogleLogin({ 
  onSuccess: (tokenResponse)  =>{
    sendTokenToGoogle(tokenResponse.access_token)
  },
  onError: (err)  =>{
    console.log(err)
  }, 
});

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
          message.length > 30 ? (
            <p className={message ? 'error':''}>{message}</p>
          ) : (
            <p className="success">{message}</p>
            
          )
        )}
        {!pendingActivation ? (
          <animated.div style={props} className="inputContainer">
            <div className="inputBox">
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                maxLength={50}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres não alfanuméricos, ponto e espaço
                  const filteredValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ.]/g, '');
                  // Limitar a 30 caracteres
                  const truncatedValue = filteredValue.slice(0, 30);
                  setName(truncatedValue);
                }}
                placeholder="Nome"
                required
              /> 

              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres não permitidos no e-mail
                  const filteredValue = inputValue.replace(/[^a-zA-Z0-9@._]/g, '');
                  setEmail(filteredValue);
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

              <input
                type={!passwordVisibility ? "password":"text"}
                id="senha"
                name="senha"
                value={senha}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  //regex to valided password
                  const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9@.#%]/g, '');
                  // Limitar a 8 caracteres
                  const truncatedValue = sanitizedValue.slice(0, 22);
                  setSenha(truncatedValue);
                }}
                placeholder="Password"
                maxLength={8}
                required
              />
              {!passwordVisibility ?(
                <VscEyeClosed className="icon__VscEyeClosed" onClick={() =>{setPasswordVisibility(true)}}/>
              ):(
                <VscEye className="icon__VscEyeClosed" onClick={() =>{setPasswordVisibility(false)}}/>
              )}

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
                    <div className="terms__and__btn__create__account">

                      <TurnstileComponent key={captchaKey} siteKey="0x4AAAAAAAz289DCfx9-VvHc" onVerify={handleTokenVerification} />
                      
                      <div className="footer-links in__SignUp">
                        Ao clicar em "Concordar", você aceita nossos
                          <Link to="/TermsOfUse" className="footer-link">
                            Termos de Uso
                          </Link>
                          e declara ter lido nossa
                          <Link to="/PrivacyPolicies" className="footer-link">
                            Políticas de Privacidade
                          </Link>
                        </div>
                      <input type="submit" value="Concordar" />
                    </div>
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
            <p className="text__information__recover__account">Já existe uma conta com ativação pendente para esse email ou celular informado. Deseja recuperá-la?</p>
            <button type="button" id="button_next" onClick={sendCodeAndRedirectUser}>Recuperar conta</button>
          </div>
        )}
        

        <div className="link__login">
          <p>Você já tem uma conta?</p><Link className="link" to="/SignIn">Login</Link>
        </div>

      </form>
      {!pendingActivation && (
        <>
          <div className='box__another__option__login'>
              <hr />
              <p className='text__other'>OU</p>
              <hr />
          </div>
          <button className="button google" onClick={login}>
                <svg
                  viewBox="0 0 256 262"
                  preserveAspectRatio="xMidYMid"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    fill="#EB4335"
                  ></path>
                </svg>
                Continuar com o Google
          </button>

          <footer className="footer">
            <p className="copyright-text">
              © 2024 Barbeasy. Todos os direitos reservados.
            </p>
          </footer>
        </>
      )}
    </div>
    </> 
    
  );
}

export default SignUp;
