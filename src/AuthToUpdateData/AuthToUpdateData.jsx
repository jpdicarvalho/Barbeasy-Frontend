import { useState } from 'react';

import axios from 'axios';

import { VscError } from "react-icons/vsc";
import { PiPassword } from "react-icons/pi";
import './AuthToUpdateData.css';

export default function AuthToUpdateData ({ onPasswordVerify }){

    //Buscando informações do usuário logado
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('dataBarbearia');//Obtendo os dados salvo no localStorage
    const userInformation = JSON.parse(userData);//trasnformando os dados para JSON
    const barbeariaId = userInformation.barbearia[0].id;

    const urlApi = 'https://barbeasy.up.railway.app'

    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');


    const AuthToUpdateData = () => {
        if(password){
            axios.get(`${urlApi}/v1/api/AuthToUpdateData/`, {
                params: {
                    barbeariaId: barbeariaId,
                    password: password
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                  }
            }).then(res => {
              if(res.data.Success === 'true'){
                onPasswordVerify(true);
                setPassword('')
              }else{
                onPasswordVerify(false);
                setMessage('Senha incorreta.')
                setTimeout(() => {
                    setMessage('');
                  }, 2000);
              }
            }).catch(error => {
                onPasswordVerify(false);
                setMessage('Erro ao verificar senha, tente novamente mais tarde')
                setPassword('')
                console.error('Error', error)
            });
        }
        
      };
    return(
        <div className="form__change__data">
            <div className='container__text__change__data'>
                Digite sua senha para confirmar a alteração
            </div>
            {message.length > 7 &&(
                <div className={` ${message.length > 7 ? 'mensagem-erro' : ''}`}>
                <VscError className={`hide_icon__error ${message.length > 7 ? 'icon__error' : ''}`}/>
                <p className="text__message">{message}</p>
            </div>
            )}
           <div className='container__form__change__data'>
            <input
                type="password"
                id="senha"
                name="senha"
                value={password}
                className={`input__change__data ${password ? 'input__valided':''}`}
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
                <button className={`Btn__confirm__changes ${password ? 'Btn__valided':''}`} onClick={AuthToUpdateData}>
                    Confirmar
                </button>
           </div>
        </div>
    )
}