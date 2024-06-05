import { useState } from 'react';

import { PiPassword } from "react-icons/pi";
import './AuthToUpdateData.css';

export default function AuthToUpdateData (){
    const [password, setPassword] = useState('')

    return(
        <form action="" className="form__change__data">
            <div className='container__text__change__data'>
                Digite sua senha para confirmar a alteração
            </div>
           <div className='container__form__change__data'>
            <input
                type="password"
                id="senha"
                name="senha"
                className={`input__change__data ${password ? 'input__valided':''}`}
                maxlength="10"
                onChange={(e) => {
                    const inputValue = e.target.value;
                    // Limitar a 10 caracteres
                    const truncatedPasswordConfirm = inputValue.slice(0, 10);
                    setPassword(truncatedPasswordConfirm);
                }}
                placeholder="Senha atual"
                maxLength={8}
                required
                /><PiPassword className='icon__input__change__data'/>
                <button type='submit' className={`Btn__confirm__changes ${password ? 'Btn__valided':''}`}>
                    Confirmar
                </button>
           </div>
        </form>
    )
}