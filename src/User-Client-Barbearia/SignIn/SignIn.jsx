import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';

import './style.css';
import barberLogo from '../../../barber-logo.png';

function SignIn() {
  
  const urlApi = 'https://barbeasy.up.railway.app'
  
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false)
  const [values, setValues] = useState({
    email: '',
    senha: ''
  });
  const [message, setMessage] = useState(null);

  async function sendForm(e) {
    e.preventDefault();
    setIsLoading(true)

    const credentials = {
      email: values.email,
      senha: values.senha
    }

    axios.post(`${urlApi}/api/v1/SignIn`, credentials)
    .then(res =>{
      console.log(res)
      // Armazene o token no localStorage
      localStorage.clear();
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userData', JSON.stringify(res.data));

      setMessage('Seja Bem Vindo!');
      setIsLoading(false)
      setTimeout(() => {
        setMessage(null);
        // Mandando dados do usuário para a Home Page
        navigate('/Home');
      }, 2000);

    }).catch(err => {
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

  const sendTokenFromGoogleToServer = (credentials) =>{
    if(credentials){
      setIsLoading(true)

      axios.post(`${urlApi}/api/v1/googleSignIn`, {credential: credentials})
        .then(res => {
          console.log(res)
          // Armazene o token no localStorage
          localStorage.clear();
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('userData', JSON.stringify(res.data));

          setMessage('Seja Bem Vindo!');
          setIsLoading(false)
          setTimeout(() => {
            setMessage(null);
            // Mandando dados do usuário para a Home Page
            navigate('/Home');
          }, 2000);
        }).catch(err =>{
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

//==================== Google SignIn Button ============================
const GoogleSignInButton = () => {
    
  useEffect(() => {
    // Carregar o script do Google GSI
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    document.body.appendChild(script);

    // Inicializar o cliente Google GSI com o callback de login
    script.onload = () => {
      google.accounts.id.initialize({
        client_id: '1049085760569-b1ic098034d809i62i4bn6i5gq49f492.apps.googleusercontent.com',
        callback: (response) => {
          sendTokenFromGoogleToServer(response.credential)
          console.log('Credenciais do usuário:', response.credential);
        },
      });
      google.accounts.id.renderButton(
        document.querySelector('.g_id_signin'),
        {
          theme: 'filled_black', // Remove o preenchimento padrão
          size: 'large',
          type: 'pill', // Exibe apenas o ícone (se necessário)
          text: 'signin_with', // Mantém o texto, caso necessário
          shape: 'pill',
        }
      );
    };

    // Limpeza do script ao desmontar o componente
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      {/* Elemento de inicialização */}
      <div
        id="g_id_onload"
        data-client_id="1049085760569-b1ic098034d809i62i4bn6i5gq49f492.apps.googleusercontent.com"
        data-login_uri={`${urlApi}/api/v1/googleSignIn`}
        data-auto_prompt="false"
      ></div>

      {/* Botão de login personalizado */}
      <div
        className="g_id_signin"
      ></div>
    </div>
  );
};

  return (
    <div className="container__default">
      <form onSubmit={sendForm} className="container">

      <div className="imgBox">
        <img src={barberLogo} alt="" />
      </div>

      <h2 id="HeaderSignIn">Barbeasy</h2>
      <h3 style={{color: 'gray', marginBottom: '10px'}}>Login</h3>
      
      {message === 'Seja Bem Vindo!' ? (
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
          type="password"
          id="senha"
          name="senha"
          value={values.senha}
          onChange={(e) => {
            const inputValue = e.target.value;
            // Limitar a 8 caracteres
            const truncatedValue = inputValue.slice(0, 8);
            setValues({ ...values, senha: truncatedValue });
          }}
          placeholder="Password"
          maxLength={8}
          required
        />
      </div>

      <div className="Box__forgot__password" onClick={() => {navigate("/ResetPassword", { state: { userType: 'client' } })}}>
        Esqueceu a senha?
      </div>

      <div className="inputBox">
        {isLoading ? (
          <div className="loaderCreatingBooking"></div>
        ):(
          <input type="submit" value="Entrar" />
        )}
      </div>

      <div className="link__signup">
        <p >Não tem uma conta?</p>
        <Link className="link" to="/SignUp">
          Criar Conta
        </Link>
      </div>

      <div className='box__another__option__login'>
        <hr />
        <p className='text__other'>OU</p>
        <hr />
      </div>

      <GoogleSignInButton />
      
      </form>
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
