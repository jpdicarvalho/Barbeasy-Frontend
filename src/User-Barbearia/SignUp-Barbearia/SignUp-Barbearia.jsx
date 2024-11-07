import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSpring, animated } from "react-spring";

import './style.css';

import { IoStorefrontOutline } from "react-icons/io5";
import { CiLocationArrow1 } from "react-icons/ci";
import { VscAccount } from "react-icons/vsc";


import barberLogo from '../../../barber-logo.png';

function SignUpBarbearia() {

  const urlApi = 'https://barbeasy.up.railway.app'

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false)
  const [values, setValues] = useState({
    name: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    usuario: '',
    email: '',
    senha: '',
    celular: '',
  });

  const [step, setStep] = useState(1);
  const [message, setMessage] = useState(null);

  const props = useSpring({
    opacity: 1,
    transform: "translateX(0%)",
    from: { opacity: 0, transform: "translateX(-100%)" }
  });

  //Function to verify if all values is not empty
  const areAllFieldsFilled = () => {
    for (const key in values) {
      if (values.hasOwnProperty(key) && values[key].trim() === '') {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();//impede o navegador de recaregar a página ao enviar o formulário
    setIsLoading(true)

    if (areAllFieldsFilled()){
      axios.post(`${urlApi}/api/v1/SignUpBarbearia`, values)
      .then(res => {
        if (res.status === 201) {
          setIsLoading(false)
          setMessage('Cadastro realizado!');
          setTimeout(() => {
            setMessage(null);
            //navigate('/SignInBarbearia');
          }, 2000);
        } else {
          setIsLoading(false)
          setMessage('Erro ao realizar o cadastro!');
          setTimeout(() => {
            setMessage(null);
          }, 3000);
        }
      })
      .catch(err => {
        if (err.response.status === 401) {
          setIsLoading(false)
          setMessage('E-mail ou endereço já cadastrado.');
        } else if(err.response.status === 400) {
          setIsLoading(false)
          setMessage('Erro ao realizar o cadastro! Verifique os campos preenchidos');
        }else{
          setIsLoading(false)
          setMessage('Erro ao realizar o cadastro!');
        }
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      });
    }else{
      setIsLoading(false)
      setMessage('Preencha todos os campos.')
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  console.log(values)
  return (
    <>
    <div className="container__default">
          <form onSubmit={handleSubmit} className="container">
        <div className="imgBox">
          <img src={barberLogo} alt="" />
        </div>

        <h2 id="HeaderSignUp">Barbeasy</h2>
        
        <div className="Box__cadastro__barbearia">
          <IoStorefrontOutline className='icon__IoStorefrontOutline'/>
          <h3 style={{color: '#f6f6fc'}}>Cadastro de Barbearia</h3>
        </div>

        {message === "Cadastro realizado!" ? (
          <p className="success">{message}</p>
          ) : (
          <p className={message ? 'error':''}>{message}</p>
        )}


        <animated.div style={props}>
          {step >= 1 && (
          <div className="inputBox">
            <input
            type="text"
            id="name"
            name="name"
            value={values.name}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Remover caracteres não alfanuméricos, ponto e espaço
              const filteredValue = inputValue.replace(/[^a-zA-Z\sçéúíóáõãèòìàêôâ]/g, '');
              // Limitar a 30 caracteres
              const truncatedValue = filteredValue.slice(0, 30);
              setValues({ ...values, name: truncatedValue });
            }}
            placeholder="Nome da Barbearia"
            maxLength={50}
            required
          /> 

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
            placeholder="WhatsApp"
            maxLength={16}
            required
          /> 
          </div>
          )}

          {step >= 2 && (
            <div className="inputBox">
              <div style={{marginTop: '10px'}} className="Box__endereco__barbearia">
                <CiLocationArrow1 className='icon__GrMapLocation'/>
                <p id="tittle_p">Endereço</p>
              </div>
              
              <input
              type="text"
              id="street"
              name="street"
              value={values.street}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Remover caracteres especiais
                const filteredValue = inputValue.replace(/[^a-zA-Z\sçéúíóáõãèòìàêôâ]/g, '');

                // Limitar a 50 caracteres
                const truncatedValue = filteredValue.slice(0, 30);
                setValues({ ...values, street: truncatedValue });
              }}
              placeholder="Rua"
              maxLength={30}
              required
            />

              <input
                type="text"
                id="number"
                name="number"
                value={values.number}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres não numéricos
                  const numericValue = inputValue.replace(/\D/g, '');
                  // Limitar a 5 caracteres
                  const truncatedValue = numericValue.slice(0, 5);
                  setValues({ ...values, number: truncatedValue });
                }}
                placeholder="Nº"
                maxLength={5}
                required
              />
              
              <input
                type="text"
                id="neighborhood"
                name="neighborhood"
                value={values.neighborhood}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres especiais
                  const sanitizedValue = inputValue.replace(/[^a-zA-Z\sçéúíóáõãèòìàêôâ]/g, '');
                  // Limitar a 50 caracteres
                  const truncatedValue = sanitizedValue.slice(0, 30);
                  setValues({ ...values, neighborhood: truncatedValue });
                }}
                placeholder="Bairro"
                maxLength={20}
                required
              />
              
              <input
                type="text"
                id="city"
                name="city"
                value={values.city}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres especiais
                  const sanitizedValue = inputValue.replace(/[^a-zA-Z\sçéúíóáõãèòìàêôâ]/g, '');
                  // Limitar a 50 caracteres
                  const truncatedValue = sanitizedValue.slice(0, 30);
                  setValues({ ...values, city: truncatedValue });
                }}
                placeholder="Cidade"
                maxLength={20}
                required
              />
            </div>
          )}

          {step >= 3 && (
            <div className="inputBox">

              <div style={{marginTop: '10px'}} className="Box__endereco__barbearia">
                <VscAccount className='icon__GrMapLocation'/>
                <p id="tittle_p">Informações de login</p>
              </div>

              <input
                type="text"
                id="usuario"
                name="usuario"
                value={values.usuario}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres não alfanuméricos
                  const filteredValue = inputValue.replace(/[^a-zA-Z\s]/g, '');
                  // Limitar a 30 caracteres
                  const truncatedValue = filteredValue.slice(0, 20);
                setValues({ ...values, usuario: truncatedValue });
                }}
                placeholder="Nome de Usuário"
                maxLength={15}
                required
              />

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
                  // Validar se o valor atende ao formato de email esperado
                    setValues({ ...values, email: truncatedValue });
                }}
                placeholder="Email"
                maxLength={50}
                required
              />

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
          )}

          {step < 4 && (
            <div className='inputBox'>
              <button type="submit" onClick={nextStep} id="button_next">Continuar</button>
            </div>
          )}

          {step === 4 && (
            <div className='inputBox'>
              <div className="inputBox__inner__cadastrar">
                  {isLoading ? (
                    <div className="loaderCreatingBooking"></div>
                  ):(
                    <input type="submit" value="Cadastrar" />
                  )}
                </div>
              
            </div>
          )}
        </animated.div>

        <div className="link__login">
          <p>Você já tem uma conta?</p><Link className="link" to="/SignInBarbearia">Login</Link>
        </div>
          </form>
      </div>
      
    </>
  );
}

export default SignUpBarbearia;
