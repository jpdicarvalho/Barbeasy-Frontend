import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';
import barberLogo from './barber-logo.png';

function SignInBarbearia() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    
    async function sendForm(e) {
        e.preventDefault();

        let dataUser = await fetch('https://api-user-barbeasy.up.railway.app/SignIn', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                password: password,
                email: email
            })
        });
        
        dataUser = await dataUser.json();
        console.log(dataUser)
        if (dataUser.success) {
            // Armazene o token no localStorage
            localStorage.setItem('token', dataUser.token);
            localStorage.setItem('userData', JSON.stringify(dataUser));
            setMessage('Seja Bem Vindo!');
              setTimeout(() => {
                setMessage(null);
                //mandando dados do usuáriopara a Home Page
               navigate('/Home');
              }, 2000);
        } else {
            setMessage('Erro ao realizar o Login!');
                setTimeout(() => {
                    setMessage(null);
                  }, 2000);
        }
    }

    return (
        <form onSubmit={sendForm} className="container">
            <div className="imgBox">
                <img src={barberLogo} alt="" />
            </div>
            <h2 id='HeaderSignIn'>Barbeasy</h2>
            <span>Login</span>
            {message === "Seja Bem Vindo!" ? (
                <p className="sucess">{message}</p>
                ) : (
                <p className="error">{message}</p>
            )}
                <div className="inputBox">
                    <input type="email" id="email" name="email" onChange={e => setEmail(e.target.value)} placeholder='Email'/>
                    <i className="fa-solid fa-envelope Icon"></i>
                </div>
                <div className="inputBox">
                    <input type="password" id="password" name="password" onChange={e => setPassword(e.target.value)} placeholder='Password' />
                    <i className="fa-solid fa-lock Icon"></i>
                </div>
                <div className='inputBox'>
                    <input type="submit" value="Entrar"/>
                </div>
                <div className="link__signup">
                    <p>Não tem uma conta?</p><Link className="link" to="/SignUpBarbearia">Criar Conta</Link>
                </div>
            </form>
    );
}

export default SignInBarbearia;