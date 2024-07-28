import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import axios from 'axios';


import { PiCopySimple } from "react-icons/pi";
import { IoTicketOutline } from "react-icons/io5";
import { RiSecurePaymentLine } from "react-icons/ri";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

import './PaymentScreen.css'

export default function PaymentScreen(){
    const navigate = useNavigate();
    const location = useLocation();

    const { paymentObject, identificationToken, serviceValues, accessTokenBarbearia } = location.state;

    const qr_code = paymentObject.point_of_interaction.transaction_data.qr_code
    const qr_code_base64 = paymentObject.point_of_interaction.transaction_data.qr_code_base64
    const date_of_expiration = paymentObject.date_of_expiration

    const urlGetPayment = 'https://api.mercadopago.com/v1/payments/'
    const urlApi = 'https://barbeasy.up.railway.app'

    const token = localStorage.getItem('token');

    const handleBackClick = () => { 
        navigate("/Home ");
    };

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
console.log(PaymentStatus)
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

    //Function to formatted date
    function formatExpirationDate(dateString) {
        const date = new Date(dateString);
      
        // Obter partes da data
        const day = date.getDate();
        const month = date.toLocaleString('pt-BR', { month: 'long' });
        const hours = date.getHours();
        const minutes = date.getMinutes();
      
        // Ajustar formato da hora
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
      
        return `${day} de ${month} às ${formattedHours}:${formattedMinutes} h`;
    }
    const formattedDate = formatExpirationDate(date_of_expiration);

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
                        <p className="date_of_expiration">Vencimento: {formattedDate}</p>
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
        
    )
}