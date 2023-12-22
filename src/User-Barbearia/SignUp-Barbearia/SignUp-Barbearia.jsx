import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSpring, animated } from "react-spring";
import './style.css';
import barberLogo from './barber-logo.png';

function SignUpBarbearia() {
  const [values, setValues] = useState({
    barbearia_name: '',
    user_name: '',
    email: '',
    senha: ''
  });
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const props = useSpring({
    opacity: 1,
    transform: "translateX(0%)",
    from: { opacity: 0, transform: "translateX(-100%)" }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    // Concatenar os dados de endereço
    const endereco = `${values.street}, Nº ${values.number}, ${values.neighborhood} - ${values.city}.`;

    // Adicionar a variável endereco aos valores a serem enviados
    const dataBarbearia = {
    ...values,
    endereco,  // Adicionando a variável endereco
    };

    console.log(dataBarbearia)

    axios.post('https://api-user-barbeasy.up.railway.app/SignUp_Barbearia', dataBarbearia)
      .then(res => {
        if (res.status === 201) {
          setMessage('Cadastro realizado!');
          setTimeout(() => {
            setMessage(null);
            navigate('/SignInBarbearia');
          }, 2000);

        } else {
          setMessage('Erro ao realizar o cadastro!');
          setTimeout(() => {
            setMessage(null);
          }, 3000);
          console.log(res.data.Error);
        }
      })
      .catch(err => {
        setMessage('Erro ao realizar o cadastro!');
        setTimeout(() => {
          setMessage(null);
        }, 3000);
        console.error(err);
      });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="container">
        <div className="imgBox">
          <img src={barberLogo} alt="" />
        </div>

        <h2 id="HeaderSignUp">Barbeasy</h2>
        <span>Cadastro de Barbearia</span>
        {message === "Cadastro realizado!" ? (
          <p className="success">{message}</p>
        ) : (
          <p className="error">{message}</p>
        )}

        <animated.div style={props}>
          {step >= 1 && (
          <div className="inputBox">
            <input
            type="text"
            id="barbearia_name"
            name="barbearia_name"
            value={values.barbearia_name}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Remover caracteres não alfanuméricos, ponto e espaço
              const filteredValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ.]/g, '');
              // Limitar a 30 caracteres
              const truncatedValue = filteredValue.slice(0, 30);
              setValues({ ...values, barbearia_name: truncatedValue });
            }}
            placeholder="Nome da Barbearia"
            required
          /> <span className="material-symbols-outlined" id="Icon_Barbearia">store</span>
          
          
          </div>
          )}

          {step >= 2 && (
            <div className="inputBox">
              <p id="tittle_p">Endereço da Barbearia</p>
              <input
              type="text"
              id="street"
              name="street"
              onChange={(e) => {
                const inputValue = e.target.value;
                // Remover caracteres especiais
                const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ]/g, '');

                // Limitar a 50 caracteres
                const truncatedValue = sanitizedValue.slice(0, 50);
                setValues({ ...values, street: truncatedValue });
              }}
              placeholder="Rua"
              required
            /> <span className="material-symbols-outlined" id="street_icon">add_road</span>

              <input
                type="text"
                id="number"
                name="number"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres não numéricos
                  const numericValue = inputValue.replace(/\D/g, '');
                  // Limitar a 10 caracteres
                  const truncatedValue = numericValue.slice(0, 5);
                  setValues({ ...values, number: truncatedValue });
                }}
                placeholder="Nº"
                required
              />{' '} <span className="material-symbols-outlined" id="street_number">home_pin</span>
              
              <input
                type="text"
                id="neighborhood"
                name="neighborhood"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres especiais
                  const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ]/g, '');
                  // Limitar a 50 caracteres
                  const truncatedValue = sanitizedValue.slice(0, 50);
                  setValues({ ...values, neighborhood: truncatedValue });
                }}
                placeholder="Bairro"
                required
              /><span className="material-symbols-outlined" id="neighborhood_icon">route</span>
              
              <input
                type="text"
                id="city"
                name="city"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres especiais
                  const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ]/g, '');
                  // Limitar a 50 caracteres
                  const truncatedValue = sanitizedValue.slice(0, 30);
                  setValues({ ...values, city: truncatedValue });
                }}
                placeholder="Cidade"
                required
              />{' '} <span className="material-symbols-outlined" id="city_icon">map</span>
            </div>
          )}

          {step >= 3 && (
            <div className="inputBox">
              <p id="tittle_p">Informações de Login</p>
              <input
                type="text"
                id="user_name"
                name="user_name"
                value={values.user_name}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Remover caracteres não alfanuméricos
                  const filteredValue = inputValue.replace(/[^a-zA-Z0-9.\s]/g, '');
                  // Limitar a 30 caracteres
                  const truncatedValue = filteredValue.slice(0, 30);
                setValues({ ...values, user_name: truncatedValue });
                }}
                placeholder="Nome de Usuário"
                required
              />{' '} <i className="fa-regular fa-user" id="Icon_user_barbearia"></i>

              <input
                type="email"
                id="email"
                name="email"
                onChange={(e) => {
                  const inputValue = e.target.value;
                  // Substituir o conteúdo do campo para conter apenas números, letras, "@" e "."
                  const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9@.]/g, '');
                  // Limitar a 50 caracteres
                  const truncatedValue = sanitizedValue.slice(0, 50);
                  setValues({ ...values, email: truncatedValue });
                }}
                placeholder="Email"
                required
              />{' '} <i className="fa-solid fa-envelope" id="icon_email"></i>

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
                required
                />{' '} <i className="fa-solid fa-lock" id="icon_password"></i>
            </div>
          )}

          {step < 4 && (
            <div className='inputBox'>
              <button type="submit" onClick={nextStep} id="button_next">Continuar</button>
            </div>
          )}

          {step === 4 && (
            <div className='inputBox'>
              <input type="submit" value="Cadastrar" />
            </div>
          )}
        </animated.div>

        <div className="link__login">
          <p>Você já tem uma conta?</p><Link className="link" to="/SignInBarbearia">Login</Link>
        </div>
      </form>
    </>
  );
}

export default SignUpBarbearia;
