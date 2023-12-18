import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './style.css'
import barberLogo from './barber-logo.png';

function SignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [messageLocationPermition, setMessageLocationPermition] = useState(null);
    
    useEffect(() => {
        const obterLocalizacao = async () => {
          try {
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            const UserLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setMessageLocationPermition("Faça login e descubra as melhores barbearias ao seu redor.");
            setTimeout(() => {
                setMessageLocationPermition(null);
            }, 3000);
            return UserLocation
          } catch (error) {
            console.error('Erro ao obter a localização do usuário:', error);
            setMessageLocationPermition("Para mostrar Barbearias próximas, precisamos da sua localização.");
            setTimeout(() => {
                setMessageLocationPermition(null);
            }, 3000);
          }
        };
          obterLocalizacao();
        }, []);
    async function sendForm(e) {
        e.preventDefault();

        let dataUser = await fetch('https://barbeasy-client-backend.onrender.com/SignIn', {
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
            {message === "Seja Bem Vindo!" ? (
                <p className="sucess">{message}</p>
                ) : (
                <p className="error">{message}</p>
            )}
            {messageLocationPermition === "Faça login e descubra as melhores barbearias ao seu redor." ? (
                <p className="sucess">{messageLocationPermition}</p>
                ) : (
                <p className="error">{messageLocationPermition}</p>
            )}
                <div className="inputBox">
                    <input type="text" id="email" name="email" onChange={e => setEmail(e.target.value)} placeholder='Email'/>
                    <i className="fa-regular fa-user"></i>
                </div>
                <div className="inputBox">
                    <input type="password" id="password" name="password" onChange={e => setPassword(e.target.value)} placeholder='Password' />
                    <i className="fa-solid fa-lock"></i>
                </div>
                <div className='inputBox'>
                    <input type="submit" value="Entrar"/>
                </div>
                <Link className="link" to="/SignUp">Criar Conta</Link>
            </form>
    );
}

export default SignIn;