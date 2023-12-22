import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSpring, animated } from "react-spring";
import './style.css';
import barberLogo from './barber-logo.png';

function SignUpBarbearia() {
  const [values, setValues] = useState({
    name: '',
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
    axios.post('', values)
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
          <p className="sucess">{message}</p>
        ) : (
          <p className="error">{message}</p>
        )}

        <animated.div style={props}>
          {step >= 1 && (
<div className="inputBox">
  <input
    type="text"
    id="Barbearia_name"
    name="Barbearia_name"
    value={values.Barbearia_name}
    onChange={(e) => {
      const inputValue = e.target.value;
      // Remover caracteres não alfanuméricos
      const filteredValue = inputValue.replace(/[^a-zA-Z0-9]/g, '');
      // Limitar a 30 caracteres
      const truncatedValue = filteredValue.slice(0, 30);
      setValues({ ...values, Barbearia_name: truncatedValue });
    }}
    placeholder="Nome da Barbearia"
    required
  /> <span className="material-symbols-outlined" id="Icon_Barbearia">store</span>

  <input
    type="text"
    id="User_name"
    name="User_name"
    value={values.User_name}
    onChange={(e) => {
      const inputValue = e.target.value;
      // Remover caracteres não alfanuméricos
      const filteredValue = inputValue.replace(/[^a-zA-Z0-9]/g, '');
      // Limitar a 30 caracteres
      const truncatedValue = filteredValue.slice(0, 30);
      setValues({ ...values, User_name: truncatedValue });
    }}
    placeholder="Nome de Usuário"
    required
  /> <i className="fa-regular fa-user" id="Icon_User"></i>
</div>
          )}

          {step >= 2 && (
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
  required
/> <i className="fa-solid fa-envelope Icon"></i>
              <input type="tel" id="phone_number" name="phone_number" onChange={e => setValues({ ...values, phone_number: e.target.value })} placeholder="(99) 9 9999-9999" required />
              <span className="material-symbols-outlined" id="Icon_phone">phone_iphone</span>
            </div>
          )}

          {step >= 3 && (
            <div className="inputBox">
              <input type="password" id="senha" name="senha" onChange={e => setValues({ ...values, senha: e.target.value })} placeholder="Password" required />
              <i className="fa-solid fa-lock Icon"></i>
            </div>
          )}

          {step < 3 && (
            <div className='inputBox'>
              <button type="submit" onClick={nextStep} id="button_next">Continuar</button>
            </div>
          )}

          {step === 3 && (
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
