import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"

import PropTypes from 'prop-types';

import axios from 'axios';

import { IoIosArrowDown } from "react-icons/io";
import { PiContactlessPayment } from "react-icons/pi";
import { SiMercadopago } from "react-icons/si";
import { AiOutlineFileProtect } from "react-icons/ai";
import { VscError } from "react-icons/vsc";
import { PiPassword } from "react-icons/pi";
import { MdOutlineDone } from "react-icons/md";

export function BookingPoliceis ({barbeariaId, OAuthUrl, isConectedWithMercadoPago}){

    const urlApi = 'https://barbeasy.up.railway.app'
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const [confirmPassword, setConfirmPassword] = useState('');

//=========== Section Booking Policeis ===========
const [showBookingsPoliceis, setShowBookingsPoliceis] = useState(false);
const [bookingWithPayment, setBookingWithPayment] = useState(false);
const [servicePercentageStored, setServicePercentageStored] = useState('');
const [servicePercentage, setServicePercentage] = useState(false);
const [inputCheckChange, setInputCheckChange] = useState('');
const [messagePoliceisChange, setMessagePoliceisChange] = useState('');

const getBookingPoliceis = () =>{
  axios.get(`${urlApi}/api/v1/bookingPoliceis/${barbeariaId}`)
  .then(res =>{
      if(res.status === 200){
        setBookingWithPayment(res.data.bookingPoliceis.booking_with_payment === "enabled" ? true:false)
        setServicePercentage(res.data.bookingPoliceis.service_percentage === "false" ? false:res.data.bookingPoliceis.service_percentage)
        setServicePercentageStored(res.data.bookingPoliceis.service_percentage === "false" ? '':res.data.bookingPoliceis.service_percentage)
      }
  }).catch(err =>{
    if(err.response.status === 403){
      return navigate("/SessionExpired")
    }
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
        checked={servicePercentage === value}
        onChange={() => {
          if (servicePercentage === value) {
            // Se a opção já estiver selecionada, desmarque-a
            setServicePercentage(false);
          } else {
            // Caso contrário, selecione a opção
            setServicePercentage(value);
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

//Function to update de policeis of barbearia
const updateBookingPoliceis = () =>{

  const values = {
    barbeariaId,
    confirmPassword,
    bookingWithPayment: bookingWithPayment ? 'enabled':'disabled',
    servicePercentage: servicePercentage ? servicePercentage:'false'
  }

  axios.put(`${urlApi}/api/v1/updateBookingPoliceis`, values, {
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
          getBookingPoliceis()
        }, 3000);
        return
      }
  }).catch(err =>{
    if(err.response.status === 403){
      return navigate("/SessionExpired")
    }
    if(err.response.status === 401){
      setMessagePoliceisChange('Verifique a senha informada e tente novamente')
      return setTimeout(() => {
          setMessagePoliceisChange('');
          setConfirmPassword('')
          setInputCheckChange('')
        }, 3000);
    }
      setMessagePoliceisChange('Houve um erro ao salvar as políticas de agendamento, tente novamente mais tarde.')
      return setTimeout(() => {
          setMessagePoliceisChange('');
          setConfirmPassword('')
          setInputCheckChange('')
        }, 3000);
    console.log(err)
  })
}

BookingPoliceis.propTypes = {
    barbeariaId: PropTypes.number
};

return (
    <>
        <div className="menu__main" onClick={changeShowBookingPolicies} translate="no">
          <AiOutlineFileProtect className='icon_menu'/>
            Políticas de agendamento
          <IoIosArrowDown className={`arrow ${showBookingsPoliceis ? 'girar' : ''}`} id='arrow'/>
        </div>

        {showBookingsPoliceis && (
            <div className="divSelected" translate="no">
                <p className='information__span'>Escolha como os agendamentos devem ser feitos em sua barbearia:</p>
              <div className="container__payment__policeis">
                {bookingWithPayment === true ? (
                  <>
                  <div className='container__checkbox__payment' translate="no">
                    <PiContactlessPayment className='icon_menu__payment__enable' style={{color: '#f6f6f6'}}/>
                    <span  className='span__payment__enable' style={{color: '#f6f6f6'}}>Apenas com pagamento</span>
                      <input
                        type="checkbox"
                        id='bookingPoliceis'
                        checked={bookingWithPayment === true} // Marca o input se o bookingWithPayment for true
                        onChange={() => {
                          const paymentChange = bookingWithPayment === true ? false : true; // Inverte o estado atual
                          setBookingWithPayment(paymentChange);
                          setInputCheckChange('bookingWithPaymentDisable')
                          setServicePercentage(false)
                        }}
                      />
                      <label htmlFor="bookingPoliceis" className='switch'>
                        <span className='slider'></span>
                      </label>
                  </div>
                    
                    <div className="container__conection__with__mercado__pago" translate="no">
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
                                  {inputCheckChange === 'bookingWithPaymentEnable' && servicePercentage !== false &&(
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

                                  {servicePercentage !== false && servicePercentage !== servicePercentageStored && inputCheckChange === '' &&(
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
                    <div className='container__checkbox__payment' translate="no">
                      <PiContactlessPayment className='icon_menu__payment__enable' style={{color: '#354249'}}/>

                      <span className='span__payment__enable' style={{color: '#354249'}}>Apenas com pagamento</span>
                        <input
                          type="checkbox"
                          id='bookingPoliceis'
                          checked={bookingWithPayment === true} // Marca o input se o paymentEnable for true
                          onChange={() => {
                            const paymentChange = bookingWithPayment === true ? false : true; // Inverte o estado atual
                            setBookingWithPayment(paymentChange);
                            setInputCheckChange('bookingWithPaymentEnable')
                          }}
                        />
                        <label htmlFor="bookingPoliceis" className='switch'>
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

                    <div className="form__change__data" translate="no">
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