import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import InputMask from "react-input-mask";
import { useSpring, animated } from "react-spring";
import './style.css';
import barberLogo from './barber-logo.png';

function SignUp() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    celular: '',
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
      axios.post('https://api-user-barbeasy.up.railway.app/api/SignUp', values) // <-- Ajuste aqui
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
          if (err.response && err.response.status === 400) {
            setMessage('E-mail ou Celular já cadastrado');
          } else {
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

  return (
    <div className="container__default">
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
            id="name"
            name="name"
            value={values.name}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Remover caracteres não alfanuméricos, ponto e espaço
              const filteredValue = inputValue.replace(/[^a-zA-Z0-9\sçéúíóáõãèòìàêôâ.]/g, '');
              // Limitar a 30 caracteres
              const truncatedValue = filteredValue.slice(0, 30);
              setValues({ ...values, name: truncatedValue });
            }}
            placeholder="Nome de Usuário"
            required
          /> <i className="fa-regular fa-user Icon"></i>


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
            required
          /> <i className="fa-solid fa-envelope" id="Icon_User"></i>
          </div>

          {step >= 2 && (
            <div className="inputBox">
              <InputMask
                type="tel"
                id="celular"
                name="celular"
                mask="(99) 9 9999-9999"
                value={values.celular}
                onChange={(e) => setValues({ ...values, celular: e.target.value })}
                placeholder="(99) 9 9999-9999"
                required
              /> <span className="material-symbols-outlined" id="Icon_Barbearia">phone_iphone</span>

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
          {step < 3 && (
            <div className='inputBox'>
              <button type="button" onClick={nextStep} id="button_next">Continuar</button>
            </div>
          )}

          {step === 3 && (
            <div className='inputBox'>
              <input type="submit" value="Cadastrar" />
            </div>
          )}
        </animated.div>

        <div className="link__login">
          <p>Você já tem uma conta?</p><Link className="link" to="/SignIn">Login</Link>
        </div>
      </form>
    </div>
  );
}

export default SignUp;