import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import axios from 'axios';


import { PiCopySimple } from "react-icons/pi";
import { IoTicketOutline } from "react-icons/io5";
import { RiSecurePaymentLine } from "react-icons/ri";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RxCounterClockwiseClock } from "react-icons/rx";

import './PaymentScreen.css'

export default function PaymentScreen(){
    const navigate = useNavigate();
    const location = useLocation();

    const urlGetPayment = 'https://api.mercadopago.com/v1/payments/'
    const urlApi = 'https://barbeasy.up.railway.app'

    const token = localStorage.getItem('token');

    const { paymentObject, identificationToken, serviceValues, accessTokenBarbearia } = location.state;

    const qr_code = paymentObject.point_of_interaction.transaction_data.qr_code
    const qr_code_base64 = paymentObject.point_of_interaction.transaction_data.qr_code_base64
    const date_of_expiration = paymentObject.date_of_expiration// está assim o formato: 2024-07-29T12:02:16.828-04:00

    const handleBackClick = () => {
        navigate("/Home ");
    };

    const [deletedPreBooking, setDeletedPreBooking] = useState(false)

    const deletePreBooking = () =>{
        axios.delete(`${urlApi}/api/v1/delePreBooking/${paymentObject.id}/${identificationToken}`,{
            headers: {
                'Authorization': `Bearer ${token}`
              }
        }).then(res =>{
            if(res.data.Success === true){
                setDeletedPreBooking(true)
            }
        }).catch(err =>{
            console.log('Erro:', err)
            setDeletedPreBooking(false)
        })
    }
    //Function to calculete the time difference betwen date_of_expiration and current date
    const calculateTimeDifference = () => {
        const expirationDate = new Date(date_of_expiration).getTime();
        const currentDate = Date.now();
        const differenceInMilliseconds = expirationDate - currentDate;
        const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
        return differenceInSeconds;
    };
    
    //Variables to stotage secondes
    const [seconds, setSeconds] = useState(calculateTimeDifference());
    
    //Hook to setSeconds, call the function deletePreBooking and redirect user
      useEffect(() => {
        const timer = setInterval(() => {
          setSeconds((prevSeconds) => {
            if (prevSeconds <= 0) {
                clearInterval(timer);
                deletePreBooking()
                return 0;
            }
            return prevSeconds - 1;
          });
        }, 1000);
    
        return () => clearInterval(timer);
      }, []);
    //==========================================================

    const [PaymentStatus, setPaymentStatus] = useState('');
    const [paymentUpdated, setPaymentUpdated] = useState(false);

    //Function to verify status of payment
    const getPayment = () =>{
        axios.get(`${urlGetPayment}${paymentObject.id}`, {
            headers: {
                'Authorization': `Bearer ${accessTokenBarbearia}`
              }
        }).then(res =>{
            setPaymentStatus(res.data.status)
        }).catch(err =>{
            console.log(err)
        })
    }

    //Function to update status to approved
    const updatePaymentStatus = () =>{
        if(PaymentStatus === 'approved'){
            const values = {
                PaymentStatus,
                identificationToken,
                PaymentId: paymentObject.id
            }
            axios.put(`${urlApi}/api/v1/updatePaymentStatus`, values, {
                headers: {
                    'Authorization': `Bearer ${token}`
                  }
            }).then(res =>{
                if(res.data.Success === 'Success'){
                    return setPaymentUpdated(true)
                }
            }).catch(err =>{
                console.error('Erro:', err)
                return setPaymentUpdated(false)
            })
        }
    }

    //Call function getPayment each 5 secondes
    useEffect(() => {
        if(PaymentStatus != 'approved'){
            const interval = setInterval(() => {
                getPayment();
              }, 5000); // 5 segundos
          
              // Limpeza do intervalo quando o componente for desmontado
              return () => clearInterval(interval);
        }
    }, []);

    //Call function updatePaymentStatus
    updatePaymentStatus()

    //Function to copy the qr_code
    const [copyMessage, setCopyMessage] = useState('');

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
          .then(() => {
            setCopyMessage('Copiado para a área de transferência!');
            setTimeout(() => setCopyMessage(''), 2000); // Mensagem some após 2 segundos
          })
          .catch(err => {
            console.error('Erro ao copiar texto: ', err);
            setCopyMessage('Erro ao copiar');
            setTimeout(() => setCopyMessage(''), 2000); // Mensagem some após 2 segundos
          });
    };

    //========================================================================

    return(
        <div className="container__master">
            {!deletedPreBooking ? (
                <div className="teste">
                    {paymentUpdated ? (
                        <div className="container__payment__approved">
                            <IoIosCheckmarkCircleOutline className="icon__CheckmarkCircleOutline"/>
                            <p className="text__one__conection__succesfuly">Pagamento recebido!</p>
                            <p className="text__two__conection__succesfuly">Seu agendamento foi confirmado! Verifique a data e o horário para não perder sua reserva.</p>
                            <div className="Box__btn__back__Booking__Details" onClick={handleBackClick}>
                                <button className="Btn__back__Booking__Details" >
                                    Voltar
                                </button>
                            </div>
                        </div>
                    ):(
                        <div className="container__payment__screen">
                            <div className="header__payment__screen">
                                <h2>Babreasy</h2>
                                <div className="box__pay__secure">
                                    <RiSecurePaymentLine className="icon__pay__secure"/>
                                    <p>Pague com segurança</p>
                                </div>
                            </div>
                            <div className="section__value__payment">
                                <h3 className="value__payment">Pague {serviceValues.servicePrice} via Pix</h3>
                                <p className="date_of_expiration">{seconds > 0 ? `Vencimento em ${seconds} segundos` : 'Tempo esgotado :('}</p>
                            </div>
                            <div className="Box__qr_code_base64">
                                <img className="inner__qr_code_base64" src={`data:image/png;base64,${qr_code_base64}`} alt="QR Code Base64" />
                            </div>
                            <div className="Box__qr_code__to__copy">
                                <h5>Código de pagamento</h5>
                                {copyMessage &&(
                                    <div className="box__text__copied">
                                        <p className="text__copied">Código de pagamento copiado!</p>
                                    </div>
                                )}
                                <div className="box__value__qr_code">
                                    <p className="value__qr_code">{qr_code}</p>
                                    <PiCopySimple className="icon__PiCopySimple" onClick={() => handleCopy(qr_code)}/>
                                </div>
                            </div>
                            <div className="section__how__pay">
                                <h3>Como Pagar?</h3>
                                <div className="box__instructions__how__pay">
                                    <div className="inner__instruction__how__pay">
                                        <p className="number__one__instruction">1</p>
                                        <p className="text__instruction">Entre no app ou site do seu banco e escolha a opção de pagamento via Pix.</p>
                                    </div>
                                    <div className="inner__instruction__how__pay">
                                        <p className="number__two__instruction">2</p>
                                        <p className="text__instruction">Escaneie o código QR ou copie e cole o código de pagamento.</p>
                                    </div>
                                    <div className="inner__instruction__how__pay">
                                        <p className="number__three__instruction">3</p>
                                        <p className="text__instruction">Pronto! O pagamento será creditado na hora e você receberá um e-mail de confirmação.</p>
                                    </div>
                                    
                                    <p className="text__information__pix">O Pix tem um limite diário de transferências. Para mais informações, por favor, consulte seu banco.</p>
                                </div>
                            </div>
                            <div className="section__details__service">
                                <IoTicketOutline className="icon__IoTicketOutline"/>
                                <h2>Detalhes do seu serviço</h2>
                            </div>
                            <div className="values__details__service">
                                <p>Barbearia</p>
                                <p>{serviceValues.barbeariaName}</p>
                            </div>
                            <div className="values__details__service">
                                <p>Profissional</p>
                                <p>{serviceValues.professionalName}</p>
                            </div>
                            <div className="values__details__service">
                                <p>{serviceValues.serviceName}</p>
                                <p>{serviceValues.servicePrice}</p>
                            </div>
                            <div className="values__details__service">
                                <p>Duração</p>
                                <p>{serviceValues.serviceDuration}min</p>
                            </div>
                            <div className="values__details__service">
                                <p>Data</p>
                                <p>{serviceValues.selectedDay}</p>
                            </div>
                            <div className="values__details__service">
                                <p>Início</p>
                                <p>{serviceValues.timeSelected} h</p>
                            </div>
                            <div className="Box__btn__back__Booking__Details" style={{marginBottom: '20px'}} onClick={handleBackClick}>
                                <button className="Btn__back__Booking__Details" >
                                    Voltar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ):(
                <div className="section__time__over">
                    <RxCounterClockwiseClock className="icon__RxCounterClockwiseClock"/>
                    <p className="text__one__conection__succesfuly">Tempo esgotado...</p>
                    <p className="text__two__conection__succesfuly">O tempo para a realização do pagamento expirou. Mas não tem problema! Você pode tentar novamente</p>
                    <div className="Box__btn__back__Booking__Details" onClick={handleBackClick}>
                        <button className="Btn__back__Booking__Details" >
                            Voltar
                        </button>
                    </div>
                </div>
            )}
        
        </div>
        
    )
}