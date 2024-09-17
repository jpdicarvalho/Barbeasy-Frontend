import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSpring, animated } from "react-spring";
import './style.css';

import barberLogo from '../../../barber-logo.png';

import { IoPhonePortraitSharp } from "react-icons/io5";
import { VscAccount } from "react-icons/vsc";


function SignUp() {

  const urlApi = 'https://barbeasy.up.railway.app'

  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: '',
    email: '',
    celular: '',
    senha: ''
  });

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState(null);
  const [step, setStep] = useState(1);

  const props = useSpring({
    opacity: 1,
    transform: step === 1 ? "translateX(0%)" : `translateX(-${(step - 1) * 0}%)`,
    from: { opacity: 0, transform: "translateX(-100%)" }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true)

    if (step === 3) {
      axios.post(`${urlApi}/api/v1/SignUp`, values)
        .then(res => {
          if (res.status === 201) {
            setIsLoading(false)
            setMessage('Cadastro realizado!');
            setTimeout(() => {
              setMessage(null);
              navigate('/SignIn');
            }, 2000);
          } else {
            setIsLoading(false)
            setMessage('Erro ao realizar o cadastro!');
            setTimeout(() => {
              setMessage(null);
            }, 3000);
            console.log(res.data.Error);
          }
        })
        .catch(err => {
          if (err.response && err.response.status === 400) {
            setIsLoading(false)
            setMessage('E-mail ou celular já cadastrados.');
          } else {
            setIsLoading(false)
            setMessage('Erro ao realizar o cadastro!');
            console.error(err);
          }
          setTimeout(() => {
            setMessage(null);
          }, 3000);
        });
    } else {
      setStep(step + 1);
    }
  };
  const nextStep = () => {
    setStep(step + 1);
  };
 
const valuesNoEmpty = values.name && values.email && values.celular && values.senha;

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

        {message === "Cadastro realizado!" ? (
          <p className="success">{message}</p>
          ) : (
          <p className="error">{message}</p>
        )}

        <animated.div style={props} className="inputContainer">
          <div className="inputBox">
          <input
            type="text"
            id="name"
            name="name"
            value={values.name}
            maxLength={50}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Remover caracteres não alfanuméricos, ponto e espaço
              const filteredValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ.]/g, '');
              // Limitar a 30 caracteres
              const truncatedValue = filteredValue.slice(0, 30);
              setValues({ ...values, name: truncatedValue });
            }}
            placeholder="Nome"
            required
          /> 


          <input
            type="email"
            id="email"
            name="email"
            onChange={(e) => {
              const inputValue = e.target.value;
              // Remover caracteres não permitidos no e-mail
              const filteredValue = inputValue.replace(/[^a-zA-Z0-9@.]/g, '');
              setValues({ ...values, email: filteredValue });
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
                value={values.celular}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const filteredValue = inputValue.replace(/[^0-9]/g, '');
                  // Limitar a 11 caracteres
                  const truncatedValue = filteredValue.slice(0, 11);
                  setValues({ ...values, celular: truncatedValue })
                }}
                placeholder="Ex.: 93 997412541"
                maxLength={16}
                required
              /> 
              <input
                type="password"
                id="senha"
                name="senha"
                value={values.senha}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  //regex to valided password
                  const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9@.#%]/g, '');
                  // Limitar a 8 caracteres
                  const truncatedValue = sanitizedValue.slice(0, 8);
                  setValues({ ...values, senha: truncatedValue });
                }}
                placeholder="Password"
                maxLength={8}
                required
              /> 
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
                    <input type="submit" value="Cadastrar" />
                  )}
                </div>
              ):(
                <button type="button" id="button_next">Preencha todos os campos</button>
              )}
            </div>
          )}
        </animated.div>

        <div className="link__login">
          <p>Você já tem uma conta?</p><Link className="link" to="/SignIn">Login</Link>
        </div>
      </form>
    </div>
    </>
    
  );
}

export default SignUp;
