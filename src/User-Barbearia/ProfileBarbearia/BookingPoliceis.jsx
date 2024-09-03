import { useState, useEffect } from "react";

import PropTypes from 'prop-types';

import axios from 'axios';

import { IoIosArrowDown } from "react-icons/io";
import { PiContactlessPayment } from "react-icons/pi";
import { SiMercadopago } from "react-icons/si";
import { AiOutlineFileProtect } from "react-icons/ai";
import { VscError } from "react-icons/vsc";
import { PiPassword } from "react-icons/pi";
import { MdOutlineDone } from "react-icons/md";
import { set } from "date-fns";

export function BookingPoliceis ({barbeariaId, OAuthUrl, isConectedWithMercadoPago}){

    const urlApi = 'https://barbeasy.up.railway.app'
    const token = localStorage.getItem('token');

    const [confirmPassword, setConfirmPassword] = useState('');

//=========== Section Booking Policeis ===========
const [showBookingsPoliceis, setShowBookingsPoliceis] = useState(false);
const [bookingWithPayment, setBookingWithPayment] = useState(false);
const [servicePercentageStored, setServicePercentageStored] = useState('');
const [servicePercentage, setServicePercentage] = useState(false);
const [inputCheckChange, setInputCheckChange] = useState('');
const [inputCheckAnotherChange, setInputCheckAnotherChange] = useState('');
const [anotherServicePercentage, setAnotherServicePercentage] = useState('');
const [messagePoliceisChange, setMessagePoliceisChange] = useState('');

const getBookingPoliceis = () =>{
  axios.get(`${urlApi}/api/v1/bookingPoliceis/${barbeariaId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
   }
  }).then(res =>{
      if(res.status === 200){
        setBookingWithPayment(res.data.bookingPoliceis.booking_with_payment === "enabled" ? true:false)
        setServicePercentage(res.data.bookingPoliceis.service_percentage === "false" ? false:res.data.bookingPoliceis.service_percentage)
        setServicePercentageStored(res.data.bookingPoliceis.service_percentage === "false" ? '':res.data.bookingPoliceis.service_percentage)
      }
  }).catch(err =>{
    console.log(err)
  })
}

useEffect(() =>{
  getBookingPoliceis()
}, [])

//Function to show menu of policeis settings
const changeShowBookingPolicies = () => {
  setShowBookingsPoliceis(!showBookingsPoliceis);
};

//Mini components of inputs check service percentage defalut
const CheckboxServicePercentage = ({ value }) => {
  return (
    <>
      <input
        type="checkbox"
        id={value}
        checked={servicePercentage === value && inputCheckAnotherChange === ''}
        onChange={() => {
          if (servicePercentage === value) {
            // Se a opção já estiver selecionada, desmarque-a
            setServicePercentage(false);
            setAnotherServicePercentage('')
          } else {
            // Caso contrário, selecione a opção
            setServicePercentage(value);
            setAnotherServicePercentage('')
            setInputCheckAnotherChange('')
          }
        }}
        className="days-switch"
      />
      <label htmlFor={value} className="switch">
        <span className="slider"></span>
      </label>
    </>
  );
};

//Mini components of input check another service percentage 
const CheckboxAnotherServicePercentage = ({ value }) => {
  return (
    <>
      <input
        type="checkbox"
        id={value}
        checked={inputCheckAnotherChange === value || (!(['0.1', '0.2', '0.5', '1'].includes(servicePercentage)) && (servicePercentageStored !== ''))}
        onChange={() => {
          if (inputCheckAnotherChange === value) {
            // Se a opção já estiver selecionada, desmarque-a
            setInputCheckAnotherChange(false);
          } else {
            // Caso contrário, selecione a opção
            setInputCheckAnotherChange(value);
            setServicePercentage(false)
          }
        }}
        className="days-switch"
      />
      <label htmlFor={value} className="switch">
        <span className="slider"></span>
      </label>
    </>
  );
};

//Function to format a new percentage defined by barbearia
const formatarServicePercentage = (valor) => {
  // Remover todos os caracteres exceto números
  const numero = valor.replace(/[^0-9]/g, '');

  if (!numero) return null;
  
  // Formato sem vírgula, apenas com parte inteira
  const parteInteira = numero.slice(0, 2);

  const newServicePercentage = `${parteInteira}%`;

  // Verificar se a porcentagem não é um valor indesejado
  if (["100%", "50%", "20%", "10%", "00%", "0%"].includes(newServicePercentage)) {
    return null;
  }
  
  return newServicePercentage;
};

//Function to set a new service percentage
const handleServicePercentageChange = (event) => {
  setAnotherServicePercentage(event.target.value.slice(0, 3)); // Permitir que o usuário digite livremente
};

//Function to apply the format after Blur
const handleServicePercentageBlur = () => {
  setAnotherServicePercentage(formatarServicePercentage(anotherServicePercentage));
};

//Function to update de policeis of barbearia
const updateBookingPoliceis = () =>{

  let anotherServicePercentageFormated;

  if(anotherServicePercentage){
    anotherServicePercentageFormated = `0.${anotherServicePercentage.replace(/[^0-9]/g, '')}`;
  }

  const values = {
    barbeariaId,
    confirmPassword,
    bookingWithPayment: bookingWithPayment ? 'enabled':'disabled',
    servicePercentage: servicePercentage !== 'outros' && servicePercentage !== false ? servicePercentage:anotherServicePercentageFormated
  }

  axios.put(`${urlApi}/api/v1/updateBookingPoliceis/`, values, {
    headers: {
      'Authorization': `Bearer ${token}`
   }
  }).then(res =>{
      if(res.status === 200){
        setMessagePoliceisChange('Políticas de agendamento atualizadas com sucesso.')
        setTimeout(() => {
          setMessagePoliceisChange('');
          setConfirmPassword('')
          setShowBookingsPoliceis('')
          setInputCheckChange('')
          setAnotherServicePercentage('')
          getBookingPoliceis()
        }, 3000);
        return
      }
  }).catch(err =>{
    console.log(err)
  })
}

BookingPoliceis.propTypes = {
    barbeariaId: PropTypes.number
  };

return (
    <>
        <div className="menu__main" onClick={changeShowBookingPolicies}>
          <AiOutlineFileProtect className='icon_menu'/>
            Políticas de agendamento
          <IoIosArrowDown className={`arrow ${showBookingsPoliceis ? 'girar' : ''}`} id='arrow'/>
        </div>

        {showBookingsPoliceis && (
            <div className="divSelected">
                <p className='information__span'>Escolha como os agendamentos devem ser feitos em sua barbearia:</p>
              <div className="container__payment__policeis">
                {bookingWithPayment === true ? (
                  <>
                  <div className='container__checkbox__payment'>
                    <PiContactlessPayment className='icon_menu__payment__enable' style={{color: '#f6f6f6'}}/>
                    <span  className='span__payment__enable' style={{color: '#f6f6f6'}}>Apenas com pagamento</span>
                      <input
                        type="checkbox"
                        id='status'
                        checked={bookingWithPayment === true} // Marca o input se o bookingWithPayment for true
                        onChange={() => {
                          const paymentChange = bookingWithPayment === true ? false : true; // Inverte o estado atual
                          setBookingWithPayment(paymentChange);
                          setInputCheckChange('bookingWithPaymentDisable')
                          setServicePercentage('false')
                        }}
                      />
                      <label htmlFor="status" className='switch'>
                        <span className='slider'></span>
                      </label>
                  </div>
                    
                    <div className="container__conection__with__mercado__pago">
                      {isConectedWithMercadoPago ? (
                        <>
                          <div className='container__barearia__conected'>
                            <SiMercadopago className='logo__mercado__pago__conection' />
                            <p className='information__span__payment__enable'>Barbearia conectada ao Mercado Pago</p>
                          </div>
                          <div className='container__valor__payment__booking'>
                            <p className='text__valor__payment__booking'>Quanto você deseja recerber pelo agendamento?</p>

                            <div className='container__service__percentage'>
                              <p className={`text__service__percentage ${servicePercentage === "0.1" ? 'text__service__percentage__selected':''}`}>10% do valor do serviço</p>
                              <CheckboxServicePercentage value="0.1"/>
                            </div>

                            <div className='container__service__percentage'>
                              <p className={`text__service__percentage ${servicePercentage === "0.2" ? 'text__service__percentage__selected':''}`}>20% do valor do serviço</p>
                              <CheckboxServicePercentage value="0.2"/>
                            </div>


                            <div className='container__service__percentage'>
                              <p className={`text__service__percentage ${servicePercentage === "0.5" ? 'text__service__percentage__selected':''}`}>50% do valor do serviço</p>
                              <CheckboxServicePercentage value="0.5"/>
                            </div>

                            <div className='container__service__percentage'>
                              <p className={`text__service__percentage ${servicePercentage === "1" ? 'text__service__percentage__selected':''}`}>100% do valor do serviço</p>
                              <CheckboxServicePercentage value="1"/>
                            </div>

                              <div className='container__service__percentage__another' >
                              <input
                                type="text"
                                value={anotherServicePercentage}
                                className={` ${inputCheckAnotherChange === "outros" || !(['0.1', '0.2', '0.5', '1'].includes(servicePercentage)) && (servicePercentageStored !== '') ? 'input__another__percentage':'ocult__input__another__percentage'}`}
                                onChange={handleServicePercentageChange}
                                onBlur={handleServicePercentageBlur}// Aplicar a formatação ao perder o foco
                                placeholder={['0.1', '0.2', '0.5', '1'].includes(servicePercentageStored) || servicePercentageStored === '' ? 'Ex.: 30%':`${servicePercentageStored.slice(2)}%`}
                                maxLength={6}
                              />
                              <p className={`text__service__percentage__another ${inputCheckAnotherChange === "outros" || (!(['0.1', '0.2', '0.5', '1'].includes(servicePercentage)) && (servicePercentageStored !== ''))? 'text__service__percentage__another__selected':''}`}>
                                {inputCheckAnotherChange === "outros" || (!(['0.1', '0.2', '0.5', '1'].includes(servicePercentage)) && (servicePercentageStored !== '')) ? 'do valor do serviço':'Outros'}
                              </p>
                              <CheckboxAnotherServicePercentage value="outros"/>
                            </div>
                            
                            
                              {messagePoliceisChange === "Políticas de agendamento atualizadas com sucesso." ? (
                                <div className="mensagem-sucesso">
                                  <MdOutlineDone className="icon__success"/>
                                  <p className="text__message">{messagePoliceisChange}</p>
                                </div>
                              ) : (
                                <div className={` ${messagePoliceisChange ? 'mensagem-erro' : ''}`}>
                                  <VscError className={`hide_icon__error ${messagePoliceisChange ? 'icon__error' : ''}`}/>
                                  <p className="text__message">{messagePoliceisChange}</p>
                                </div>
                              )}

                                <div style={{ paddingLeft: '10px' }}>
                                  {inputCheckChange === 'bookingWithPaymentEnable' && servicePercentage !== false && servicePercentage !== 'outros' &&(
                                    <>
                                      <div className="form__change__data">
                                          <div className="container__text__change__data">
                                            Digite sua senha para confirmar a alteração
                                          </div>
                                          <div className="container__form__change__data">
                                            <input
                                              type="password"
                                              id="senha"
                                              name="senha"
                                              value={confirmPassword}
                                              className={`input__change__data ${confirmPassword ? 'input__valided' : ''}`}
                                              onChange={(e) => {
                                                const inputValue = e.target.value;
                                                // Limitar a 10 caracteres
                                                const truncatedPasswordConfirm = inputValue.slice(0, 10);
                                                setConfirmPassword(truncatedPasswordConfirm);
                                              }}
                                              placeholder="Senha atual"
                                              maxLength={8}
                                              required
                                            />
                                            <PiPassword className="icon__input__change__data" />
                                            <button
                                              className={`Btn__confirm__changes ${confirmPassword ? 'Btn__valided' : ''}`}
                                              onClick={updateBookingPoliceis}
                                            >
                                              Confirmar
                                            </button>
                                          </div>
                                      </div>
                                    </>
                                  )}

                                  {anotherServicePercentage === '' && servicePercentage !== false && servicePercentage !== 'outros' && servicePercentage !== servicePercentageStored && inputCheckChange === '' &&(
                                    <>
                                      <div className="form__change__data">
                                          <div className="container__text__change__data">
                                            Digite sua senha para confirmar a alteração
                                          </div>
                                          <div className="container__form__change__data">
                                            <input
                                              type="password"
                                              id="senha"
                                              name="senha"
                                              value={confirmPassword}
                                              className={`input__change__data ${confirmPassword ? 'input__valided' : ''}`}
                                              onChange={(e) => {
                                                const inputValue = e.target.value;
                                                // Limitar a 10 caracteres
                                                const truncatedPasswordConfirm = inputValue.slice(0, 10);
                                                setConfirmPassword(truncatedPasswordConfirm);
                                              }}
                                              placeholder="Senha atual"
                                              maxLength={8}
                                              required
                                            />
                                            <PiPassword className="icon__input__change__data" />
                                            <button
                                              className={`Btn__confirm__changes ${confirmPassword ? 'Btn__valided' : ''}`}
                                              onClick={updateBookingPoliceis}
                                            >
                                              Confirmar
                                            </button>
                                          </div>
                                      </div>
                                    </>
                                  )}

                                  {servicePercentage === false && inputCheckAnotherChange === 'outros' && anotherServicePercentage !== '' &&(
                                    <>
                                      <div className="form__change__data">
                                          <div className="container__text__change__data">
                                            Digite sua senha para confirmar a alteração
                                          </div>
                                          <div className="container__form__change__data">
                                            <input
                                              type="password"
                                              id="senha"
                                              name="senha"
                                              value={confirmPassword}
                                              className={`input__change__data ${confirmPassword ? 'input__valided' : ''}`}
                                              onChange={(e) => {
                                                const inputValue = e.target.value;
                                                // Limitar a 10 caracteres
                                                const truncatedPasswordConfirm = inputValue.slice(0, 10);
                                                setConfirmPassword(truncatedPasswordConfirm);
                                              }}
                                              placeholder="Senha atual"
                                              maxLength={8}
                                              required
                                            />
                                            <PiPassword className="icon__input__change__data" />
                                            <button
                                              className={`Btn__confirm__changes ${confirmPassword ? 'Btn__valided' : ''}`}
                                              onClick={updateBookingPoliceis}
                                            >
                                              Confirmar
                                            </button>
                                          </div>
                                      </div>
                                    </>
                                  )}

                                  {anotherServicePercentage !== '' && inputCheckChange === 'bookingWithPaymentEnable' && servicePercentageStored !== '' &&(
                                    <>
                                      <div className="form__change__data">
                                          <div className="container__text__change__data">
                                            Digite sua senha para confirmar a alteração
                                          </div>
                                          <div className="container__form__change__data">
                                            <input
                                              type="password"
                                              id="senha"
                                              name="senha"
                                              value={confirmPassword}
                                              className={`input__change__data ${confirmPassword ? 'input__valided' : ''}`}
                                              onChange={(e) => {
                                                const inputValue = e.target.value;
                                                // Limitar a 10 caracteres
                                                const truncatedPasswordConfirm = inputValue.slice(0, 10);
                                                setConfirmPassword(truncatedPasswordConfirm);
                                              }}
                                              placeholder="Senha atual"
                                              maxLength={8}
                                              required
                                            />
                                            <PiPassword className="icon__input__change__data" />
                                            <button
                                              className={`Btn__confirm__changes ${confirmPassword ? 'Btn__valided' : ''}`}
                                              onClick={updateBookingPoliceis}
                                            >
                                              Confirmar
                                            </button>
                                          </div>
                                      </div>
                                    </>
                                  )}
                                  
                                  {anotherServicePercentage !== '' && inputCheckChange === '' && servicePercentageStored === servicePercentage &&(
                                    <>
                                      <div className="form__change__data">
                                          <div className="container__text__change__data">
                                            Digite sua senha para confirmar a alteração
                                          </div>
                                          <div className="container__form__change__data">
                                            <input
                                              type="password"
                                              id="senha"
                                              name="senha"
                                              value={confirmPassword}
                                              className={`input__change__data ${confirmPassword ? 'input__valided' : ''}`}
                                              onChange={(e) => {
                                                const inputValue = e.target.value;
                                                // Limitar a 10 caracteres
                                                const truncatedPasswordConfirm = inputValue.slice(0, 10);
                                                setConfirmPassword(truncatedPasswordConfirm);
                                              }}
                                              placeholder="Senha atual"
                                              maxLength={8}
                                              required
                                            />
                                            <PiPassword className="icon__input__change__data" />
                                            <button
                                              className={`Btn__confirm__changes ${confirmPassword ? 'Btn__valided' : ''}`}
                                              onClick={updateBookingPoliceis}
                                            >
                                              Confirmar
                                            </button>
                                          </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                          </div>
                        </>
                      ):(
                        <>
                        <div className='Box__btn__conection__mercado__pago'>
                            <p className='information__span'>Conecte-se ao Mercado Pago para começar a receber pagamentos dos seus agendamentos.</p>
                            <a href={OAuthUrl} className='Link__oauth__mercado__pago'>
                              <SiMercadopago className='logo__mercado__pago__conection' />
                              <p>Conectar ao Mercado Pago</p>
                            </a>   
                        </div>
                        </>
                      )}
                    </div>
                  </>
                ):(
                  <>
                    <div className='container__checkbox__payment'>
                      <PiContactlessPayment className='icon_menu__payment__enable' style={{color: '#354249'}}/>

                      <span className='span__payment__enable' style={{color: '#354249'}}>Apenas com pagamento</span>
                        <input
                          type="checkbox"
                          id='status'
                          checked={bookingWithPayment === true} // Marca o input se o paymentEnable for true
                          onChange={() => {
                            const paymentChange = bookingWithPayment === true ? false : true; // Inverte o estado atual
                            setBookingWithPayment(paymentChange);
                            setInputCheckChange('bookingWithPaymentEnable')
                          }}
                        />
                        <label htmlFor="status" className='switch'>
                          <span className='slider'></span>
                        </label>
                  </div>
                  </>
                )}
                
                {inputCheckChange === 'bookingWithPaymentDisable' &&(
                  <>
                  {messagePoliceisChange === "Políticas de agendamento atualizadas com sucesso." ? (
                        <div className="mensagem-sucesso">
                          <MdOutlineDone className="icon__success"/>
                          <p className="text__message">{messagePoliceisChange}</p>
                        </div>
                      ) : (
                        <div className={` ${messagePoliceisChange ? 'mensagem-erro' : ''}`}>
                          <VscError className={`hide_icon__error ${messagePoliceisChange ? 'icon__error' : ''}`}/>
                          <p className="text__message">{messagePoliceisChange}</p>
                        </div>
                      )}

                    <div className="form__change__data">
                        <div className="container__text__change__data">
                          Digite sua senha para confirmar a alteração
                        </div>
                        <div className="container__form__change__data">
                          <input
                            type="password"
                            id="senha"
                            name="senha"
                            value={confirmPassword}
                            className={`input__change__data ${confirmPassword ? 'input__valided' : ''}`}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              // Limitar a 10 caracteres
                              const truncatedPasswordConfirm = inputValue.slice(0, 10);
                              setConfirmPassword(truncatedPasswordConfirm);
                            }}
                            placeholder="Senha atual"
                            maxLength={8}
                            required
                          />
                          <PiPassword className="icon__input__change__data" />
                          <button
                            className={`Btn__confirm__changes ${confirmPassword ? 'Btn__valided' : ''}`}
                            onClick={updateBookingPoliceis}
                          >
                            Confirmar
                          </button>
                        </div>
                    </div>
                  </>
                )}
              </div>

            </div>
          )}
    </>
)
}