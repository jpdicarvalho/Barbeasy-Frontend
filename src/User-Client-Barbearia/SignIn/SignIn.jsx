import { useState } from 'react';
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

    axios.get(`${urlApi}/api/v1/SignIn/${values.email}/${values.senha}`)
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

      <div className="Box__forgot__password" onClick={() => {navigate("/ResetPassword")}}>
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
      
      </form>

    </div>
  );
}

export default SignIn;
