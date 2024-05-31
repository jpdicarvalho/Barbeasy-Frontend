import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';
import barberLogo from './barber-logo.png';

function SignInBarbearia() {

    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [values, setValues] = useState({
        email: '',
        senha: ''
      });

      async function sendForm(e) {
        e.preventDefault();
    
        try {
          const response = await fetch('https://api-user-barbeasy.up.railway.app/v1/api/SignUpBarbearia', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-type': 'application/json',
            },
            body: JSON.stringify(values),
          });
    
          if (response.ok) {
            const dataBarbearia = await response.json();
            //Salvando dados do usuário no LocalStorage
            localStorage.setItem('token', dataBarbearia.token);
            localStorage.setItem('dataBarbearia', JSON.stringify(dataBarbearia));

            setMessage('Seja Bem Vindo!');
            setTimeout(() => {
              setMessage(null);
              navigate('/HomeBarbearia');
            }, 2000);

          } else {
            setMessage('Erro ao realizar o Login!');
            setTimeout(() => {
              setMessage(null);
            }, 2000);
          }

        } catch (error) {
          console.error('Erro na requisição:', error);
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
            <h2 id='HeaderSignIn'>Barbeasy</h2>
            <span>Login</span>
            {message === "Seja Bem Vindo!" ? (
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
                    maxLength={50}
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
                    />{' '} <i className="fa-solid fa-lock Icon"></i>
                </div>

                <div className='inputBox'>
                    <input type="submit" value="Entrar"/>
                </div>
                <div className="link__signup">
                    <p>Não tem uma conta?</p><Link className="link" to="/SignUpBarbearia">Criar Conta</Link>
                </div>
        </form>
      </div>
    );
}

export default SignInBarbearia;