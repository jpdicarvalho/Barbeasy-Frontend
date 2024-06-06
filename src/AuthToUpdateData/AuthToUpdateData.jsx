import { useState } from 'react';

import { PiPassword } from "react-icons/pi";
import './AuthToUpdateData.css';

export default function AuthToUpdateData (){

    //Buscando informações do usuário logado
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('dataBarbearia');//Obtendo os dados salvo no localStorage
    const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
    const barbeariaId = userInformation.barbearia[0].id;

    const urlApi = 'https://barbeasy.up.railway.app'

    const [password, setPassword] = useState('');

    const AuthToUpdateData = () => {
        if(password){
            axios.get(`${urlApi}/v1/api/AuthToUpdateData/${barbeariaId}/${password}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                  }
            }).then(res => {
              if(res.data.Success === 'Success'){
                console.log('foi')
              }
            }).catch(error => {
                console.log('não foi')
                console.error('Error', error)
            });
        }
        
      };

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
                <button type='submit' className={`Btn__confirm__changes ${password ? 'Btn__valided':''}`} onClick={AuthToUpdateData}>
                    Confirmar
                </button>
           </div>
        </form>
    )
}