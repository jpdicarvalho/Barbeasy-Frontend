import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';

import { MdEmail } from "react-icons/md";
import { PiPassword } from "react-icons/pi";

import './style.css';
import barberLogo from '../../../barber-logo.png';

function SignInBarbearia() {
    const urlApi = 'https://barbeasy.up.railway.app'

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false)
    const [isProfessional, setIsProfessional] = useState(false);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const [message, setMessage] = useState(null);

      const sendForm = (event) => {
        event.preventDefault();
        setIsLoading(true)

        if(!isProfessional){
          axios.get(`${urlApi}/api/v1/SignInBarbearia/${email}/${senha}`)
          .then(res => {
            if(res.data.Success === 'Success'){
              localStorage.clear();
              localStorage.setItem('token', res.data.token);
              localStorage.setItem('dataBarbearia', JSON.stringify(res.data));

              setIsLoading(false)
              setMessage('Seja Bem Vindo!');
              setTimeout(() => {
              setMessage(null);
              navigate('/HomeBarbearia');
            }, 2000);

            }else{
              setIsLoading(false)
              setMessage('Erro ao realizar o Login!');
              setTimeout(() => {
                setMessage(null);
              }, 2000);
            }
          }).catch(err =>{
            console.error('Erro na requisição:', err);
            setIsLoading(false)
            setMessage('Erro ao realizar o Login!');
            setTimeout(() => {
              setMessage(null);
            }, 2000);
          })
        }else{
          axios.get(`${urlApi}/api/v1/SignInProfessional/${email}/${senha}`)
          .then(res => {
            console.log(res)
            if(res.data.Success === 'Success'){
              
              localStorage.clear();
              localStorage.setItem('token', res.data.token);
              localStorage.setItem('dataprofessional', JSON.stringify(res.data));

              setIsLoading(false)
              setMessage('Seja Bem Vindo!');
              setTimeout(() => {
              setMessage(null);
              navigate('/HomeProfessional');
            }, 2000);

            }else{
              setIsLoading(false)
              setMessage('Erro ao realizar o Login!');
              setTimeout(() => {
                setMessage(null);
              }, 2000);
            }
          }).catch(err =>{
            console.error('Erro na requisição:', err);
            setIsLoading(false)
            setMessage('Erro ao realizar o Login!');
            setTimeout(() => {
              setMessage(null);
            }, 2000);
          })
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
                    value={email}
                    onChange={(e) => {
                        const inputValue = e.target.value;
                        // Substituir o conteúdo do campo para conter apenas números, letras, "@" e "."
                        const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9@.]/g, '');
                        // Limitar a 50 caracteres
                        const truncatedValue = sanitizedValue.slice(0, 50);
                        setEmail(truncatedValue);
                    }}
                    placeholder="Email"
                    maxLength={50}
                    required
                    />{' '} <MdEmail className='icon__inSignUp'/>
                </div>

                <div className="inputBox">
                <input
                    type="password"
                    id="senha"
                    name="senha"
                    value={senha}
                    onChange={(e) => {
                      let inputValue = e.target.value;
                      
                      // Remover caracteres não permitidos
                      inputValue = inputValue.replace(/[^a-zA-Z0-9@.#%]/g, '');
                      
                      // Limitar a 8 caracteres
                      const truncatedValue = inputValue.slice(0, 8);
                      
                      setSenha(truncatedValue);
                    }}
                    placeholder="Password"
                    maxLength={8}
                    required
                    />{' '} <PiPassword className='icon__inSignUp'/>
                </div>

                <div className='container__checkbox__professional'>
                  <input type="checkbox"
                         className='input__checkbox__professional'
                         onChange={(e) => setIsProfessional(!isProfessional)}
                  />
                  <label>Sou profissional</label>
                </div>

                <div className='inputBox'>
                {isLoading ? (
                  <div className="loaderCreatingBooking"></div>
                ):(
                  <input type="submit" value="Entrar" />
                )}
                </div>
                <div className="link__signup">
                    <p>Não tem uma conta?</p><Link className="link" to="/SignUpBarbearia">Criar Conta</Link>
                </div>
        </form>
      </div>
    );
}

export default SignInBarbearia;