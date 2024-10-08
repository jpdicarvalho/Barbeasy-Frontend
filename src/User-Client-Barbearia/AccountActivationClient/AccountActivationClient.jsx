import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import './AccountActivationClient.css';

import barberLogo from '../../../barber-logo.png';


function AccountActivationClient (){
  
  const urlApi = 'https://barbeasy.up.railway.app'
  
  const location = useLocation();

  const { objectNewAccount } = location.state;

  // Estado que armazena os valores digitados
  const [code, setCode] = useState(new Array(5).fill(""));
  // Referências para os inputs
  const inputRefs = useRef([]);

  // Função que lida com as mudanças no input
  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/^[0-9]$/.test(value)) {  // Aceitar apenas números
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value !== "" && index < 4) {  // Avançar para o próximo input, se não estiver no último
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Função que lida com o comportamento ao pressionar teclas
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault(); // Evitar o comportamento padrão do Backspace

      const newCode = [...code];
      if (newCode[index] !== "") {  // Se o campo atual não está vazio, limpa-o
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {  // Se o campo está vazio, move o foco para o anterior
        inputRefs.current[index - 1].focus();
        newCode[index - 1] = "";  // Limpar o valor do campo anterior
        setCode(newCode);
      }
    }
  };
//================== Section cronometro ====================
const calculateTimeDifference = (data_request) => {
  const expirationDate = new Date(data_request).getTime();
  const currentDate = Date.now();
  const differenceInMilliseconds = expirationDate - currentDate;

  if (differenceInMilliseconds <= 0) {
    return 0; // Retorna 0 segundos se já expirou
  }

  const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
  return differenceInSeconds;
};

const formatTime = (totalSeconds) => {
const minutes = Math.floor(totalSeconds / 60);
const seconds = totalSeconds % 60;

// Formatar minutos e segundos com dois dígitos
const formattedMinutes = String(minutes).padStart(2, '0');
const formattedSeconds = String(seconds).padStart(2, '0');

return `${formattedMinutes}:${formattedSeconds}`;
};

const [seconds, setSeconds] = useState(calculateTimeDifference(objectNewAccount.data_request));
const formattedTime = formatTime(seconds);

// Hook para contagem regressiva
useEffect(() => {
  const timer = setInterval(() => {
    setSeconds((prevSeconds) => {
      if (prevSeconds <= 0) {
        clearInterval(timer);
        return 0;
      }
      return prevSeconds - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, []);
//==================== Section verify code activation =================
const [message, setMessage] = useState(null);

const verifyCodeActivation = () =>{
  if(code.join('').length === 5){
    const values = {
      email: objectNewAccount.email,
      celular: objectNewAccount.celular,
      code: code.join('')
    }
    axios.post(`${urlApi}/api/v1/verifyCodeActivationClient`, values)
    .then(res =>{
      if(res.status === 201){
        setMessage('Sua conta foi ativada com sucesso!')
      }
    })
    .catch(err =>{
      console.log('Erro ao ativar a conta', err)
      setMessage('Erro ao ativar a conta')

    })
  }else{
    return setMessage('Preencha todos os campos.')
  }
}

return (
    <>
      <div className="container__in__AccountActivationClient">
        <div className="imgBox">
          <img src={barberLogo} alt="" />
        </div>

        <h2 id="HeaderSignUp">Barbeasy</h2>

        <div className="Box__cadastro__barbearia">
          <h3 style={{color: '#f6f6fc'}}>Verificação de e-mail</h3>
        </div>

        <div className="information__in__AccountActivationClient">
          <p>Enviamos um código de ativação para o e-mail {objectNewAccount.email}</p>
        </div>
        {message}
        <div className="form__in__AccountActivationClient" onClick={verifyCodeActivation}>
          <div className="box__input__in__AccountActivationClient">
            {code.map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={code[index]}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => inputRefs.current[index] = el}  // Referenciar o input
                className="input__code__verification"
              />
            ))}
          </div>

          <input type="submit" value="Ativar conta" className="input__submit__code__verification"/>
        </div>
        {formattedTime === '00:00' ? (
          <div className="resend__code__verification">
            Reenviar código
          </div>
        ):(
          <div className="time__resend__code__verification">
            Reenviar código em {formattedTime}
          </div>
        )}
        
      </div>
    </>
  );
}

export default AccountActivationClient;