import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import './AccountActivationClient.css'
import axios from "axios";

import barberLogo from '../../../barber-logo.png';

function AccountActivationClient (){

  // Estado que armazena os valores digitados
  const [code, setCode] = useState(new Array(5).fill(""));
  // Referências para os inputs
  const inputRefs = useRef([]);


  const handleChange = (e, index) => {
    const value = e.target.value;
    console.log(e)
    if (/^[0-9]$/.test(value)) {  // Aceitar apenas números
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (index < 4) {
        inputRefs.current[index + 1].focus(); // Avançar para o próximo input
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && code[index] === '') {
        console.log(index)
      if (index > 0) {
        inputRefs.current[index - 1].focus(); // Voltar para o input anterior
      }
    }
  };

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
                    <p>Enviamos um código de ativação para o e-mail 'exemple@gmail.com'</p>
                </div>

                <form action="" className="form__in__AccountActivationClient">
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

                    <input type="submit" className="input__submit__code__verification"/>
                </form>
                <div>
                    Reenviar código
                </div>
            </div>
        </>
    )
}
export default AccountActivationClient