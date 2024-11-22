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
    token_cloudflare: tokenCloudFlare
  }

  axios.post(`${urlApi}/api/v1/SignIn`, credentials)
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
    setCaptchaKey(prev => prev + 1); // Reiniciar o turnstile caso haja erro
    
    if(err.response.status === 302){
      setIsLoading(false)
      setEmailStored(err.response.data.userPending.email)
      setPhoneNumberStored(err.response.data.userPending.celular)
      return setPendingActivation(true)
    }
    if(err.response.status === 401){
      setMessage('E-mail ou senha incorreto.');
      return setTimeout(() => {
        setIsLoading(false)
        setMessage(null);
      }, 2000);
    }
    if(err.response.status === 403){
      setMessage('Falha na verificação de autenticação humana.');
      return setTimeout(() => {
        setIsLoading(false)
        setMessage(null);
      }, 2000);
    }
    if(err.response.status === 404){
      setMessage('Usuário não encontrado.');

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

return (
  <div className="container__default" translate="no">
    <form className="container" translate="no">
      <div className="imgBox" translate="no">
        <img src={barberLogo} alt="Barber Logo" />
      </div>

      <h2 id="HeaderSignIn">Barbeasy</h2>
      {!pendingActivation ? (
        <>
          <h3 style={{ color: "gray", marginBottom: "10px" }}>Login</h3>

          {message === "Seja Bem-Vindo!" ? (
            <p className="success">{message}</p>
          ) : (
            <p className={message ? "error" : ""}>{message}</p>
          )}

          <div className="inputBox center__form">
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={(e) => {
                const inputValue = e.target.value;
                const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9@.]/g, "");
                const truncatedValue = sanitizedValue.slice(0, 50);
                setValues({ ...values, email: truncatedValue });
              }}
              placeholder="Email"
              maxLength={100}
              required
            />
          </div>

          <div className="inputBox center__form">
            <input
              type={passwordVisibility ? "text" : "password"}
              id="senha"
              name="senha"
              value={values.senha}
              onChange={(e) => {
                const inputValue = e.target.value;
                const truncatedValue = inputValue.slice(0, 22);
                setValues({ ...values, senha: truncatedValue });
              }}
              placeholder="Password"
              maxLength={22}
              required
            />
            {!passwordVisibility ? (
              <VscEyeClosed
                className="icon__VscEyeClosed_in_signin"
                onClick={() => {
                  setPasswordVisibility(true);
                }}
              />
            ) : (
              <VscEye
                className="icon__VscEyeClosed_in_signin"
                onClick={() => {
                  setPasswordVisibility(false);
                }}
              />
            )}
          </div>

          <div
            className="Box__forgot__password"
            onClick={() => {
              navigate("/ResetPassword", { state: { userType: "client" } });
            }}
          >
            Esqueceu a senha?
          </div>

          <TurnstileComponent
            key={captchaKey}
            siteKey="0x4AAAAAAAz289DCfx9-VvHc"
            onVerify={handleTokenVerification}
          />

          <div className="inputBox">
            {isLoading ? (
              <div className="loaderCreatingBooking"></div>
            ) : (
              <input type="submit" value="Entrar" onClick={sendForm} />
            )}
          </div>
        </>
      ) : (
        <div className="box__recover__account">
          <div className="Box__cadastro__barbearia">
            <h3 style={{ color: "#f6f6fc" }}>Recuperação de Conta</h3>
          </div>
          <p className="text__information__recover__account">
            Já existe uma conta com ativação pendente para esse email ou
            celular informado. Deseja recuperá-la?
          </p>
          <button
            type="button"
            id="button_next"
            onClick={sendCodeAndRedirectUser}
          >
            Recuperar conta
          </button>
        </div>
      )}

      <div className="link__signup">
        <p>Não tem uma conta?</p>
        <Link className="link" to="/SignUp">
          Criar Conta
        </Link>
      </div>
    </form>

    <div className="box__another__option__login">
      <hr />
      <p className="text__other">OU</p>
      <hr />
    </div>

    <button className="button google" onClick={login}>
      {/* Ícone do Google */}
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
