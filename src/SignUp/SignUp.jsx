import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import './style.css';
import barberLogo from './barber-logo.png'


function SignUp() {
    const [values, setValues] = useState({
        name:'',
        email:'',
        senha:''
    })
    const [message, setMessage] = useState(null);

    const navigate = useNavigate()
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('https://api-user-barbeasy.up.railway.app/SingUp', values)
          .then(res => {
            if (res.status === 201) {
              setMessage('Cadastro realizado!');
              setTimeout(() => {
                setMessage(null);
                navigate('/');
              }, 2000);
              
            } else{
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

    return (
    <>
      <form onSubmit={handleSubmit} className="container">
        <div className="imgBox">
            <img src={barberLogo} alt="" />
        </div>

        <h2 id="HeaderSignUp">Barbeasy</h2>
        <span>Cadastro de Usuário</span>
        {message === "Cadastro realizado!" ? (
            <p className="sucess">{message}</p>
            ) : (
            <p className="error">{message}</p>
        )}
        <div className="inputBox">
            <input type="text" id="name" name="name" onChange={ e => setValues({...values, name: e.target.value})} placeholder="Nome" required/>
            <i className="fa-regular fa-user"></i>
        </div>

        <div className="inputBox">
          <input type="text" id="email" name="email" onChange={ e => setValues({...values, email: e.target.value})} placeholder="Email" required/>
          <i className="fa-solid fa-envelope"></i> 
        </div>

        <div className="inputBox">
           <input type="password" id="senha" name="senha" onChange={ e => setValues({...values, senha: e.target.value})} placeholder="Password" required/>
           <i className="fa-solid fa-lock"></i>
        </div>

        <div className='inputBox'>
            <input type="submit" value="Cadastrar"/>
        </div>
        <Link className="link" to="/">Fazer Login</Link>
      </form>
    </>
    )
  }
  
  export default SignUp  