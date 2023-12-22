import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import InputMask from "react-input-mask";
import { useSpring, animated } from "react-spring";
import './style.css';
import barberLogo from './barber-logo.png';

function SignUp() {
  const [values, setValues] = useState({
    user_name: '',
    email: '',
    phone_number: '',
    senha: ''
  });
  const [message, setMessage] = useState(null);
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const props = useSpring({
    opacity: 1,
    transform: step === 1 ? "translateX(0%)" : `translateX(-${(step - 1) * 0}%)`,
    from: { opacity: 0, transform: "translateX(-100%)" }
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (step === 3) {
      axios.post('https://api-user-barbeasy.up.railway.app/SignUp', values) // <-- Ajuste aqui
        .then(res => {
          if (res.status === 201) {
            setMessage('Cadastro realizado!');
            setTimeout(() => {
              setMessage(null);
              navigate('/SignIn');
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
    } else {
      setStep(step + 1);
    }
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
        <span>Cadastro de Usuário</span>
        {message === "Cadastro realizado!" ? (
          <p className="success">{message}</p>
        ) : (
          <p className="error">{message}</p>
        )}

        <animated.div style={props} className="inputContainer">
          <div className="inputBox">
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={values.user_name}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Remover caracteres não alfanuméricos
                const filteredValue = inputValue.replace(/[^a-zA-Z0-9]/g, '');
                // Limitar a 30 caracteres
                const truncatedValue = filteredValue.slice(0, 30);
                setValues({ ...values, user_name: truncatedValue });
              }}
              placeholder="Nome de Usuário"
              required
            /> <i className="fa-regular fa-user Icon"></i>

            <input
              type="email"
              id="email"
              name="email"
              onChange={e => setValues({ ...values, email: e.target.value })}
              placeholder="Email"
              required
            />
            <i className="fa-solid fa-envelope" id="Icon_User"></i>
          </div>

          {step >= 2 && (
            <div className="inputBox">
              <InputMask
                type="tel"
                id="phone_number"
                name="phone_number"
                mask="(99) 9 9999-9999"
                value={values.phone_number}
                onChange={(e) => setValues({ ...values, phone_number: e.target.value })}
                placeholder="(99) 9 9999-9999"
                required
              />
              <span className="material-symbols-outlined" id="Icon_Barbearia">phone_iphone</span>

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
              /> <i className="fa-solid fa-lock" id="Icon_User"></i>
            </div>
          )}
          {step < 2 && (
            <div className='inputBox'>
              <button type="button" onClick={nextStep} id="button_next">Continuar</button>
            </div>
          )}

          {step === 2 && (
            <div className='inputBox'>
              <input type="submit" value="Cadastrar" />
            </div>
          )}
        </animated.div>

        <div className="link__login">
          <p>Você já tem uma conta?</p><Link className="link" to="/SignIn">Login</Link>
        </div>
      </form>
    </>
  );
}

export default SignUp;