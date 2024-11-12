import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { VscEyeClosed } from "react-icons/vsc";
import { VscEye } from "react-icons/vsc";
import TurnstileComponent from '../../TurnstileCloudFlare/TurnstileComponent';

import axios from 'axios';

import './style.css';
import barberLogo from '../../../barber-logo.png';

function SignIn() {
  
const urlApi = 'https://barbeasy.up.railway.app'
const urlAuth = 'https://barbeasy-authenticators.up.railway.app'

const navigate = useNavigate();

const [isLoading, setIsLoading] = useState(false)
const [values, setValues] = useState({
  email: '',
  senha: ''
});
const [message, setMessage] = useState(null);
const [passwordVisibility, setPasswordVisibility] = useState(false)
const [pendingActivation, setPendingActivation] = useState(false)
const [emailStored, setEmailStored] = useState('');
const [phoneNumberStored, setPhoneNumberStored] = useState('');
const [tokenCloudFlare, setTokenCloudFlare] = useState('');
const [captchaKey, setCaptchaKey] = useState(0);

const handleTokenVerification = (token) => {
  setTokenCloudFlare(token);
};
//=================================== Sign in functions ==================================
const sendForm = () =>{
  setIsLoading(true)

  const credentials = {
    email: values.email,
    senha: values.senha, 
  }

  axios.post(`${urlApi}/api/v1/SignIn`, credentials, {
    headers: {
      'Authorization': `Bearer ${tokenCloudFlare}`
    }
  })
  .then(res =>{
    // Armazene o token no localStorage
    localStorage.clear();
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('userData', JSON.stringify(res.data));

    setMessage('Seja Bem-Vindo!');
    setIsLoading(false)
    setTimeout(() => {
      setMessage(null);
      // Mandando dados do usuário para a Home Page
      navigate('/Home');
    }, 2000);

  }).catch(err => {
    setCaptchaKey(prev => prev + 1); // Reinicie o CAPTCHA após erro também
    if(err.response.status === 302){
      setIsLoading(false)
      setEmailStored(err.response.data.userPending.email)
      setPhoneNumberStored(err.response.data.userPending.celular)
      return setPendingActivation(true)
    }
    if(err.response.status === 404){
      setMessage('Usuário não encontrado!');

      return setTimeout(() => {
        setIsLoading(false)
        setMessage(null);
      }, 2000);
    }
    if(err.response.status === 403){
      setMessage('Cloudflare erro!');
      return setTimeout(() => {
        setIsLoading(false)
        setMessage(null);
      }, 2000);
    }
    setMessage('Erro ao realizar o Login! Tente novamente mais tarde.');
    setTimeout(() => {
      setIsLoading(false)
      setMessage(null);
    }, 2000);
    console.log(err)

  })
}

const sendTokenFromGoogleToServer = (credentials) =>{
  if(credentials){
    setIsLoading(true)

    axios.post(`${urlApi}/api/v1/googleSignIn`, {credential: credentials, type: 'client'})
      .then(res => {
        // Armazene o token no localStorage
        localStorage.clear();
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userData', JSON.stringify(res.data));

        setMessage('Seja Bem-Vindo!');
        setIsLoading(false)
        setTimeout(() => {
          setMessage(null);
          // Mandando dados do usuário para a Home Page
          navigate('/Home');
        }, 2000);
      }).catch(err =>{
        if(err.response.status === 302){
          setIsLoading(false)
          setEmailStored(err.response.data.userPending.email)
          setPhoneNumberStored(err.response.data.userPending.celular)
          return setPendingActivation(true)
        }
        if(err.response.status === 404){
          setMessage('Usuário não encontrado!');
  
          return setTimeout(() => {
            setIsLoading(false)
            setMessage(null);
          }, 2000);
        }
        setMessage('Erro ao realizar o Login! Tente novamente mais tarde.');
        setTimeout(() => {
          setIsLoading(false)
          setMessage(null);
        }, 2000);
        console.log(err)
      })
  }
}

const login = useGoogleLogin({ 
  onSuccess: (tokenResponse)  =>{
    sendTokenFromGoogleToServer(tokenResponse.access_token)
  },
  onError: (err)  =>{
    console.log(err)
  }, 
});
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
//================ send code to whatsApp e redirect user to recover account =============
const sendCodeAndRedirectUser = () =>{
  //Object to Recover Account
  const objectNewAccountForActivation = {
    type: 'client',
    phoneNumber: phoneNumberStored,
    email: emailStored,
    data_request: Date.now() + 50 * 1000,
    
  }
  sendCodeAutentication(objectNewAccountForActivation.phoneNumber, objectNewAccountForActivation.email)
  navigate('/RecoverAccount', { state: { objectNewAccountForActivation } });
}
//<Turnstile siteKey="0x4AAAAAAAz289DCfx9-VvHc" onVerify={handleTokenVerification} />

  return (
    <div className="container__default">
      
      <form className="container">

      <div className="imgBox">
        <img src={barberLogo} alt="" />
      </div>

      <h2 id="HeaderSignIn">Barbeasy</h2>
      {!pendingActivation ? (
        <>
          <h3 style={{color: 'gray', marginBottom: '10px'}}>Login</h3>
      
      {message === 'Seja Bem-Vindo!' ? (
        <p className="success">{message}</p>
      ) : (
        <p className={message ? 'error':''}>{message}</p>
      )}

      <div className="inputBox">
        <input
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={(e) => {
            const inputValue = e.target.value;
            // Substituir o conteúdo do campo para conter apenas números, letras, "@" e "."
            const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9@.]/g, '');
            // Limitar a 50 caracteres
            const truncatedValue = sanitizedValue.slice(0, 50);
            setValues({ ...values, email: truncatedValue });
          }}
          placeholder="Email"
          maxLength={100}
          required
        />
      </div>

      <div className="inputBox">
        <input
          type={!passwordVisibility ? "password":"text"}
          id="senha"
          name="senha"
          value={values.senha}
          onChange={(e) => {
            const inputValue = e.target.value;
            // Limitar a 8 caracteres
            const truncatedValue = inputValue.slice(0, 22);
            setValues({ ...values, senha: truncatedValue });
          }}
          placeholder="Password"
          maxLength={22}
          required
        />
        {!passwordVisibility ?(
          <VscEyeClosed className="icon__VscEyeClosed_in_signin" onClick={() =>{setPasswordVisibility(true)}}/>

        ):(
          <VscEye className="icon__VscEyeClosed_in_signin" onClick={() =>{setPasswordVisibility(false)}}/>
        )}
      </div>

      <div className="Box__forgot__password" onClick={() => {navigate("/ResetPassword", { state: { userType: 'client' } })}}>
        Esqueceu a senha?
      </div>

      <TurnstileComponent key={captchaKey} siteKey="0x4AAAAAAAz289DCfx9-VvHc" onVerify={handleTokenVerification} />

      <div className="inputBox">
        {isLoading ? (
          <div className="loaderCreatingBooking"></div>
        ):(
          <input type="submit" value="Entrar" onClick={sendForm}/>
        )}
      </div>
        </>
      ):(
        <div className="box__recover__account">
          <div className="Box__cadastro__barbearia">
              <h3 style={{color: '#f6f6fc'}}>Recuperação de Conta</h3>
          </div>
          <p className="text__information__recover__account">Já existe uma conta com ativação pendente para esse email ou celular informado. Deseja recuperá-la?</p>
          <button type="button" id="button_next" onClick={sendCodeAndRedirectUser}>Recuperar conta</button>
        </div>
      )}

      <div className="link__signup">
        <p >Não tem uma conta?</p>
        <Link className="link" to="/SignUp">
          Criar Conta
        </Link>
      </div>
      
      </form>

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
        Entrar com o Google
      </button>

      <footer className="footer">
        <div className="footer-links">
          <Link to="/TermsOfUse" className="footer-link">
            Termos de Uso
          </Link>
          <span className="footer-divider">|</span>
          <Link to="/PrivacyPolicies" className="footer-link">
            Políticas de Privacidade
          </Link>
        </div>
        <p className="copyright-text">
          © 2024 Barbeasy. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}

export default SignIn;
