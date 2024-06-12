import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';
import barberLogo from './barber-logo.png';

function SignIn() {
  
  const urlApi = 'https://barbeasy.up.railway.app'
  
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: '',
    senha: ''
  });
  const [message, setMessage] = useState(null);

  async function sendForm(e) {
    e.preventDefault();

    try {
      const dataUser = await fetch(`${urlApi}/api/v1/SignIn`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify(values), // Passar os valores do estado no corpo da requisição
      });

      const responseData = await dataUser.json();

      if (responseData.success) {
        // Armazene o token no localStorage
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('userData', JSON.stringify(responseData));

        setMessage('Seja Bem Vindo!');
        setTimeout(() => {
          setMessage(null);
          // Mandando dados do usuário para a Home Page
          navigate('/Home');
        }, 2000);
      } else {
        setMessage('Erro ao realizar o Login!');
        setTimeout(() => {
          setMessage(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setMessage('Erro ao realizar o Login!');
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    }
  }

  return (
    <div className="container__default">
      <form onSubmit={sendForm} className="container">

<div className="imgBox">
  <img src={barberLogo} alt="" />
</div>

<h2 id="HeaderSignIn">Barbeasy</h2>
<span>Login</span>
{message === 'Seja Bem Vindo!' ? (
  <p className="success">{message}</p>
) : (
  <p className="error">{message}</p>
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
  />{' '} <i className="fa-solid fa-envelope Icon"></i>
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
  />{' '}
  <i className="fa-solid fa-lock Icon"></i>
</div>

<div className="inputBox">
  <input type="submit" value="Entrar" />
</div>

<div className="link__signup">
  <p>Não tem uma conta?</p>
  <Link className="link" to="/SignUp">
    Criar Conta
  </Link>
</div>
      </form>
    </div>
  );
}

export default SignIn;
